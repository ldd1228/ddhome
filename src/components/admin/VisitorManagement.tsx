import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { getVisitors, getVisitorStats } from '@/db/api';
import { Visitor } from '@/types';

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState({
    total_visits: 0,
    unique_visitors: 0,
    total_messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [visitorsData, statsData] = await Promise.all([
        getVisitors({ limit: 100 }),
        getVisitorStats(),
      ]);
      setVisitors(visitorsData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败：', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrowserName = (userAgent: string | null) => {
    if (!userAgent) return '未知';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return '其他';
  };

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return '未知';
    if (/Mobile|Android|iPhone/i.test(userAgent)) return '移动端';
    if (/iPad|Tablet/i.test(userAgent)) return '平板';
    return '桌面端';
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总访问次数</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{stats.total_visits}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              所有页面访问记录
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">独立访客</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{stats.unique_visitors}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              不重复的访客数量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">留言总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-muted" />
            ) : (
              <div className="text-2xl font-bold">{stats.total_messages}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              收到的留言数量
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 访客列表 */}
      <Card>
        <CardHeader>
          <CardTitle>访客记录</CardTitle>
          <CardDescription>
            最近 100 条访问记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无访客记录
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>访问时间</TableHead>
                    <TableHead>页面路径</TableHead>
                    <TableHead>浏览器</TableHead>
                    <TableHead>设备类型</TableHead>
                    <TableHead>分辨率</TableHead>
                    <TableHead>语言</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(visitor.visited_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visitor.page_path}</Badge>
                      </TableCell>
                      <TableCell>
                        {getBrowserName(visitor.user_agent)}
                      </TableCell>
                      <TableCell>
                        {getDeviceType(visitor.user_agent)}
                      </TableCell>
                      <TableCell>
                        {visitor.screen_resolution || '-'}
                      </TableCell>
                      <TableCell>
                        {visitor.language || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
