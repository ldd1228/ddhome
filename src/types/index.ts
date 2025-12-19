export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// 页面区域类型
export type SectionType = 'home' | 'about' | 'projects' | 'interests' | 'contact';

// 项目类型
export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  difficulty: '简单' | '中等' | '挑战';
  tags: string[];
  details?: string;
  images?: string[];
}

// 兴趣爱好类型
export interface Interest {
  id: string;
  title: string;
  image: string;
  note: string;
  rotation?: number;
}

// 时间轴事件类型
export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

// 联系表单类型
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// 访客记录类型
export interface Visitor {
  id: string;
  visitor_uuid: string;
  page_path: string;
  referrer: string | null;
  user_agent: string | null;
  screen_resolution: string | null;
  language: string | null;
  visited_at: string;
}

// 媒体文件类型
export interface MediaFile {
  type: 'image' | 'video' | 'drawing';
  url: string;
  name: string;
}

// 留言记录类型
export interface Message {
  id: string;
  visitor_uuid: string;
  name: string;
  email: string;
  message: string;
  media_files: MediaFile[];
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

