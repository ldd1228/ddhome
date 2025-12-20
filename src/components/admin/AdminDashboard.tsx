import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageSquare } from 'lucide-react';
import VisitorManagement from './VisitorManagement';
import MessageManagement from './MessageManagement';

interface AdminDashboardProps {
  onBack?: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('visitors');

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 - 仅在有 onBack 回调时显示 */}
      {onBack && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回网站
                </Button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-xl font-bold">蛋蛋小屋 · 管理后台</h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="visitors" className="gap-2">
              <Users className="h-4 w-4" />
              访客管理
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              留言管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitors" className="space-y-6">
            <VisitorManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessageManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
