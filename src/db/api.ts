import { supabase } from './supabase';
import { Visitor, Message } from '@/types';

/**
 * 记录访客访问
 */
export async function recordVisit(data: {
  visitor_uuid: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
  screen_resolution?: string;
  language?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('visitors')
    .insert({
      visitor_uuid: data.visitor_uuid,
      page_path: data.page_path,
      referrer: data.referrer || null,
      user_agent: data.user_agent || null,
      screen_resolution: data.screen_resolution || null,
      language: data.language || null,
    });

  if (error) {
    console.error('记录访问失败：', error);
  }
}

/**
 * 保存留言记录
 */
export async function saveMessage(data: {
  visitor_uuid: string;
  name: string;
  email: string;
  message: string;
  media_files?: any[];
  user_agent?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('messages')
    .insert({
      visitor_uuid: data.visitor_uuid,
      name: data.name,
      email: data.email,
      message: data.message,
      media_files: data.media_files || [],
      user_agent: data.user_agent || null,
    });

  if (error) {
    console.error('保存留言失败：', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 获取所有访客记录
 */
export async function getVisitors(params?: {
  limit?: number;
  offset?: number;
}): Promise<Visitor[]> {
  const { limit = 100, offset = 0 } = params || {};

  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('visited_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('获取访客记录失败：', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 获取所有留言记录
 */
export async function getMessages(params?: {
  limit?: number;
  offset?: number;
}): Promise<Message[]> {
  const { limit = 100, offset = 0 } = params || {};

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('获取留言记录失败：', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 获取访客统计
 */
export async function getVisitorStats(): Promise<{
  total_visits: number;
  unique_visitors: number;
  total_messages: number;
}> {
  // 总访问次数
  const { count: total_visits } = await supabase
    .from('visitors')
    .select('*', { count: 'exact', head: true });

  // 唯一访客数
  const { data: unique_data } = await supabase
    .from('visitors')
    .select('visitor_uuid');

  const unique_visitors = unique_data
    ? new Set(unique_data.map(v => v.visitor_uuid)).size
    : 0;

  // 总留言数
  const { count: total_messages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  return {
    total_visits: total_visits || 0,
    unique_visitors,
    total_messages: total_messages || 0,
  };
}

/**
 * 根据访客 UUID 获取该访客的所有访问记录
 */
export async function getVisitorHistory(visitor_uuid: string): Promise<Visitor[]> {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('visitor_uuid', visitor_uuid)
    .order('visited_at', { ascending: false });

  if (error) {
    console.error('获取访客历史失败：', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 根据访客 UUID 获取该访客的所有留言
 */
export async function getVisitorMessages(visitor_uuid: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('visitor_uuid', visitor_uuid)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取访客留言失败：', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}
