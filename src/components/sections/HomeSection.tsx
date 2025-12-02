import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionType } from '@/types';

interface HomeSectionProps {
  onNavigate: (section: SectionType) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 fade-in">
      <div className="max-w-4xl w-full text-center">
        {/* 头像 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src="/images/avatar.jpg"
              alt="头像"
              className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl animate-bounce">
              👋
            </div>
          </div>
        </div>

        {/* 欢迎语 */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl max-xl:text-4xl font-handwriting text-foreground mb-6 leading-relaxed">
            嘿，欢迎进来喝杯茶！
          </h1>
          <p className="text-xl max-xl:text-lg font-serif text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            这里是我用代码、镜头和一点点好奇心搭的小木屋。
            <br />
            翻一翻，也许你会找到我们一起爱上的那件小事。
          </p>
        </div>

        {/* 快速导航 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => onNavigate('about')}
            className="stamp-button px-6 py-6 text-base font-serif"
            variant="outline"
          >
            认识我 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={() => onNavigate('projects')}
            className="stamp-button px-6 py-6 text-base font-serif"
            variant="outline"
          >
            看看项目 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={() => onNavigate('interests')}
            className="stamp-button px-6 py-6 text-base font-serif"
            variant="outline"
          >
            我的兴趣 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={() => onNavigate('contact')}
            className="stamp-button px-6 py-6 text-base font-serif"
            variant="outline"
          >
            留个言 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* 装饰元素 */}
        <div className="mt-16 flex justify-center gap-8 text-4xl opacity-60">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌿</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>☕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>📚</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎨</span>
        </div>
      </div>
    </div>
  );
}
