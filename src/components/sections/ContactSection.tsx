import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '@/types';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 模拟提交
    console.log('表单数据：', formData);
    
    // 显示成功动画
    setIsSubmitted(true);
    
    // 3秒后重置表单
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 fade-in">
      <div className="max-w-3xl mx-auto">
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
                感谢你的留言，我会尽快回复的 💌
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
                  rows={6}
                  className="font-serif resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full stamp-button py-6 text-lg font-serif"
                size="lg"
              >
                <Send className="mr-2 w-5 h-5" />
                寄出明信片
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
