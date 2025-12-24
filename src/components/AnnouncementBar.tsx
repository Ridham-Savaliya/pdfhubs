import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Interface matches admin panel field names exactly
interface AnnouncementBarSettings {
  enabled: boolean;
  text: string;
  link: string;
  background_color: string;
}

export function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementBarSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchSettings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('announcement-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.announcement_bar'
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'value' in payload.new) {
            setSettings(payload.new.value as unknown as AnnouncementBarSettings);
            setDismissed(false); // Show again when updated
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'announcement_bar')
      .maybeSingle();

    if (data?.value) {
      setSettings(data.value as unknown as AnnouncementBarSettings);
    }
  };

  if (!settings?.enabled || dismissed || !settings?.text) return null;

  return (
    <div 
      className="relative py-2.5 px-4 text-center text-sm font-medium"
      style={{ 
        backgroundColor: settings.background_color || '#ef4444',
        color: '#ffffff'
      }}
    >
      <div className="container flex items-center justify-center gap-2">
        <span>{settings.text}</span>
        {settings.link && (
          <a 
            href={settings.link} 
            className="underline underline-offset-2 hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more →
          </a>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
