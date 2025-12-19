import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordVisit } from '@/db/api';

/**
 * 获取或创建访客 UUID
 */
function getVisitorUUID(): string {
  const STORAGE_KEY = 'visitor_uuid';
  let uuid = localStorage.getItem(STORAGE_KEY);

  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, uuid);
  }

  return uuid;
}

/**
 * 获取屏幕分辨率
 */
function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

/**
 * 访客追踪组件
 * 自动记录页面访问
 */
export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitor_uuid = getVisitorUUID();
        const page_path = location.pathname + location.search;
        const referrer = document.referrer;
        const user_agent = navigator.userAgent;
        const screen_resolution = getScreenResolution();
        const language = navigator.language;

        await recordVisit({
          visitor_uuid,
          page_path,
          referrer,
          user_agent,
          screen_resolution,
          language,
        });

        console.log('访问记录已保存');
      } catch (error) {
        console.error('记录访问失败：', error);
      }
    };

    trackVisit();
  }, [location]);

  return null; // 不渲染任何内容
}

/**
 * 导出获取访客 UUID 的函数，供其他组件使用
 */
export { getVisitorUUID };
