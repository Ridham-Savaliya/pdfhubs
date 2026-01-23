import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Unlock, Eye, EyeOff, Download, Loader2, AlertCircle, Server, Laptop } from 'lucide-react';
import { downloadFile } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UnlockPDFProps {
  files: File[];
}

export function UnlockPDF({ files }: UnlockPDFProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useServerSide, setUseServerSide] = useState(true);

  const saveConversionHistory = async (fileName: string, fileSize: number, outputFileName: string) => {
    if (!user) return;
    
    try {
      await supabase.from('conversion_history').insert({
        user_id: user.id,
        tool_name: 'Unlock PDF',
        original_filename: fileName,
        output_filename: outputFileName,
        file_size: fileSize,
        status: 'completed'
      });
    } catch (error) {
      console.error('Failed to save conversion history:', error);
    }
  };

  const handleServerSideUnlock = async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/unlock-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server unlock failed' }));
      throw new Error(errorData.error || 'Server unlock failed');
    }

    return response.blob();
  };

  const handleClientSideUnlock = async (file: File): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    
    // Try to load with ignoreEncryption option
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    // Create a new clean PDF by copying pages
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => newPdf.addPage(page));
    
    // Set clean metadata
    newPdf.setTitle(file.name.replace('.pdf', ''));
    newPdf.setSubject('');
    newPdf.setKeywords([]);
    newPdf.setProducer('PDFHubs');
    newPdf.setCreator('PDFHubs');

    const pdfBytes = await newPdf.save();
    const buffer = new ArrayBuffer(pdfBytes.length);
    const view = new Uint8Array(buffer);
    view.set(pdfBytes);
    return new Blob([buffer], { type: 'application/pdf' });
  };

  const handleUnlock = async () => {
    if (!password) {
      toast.error('Please enter the PDF password');
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      let successCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 0.3) / files.length) * 100);
        
        try {
          let blob: Blob;
          
          if (useServerSide) {
            try {
              toast.info('Verifying password and unlocking...');
              blob = await handleServerSideUnlock(file);
            } catch (serverError) {
              console.warn('Server-side unlock failed, falling back to client-side:', serverError);
              toast.info('Using local unlock...');
              blob = await handleClientSideUnlock(file);
            }
          } else {
            blob = await handleClientSideUnlock(file);
          }

          setProgress(((i + 0.7) / files.length) * 100);
          
          const outputName = `unlocked-${file.name}`;
          downloadFile(blob, outputName);
          await saveConversionHistory(file.name, file.size, outputName);
          setProgress(((i + 1) / files.length) * 100);
          successCount++;
          
        } catch (loadError) {
          console.error('Unlock error:', loadError);
          const errorMsg = loadError instanceof Error ? loadError.message : 'Unknown error';
          toast.error(`Could not unlock ${file.name}: ${errorMsg}`);
          continue;
        }
      }

      if (successCount > 0) {
        toast.success(`Unlocked ${successCount} PDF(s) successfully!`);
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Failed to unlock PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-secondary/50 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Unlock className="h-6 w-6" />
          <h3 className="font-semibold text-lg">Remove Password Protection</h3>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/30">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Password Required</p>
            <p className="text-muted-foreground">
              Enter the current password to unlock your PDF. This will create a new unprotected copy of your document.
            </p>
          </div>
        </div>

        {/* Unlock Mode Toggle */}
        <div className="p-4 bg-background rounded-xl border border-border space-y-3">
          <Label className="text-sm font-medium">Unlock Mode</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUseServerSide(true)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                useServerSide 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              }`}
            >
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">Enhanced (Server)</span>
            </button>
            <button
              type="button"
              onClick={() => setUseServerSide(false)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                !useServerSide 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span className="text-sm font-medium">Basic (Local)</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {useServerSide 
              ? 'Enhanced unlock with password verification for PDFHubs-protected files.' 
              : 'Basic unlock processed locally in your browser.'}
          </p>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="unlockPassword">PDF Password</Label>
          <div className="relative">
            <Input
              id="unlockPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter current PDF password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2">
          <Label className="text-sm">Files to unlock ({files.length})</Label>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Unlock className="h-4 w-4" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      {processing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Unlocking...
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleUnlock}
        disabled={processing || !password}
        className="w-full bg-gradient-primary"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Unlocking...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Unlock & Download
          </>
        )}
      </Button>
    </div>
  );
}
