import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeftRight, Server, Monitor, Eye, FileDiff, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { comparePDFs, pdfToImages } from '@/lib/pdf-utils';
import { toast } from 'sonner';

interface PDFComparerProps {
  files: File[];
}

interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface ComparisonResult {
  differences: {
    page: number;
    type: "text" | "layout";
    description: string;
    diffs?: DiffChange[];
  }[];
  summary: string;
  pageCount1: number;
  pageCount2: number;
}

export function PDFComparer({ files }: PDFComparerProps) {
  const [comparing, setComparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [mode, setMode] = useState<'text' | 'visual'>('text');
  const [file1Images, setFile1Images] = useState<string[]>([]);
  const [file2Images, setFile2Images] = useState<string[]>([]);
  const [currentVisualPage, setCurrentVisualPage] = useState(0);
  const [loadingVisuals, setLoadingVisuals] = useState(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      file1Images.forEach(url => URL.revokeObjectURL(url));
      file2Images.forEach(url => URL.revokeObjectURL(url));
    };
  }, [file1Images, file2Images]);

  const handleCompare = async () => {
    if (files.length !== 2) {
      toast.error('Please upload exactly 2 PDF files to compare');
      return;
    }

    setComparing(true);
    setProgress(0);
    setResult(null);

    try {
      // Perform text comparison
      const comparisonResult = await comparePDFs(files[0], files[1], (p) => setProgress(p));
      setResult(comparisonResult);

      if (comparisonResult.differences.length === 0) {
        toast.success('Text content is identical!');
      } else {
        toast.info(`Found differences on ${comparisonResult.differences.length} page(s)`);
      }

      // Pre-load visuals if switch to visual mode
      // We don't load them yet to save performance, only if user clicks visual or if we want to show immediately.
      // Let's load them on demand when switching to visual mode.

    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Failed to compare PDFs');
    } finally {
      setComparing(false);
    }
  };

  const loadVisuals = async () => {
    if (file1Images.length > 0) return; // Already loaded

    setLoadingVisuals(true);
    try {
      const blobs1 = await pdfToImages(files[0], { scale: 1.0 });
      const blobs2 = await pdfToImages(files[1], { scale: 1.0 });

      const urls1 = blobs1.map(b => URL.createObjectURL(b));
      const urls2 = blobs2.map(b => URL.createObjectURL(b));

      setFile1Images(urls1);
      setFile2Images(urls2);
    } catch (e) {
      toast.error("Failed to load visual comparison");
    } finally {
      setLoadingVisuals(false);
    }
  };

  useEffect(() => {
    if (mode === 'visual' && result) {
      loadVisuals();
    }
  }, [mode, result]);

  const stats = result ? {
    textDiffs: result.differences.filter(d => d.type === 'text').length,
    layoutDiffs: result.differences.filter(d => d.type === 'layout').length,
    total: result.differences.length
  } : null;

  return (
    <div className="space-y-6">
      {/* File Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file, index) => (
          <div key={index} className="p-4 bg-secondary/50 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Doc {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Compare Button */}
      {!result && (
        <div className="text-center py-8">
          <Button
            onClick={handleCompare}
            disabled={comparing || files.length !== 2}
            size="lg"
            className="bg-gradient-primary w-full max-w-xs"
          >
            {comparing ? 'Analyzing Documents...' : 'Start Comparison'}
          </Button>
          {comparing && (
            <div className="mt-4 max-w-xs mx-auto space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setMode('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'text'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Text Analysis
              </button>
              <button
                onClick={() => setMode('visual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'visual'
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Visual Comparison
              </button>
            </div>
          </div>

          {/* Summary Banner */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center justify-between ${result.differences.length === 0
              ? 'bg-success/5 border-success/20'
              : 'bg-warning/5 border-warning/20'
            }`}>
            <div className="flex items-center gap-3">
              {result.differences.length === 0 ? (
                <div className="p-2 bg-success/10 rounded-full">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              ) : (
                <div className="p-2 bg-warning/10 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground">
                  {result.summary}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Compared {result.pageCount1} pages vs {result.pageCount2} pages
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => {
              setResult(null);
              setFile1Images([]);
              setFile2Images([]);
            }}>
              Compare New Files
            </Button>
          </div>

          {/* TEXT ANALYSIS MODE */}
          {mode === 'text' && (
            <div className="space-y-4">
              {result.differences.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No text differences found between these documents.
                </div>
              ) : (
                result.differences.map((diff, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-secondary/30 px-4 py-3 border-b border-border flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <FileDiff className="h-4 w-4" />
                        Page {diff.page}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">{diff.type} Diff</span>
                    </div>

                    <div className="p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                      {diff.type === 'layout' ? (
                        <p className="text-muted-foreground italic">{diff.description}</p>
                      ) : (
                        <div>
                          {diff.diffs?.map((part, i) => (
                            <span
                              key={i}
                              className={
                                part.added ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-0.5 rounded' :
                                  part.removed ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-0.5 rounded' :
                                    ''
                              }
                            >
                              {part.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VISUAL COMPARISON MODE */}
          {mode === 'visual' && (
            <div className="space-y-4">
              {loadingVisuals ? (
                <div className="text-center py-20">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Rendering pages for visual comparison...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm max-w-md mx-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentVisualPage(p => Math.max(0, p - 1))}
                      disabled={currentVisualPage === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="font-medium min-w-[100px] text-center">
                      Page {currentVisualPage + 1} / {Math.max(result.pageCount1, result.pageCount2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentVisualPage(p => Math.min(Math.max(result.pageCount1, result.pageCount2) - 1, p + 1))}
                      disabled={currentVisualPage >= Math.max(result.pageCount1, result.pageCount2) - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Side by Side View */}
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    {/* Left Doc */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                        <span>{files[0].name}</span>
                      </div>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border aspect-[1/1.4]">
                        {file1Images[currentVisualPage] ? (
                          <img
                            src={file1Images[currentVisualPage]}
                            alt={`Doc 1 Page ${currentVisualPage + 1}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50">
                            No Page
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Doc */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                        <span>{files[1].name}</span>
                      </div>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border aspect-[1/1.4]">
                        {file2Images[currentVisualPage] ? (
                          <img
                            src={file2Images[currentVisualPage]}
                            alt={`Doc 2 Page ${currentVisualPage + 1}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50">
                            No Page
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground pt-4">
                    Reviewing visual layout differences side-by-side.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
