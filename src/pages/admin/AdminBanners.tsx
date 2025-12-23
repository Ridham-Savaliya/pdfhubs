import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Image, Megaphone, Save } from "lucide-react";

interface HeroBanner {
  enabled: boolean;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_color: string;
  image_url?: string;
}

interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link: string;
  background_color: string;
}

export default function AdminBanners() {
  const [heroBanner, setHeroBanner] = useState<HeroBanner>({
    enabled: false,
    title: "",
    description: "",
    cta_text: "",
    cta_link: "",
    background_color: "#ef4444",
  });
  
  const [announcementBar, setAnnouncementBar] = useState<AnnouncementBar>({
    enabled: false,
    text: "",
    link: "",
    background_color: "#ef4444",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: heroData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_banner')
          .single();
        
        const { data: announcementData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'announcement_bar')
          .single();

        if (heroData?.value) {
          setHeroBanner(heroData.value as unknown as HeroBanner);
        }
        if (announcementData?.value) {
          setAnnouncementBar(announcementData.value as unknown as AnnouncementBar);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveHeroBanner = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.parse(JSON.stringify(heroBanner)) })
        .eq('key', 'hero_banner');

      if (error) throw error;
      toast.success('Hero banner saved!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAnnouncementBar = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.parse(JSON.stringify(announcementBar)) })
        .eq('key', 'announcement_bar');

      if (error) throw error;
      toast.success('Announcement bar saved!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Banners" description="Customize your site banners">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Banners" description="Customize your site banners and announcements">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcement Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcement Bar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Announcement Bar</Label>
              <Switch
                checked={announcementBar.enabled}
                onCheckedChange={(checked) => 
                  setAnnouncementBar({ ...announcementBar, enabled: checked })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Announcement Text</Label>
              <Input
                value={announcementBar.text}
                onChange={(e) => setAnnouncementBar({ ...announcementBar, text: e.target.value })}
                placeholder="🎉 Special offer! Get 50% off..."
              />
            </div>

            <div className="space-y-2">
              <Label>Link URL (optional)</Label>
              <Input
                value={announcementBar.link}
                onChange={(e) => setAnnouncementBar({ ...announcementBar, link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={announcementBar.background_color}
                  onChange={(e) => setAnnouncementBar({ ...announcementBar, background_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={announcementBar.background_color}
                  onChange={(e) => setAnnouncementBar({ ...announcementBar, background_color: e.target.value })}
                />
              </div>
            </div>

            {/* Preview */}
            {announcementBar.enabled && (
              <div 
                className="p-3 rounded-lg text-center text-white font-medium"
                style={{ backgroundColor: announcementBar.background_color }}
              >
                {announcementBar.text || 'Your announcement here...'}
              </div>
            )}

            <Button onClick={saveAnnouncementBar} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Announcement Bar
            </Button>
          </CardContent>
        </Card>

        {/* Hero Banner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Hero Banner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Hero Banner</Label>
              <Switch
                checked={heroBanner.enabled}
                onCheckedChange={(checked) => 
                  setHeroBanner({ ...heroBanner, enabled: checked })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={heroBanner.title}
                onChange={(e) => setHeroBanner({ ...heroBanner, title: e.target.value })}
                placeholder="Special Promotion!"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={heroBanner.description}
                onChange={(e) => setHeroBanner({ ...heroBanner, description: e.target.value })}
                placeholder="Get access to all premium features..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                  value={heroBanner.cta_text}
                  onChange={(e) => setHeroBanner({ ...heroBanner, cta_text: e.target.value })}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input
                  value={heroBanner.cta_link}
                  onChange={(e) => setHeroBanner({ ...heroBanner, cta_link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input
                value={heroBanner.image_url || ""}
                onChange={(e) => setHeroBanner({ ...heroBanner, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={heroBanner.background_color}
                  onChange={(e) => setHeroBanner({ ...heroBanner, background_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={heroBanner.background_color}
                  onChange={(e) => setHeroBanner({ ...heroBanner, background_color: e.target.value })}
                />
              </div>
            </div>

            {/* Preview */}
            {heroBanner.enabled && (
              <div 
                className="p-6 rounded-lg text-white"
                style={{ backgroundColor: heroBanner.background_color }}
              >
                <h3 className="text-xl font-bold">{heroBanner.title || 'Banner Title'}</h3>
                <p className="text-sm opacity-90 mt-2">{heroBanner.description || 'Banner description...'}</p>
                {heroBanner.cta_text && (
                  <button className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium">
                    {heroBanner.cta_text}
                  </button>
                )}
              </div>
            )}

            <Button onClick={saveHeroBanner} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Hero Banner
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
