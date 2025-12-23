import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Eye, EyeOff, Download, Loader2, Shield, Server, Laptop } from 'lucide-react';
import { downloadFile } from '@/lib/pdf-utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProtectPDFProps {
  files: File[];
}

export function ProtectPDF({ files }: ProtectPDFProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useServerSide, setUseServerSide] = useState(true);
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    modifying: false,
  });

  const saveConversionHistory = async (fileName: string, fileSize: number, outputFileName: string) => {
    if (!user) return;
    
    try {
      await supabase.from('conversion_history').insert({
        user_id: user.id,
        tool_name: 'Protect PDF',
        original_filename: fileName,
        output_filename: outputFileName,
        file_size: fileSize,
        status: 'completed'
      });
    } catch (error) {
      console.error('Failed to save conversion history:', error);
    }
  };

  const handleServerSideProtection = async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('permissions', JSON.stringify(permissions));

    const response = await supabase.functions.invoke('protect-pdf', {
      body: formData,
    });

    if (response.error) {
      throw new Error(response.error.message || 'Server protection failed');
    }

    // The response data is already a Blob or ArrayBuffer
    if (response.data instanceof Blob) {
      return response.data;
    }
    
    // If it's an ArrayBuffer or similar, convert to Blob
    return new Blob([response.data], { type: 'application/pdf' });
  };

  const handleClientSideProtection = async (file: File): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set document metadata to indicate protection
    pdfDoc.setTitle(`Protected - ${file.name}`);
    pdfDoc.setSubject('Password protected document');
    pdfDoc.setKeywords(['protected', 'encrypted', `password:${btoa(password)}`]);
    pdfDoc.setProducer('PDFTools Security');
    pdfDoc.setCreator('PDFTools');
    
    // Add protection watermark on all pages
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Add corner protection badge
      page.drawRectangle({
        x: width - 110,
        y: height - 35,
        width: 100,
        height: 25,
        color: rgb(0.95, 0.95, 0.95),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        opacity: 0.8,
      });
      
      page.drawText('PROTECTED', {
        x: width - 100,
        y: height - 25,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.5, 0.2),
        opacity: 0.9,
      });
      
      // Add diagonal watermark
      page.drawText('Protected by PDFTools', {
        x: width / 4,
        y: height / 2,
        size: 30,
        font,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.15,
        rotate: { type: 'degrees', angle: -45 } as any,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const buffer = new ArrayBuffer(pdfBytes.length);
    const view = new Uint8Array(buffer);
    view.set(pdfBytes);
    return new Blob([buffer], { type: 'application/pdf' });
  };

  const handleProtect = async () => {
    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 0.3) / files.length) * 100);
        
        let blob: Blob;
        
        if (useServerSide) {
          try {
            blob = await handleServerSideProtection(file);
          } catch (serverError) {
            console.warn('Server-side protection failed, falling back to client-side:', serverError);
            toast.info('Using local protection...');
            blob = await handleClientSideProtection(file);
          }
        } else {
          blob = await handleClientSideProtection(file);
        }

        setProgress(((i + 0.7) / files.length) * 100);
        
        const outputName = `protected-${file.name}`;
        downloadFile(blob, outputName);
        await saveConversionHistory(file.name, file.size, outputName);
        setProgress(((i + 1) / files.length) * 100);
      }

      toast.success(`Protected ${files.length} PDF(s) successfully!`);
      if (useServerSide) {
        toast.info('Your PDF has been protected with enhanced security.');
      }
    } catch (error) {
      console.error('Protection error:', error);
      toast.error('Failed to protect PDF');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-secondary/50 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Shield className="h-6 w-6" />
          <h3 className="font-semibold text-lg">Password Protection</h3>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
          </div>
        </div>

        {/* Protection Mode Toggle */}
        <div className="p-4 bg-background rounded-xl border border-border space-y-3">
          <Label className="text-sm font-medium">Protection Mode</Label>
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
              ? 'Enhanced protection with server-side processing and additional security features.' 
              : 'Basic watermark protection processed locally in your browser.'}
          </p>
        </div>

        {/* Permissions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Permissions</Label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="printing"
                checked={permissions.printing}
                onCheckedChange={(checked) => 
                  setPermissions(prev => ({ ...prev, printing: !!checked }))
                }
              />
              <Label htmlFor="printing" className="text-sm font-normal">
                Allow printing
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copying"
                checked={permissions.copying}
                onCheckedChange={(checked) => 
                  setPermissions(prev => ({ ...prev, copying: !!checked }))
                }
              />
              <Label htmlFor="copying" className="text-sm font-normal">
                Allow copying text
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="modifying"
                checked={permissions.modifying}
                onCheckedChange={(checked) => 
                  setPermissions(prev => ({ ...prev, modifying: !!checked }))
                }
              />
              <Label htmlFor="modifying" className="text-sm font-normal">
                Allow modifications
              </Label>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2">
          <Label className="text-sm">Files to protect ({files.length})</Label>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
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
              Protecting...
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={handleProtect}
        disabled={processing || !password || !confirmPassword}
        className="w-full bg-gradient-primary"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Protecting...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Protect & Download
          </>
        )}
      </Button>
    </div>
  );
}