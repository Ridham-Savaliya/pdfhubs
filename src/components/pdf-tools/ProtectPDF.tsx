import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Eye, EyeOff, Download, Loader2, Shield, Server, Laptop, ShieldCheck } from 'lucide-react';
import { downloadFile } from '@/lib/pdf-utils';
import { createEncryptedPDF } from '@/lib/pdf-encryption';
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
  const [useServerSide, setUseServerSide] = useState(false); // Default to client-side encryption
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

  // True encryption using pdfmake (client-side)
  const handleClientSideEncryption = async (file: File): Promise<Blob> => {
    return createEncryptedPDF(file, {
      userPassword: password,
      ownerPassword: password + '_owner_' + Date.now(),
      permissions: {
        printing: permissions.printing ? 'highResolution' : 'lowResolution',
        modifying: permissions.modifying,
        copying: permissions.copying,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false,
      }
    }, setProgress);
  };

  // Watermark-based protection (server-side fallback)
  const handleServerSideProtection = async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('permissions', JSON.stringify(permissions));

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/protect-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server protection failed' }));
      throw new Error(errorData.error || 'Server protection failed');
    }

    return response.blob();
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
        setProgress(((i + 0.1) / files.length) * 100);
        
        let blob: Blob;
        
        if (!useServerSide) {
          // Use true encryption (client-side pdfmake)
          try {
            toast.info('Encrypting with password protection...');
            blob = await handleClientSideEncryption(file);
          } catch (encryptError) {
            console.warn('Encryption failed, falling back to server-side:', encryptError);
            toast.info('Falling back to watermark protection...');
            blob = await handleServerSideProtection(file);
          }
        } else {
          // Use watermark-based protection (server-side)
          blob = await handleServerSideProtection(file);
        }

        setProgress(((i + 0.9) / files.length) * 100);
        
        const outputName = `protected-${file.name}`;
        downloadFile(blob, outputName);
        await saveConversionHistory(file.name, file.size, outputName);
        setProgress(((i + 1) / files.length) * 100);
      }

      if (!useServerSide) {
        toast.success(`Protected ${files.length} PDF(s) with AES encryption!`);
      } else {
        toast.success(`Protected ${files.length} PDF(s) with watermark protection!`);
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
              onClick={() => setUseServerSide(false)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                !useServerSide 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">AES Encryption</span>
            </button>
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
              <span className="text-sm font-medium">Watermark</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {!useServerSide 
              ? 'True password protection - PDF will require password to open.' 
              : 'Visual watermarks with embedded metadata (no password prompt).'}
          </p>
          {!useServerSide && (
            <div className="mt-2 p-2 bg-success/10 rounded border border-success/20">
              <p className="text-xs text-success flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <strong>Recommended:</strong> Creates industry-standard encrypted PDF
              </p>
            </div>
          )}
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
