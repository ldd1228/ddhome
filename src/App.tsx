import { useState } from 'react';
import { SectionType } from '@/types';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import InterestsSection from '@/components/sections/InterestsSection';
import ContactSection from '@/components/sections/ContactSection';

const App = () => {
  const [currentSection, setCurrentSection] = useState<SectionType>('home');

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
      {/* 桌面端侧边栏 */}
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      {/* 移动端导航 */}
      <MobileNav currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      {/* 主内容区域 */}
      <main className="xl:ml-64 pt-16 xl:pt-0 pb-20 xl:pb-0">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
