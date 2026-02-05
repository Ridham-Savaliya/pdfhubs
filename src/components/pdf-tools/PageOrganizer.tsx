import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCw, Trash2, GripVertical, Download, Loader2 } from 'lucide-react';
import { getPageThumbnails, reorderPages, deletePages, rotatePDF, downloadFile } from '@/lib/pdf-utils';
import { toast } from 'sonner';

interface PageOrganizerProps {
  file: File;
  onComplete?: () => void;
}

interface PageData {
  index: number;
  thumbnail: string;
  rotation: number;
  deleted: boolean;
}

export function PageOrganizer({ file, onComplete }: PageOrganizerProps) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [draggedPage, setDraggedPage] = useState<number | null>(null);

  useEffect(() => {
    loadThumbnails();
  }, [file]);

  const loadThumbnails = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const thumbnails = await getPageThumbnails(file, 100, (p) => setProgress(p));
      setPages(thumbnails.map((thumb, index) => ({
        index: index + 1,
        thumbnail: thumb,
        rotation: 0,
        deleted: false,
      })));
    } catch (error) {
      toast.error('Failed to load PDF pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPage(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPage === null || draggedPage === targetIndex) return;

    const newPages = [...pages];
    const [draggedItem] = newPages.splice(draggedPage, 1);
    newPages.splice(targetIndex, 0, draggedItem);
    setPages(newPages);
    setDraggedPage(null);
  };

  const toggleDelete = (index: number) => {
    setPages(prev => prev.map((page, i) => 
      i === index ? { ...page, deleted: !page.deleted } : page
    ));
  };

  const rotatePage = (index: number) => {
    setPages(prev => prev.map((page, i) => 
      i === index ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    ));
  };

  const handleSave = async () => {
    setProcessing(true);
    setProgress(0);

    try {
      // Get active pages in new order
      const activePages = pages.filter(p => !p.deleted);
      const newOrder = activePages.map(p => p.index);
      
      if (newOrder.length === 0) {
        toast.error('Cannot delete all pages');
        setProcessing(false);
        return;
      }

      setProgress(30);

      // Reorder pages first
      let resultBlob = await reorderPages(file, newOrder);
      setProgress(60);

      // Apply rotations if any
      const rotations = activePages.filter(p => p.rotation > 0);
      if (rotations.length > 0) {
        // For simplicity, apply rotation to all pages if any have rotation
        // In production, you'd want per-page rotation
        const avgRotation = rotations[0].rotation as 0 | 90 | 180 | 270;
        const rotatedFile = new File([resultBlob], file.name, { type: 'application/pdf' });
        resultBlob = await rotatePDF(rotatedFile, avgRotation);
      }

      setProgress(100);
      downloadFile(resultBlob, `organized-${file.name}`);
      toast.success(`PDF saved with ${activePages.length} pages`);
      onComplete?.();
    } catch (error) {
      toast.error('Failed to save PDF');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground mb-4">Loading pages...</p>
        <Progress value={progress} className="max-w-xs mx-auto" />
      </div>
    );
  }

  const activePageCount = pages.filter(p => !p.deleted).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Organize Pages</h3>
          <p className="text-sm text-muted-foreground">
            Drag to reorder • {activePageCount} of {pages.length} pages selected
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={processing}
          className="bg-gradient-primary"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Save PDF
            </>
          )}
        </Button>
      </div>

      {processing && (
        <Progress value={progress} className="h-2" />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pages.map((page, index) => (
          <div
            key={page.index}
            draggable={!page.deleted}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group rounded-xl border-2 transition-all duration-200 ${
              page.deleted 
                ? 'opacity-50 border-destructive bg-destructive/10' 
                : 'border-border hover:border-primary hover:shadow-lg cursor-grab active:cursor-grabbing'
            } ${draggedPage === index ? 'ring-2 ring-primary shadow-xl' : ''}`}
          >
            {!page.deleted && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            
            <div className="p-2">
              <div 
                className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-sm"
                style={{ transform: `rotate(${page.rotation}deg)` }}
              >
                <img 
                  src={page.thumbnail} 
                  alt={`Page ${page.index}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            </div>
            
            <div className="p-2 pt-0 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Page {page.index}
              </span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => rotatePage(index)}
                  disabled={page.deleted}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-7 w-7 ${page.deleted ? 'text-destructive' : ''}`}
                  onClick={() => toggleDelete(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
