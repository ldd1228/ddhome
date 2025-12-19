import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Mail, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { getMessages } from '@/db/api';
import { Message } from '@/types';

export default function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages({ limit: 100 });
      setMessages(data);
    } catch (error) {
      console.error('加载留言失败：', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
      case 'drawing':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold">留言管理</h2>
        <p className="text-muted-foreground mt-1">
          查看所有访客留言
        </p>
      </div>

      {/* 留言列表 */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无留言记录</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{message.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {message.email}
                      <span className="mx-2">•</span>
                      {formatDate(message.created_at)}
                    </CardDescription>
                  </div>
                  {message.media_files && message.media_files.length > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getMediaIcon(message.media_files[0].type)}
                      {message.media_files.length} 个附件
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 留言内容 */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.message}
                  </p>
                </div>

                {/* 媒体文件 */}
                {message.media_files && message.media_files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">附件：</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {message.media_files.map((file, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors"
                        >
                          {(file.type === 'image' || file.type === 'drawing') && (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                          {file.type === 'video' && (
                            <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                              <Video className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-xs truncate" title={file.name}>
                              {file.name}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-7 text-xs"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              查看
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 访客信息 */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <span>访客 ID: {message.visitor_uuid.slice(0, 8)}...</span>
                  {message.user_agent && (
                    <span title={message.user_agent}>
                      {message.user_agent.includes('Mobile') ? '📱 移动端' : '💻 桌面端'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
