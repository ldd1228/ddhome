import { TimelineEvent } from '@/types';

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    year: '2020',
    title: '开始学习编程',
    description: '从零开始，一行行代码敲出来的成就感让我着迷。',
  },
  {
    id: '2',
    year: '2021',
    title: '第一个项目上线',
    description: '虽然简单，但那种"我做出来了"的喜悦至今难忘。',
  },
  {
    id: '3',
    year: '2022',
    title: '爱上摄影',
    description: '镜头里的世界，让我学会用不同的角度看生活。',
  },
  {
    id: '4',
    year: '2023',
    title: '持续探索',
    description: '每一天都在学习新东西，每一个项目都是新的冒险。',
  },
  {
    id: '5',
    year: '2024',
    title: '搭建小木屋',
    description: '用代码和设计，搭建这个属于自己的温暖角落。',
  },
];

export default function AboutSection() {
  return (
    <div className="min-h-screen py-20 px-4 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-5xl max-xl:text-4xl font-handwriting text-foreground mb-4">
            关于我
          </h2>
          <div className="divider-handdrawn w-32 mx-auto mb-6" />
          <p className="text-lg font-serif text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            一个爱动手、爱分享的生活家，用项目记录成长，用兴趣点亮日常。
          </p>
        </div>

        {/* 个人故事 */}
        <div className="warm-card p-8 mb-12">
          <h3 className="text-2xl font-handwriting text-foreground mb-4">我的故事</h3>
          <div className="space-y-4 font-serif text-foreground/80 leading-relaxed">
            <p>
              我是一个喜欢折腾的人，总是对新鲜事物充满好奇。从第一次接触编程开始，
              我就被这种"创造"的感觉深深吸引——用代码把脑海中的想法变成现实，
              这种成就感让我欲罢不能。
            </p>
            <p>
              除了敲代码，我还喜欢用镜头记录生活。摄影教会我用不同的角度看世界，
              每一张照片背后都有一个故事，每一个瞬间都值得被珍藏。
            </p>
            <p>
              这个小木屋，是我用心搭建的一个角落。在这里，我分享我的项目、
              我的兴趣、我的思考。希望你在这里能找到一些共鸣，
              或者只是单纯地感受到一点温暖。
            </p>
          </div>
        </div>

        {/* 时间轴 */}
        <div>
          <h3 className="text-3xl font-handwriting text-foreground mb-8 text-center">
            成长轨迹
          </h3>
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border max-xl:left-4" />
            
            {/* 时间轴事件 */}
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="relative pl-20 max-xl:pl-12 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* 时间点 */}
                  <div className="absolute left-5 top-0 w-6 h-6 rounded-full bg-primary border-4 border-background max-xl:left-1 max-xl:w-5 max-xl:h-5" />
                  
                  {/* 内容卡片 */}
                  <div className="warm-card p-6">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-2xl font-handwriting text-primary">
                        {event.year}
                      </span>
                      <h4 className="text-xl font-serif font-semibold text-foreground">
                        {event.title}
                      </h4>
                    </div>
                    <p className="font-serif text-foreground/70 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
