import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    const loginTime = sessionStorage.getItem('admin_login_time');

    if (!isLoggedIn) {
      toast.error('请先登录');
      navigate('/admin/login');
      return;
    }

    // 检查登录是否过期（24小时）
    if (loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      const hours = elapsed / (1000 * 60 * 60);
      
      if (hours > 24) {
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('admin_login_time');
        toast.error('登录已过期，请重新登录');
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_login_time');
    toast.success('已退出登录');
    navigate('/admin/login');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">蛋蛋小屋 - 管理后台</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackHome}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              返回首页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        </div>
      </div>

      {/* 管理后台内容 */}
      <div className="container mx-auto px-4 py-6">
        <AdminDashboard />
      </div>
    </div>
  );
}
