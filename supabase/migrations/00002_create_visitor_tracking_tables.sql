/*
# 创建访客追踪和留言管理表

## 1. 新建表

### visitors 表
- `id` (uuid, 主键, 自动生成)
- `visitor_uuid` (uuid, 访客唯一标识)
- `page_path` (text, 访问页面路径)
- `referrer` (text, 来源页面)
- `user_agent` (text, 浏览器信息)
- `screen_resolution` (text, 屏幕分辨率)
- `language` (text, 浏览器语言)
- `visited_at` (timestamptz, 访问时间, 默认当前时间)

### messages 表
- `id` (uuid, 主键, 自动生成)
- `visitor_uuid` (uuid, 访客唯一标识)
- `name` (text, 留言者姓名)
- `email` (text, 留言者邮箱)
- `message` (text, 留言内容)
- `media_files` (jsonb, 媒体文件信息)
- `ip_address` (text, IP 地址, 可选)
- `user_agent` (text, 浏览器信息)
- `created_at` (timestamptz, 创建时间, 默认当前时间)

## 2. 安全策略
- 不启用 RLS（公开数据，适合个人网站）
- 所有用户可以插入访客记录
- 所有用户可以查看所有数据
- 适合无登录系统的个人网站场景

## 3. 索引优化
- visitor_uuid 索引（快速查询同一访客）
- visited_at 和 created_at 索引（按时间排序）

## 4. 注意事项
- 使用 UUID 标识匿名访客
- 不收集敏感个人信息
- 符合隐私保护原则
*/

-- 创建访客记录表
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_uuid uuid NOT NULL,
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  screen_resolution text,
  language text,
  visited_at timestamptz DEFAULT now()
);

-- 创建留言记录表
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_uuid uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  media_files jsonb DEFAULT '[]'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_uuid ON visitors(visitor_uuid);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_visitor_uuid ON messages(visitor_uuid);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_email ON messages(email);

-- 添加注释
COMMENT ON TABLE visitors IS '访客记录表 - 记录网站访问信息';
COMMENT ON TABLE messages IS '留言记录表 - 记录所有留言信息';

COMMENT ON COLUMN visitors.visitor_uuid IS '访客唯一标识（存储在浏览器 localStorage）';
COMMENT ON COLUMN visitors.page_path IS '访问的页面路径';
COMMENT ON COLUMN visitors.referrer IS '来源页面 URL';
COMMENT ON COLUMN visitors.user_agent IS '浏览器 User Agent';
COMMENT ON COLUMN visitors.screen_resolution IS '屏幕分辨率（如：1920x1080）';
COMMENT ON COLUMN visitors.language IS '浏览器语言';

COMMENT ON COLUMN messages.visitor_uuid IS '留言者的访客标识';
COMMENT ON COLUMN messages.media_files IS '媒体文件信息（JSON 数组）';
COMMENT ON COLUMN messages.ip_address IS 'IP 地址（可选）';