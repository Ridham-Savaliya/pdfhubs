import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Save, Globe, Tag, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  og_image?: string;
  twitter_handle?: string;
  canonical_url?: string;
}

export default function AdminSEO() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: "",
    description: "",
    keywords: [],
    og_image: "",
    twitter_handle: "",
    canonical_url: "",
  });
  
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'seo')
          .single();

        if (data?.value) {
          setSeoSettings(data.value as unknown as SEOSettings);
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSEOSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.parse(JSON.stringify(seoSettings)) })
        .eq('key', 'seo');

      if (error) throw error;
      toast.success('SEO settings saved!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword && !seoSettings.keywords.includes(newKeyword)) {
      setSeoSettings({
        ...seoSettings,
        keywords: [...seoSettings.keywords, newKeyword],
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoSettings({
      ...seoSettings,
      keywords: seoSettings.keywords.filter(k => k !== keyword),
    });
  };

  if (loading) {
    return (
      <AdminLayout title="SEO Settings" description="Optimize your site for search engines">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="SEO Settings" description="Optimize your site for search engines">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Meta Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Title</Label>
                <Input
                  value={seoSettings.title}
                  onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                  placeholder="PDFTools - Free Online PDF Editor & Converter"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.title.length}/60 characters (recommended max)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={seoSettings.description}
                  onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                  placeholder="Transform your PDFs with ease. Merge, split, compress, convert and edit PDF files online for free."
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.description.length}/160 characters (recommended max)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input
                  value={seoSettings.canonical_url || ""}
                  onChange={(e) => setSeoSettings({ ...seoSettings, canonical_url: e.target.value })}
                  placeholder="https://pdftools.app"
                />
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a keyword..."
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword} variant="secondary">Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {seoSettings.keywords.map((keyword) => (
                  <Badge 
                    key={keyword} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
              
              {seoSettings.keywords.length === 0 && (
                <p className="text-sm text-muted-foreground">No keywords added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input
                  value={seoSettings.og_image || ""}
                  onChange={(e) => setSeoSettings({ ...seoSettings, og_image: e.target.value })}
                  placeholder="https://pdftools.app/og-image.png"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={seoSettings.twitter_handle || ""}
                  onChange={(e) => setSeoSettings({ ...seoSettings, twitter_handle: e.target.value })}
                  placeholder="@pdftools"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSEOSettings} disabled={saving} size="lg" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save SEO Settings
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Google Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-blue-600 text-lg font-medium truncate">
                  {seoSettings.title || 'Your Page Title'}
                </p>
                <p className="text-green-700 text-sm truncate">
                  {seoSettings.canonical_url || 'https://pdftools.app'}
                </p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {seoSettings.description || 'Your meta description will appear here...'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✅ Keep titles under 60 characters</p>
              <p>✅ Keep descriptions under 160 characters</p>
              <p>✅ Use primary keyword in title</p>
              <p>✅ Make descriptions compelling</p>
              <p>✅ Use unique titles for each page</p>
              <p>✅ Add relevant keywords naturally</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
