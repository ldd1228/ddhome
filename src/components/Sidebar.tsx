import { Home, User, Briefcase, Heart, Mail } from 'lucide-react';
import { SectionType } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
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

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col p-6 max-xl:hidden">
      {/* Logo/标题 */}
      <div className="mb-12">
        <h1 className="text-3xl font-handwriting text-sidebar-foreground mb-2">
          蛋蛋小屋
        </h1>
        <p className="text-sm text-sidebar-foreground/70 font-serif">
          一个温暖的角落
        </p>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                'hover:bg-sidebar-accent hover:translate-x-1',
                isActive && 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-serif text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 底部装饰 */}
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center font-serif">
          用心搭建的小天地 ✨
        </p>
      </div>
    </aside>
  );
}
