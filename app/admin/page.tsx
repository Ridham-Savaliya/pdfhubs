"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Megaphone, Eye, TrendingUp, FileText } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeAds: 0,
        emailsSent: 0,
        totalConversions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [profilesRes, adsRes, emailsRes, conversionsRes] = await Promise.all([
                    supabase.from('profiles').select('id', { count: 'exact', head: true }),
                    supabase.from('advertisements').select('id', { count: 'exact', head: true }).eq('is_active', true),
                    supabase.from('email_logs').select('id', { count: 'exact', head: true }),
                    supabase.from('conversion_history').select('id', { count: 'exact', head: true }),
                ]);

                setStats({
                    totalUsers: profilesRes.count || 0,
                    activeAds: adsRes.count || 0,
                    emailsSent: emailsRes.count || 0,
                    totalConversions: conversionsRes.count || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-500",
            trend: "+12% from last month"
        },
        {
            title: "Active Ads",
            value: stats.activeAds,
            icon: Megaphone,
            color: "bg-green-500",
            trend: "Running campaigns"
        },
        {
            title: "Emails Sent",
            value: stats.emailsSent,
            icon: Mail,
            color: "bg-purple-500",
            trend: "Total delivered"
        },
        {
            title: "PDF Conversions",
            value: stats.totalConversions,
            icon: FileText,
            color: "bg-orange-500",
            trend: "All time"
        },
    ];

    return (
        <AdminLayout title="Dashboard" description="Overview of your site performance">
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <stat.icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-foreground">
                                    {loading ? "..." : stat.value.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/admin/ads"
                                className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Megaphone className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium">Create Advertisement</p>
                                        <p className="text-sm text-muted-foreground">Launch a new ad campaign</p>
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/admin/emails"
                                className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <p className="font-medium">Send Email Campaign</p>
                                        <p className="text-sm text-muted-foreground">Reach out to your users</p>
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/admin/banners"
                                className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium">Update Hero Banner</p>
                                        <p className="text-sm text-muted-foreground">Customize your homepage</p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-muted-foreground">System running smoothly</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-muted-foreground">Email service active</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-muted-foreground">All tools operational</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
