import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnnouncementBarSettings {
  enabled: boolean;
  message: string;
  link: string;
  backgroundColor: string;
  textColor: string;
}

export function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementBarSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchSettings();
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

  if (!settings?.enabled || dismissed) return null;

  return (
    <div 
      className="relative py-2.5 px-4 text-center text-sm font-medium"
      style={{ 
        backgroundColor: settings.backgroundColor || '#ef4444',
        color: settings.textColor || '#ffffff'
      }}
    >
      <div className="container flex items-center justify-center gap-2">
        <span>{settings.message}</span>
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
