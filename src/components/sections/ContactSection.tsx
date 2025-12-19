import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, CheckCircle2, Loader2, Image as ImageIcon, Video, Palette, X, Upload } from 'lucide-react';
import { ContactForm } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';
import { uploadImage, uploadVideo, uploadDrawing } from '@/utils/fileUpload';
import { saveMessage } from '@/db/api';
import { getVisitorUUID } from '@/components/VisitorTracker';
import DrawingBoard from '@/components/DrawingBoard';

interface MediaFile {
  type: 'image' | 'video' | 'drawing';
  url: string;
  path: string;
  name: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showDrawingBoard, setShowDrawingBoard] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    try {
      for (const file of Array.from(files)) {
        const { url, path } = await uploadImage(file);
        setMediaFiles(prev => [...prev, {
          type: 'image',
          url,
          path,
          name: file.name,
        }]);
        toast.success(`图片 "${file.name}" 上传成功！`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '图片上传失败';
      toast.error(errorMsg);
    } finally {
      setUploadingFile(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  // 处理视频上传
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    try {
      for (const file of Array.from(files)) {
        const { url, path } = await uploadVideo(file);
        setMediaFiles(prev => [...prev, {
          type: 'video',
          url,
          path,
          name: file.name,
        }]);
        toast.success(`视频 "${file.name}" 上传成功！`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '视频上传失败';
      toast.error(errorMsg);
    } finally {
      setUploadingFile(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  // 处理画板保存
  const handleDrawingSave = async (dataUrl: string) => {
    setUploadingFile(true);
    try {
      const { url, path } = await uploadDrawing(dataUrl);
      setMediaFiles(prev => [...prev, {
        type: 'drawing',
        url,
        path,
        name: `画作_${new Date().toLocaleString('zh-CN')}`,
      }]);
      toast.success('画作保存成功！');
      setShowDrawingBoard(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '画作保存失败';
      toast.error(errorMsg);
    } finally {
      setUploadingFile(false);
    }
  };

  // 删除媒体文件
  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('文件已移除');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('请填写所有必填字段');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);

    try {
      // 获取访客 UUID
      const visitor_uuid = getVisitorUUID();

      // 准备媒体文件数据
      const mediaFilesData = mediaFiles.map(f => ({
        type: f.type,
        url: f.url,
        name: f.name,
      }));

      // 1. 保存留言到数据库
      const saveResult = await saveMessage({
        visitor_uuid,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        media_files: mediaFilesData,
        user_agent: navigator.userAgent,
      });

      if (!saveResult.success) {
        console.error('保存留言到数据库失败：', saveResult.error);
        // 继续发送邮件，即使数据库保存失败
      }

      // 2. 调用 Edge Function 发送邮件
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          mediaFiles: mediaFilesData,
        }),
      });

      if (error) {
        console.error('Edge Function 调用错误：', error);
        let errorMsg = '发送失败，请稍后重试';
        
        try {
          const errorText = await error?.context?.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMsg = errorData.error || errorMsg;
          }
        } catch (e) {
          console.error('解析错误信息失败：', e);
        }
        
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        // 显示成功动画
        setIsSubmitted(true);
        toast.success('留言已成功发送到邮箱！');
        
        // 3秒后重置表单
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setMediaFiles([]);
          setIsSubmitted(false);
        }, 3000);
      } else {
        const errorMsg = data?.error || '发送失败，请稍后重试';
        console.error('发送失败：', errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('发送留言时出错：', err);
      toast.error('发送失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-5xl max-xl:text-4xl font-handwriting text-foreground mb-4">
            留言簿
          </h2>
          <div className="divider-handdrawn w-32 mx-auto mb-6" />
          <p className="text-lg font-serif text-foreground/70 leading-relaxed">
            有什么想说的吗？给我写张明信片吧！
          </p>
        </div>

        {/* 联系邮箱 */}
        <div className="warm-card p-6 mb-8 flex items-center justify-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <span className="font-serif text-foreground">
            联系邮箱：
          </span>
          <a
            href="mailto:1660296253@qq.com"
            className="font-serif text-primary hover:underline"
          >
            1660296253@qq.com
          </a>
        </div>

        {/* 明信片风格表单 */}
        <div className="warm-card p-8 relative overflow-hidden">
          {/* 邮票装饰 */}
          <div className="absolute top-4 right-4 w-16 h-20 border-2 border-dashed border-primary/30 rounded flex items-center justify-center text-3xl">
            📮
          </div>

          {isSubmitted ? (
            // 提交成功动画
            <div className="text-center py-12 fade-in">
              <CheckCircle2 className="w-20 h-20 text-secondary mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-handwriting text-foreground mb-2">
                收到啦！
              </h3>
              <p className="font-serif text-foreground/70">
                留言已发送到我的邮箱，我会尽快回复的 💌
              </p>
            </div>
          ) : (
            // 表单
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-serif text-foreground">
                  你的名字
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入你的名字"
                  required
                  disabled={isLoading}
                  className="font-serif"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-serif text-foreground">
                  你的邮箱
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入你的邮箱"
                  required
                  disabled={isLoading}
                  className="font-serif"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-serif text-foreground">
                  想说的话
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="写下你想说的话..."
                  required
                  disabled={isLoading}
                  rows={6}
                  className="font-serif resize-none"
                />
              </div>

              {/* 媒体上传区域 */}
              <div className="space-y-4">
                <Label className="font-serif text-foreground">
                  添加图片、视频或画作（可选）
                </Label>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-4 h-4" />
                      上传文件
                    </TabsTrigger>
                    <TabsTrigger value="draw" className="gap-2">
                      <Palette className="w-4 h-4" />
                      画板创作
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* 图片上传 */}
                      <div>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingFile || isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={uploadingFile || isLoading}
                        >
                          <ImageIcon className="w-4 h-4" />
                          上传图片
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持 JPG、PNG、GIF、WEBP，最大 5MB
                        </p>
                      </div>

                      {/* 视频上传 */}
                      <div>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          multiple
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                          disabled={uploadingFile || isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploadingFile || isLoading}
                        >
                          <Video className="w-4 h-4" />
                          上传视频
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持 MP4、WEBM、MOV，最大 10MB
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="draw" className="space-y-4">
                    {!showDrawingBoard ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setShowDrawingBoard(true)}
                        disabled={uploadingFile || isLoading}
                      >
                        <Palette className="w-4 h-4" />
                        打开画板
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <DrawingBoard
                          onSave={handleDrawingSave}
                          onClear={() => {}}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowDrawingBoard(false)}
                          disabled={uploadingFile}
                        >
                          关闭画板
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* 已上传的文件列表 */}
                {mediaFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-serif text-foreground text-sm">
                      已添加的文件：
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {mediaFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group border-2 border-border rounded-lg overflow-hidden"
                        >
                          {file.type === 'video' ? (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <Video className="w-8 h-8 text-muted-foreground" />
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full aspect-video object-cover"
                            />
                          )}
                          <div className="p-2 bg-background/95">
                            <p className="text-xs font-serif truncate">
                              {file.name}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveMedia(index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || uploadingFile}
                className="w-full stamp-button py-6 text-lg font-serif"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    正在发送...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    寄出明信片
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* 底部装饰 */}
        <div className="mt-12 text-center">
          <p className="font-serif text-foreground/60 text-sm">
            期待与你的交流 ✨
          </p>
        </div>
      </div>
    </div>
  );
}
