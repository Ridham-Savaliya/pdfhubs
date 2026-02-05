import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Mail, Users, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailLog {
  id: string;
  email: string;
  email_type: string;
  status: string;
  sent_at: string;
}

interface EmailSubscription {
  id: string;
  user_id: string;
  marketing_emails: boolean;
  last_activity_at: string;
}

const emailTemplates = [
  { value: 'promotional', label: 'Custom Promotional' },
  { value: 'daily_tip', label: 'Daily PDF Tip' },
  { value: 'feature_highlight', label: 'Feature Highlight' },
  { value: 'competitor_comparison', label: 'Competitor Comparison' },
  { value: 'inactivity', label: 'Inactivity Reminder' },
];

export default function AdminEmails() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    template: 'promotional',
    subject: '',
    content: '',
    targetEmail: '', // Single email for testing
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, subsRes] = await Promise.all([
          supabase
            .from('email_logs')
            .select('*')
            .order('sent_at', { ascending: false })
            .limit(50),
          supabase
            .from('email_subscriptions')
            .select('*')
            .eq('marketing_emails', true),
        ]);

        if (logsRes.data) setEmailLogs(logsRes.data);
        if (subsRes.data) setSubscribers(subsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sendTestEmail = async () => {
    if (!formData.targetEmail) {
      toast.error('Please enter a target email');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: formData.template,
          email: formData.targetEmail,
          subject: formData.subject,
          content: formData.content,
        }
      });

      if (error) throw error;
      toast.success('Test email sent successfully!');
      
      // Refresh logs
      const { data: logs } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      if (logs) setEmailLogs(logs);
    } catch (error: any) {
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const sendBulkEmails = async () => {
    if (subscribers.length === 0) {
      toast.error('No subscribers to send to');
      return;
    }

    if (!confirm(`Send ${formData.template} email to ${subscribers.length} subscribers?`)) {
      return;
    }

    setSending(true);
    let sent = 0;
    let failed = 0;

    try {
      // Get profiles for subscriber emails
      const userIds = subscribers.map(s => s.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      if (!profiles) {
        toast.error('No profiles found');
        return;
      }

      for (const profile of profiles) {
        if (!profile.email) continue;
        
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: formData.template,
              email: profile.email,
              fullName: profile.full_name,
              subject: formData.subject,
              content: formData.content,
            }
          });
          sent++;
        } catch {
          failed++;
        }
      }

      toast.success(`Sent ${sent} emails${failed > 0 ? `, ${failed} failed` : ''}`);
    } catch (error: any) {
      toast.error(`Bulk send failed: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout title="Email Campaigns" description="Send marketing emails to your users">
      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Compose Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Template</Label>
                  <Select
                    value={formData.template}
                    onValueChange={(value) => setFormData({ ...formData, template: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.template === 'promotional' && (
                  <>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Email subject line"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content (HTML supported)</Label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write your email content here..."
                        rows={6}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Test Email Address</Label>
                  <Input
                    type="email"
                    value={formData.targetEmail}
                    onChange={(e) => setFormData({ ...formData, targetEmail: e.target.value })}
                    placeholder="test@example.com"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={sendTestEmail} disabled={sending} variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Send Test
                  </Button>
                  <Button onClick={sendBulkEmails} disabled={sending}>
                    <Users className="h-4 w-4 mr-2" />
                    Send to All ({subscribers.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 text-sm">
                  {formData.template === 'promotional' && (
                    <div>
                      <p className="font-semibold mb-2">{formData.subject || 'Custom Subject'}</p>
                      <p className="text-muted-foreground">{formData.content || 'Your custom content will appear here...'}</p>
                    </div>
                  )}
                  {formData.template === 'daily_tip' && (
                    <div>
                      <p className="font-semibold mb-2">💡 Your Daily PDF Tip</p>
                      <p className="text-muted-foreground">Rotating tips about PDF features with eye-catching design</p>
                    </div>
                  )}
                  {formData.template === 'feature_highlight' && (
                    <div>
                      <p className="font-semibold mb-2">🚀 Feature Spotlight</p>
                      <p className="text-muted-foreground">Showcases PDFHubs features with colorful cards</p>
                    </div>
                  )}
                  {formData.template === 'competitor_comparison' && (
                    <div>
                      <p className="font-semibold mb-2">🏆 Why PDFHubs?</p>
                      <p className="text-muted-foreground">Comparison table vs iLovePDF showing our advantages</p>
                    </div>
                  )}
                  {formData.template === 'inactivity' && (
                    <div>
                      <p className="font-semibold mb-2">😢 We Miss You!</p>
                      <p className="text-muted-foreground">Re-engagement email for inactive users</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Emails ({emailLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : emailLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No emails sent yet</p>
              ) : (
                <div className="space-y-3">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{log.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.email_type} • {new Date(log.sent_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">{log.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Marketing Subscribers ({subscribers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : subscribers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No subscribers yet</p>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">User ID: {sub.user_id.slice(0, 8)}...</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {new Date(sub.last_activity_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
