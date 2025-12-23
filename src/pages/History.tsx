import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Trash2, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ConversionRecord {
  id: string;
  tool_name: string;
  original_filename: string;
  output_filename: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
}

export default function History() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('conversion_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load conversion history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversion_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHistory(history.filter(h => h.id !== id));
      toast.success('Record deleted');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getToolEmoji = (toolName: string): string => {
    const emojis: Record<string, string> = {
      'Merge PDF': '🔗',
      'Split PDF': '✂️',
      'Compress PDF': '📦',
      'PDF to JPG': '🖼️',
      'JPG to PDF': '📄',
      'Rotate PDF': '🔄',
      'Add Watermark': '💧',
      'Add Page Numbers': '#️⃣',
      'PDF to Word': '📝',
      'PDF to Excel': '📊',
      'PDF to PowerPoint': '📽️',
    };
    return emojis[toolName] || '📄';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to tools
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                Conversion History
              </h1>
              <p className="text-muted-foreground">
                View and manage your recent PDF conversions
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                No conversions yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Your conversion history will appear here after you process some files.
              </p>
              <Link to="/">
                <Button className="bg-gradient-primary">
                  Start Converting
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="text-3xl">{getToolEmoji(record.tool_name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">
                        {record.original_filename}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                        {record.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{record.tool_name}</span>
                      <span>•</span>
                      <span>{formatFileSize(record.file_size)}</span>
                      <span>•</span>
                      <span>{format(new Date(record.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRecord(record.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
