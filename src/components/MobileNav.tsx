import { Home, User, Briefcase, Heart, Mail } from 'lucide-react';
import { SectionType } from '@/types';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const navItems = [
  { id: 'home' as SectionType, label: '门廊', icon: Home },
  { id: 'about' as SectionType, label: '客厅', icon: User },
  { id: 'projects' as SectionType, label: '工作桌', icon: Briefcase },
  { id: 'interests' as SectionType, label: '收藏架', icon: Heart },
  { id: 'contact' as SectionType, label: '留言簿', icon: Mail },
];

export default function MobileNav({ currentSection, onSectionChange }: MobileNavProps) {
  return (
    <div className="xl:hidden">
      {/* 顶部标题栏 */}
      <header className="fixed top-0 left-0 right-0 bg-sidebar-background border-b border-sidebar-border px-4 py-3 z-50">
        <h1 className="text-2xl font-handwriting text-sidebar-foreground text-center">
          温暖小木屋
        </h1>
      </header>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-sidebar-background border-t border-sidebar-border px-2 py-2 z-50 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300',
                isActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-serif">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
