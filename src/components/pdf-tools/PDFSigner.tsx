import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SignaturePad } from './SignaturePad';
import { getPageThumbnails, downloadFile } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';
import { Loader2, Download, PenLine, Move, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PDFSignerProps {
  file: File;
}

interface SignaturePlacement {
  id: string;
  signatureData: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function PDFSigner({ file }: PDFSignerProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatures, setSignatures] = useState<SignaturePlacement[]>([]);
  const [savedSignatures, setSavedSignatures] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPages();
  }, [file]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const thumbnails = await getPageThumbnails(file, 100, (p) => setProgress(p));
      setPages(thumbnails);
    } catch (error) {
      toast.error('Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureCreate = (signatureData: string) => {
    setSavedSignatures(prev => [...prev, signatureData]);

    // Add signature to current page
    const newSignature: SignaturePlacement = {
      id: `sig-${Date.now()}`,
      signatureData,
      pageIndex: currentPage,
      x: 50,
      y: 50,
      width: 150,
      height: 60,
    };

    setSignatures(prev => [...prev, newSignature]);
    setShowSignaturePad(false);
    toast.success('Signature added! Drag to position it.');
  };

  const handleAddExistingSignature = (signatureData: string) => {
    const newSignature: SignaturePlacement = {
      id: `sig-${Date.now()}`,
      signatureData,
      pageIndex: currentPage,
      x: 50,
      y: 50,
      width: 150,
      height: 60,
    };
    setSignatures(prev => [...prev, newSignature]);
  };

  const handleMouseDown = (e: React.MouseEvent, signatureId: string) => {
    e.preventDefault();
    setDragging(signatureId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSignatures(prev => prev.map(sig =>
      sig.id === dragging
        ? { ...sig, x: Math.max(0, Math.min(80, x)), y: Math.max(0, Math.min(80, y)) }
        : sig
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const removeSignature = (id: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== id));
  };

  const handleSave = async () => {
    if (signatures.length === 0) {
      toast.error('Please add at least one signature');
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pdfPages = pdfDoc.getPages();

      setProgress(30);

      for (const sig of signatures) {
        const page = pdfPages[sig.pageIndex];
        if (!page) continue;

        // Convert base64 to bytes
        const base64Data = sig.signatureData.split(',')[1];
        const binaryString = atob(base64Data);
        const imageBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          imageBytes[i] = binaryString.charCodeAt(i);
        }

        // Check if PNG or JPEG based on data URI
        const isPng = sig.signatureData.includes('image/png');
        const image = isPng
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);

        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Get container dimensions for accurate positioning
        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 600;

        // Calculate signature dimensions and position relative to page
        const sigWidth = (sig.width / containerWidth) * pageWidth;
        const sigHeight = (sig.height / containerHeight) * pageHeight;
        const sigX = (sig.x / 100) * pageWidth;
        // PDF y-coordinates start from bottom, so we need to flip
        const sigY = pageHeight - (sig.y / 100) * pageHeight - sigHeight;

        page.drawImage(image, {
          x: sigX,
          y: sigY,
          width: sigWidth,
          height: sigHeight,
        });
      }

      setProgress(80);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });

      setProgress(100);
      downloadFile(blob, `signed-${file.name}`);
      toast.success('PDF signed and downloaded!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign PDF');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground mb-4">Loading PDF...</p>
        <Progress value={progress} className="max-w-xs mx-auto" />
      </div>
    );
  }

  const currentPageSignatures = signatures.filter(s => s.pageIndex === currentPage);

  return (
    <div className="space-y-6">
      {showSignaturePad ? (
        <SignaturePad
          onSignatureCreate={handleSignatureCreate}
          onClose={() => setShowSignaturePad(false)}
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowSignaturePad(true)} className="bg-gradient-primary">
                <PenLine className="h-4 w-4 mr-2" />
                Create Signature
              </Button>

              {savedSignatures.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Saved:</span>
                  {savedSignatures.map((sig, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddExistingSignature(sig)}
                      className="h-10 w-16 rounded border border-border bg-white p-1 hover:border-primary transition-colors"
                    >
                      <img src={sig} alt="Saved signature" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={processing || signatures.length === 0}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Save Signed PDF
                </>
              )}
            </Button>
          </div>

          {processing && <Progress value={progress} className="h-2" />}

          {/* Page View */}
          <div className="flex gap-6">
            {/* Page Thumbnails */}
            <div className="w-24 space-y-2 flex-shrink-0">
              {pages.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-full rounded-lg border-2 overflow-hidden transition-all ${currentPage === index
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50'
                    }`}
                >
                  <img src={thumb} alt={`Page ${index + 1}`} className="w-full" />
                  <span className="text-xs text-muted-foreground block py-1">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Canvas */}
            <div
              ref={containerRef}
              className="flex-1 relative bg-white rounded-xl shadow-lg overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full"
                draggable={false}
              />

              {/* Signature Overlays */}
              {currentPageSignatures.map((sig) => (
                <div
                  key={sig.id}
                  className={`absolute cursor-move group ${dragging === sig.id ? 'z-50' : 'z-10'}`}
                  style={{
                    left: `${sig.x}%`,
                    top: `${sig.y}%`,
                    width: `${sig.width}px`,
                    height: `${sig.height}px`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, sig.id)}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={sig.signatureData}
                      alt="Signature"
                      className="w-full h-full object-contain border-2 border-dashed border-primary/50 rounded bg-white/80"
                      draggable={false}
                    />
                    <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded flex items-center gap-1">
                        <Move className="h-3 w-3" />
                        Drag
                      </span>
                      <button
                        onClick={() => removeSignature(sig.id)}
                        className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
