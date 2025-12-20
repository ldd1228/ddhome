import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证密码
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      
      if (password === adminPassword) {
        // 登录成功，保存登录状态
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_login_time', Date.now().toString());
        
        toast.success('登录成功！');
        
        // 跳转到管理后台
        navigate('/admin/dashboard');
      } else {
        toast.error('密码错误，请重试');
      }
    } catch (error) {
      console.error('登录失败：', error);
      toast.error('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">管理后台登录</CardTitle>
          <CardDescription>
            请输入管理员密码以访问后台
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">管理员密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  登录中...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  登录
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>默认密码：admin123</p>
              <p className="mt-1">可通过环境变量 VITE_ADMIN_PASSWORD 修改</p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              返回首页
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
