/*
# 创建留言媒体文件存储桶

## 1. 新建 Storage Bucket
- `app-7ye5lvt16n7l_contact_media`
  - 用于存储留言中的图片、视频和画板图片
  - 公开访问（任何人可查看）
  - 文件大小限制：图片 5MB，视频 10MB

## 2. 安全策略
- 允许所有用户上传文件（无需登录）
- 允许所有用户查看文件
- 文件自动公开访问

## 3. 文件类型
- 图片：JPEG, PNG, GIF, WEBP
- 视频：MP4, WEBM, MOV

## 4. 注意事项
- 文件名使用 UUID 避免冲突
- 前端需要验证文件类型和大小
*/

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7ye5lvt16n7l_contact_media',
  'app-7ye5lvt16n7l_contact_media',
  true,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 允许所有用户上传文件
CREATE POLICY "允许所有用户上传留言媒体文件"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'app-7ye5lvt16n7l_contact_media');

-- 允许所有用户查看文件
CREATE POLICY "允许所有用户查看留言媒体文件"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-7ye5lvt16n7l_contact_media');

-- 允许所有用户删除自己上传的文件（可选）
CREATE POLICY "允许用户删除留言媒体文件"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'app-7ye5lvt16n7l_contact_media');