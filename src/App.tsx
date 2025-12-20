import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionType } from '@/types';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import InterestsSection from '@/components/sections/InterestsSection';
import ContactSection from '@/components/sections/ContactSection';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { recordVisit } from '@/db/api';
import { getVisitorUUID } from '@/components/VisitorTracker';

const App = () => {
  const [currentSection, setCurrentSection] = useState<SectionType>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  // 检查 URL 参数，判断是否进入管理模式
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  // 记录页面访问（仅在非管理模式下）
  useEffect(() => {
    if (isAdminMode) return;

    const trackVisit = async () => {
      try {
        const visitor_uuid = getVisitorUUID();
        const page_path = `/#${currentSection}`;
        const referrer = document.referrer;
        const user_agent = navigator.userAgent;
        const screen_resolution = `${window.screen.width}x${window.screen.height}`;
        const language = navigator.language;

        await recordVisit({
          visitor_uuid,
          page_path,
          referrer,
          user_agent,
          screen_resolution,
          language,
        });
      } catch (error) {
        console.error('记录访问失败：', error);
      }
    };

    trackVisit();
  }, [currentSection, isAdminMode]);

  // 退出管理模式
  const handleExitAdmin = () => {
    setIsAdminMode(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  // 跳转到管理后台登录页
  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  // 如果是管理模式，显示管理后台
  if (isAdminMode) {
    return (
      <>
        <AdminDashboard onBack={handleExitAdmin} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomeSection onNavigate={setCurrentSection} />;
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'interests':
        return <InterestsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HomeSection onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* 管理员入口按钮 - 固定在右上角 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAdminLogin}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-primary/10 hover:border-primary transition-all duration-300"
        title="管理后台"
      >
        <Lock className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      </Button>

      {/* 桌面端侧边栏 */}
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      {/* 移动端导航 */}
      <MobileNav currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      {/* 主内容区域 */}
      <main className="xl:ml-64 pt-16 xl:pt-0 pb-20 xl:pb-0">
        {renderSection()}
      </main>

      {/* Toast 通知 */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default App;
