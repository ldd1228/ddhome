import { useState } from 'react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const projects: Project[] = [
  {
    id: '1',
    title: '个人博客系统',
    description: '用React和Node.js搭建的全栈博客，支持Markdown编辑和评论功能。',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    difficulty: '中等',
    tags: ['React', 'Node.js', 'MongoDB'],
    details: '这是我的第一个全栈项目。从设计数据库结构，到实现前后端交互，再到部署上线，每一步都充满挑战。最大的收获是学会了如何规划一个完整的项目，以及如何解决实际开发中遇到的各种问题。',
  },
  {
    id: '2',
    title: '天气预报小工具',
    description: '简洁美观的天气查询应用，支持城市搜索和未来一周预报。',
    coverImage: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    difficulty: '简单',
    tags: ['JavaScript', 'API', 'CSS'],
    details: '这个项目让我学会了如何调用第三方API，以及如何处理异步数据。虽然功能简单，但在UI设计上花了不少心思，力求做到简洁而不简陋。',
  },
  {
    id: '3',
    title: '任务管理看板',
    description: '类似Trello的任务管理工具，支持拖拽排序和多看板管理。',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    difficulty: '挑战',
    tags: ['React', 'DnD', 'LocalStorage'],
    details: '实现拖拽功能是这个项目最大的挑战。通过学习react-beautiful-dnd库，我不仅掌握了拖拽的实现原理，还学会了如何优化用户体验。这个项目让我明白，好的交互设计能让产品更有温度。',
  },
  {
    id: '4',
    title: '摄影作品集',
    description: '响应式摄影作品展示网站，支持图片懒加载和瀑布流布局。',
    coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    difficulty: '中等',
    tags: ['HTML', 'CSS', 'JavaScript'],
    details: '作为一个摄影爱好者，我想要一个能完美展示照片的网站。这个项目让我深入学习了CSS Grid和Flexbox，以及图片优化技术。最终的效果让我很满意，每一张照片都能得到最好的呈现。',
  },
];

const difficultyColors = {
  '简单': 'bg-secondary text-secondary-foreground',
  '中等': 'bg-primary text-primary-foreground',
  '挑战': 'bg-accent text-accent-foreground',
};

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen py-20 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-5xl max-xl:text-4xl font-handwriting text-foreground mb-4">
            我的项目
          </h2>
          <div className="divider-handdrawn w-32 mx-auto mb-6" />
          <p className="text-lg font-serif text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            每一个项目都是一次『做给自己』的小实验。
            它们不一定完美，却记录了我从『不会』到『会一点点』的过程。
            如果你正好也在路上，希望这些笔记能给你一点光。
          </p>
        </div>

        {/* 项目网格 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="warm-card overflow-hidden cursor-pointer fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* 封面图 */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <Badge className={`absolute top-4 right-4 ${difficultyColors[project.difficulty]}`}>
                  {project.difficulty}
                </Badge>
              </div>

              {/* 内容 */}
              <div className="p-6">
                <h3 className="text-2xl font-handwriting text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="font-serif text-foreground/70 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-serif">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 项目详情弹窗 */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="warm-card max-w-2xl w-full max-h-[80vh] overflow-y-auto fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <div className="sticky top-0 bg-card p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-2xl font-handwriting text-foreground">
                  {selectedProject.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProject(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* 内容 */}
              <div className="p-6">
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={difficultyColors[selectedProject.difficulty]}>
                    难度：{selectedProject.difficulty}
                  </Badge>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-serif">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="font-serif text-foreground/80 leading-relaxed whitespace-pre-line">
                  {selectedProject.details}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
