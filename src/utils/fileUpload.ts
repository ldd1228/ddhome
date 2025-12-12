import { supabase } from '@/db/supabase';

const BUCKET_NAME = 'app-7ye5lvt16n7l_contact_media';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * 生成唯一的文件名
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  // 只保留英文字母和数字
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.]/g, '_')
    .substring(0, 50);
  return `${timestamp}_${random}_${safeName}`;
}

/**
 * 验证文件类型
 */
function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return file.type.startsWith(prefix + '/');
    }
    return file.type === type;
  });
}

/**
 * 压缩图片
 */
async function compressImage(file: File, maxSize: number = MAX_IMAGE_SIZE): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 限制最大分辨率为 1080p
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 尝试不同的质量级别
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('图片压缩失败'));
                return;
              }

              if (blob.size <= maxSize || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/webp',
            quality
          );
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error('图片加载失败'));
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
  });
}

/**
 * 上传图片文件
 */
export async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validateFileType(file, allowedTypes)) {
    throw new Error('不支持的图片格式，请上传 JPEG、PNG、GIF 或 WEBP 格式的图片');
  }

  // 检查文件名是否包含中文
  if (/[\u4e00-\u9fa5]/.test(file.name)) {
    throw new Error('文件名不能包含中文字符，请重命名后重试');
  }

  let fileToUpload = file;

  // 如果文件超过限制，自动压缩
  if (file.size > MAX_IMAGE_SIZE) {
    try {
      fileToUpload = await compressImage(file, MAX_IMAGE_SIZE);
      console.log(`图片已自动压缩：${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      throw new Error('图片压缩失败，请尝试上传更小的图片');
    }
  }

  // 生成唯一文件名
  const fileName = generateUniqueFileName(file.name);
  const filePath = `images/${fileName}`;

  // 上传到 Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('图片上传失败：', error);
    throw new Error('图片上传失败，请稍后重试');
  }

  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
}

/**
 * 上传视频文件
 */
export async function uploadVideo(file: File): Promise<{ url: string; path: string }> {
  // 验证文件类型
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!validateFileType(file, allowedTypes)) {
    throw new Error('不支持的视频格式，请上传 MP4、WEBM 或 MOV 格式的视频');
  }

  // 检查文件名是否包含中文
  if (/[\u4e00-\u9fa5]/.test(file.name)) {
    throw new Error('文件名不能包含中文字符，请重命名后重试');
  }

  // 检查文件大小
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`视频文件过大，最大支持 ${MAX_VIDEO_SIZE / 1024 / 1024}MB`);
  }

  // 生成唯一文件名
  const fileName = generateUniqueFileName(file.name);
  const filePath = `videos/${fileName}`;

  // 上传到 Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('视频上传失败：', error);
    throw new Error('视频上传失败，请稍后重试');
  }

  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
}

/**
 * 上传画板图片（base64）
 */
export async function uploadDrawing(dataUrl: string): Promise<{ url: string; path: string }> {
  // 将 base64 转换为 Blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  // 创建 File 对象
  const file = new File([blob], `drawing_${Date.now()}.png`, {
    type: 'image/png',
    lastModified: Date.now(),
  });

  // 使用图片上传函数
  return uploadImage(file);
}

/**
 * 删除文件
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('文件删除失败：', error);
    throw new Error('文件删除失败');
  }
}
