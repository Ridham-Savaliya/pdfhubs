import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Settings, User, Shield, Mail } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <AdminLayout title="Settings" description="Manage your admin account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Super Admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium">✓ Email Service Active</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Gmail SMTP is configured and ready to send emails
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Welcome emails on new signups</p>
              <p>• Marketing campaign emails</p>
              <p>• Inactivity reminder emails</p>
              <p>• Daily tip emails</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">📢 Advertisements</h4>
                <p className="text-sm text-muted-foreground">
                  Create banner, sidebar, popup, or inline ads. Toggle active/inactive status instantly.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📧 Email Campaigns</h4>
                <p className="text-sm text-muted-foreground">
                  Send promotional emails using pre-built templates or custom content to all subscribers.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 Banners</h4>
                <p className="text-sm text-muted-foreground">
                  Add announcement bars and hero banners to highlight promotions on your site.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 SEO Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize meta tags, keywords, and social media previews for better search rankings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📊 Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  View user stats, tool usage, and conversion trends to understand your audience.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">⚡ Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">
                  All changes reflect immediately on the live site. No deployment needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
