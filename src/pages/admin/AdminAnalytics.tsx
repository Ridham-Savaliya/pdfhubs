import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, FileText, Mail, TrendingUp, Calendar } from "lucide-react";

interface ToolUsage {
  tool_name: string;
  count: number;
}

interface DailyConversion {
  date: string;
  count: number;
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [toolUsage, setToolUsage] = useState<ToolUsage[]>([]);
  const [dailyConversions, setDailyConversions] = useState<DailyConversion[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversions: 0,
    totalEmails: 0,
    avgConversionsPerUser: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get total counts
        const [usersRes, conversionsRes, emailsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('conversion_history').select('id', { count: 'exact', head: true }),
          supabase.from('email_logs').select('id', { count: 'exact', head: true }),
        ]);

        const totalUsers = usersRes.count || 0;
        const totalConversions = conversionsRes.count || 0;

        setStats({
          totalUsers,
          totalConversions,
          totalEmails: emailsRes.count || 0,
          avgConversionsPerUser: totalUsers > 0 ? Math.round(totalConversions / totalUsers) : 0,
        });

        // Get tool usage breakdown
        const { data: toolData } = await supabase
          .from('conversion_history')
          .select('tool_name');

        if (toolData) {
          const toolCounts: Record<string, number> = {};
          toolData.forEach(item => {
            toolCounts[item.tool_name] = (toolCounts[item.tool_name] || 0) + 1;
          });
          
          const sortedToolUsage = Object.entries(toolCounts)
            .map(([tool_name, count]) => ({ tool_name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
          
          setToolUsage(sortedToolUsage);
        }

        // Get daily conversions (last 7 days)
        const { data: dailyData } = await supabase
          .from('conversion_history')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (dailyData) {
          const dailyCounts: Record<string, number> = {};
          dailyData.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString();
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          });
          
          // Fill in missing days
          const last7Days: DailyConversion[] = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
            last7Days.push({ date, count: dailyCounts[date] || 0 });
          }
          
          setDailyConversions(last7Days);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-500" },
    { title: "Total Conversions", value: stats.totalConversions, icon: FileText, color: "bg-green-500" },
    { title: "Emails Sent", value: stats.totalEmails, icon: Mail, color: "bg-purple-500" },
    { title: "Avg per User", value: stats.avgConversionsPerUser, icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <AdminLayout title="Analytics" description="Track your site performance">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? "..." : stat.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Conversions Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Conversions (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : dailyConversions.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dailyConversions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Tool Usage Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tool Usage Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : toolUsage.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={280}>
                    <PieChart>
                      <Pie
                        data={toolUsage}
                        dataKey="count"
                        nameKey="tool_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={false}
                      >
                        {toolUsage.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {toolUsage.map((tool, index) => (
                      <div key={tool.tool_name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm truncate">{tool.tool_name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{tool.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
