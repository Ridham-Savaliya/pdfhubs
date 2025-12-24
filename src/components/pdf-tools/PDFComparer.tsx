import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, AlertTriangle, CheckCircle, Loader2, ArrowLeftRight, Server, Monitor, Eye, FileCheck, FileDiff } from 'lucide-react';
import { comparePDFs } from '@/lib/pdf-utils';
import { toast } from 'sonner';

interface PDFComparerProps {
  files: File[];
}

interface ComparisonResult {
  differences: {
    page: number;
    type: "text" | "layout";
    description: string;
    file1Text?: string;
    file2Text?: string;
  }[];
  summary: string;
}

export function PDFComparer({ files }: PDFComparerProps) {
  const [comparing, setComparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [useServerSide, setUseServerSide] = useState(true);
  const [expandedDiff, setExpandedDiff] = useState<number | null>(null);

  const handleServerSideCompare = async (): Promise<ComparisonResult> => {
    const formData = new FormData();
    formData.append('file1', files[0]);
    formData.append('file2', files[1]);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/compare-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Server comparison failed');
    }

    return response.json();
  };

  const handleCompare = async () => {
    if (files.length !== 2) {
      toast.error('Please upload exactly 2 PDF files to compare');
      return;
    }

    setComparing(true);
    setProgress(0);
    setResult(null);
    setExpandedDiff(null);

    try {
      let comparisonResult: ComparisonResult;

      if (useServerSide) {
        setProgress(30);
        toast.info('Comparing documents on server...');
        comparisonResult = await handleServerSideCompare();
        setProgress(100);
      } else {
        comparisonResult = await comparePDFs(files[0], files[1], (p) => setProgress(p));
      }

      setResult(comparisonResult);
      
      if (comparisonResult.differences.length === 0) {
        toast.success('Documents are identical!');
      } else {
        toast.info(`Found ${comparisonResult.differences.length} difference(s)`);
      }
    } catch (error) {
      console.error('Comparison error:', error);
      
      // Fallback to client-side if server fails
      if (useServerSide) {
        toast.warning('Server comparison failed, trying locally...');
        try {
          const localResult = await comparePDFs(files[0], files[1], (p) => setProgress(p));
          setResult(localResult);
          
          if (localResult.differences.length === 0) {
            toast.success('Documents are identical!');
          } else {
            toast.info(`Found ${localResult.differences.length} difference(s)`);
          }
          return;
        } catch (localError) {
          toast.error('Failed to compare PDFs');
        }
      } else {
        toast.error('Failed to compare PDFs');
      }
    } finally {
      setComparing(false);
    }
  };

  const getComparisonStats = () => {
    if (!result) return null;
    const textDiffs = result.differences.filter(d => d.type === 'text').length;
    const layoutDiffs = result.differences.filter(d => d.type === 'layout').length;
    return { textDiffs, layoutDiffs, total: result.differences.length };
  };

  const stats = getComparisonStats();

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-secondary/30 rounded-xl">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Client</span>
        </div>
        <Switch
          checked={useServerSide}
          onCheckedChange={setUseServerSide}
          id="compare-mode"
        />
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Server</span>
        </div>
        <Label htmlFor="compare-mode" className="text-xs text-muted-foreground ml-2">
          {useServerSide ? 'Enhanced comparison' : 'Basic comparison'}
        </Label>
      </div>

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
              Document {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Compare Button */}
      {!result && (
        <div className="text-center">
          <Button 
            onClick={handleCompare} 
            disabled={comparing || files.length !== 2}
            size="lg"
            className="bg-gradient-primary"
          >
            {comparing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-5 w-5 mr-2" />
                Compare Documents
              </>
            )}
          </Button>
        </div>
      )}

      {/* Progress */}
      {comparing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{useServerSide ? 'Server analyzing documents...' : 'Analyzing documents...'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary with Stats */}
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            result.differences.length === 0 
              ? 'bg-success/10 border border-success/30' 
              : 'bg-warning/10 border border-warning/30'
          }`}>
            {result.differences.length === 0 ? (
              <FileCheck className="h-6 w-6 text-success" />
            ) : (
              <FileDiff className="h-6 w-6 text-warning" />
            )}
            <div className="flex-1">
              <p className="font-medium text-foreground">{result.summary}</p>
              {stats && stats.total > 0 && (
                <div className="flex gap-4 mt-1">
                  {stats.textDiffs > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {stats.textDiffs} text difference{stats.textDiffs > 1 ? 's' : ''}
                    </span>
                  )}
                  {stats.layoutDiffs > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {stats.layoutDiffs} layout difference{stats.layoutDiffs > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Difference List */}
          {result.differences.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Differences Found:
              </h4>
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {result.differences.map((diff, index) => (
                  <div 
                    key={index}
                    className={`p-4 bg-card rounded-xl border transition-all cursor-pointer ${
                      expandedDiff === index ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setExpandedDiff(expandedDiff === index ? null : index)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        diff.type === 'text' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                      }`}>
                        {diff.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-foreground flex-1">
                        {diff.description}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Page {diff.page}
                      </span>
                    </div>
                    
                    {expandedDiff === index && (diff.file1Text || diff.file2Text) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 animate-fade-in">
                        {diff.file1Text && (
                          <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                            <p className="text-xs font-medium text-destructive mb-1">Document 1:</p>
                            <p className="text-sm text-foreground">{diff.file1Text}...</p>
                          </div>
                        )}
                        {diff.file2Text && (
                          <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                            <p className="text-xs font-medium text-success mb-1">Document 2:</p>
                            <p className="text-sm text-foreground">{diff.file2Text}...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compare Again */}
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setResult(null);
                setExpandedDiff(null);
              }}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Compare Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
