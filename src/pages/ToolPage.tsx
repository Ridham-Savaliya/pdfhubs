import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, FileText, RotateCw, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { useState, useCallback, lazy, Suspense } from "react";
import { toast } from "sonner";

// Lazy load heavy tool components
const PDFEditor = lazy(() => import("@/components/pdf-editor").then(m => ({ default: m.PDFEditor })));
const PageOrganizer = lazy(() => import("@/components/pdf-tools/PageOrganizer").then(m => ({ default: m.PageOrganizer })));
const PDFComparer = lazy(() => import("@/components/pdf-tools/PDFComparer").then(m => ({ default: m.PDFComparer })));
const PDFSigner = lazy(() => import("@/components/pdf-tools/PDFSigner").then(m => ({ default: m.PDFSigner })));
const ProtectPDF = lazy(() => import("@/components/pdf-tools/ProtectPDF").then(m => ({ default: m.ProtectPDF })));
const UnlockPDF = lazy(() => import("@/components/pdf-tools/UnlockPDF").then(m => ({ default: m.UnlockPDF })));

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SEOHead, toolSEO } from "@/components/SEOHead";
import { ToolFAQ } from "@/components/ToolFAQ";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolContent } from "@/components/ToolContent";
import {
  downloadFile,
  downloadFiles,
} from "@/lib/file-utils";

const toolInfo: Record<string, {
  title: string;
  description: string;
  color: string;
  acceptedFiles: string;
  minFiles?: number;
  maxFiles?: number;
  serverSide?: boolean;
}> = {
  "merge-pdf": {
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single document. Upload your files in the order you want them merged.",
    color: "bg-tool-merge",
    acceptedFiles: ".pdf",
    minFiles: 2,
    maxFiles: 20,
  },
  "split-pdf": {
    title: "Split PDF",
    description: "Split your PDF into separate single-page documents. Each page becomes its own file.",
    color: "bg-tool-split",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compress-pdf": {
    title: "Compress PDF",
    description: "Reduce file size significantly by optimizing images and content. Choose quality level based on your needs.",
    color: "bg-tool-compress",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    description: "Convert each page of your PDF into a high-quality JPG image.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description: "Convert your images (JPG, PNG) to a single PDF document.",
    color: "bg-tool-convert",
    acceptedFiles: ".jpg,.jpeg,.png,.webp",
    minFiles: 1,
    maxFiles: 50,
  },
  "rotate-pdf": {
    title: "Rotate PDF",
    description: "Rotate all pages in your PDF to the correct orientation.",
    color: "bg-tool-rotate",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "add-watermark": {
    title: "Add Watermark",
    description: "Add custom text watermarks to protect your PDF documents.",
    color: "bg-tool-watermark",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "add-page-numbers": {
    title: "Add Page Numbers",
    description: "Insert page numbers to your PDF documents with custom positioning.",
    color: "bg-tool-edit",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert PDF to editable Word format. Powered by our cloud processing engine.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
    serverSide: true,
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Extract tables from PDF to Excel spreadsheets. Uses cloud-based conversion.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
    serverSide: true,
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint presentations. Cloud-powered conversion.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
    serverSide: true,
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format. (Coming soon)",
    color: "bg-tool-convert",
    acceptedFiles: ".doc,.docx",
    minFiles: 1,
    maxFiles: 10,
  },
  "edit-pdf": {
    title: "Edit PDF",
    description: "Add text, images, drawings, and annotations to your PDFs with our interactive editor.",
    color: "bg-tool-edit",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "protect-pdf": {
    title: "Protect PDF",
    description: "Add password protection to secure your PDF documents.",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "unlock-pdf": {
    title: "Unlock PDF",
    description: "Remove password protection from your PDFs.",
    color: "bg-tool-unlock",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "organize-pages": {
    title: "Organize Pages",
    description: "Reorder, rotate, and delete pages with drag & drop.",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "sign-pdf": {
    title: "Sign PDF",
    description: "Draw, type, or upload your signature and place it on any page.",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compare-pdf": {
    title: "Compare PDFs",
    description: "Find text and layout differences between two PDF documents.",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 2,
    maxFiles: 2,
  },
  "extract-pages": {
    title: "Extract Pages",
    description: "Extract specific pages from your PDF document. Select pages to keep and create a new PDF.",
    color: "bg-tool-split",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compare-pdfs": {
    title: "Compare PDFs",
    description: "Find text and layout differences between two PDF documents.",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 2,
    maxFiles: 2,
  },
};

const toolIcons: Record<string, React.ReactNode> = {
  "merge-pdf": "🔗",
  "split-pdf": "✂️",
  "compress-pdf": "📦",
  "pdf-to-jpg": "🖼️",
  "jpg-to-pdf": "📄",
  "rotate-pdf": "🔄",
  "add-watermark": "💧",
  "add-page-numbers": "#️⃣",
  "pdf-to-word": "📝",
  "pdf-to-excel": "📊",
  "pdf-to-powerpoint": "📽️",
  "word-to-pdf": "📄",
  "edit-pdf": "✏️",
  "protect-pdf": "🔒",
  "unlock-pdf": "🔓",
  "organize-pages": "📑",
  "extract-pages": "📄",
  "sign-pdf": "✍️",
  "compare-pdf": "⚖️",
  "compare-pdfs": "⚖️",
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number; fileSize: number } | null>(null);

  // Options state
  const [rotation, setRotation] = useState<"90" | "180" | "270">("90");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkPosition, setWatermarkPosition] = useState<"center" | "diagonal" | "tiled">("diagonal");
  const [pageNumberPosition, setPageNumberPosition] = useState<"bottom-center" | "bottom-left" | "bottom-right" | "top-center">("bottom-center");
  const [compressionQuality, setCompressionQuality] = useState<"low" | "medium" | "high">("medium");
  const [imageFormat, setImageFormat] = useState<"jpeg" | "png">("jpeg");

  const tool = toolId ? toolInfo[toolId] : null;

  // Save conversion history
  const saveConversionHistory = async (fileName: string, fileSize: number, outputFileName: string) => {
    if (!user || !toolId || !tool) return;

    try {
      await supabase.from('conversion_history').insert({
        user_id: user.id,
        tool_name: tool.title,
        original_filename: fileName,
        output_filename: outputFileName,
        file_size: fileSize,
        status: 'completed'
      });
    } catch (error) {
      console.error('Failed to save conversion history:', error);
    }
  };

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles);
    setProgress(0);

    if (newFiles.length > 0 && newFiles[0].name.toLowerCase().endsWith('.pdf')) {
      try {
        // Dynamically load getPDFInfo only when needed
        const { getPDFInfo } = await import("@/lib/pdf-utils");
        const info = await getPDFInfo(newFiles[0]);
        setPdfInfo({ pageCount: info.pageCount, fileSize: info.fileSize });
      } catch (e) {
        setPdfInfo(null);
      }
    } else {
      setPdfInfo(null);
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleServerSideConversion = async (file: File, format: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', format);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/convert-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Conversion failed' }));
      throw new Error(error.error || 'Conversion failed');
    }

    return response.blob();
  };

  const handleProcess = async () => {
    if (!toolId || files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    const minFiles = tool?.minFiles || 1;
    if (files.length < minFiles) {
      toast.error(`Please upload at least ${minFiles} file(s)`);
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Dynamically import the heavy PDF utilities ONLY when processing starts
      const pdfUtils = await import("@/lib/pdf-utils");

      switch (toolId) {
        case "merge-pdf": {
          setProgress(20);
          const blob = await pdfUtils.mergePDFs(files, (p) => setProgress(p));
          setProgress(100);
          const outputName = "merged.pdf";
          downloadFile(blob, outputName);
          await saveConversionHistory(files.map(f => f.name).join(', '), files.reduce((a, f) => a + f.size, 0), outputName);
          toast.success(`Successfully merged ${files.length} PDFs!`);
          break;
        }

        case "split-pdf": {
          setProgress(20);
          const blobs = await pdfUtils.splitPDF(files[0], (p) => setProgress(p));
          setProgress(80);
          const baseName = files[0].name.replace(".pdf", "");
          const filenames = blobs.map((_, i) => `${baseName}-page-${i + 1}.pdf`);
          downloadFiles(blobs, filenames);
          setProgress(100);
          await saveConversionHistory(files[0].name, files[0].size, `${blobs.length} pages`);
          toast.success(`Split into ${blobs.length} separate PDF files!`);
          break;
        }

        case "compress-pdf": {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const originalSize = file.size;

            const blob = await pdfUtils.compressPDF(file, compressionQuality, (p) => {
              setProgress(((i + p / 100) / files.length) * 100);
            });

            const newSize = blob.size;
            const reduction = ((originalSize - newSize) / originalSize * 100);
            const outputName = `compressed-${file.name}`;

            downloadFile(blob, outputName);
            await saveConversionHistory(file.name, file.size, outputName);
            toast.success(
              `${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(newSize)} (${reduction.toFixed(0)}% smaller)`
            );
          }
          break;
        }

        case "rotate-pdf": {
          const rotationAngle = parseInt(rotation) as 90 | 180 | 270;
          setProgress(20);
          for (const file of files) {
            const outputName = `rotated-${file.name}`;
            const blob = await pdfUtils.rotatePDF(file, rotationAngle, (p) => setProgress(p));
            downloadFile(blob, outputName);
            await saveConversionHistory(file.name, file.size, outputName);
          }
          setProgress(100);
          toast.success(`Rotated ${files.length} PDF(s) by ${rotation}°`);
          break;
        }

        case "add-watermark": {
          if (!watermarkText.trim()) {
            toast.error("Please enter watermark text");
            setIsProcessing(false);
            return;
          }
          setProgress(20);
          for (const file of files) {
            const outputName = `watermarked-${file.name}`;
            const blob = await pdfUtils.addWatermark(file, watermarkText, { position: watermarkPosition }, (p) => setProgress(p));
            downloadFile(blob, outputName);
            await saveConversionHistory(file.name, file.size, outputName);
          }
          setProgress(100);
          toast.success("Watermark added successfully!");
          break;
        }

        case "add-page-numbers": {
          setProgress(20);
          for (const file of files) {
            const outputName = `numbered-${file.name}`;
            const blob = await pdfUtils.addPageNumbers(file, { position: pageNumberPosition }, (p) => setProgress(p));
            downloadFile(blob, outputName);
            await saveConversionHistory(file.name, file.size, outputName);
          }
          setProgress(100);
          toast.success("Page numbers added!");
          break;
        }

        case "jpg-to-pdf": {
          setProgress(20);
          const blob = await pdfUtils.imagesToPDF(files, (p) => setProgress(p));
          setProgress(100);
          const outputName = "images-converted.pdf";
          downloadFile(blob, outputName);
          await saveConversionHistory(files.map(f => f.name).join(', '), files.reduce((a, f) => a + f.size, 0), outputName);
          toast.success(`Converted ${files.length} image(s) to PDF!`);
          break;
        }

        case "pdf-to-jpg": {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const baseName = file.name.replace(".pdf", "");

            const blobs = await pdfUtils.pdfToImages(file, { format: imageFormat, quality: 0.9 }, (p) => {
              setProgress(((i + p / 100) / files.length) * 100);
            });

            const ext = imageFormat === "png" ? "png" : "jpg";
            const filenames = blobs.map((_, j) => `${baseName}-page-${j + 1}.${ext}`);
            downloadFiles(blobs, filenames);
            await saveConversionHistory(file.name, file.size, `${blobs.length} images`);
            toast.success(`Converted ${blobs.length} pages to ${imageFormat.toUpperCase()}!`);
          }
          break;
        }

        case "pdf-to-word": {
          setProgress(30);
          toast.info("Converting PDF to Word...");
          const blob = await handleServerSideConversion(files[0], 'docx');
          setProgress(100);
          const outputName = files[0].name.replace('.pdf', '.docx');
          downloadFile(blob, outputName);
          await saveConversionHistory(files[0].name, files[0].size, outputName);
          toast.success("PDF converted to Word successfully!");
          break;
        }

        case "pdf-to-excel": {
          setProgress(30);
          toast.info("Converting PDF to Excel...");
          const blob = await handleServerSideConversion(files[0], 'xlsx');
          setProgress(100);
          const outputName = files[0].name.replace('.pdf', '.xlsx');
          downloadFile(blob, outputName);
          await saveConversionHistory(files[0].name, files[0].size, outputName);
          toast.success("PDF converted to Excel successfully!");
          break;
        }

        case "pdf-to-powerpoint": {
          setProgress(30);
          toast.info("Converting PDF to PowerPoint...");
          const blob = await handleServerSideConversion(files[0], 'pptx');
          setProgress(100);
          const outputName = files[0].name.replace('.pdf', '.pptx');
          downloadFile(blob, outputName);
          await saveConversionHistory(files[0].name, files[0].size, outputName);
          toast.success("PDF converted to PowerPoint successfully!");
          break;
        }

        case "word-to-pdf":
          toast.info("Word to PDF conversion is coming soon!");
          break;

        case "protect-pdf":
        case "unlock-pdf":
        case "edit-pdf":
        case "sign-pdf":
        case "organize-pages":
        case "compare-pdf":
        case "compare-pdfs":
        case "extract-pages":
          // Handled by components or special logic
          if (toolId === "compare-pdf" || toolId === "compare-pdfs") {
            if (files.length < 2) {
              toast.error("Please upload 2 files to compare.");
            }
          }
          break;

        default:
          toast.error("Unknown tool");
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while processing");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Tool not found
            </h1>
            <Link to="/">
              <Button className="bg-gradient-primary">Go back home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get SEO data for this tool
  const seoData = toolId && toolSEO[toolId] ? toolSEO[toolId] : null;
  const canonicalUrl = `https://pdfhubs.site/tool/${toolId}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO Head with tool-specific meta tags */}
      {seoData && (
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          canonical={canonicalUrl}
          toolId={toolId}
        />
      )}

      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <div className="bg-gradient-hero-soft relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          <div className="container relative py-12 md:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to all tools
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div
                className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl ${tool.color} shadow-lg text-4xl animate-scale-in`}
              >
                {toolIcons[toolId || ""] || "📄"}
              </div>
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                    {tool.title}
                  </h1>
                  {tool.serverSide && (
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Cloud-powered
                    </span>
                  )}
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb items={[
              { label: "PDF Tools", href: "/" },
              { label: tool.title }
            ]} />

            {/* Suspense wrapper for lazy loaded tools */}
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading tool...</p>
              </div>
            }>
              {/* Special tool interfaces */}
              {toolId === "edit-pdf" && files.length > 0 ? (
                <PDFEditor file={files[0]} />
              ) : (toolId === "organize-pages" || toolId === "extract-pages") && files.length > 0 ? (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <PageOrganizer file={files[0]} />
                </div>
              ) : toolId === "sign-pdf" && files.length > 0 ? (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <PDFSigner file={files[0]} />
                </div>
              ) : (toolId === "compare-pdf" || toolId === "compare-pdfs") && files.length === 2 ? (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <PDFComparer files={files} />
                </div>
              ) : toolId === "protect-pdf" ? (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={tool.acceptedFiles}
                    maxFiles={tool.maxFiles}
                  />
                  {files.length > 0 && (
                    <div className="mt-6">
                      <ProtectPDF files={files} />
                    </div>
                  )}
                </div>
              ) : toolId === "unlock-pdf" ? (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-in">
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={tool.acceptedFiles}
                    maxFiles={tool.maxFiles}
                  />
                  {files.length > 0 && (
                    <div className="mt-6">
                      <UnlockPDF files={files} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10 animate-fade-in">
                  <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={tool.acceptedFiles}
                    maxFiles={tool.maxFiles}
                  />

                  {pdfInfo && (
                    <div className="mt-6 p-4 bg-secondary/50 rounded-2xl flex items-center gap-3 animate-fade-in">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">
                        <span className="font-medium">{pdfInfo.pageCount} page{pdfInfo.pageCount !== 1 ? 's' : ''}</span>
                        <span className="text-muted-foreground"> • {formatFileSize(pdfInfo.fileSize)}</span>
                      </span>
                    </div>
                  )}

                  {/* Compression Options */}
                  {files.length > 0 && toolId === "compress-pdf" && (
                    <div className="mt-6 p-6 bg-secondary/50 rounded-2xl space-y-4 animate-fade-in">
                      <Label className="text-sm font-medium text-foreground block">
                        Compression Level
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["low", "medium", "high"] as const).map((level) => (
                          <Button
                            key={level}
                            variant={compressionQuality === level ? "default" : "outline"}
                            onClick={() => setCompressionQuality(level)}
                            className={`flex-col h-auto py-4 ${compressionQuality === level ? 'bg-gradient-primary shadow-md' : ''}`}
                          >
                            <span className="capitalize font-medium">{level}</span>
                            <span className="text-xs opacity-70 mt-1">
                              {level === "low" && "Smallest file"}
                              {level === "medium" && "Balanced"}
                              {level === "high" && "Best quality"}
                            </span>
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lower quality = smaller file size. Medium is recommended for most uses.
                      </p>
                    </div>
                  )}

                  {/* Rotate Options */}
                  {files.length > 0 && toolId === "rotate-pdf" && (
                    <div className="mt-6 p-6 bg-secondary/50 rounded-2xl animate-fade-in">
                      <Label className="text-sm font-medium text-foreground mb-4 block">
                        Rotation Angle
                      </Label>
                      <div className="flex gap-3">
                        {(["90", "180", "270"] as const).map((angle) => (
                          <Button
                            key={angle}
                            variant={rotation === angle ? "default" : "outline"}
                            onClick={() => setRotation(angle)}
                            className={`flex-1 ${rotation === angle ? 'bg-gradient-primary shadow-md' : ''}`}
                          >
                            <RotateCw className="h-4 w-4 mr-2" />
                            {angle}° {angle === "90" ? "Right" : angle === "270" ? "Left" : "Flip"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Watermark Options */}
                  {files.length > 0 && toolId === "add-watermark" && (
                    <div className="mt-6 p-6 bg-secondary/50 rounded-2xl space-y-5 animate-fade-in">
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">
                          Watermark Text
                        </Label>
                        <Input
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">
                          Style
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(["diagonal", "center", "tiled"] as const).map((pos) => (
                            <Button
                              key={pos}
                              variant={watermarkPosition === pos ? "default" : "outline"}
                              onClick={() => setWatermarkPosition(pos)}
                              className={`capitalize ${watermarkPosition === pos ? 'bg-gradient-primary shadow-md' : ''}`}
                            >
                              {pos}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page Number Options */}
                  {files.length > 0 && toolId === "add-page-numbers" && (
                    <div className="mt-6 p-6 bg-secondary/50 rounded-2xl animate-fade-in">
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Position
                      </Label>
                      <Select value={pageNumberPosition} onValueChange={(v) => setPageNumberPosition(v as typeof pageNumberPosition)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* PDF to Image Options */}
                  {files.length > 0 && toolId === "pdf-to-jpg" && (
                    <div className="mt-6 p-6 bg-secondary/50 rounded-2xl animate-fade-in">
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Output Format
                      </Label>
                      <div className="flex gap-3">
                        {(["jpeg", "png"] as const).map((fmt) => (
                          <Button
                            key={fmt}
                            variant={imageFormat === fmt ? "default" : "outline"}
                            onClick={() => setImageFormat(fmt)}
                            className={`flex-1 uppercase ${imageFormat === fmt ? 'bg-gradient-primary shadow-md' : ''}`}
                          >
                            {fmt}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        JPEG: smaller files, good for photos. PNG: lossless, good for text/graphics.
                      </p>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {isProcessing && progress > 0 && (
                    <div className="mt-6 animate-fade-in">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="mt-8 flex justify-center">
                      <Button
                        size="lg"
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-12 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-5 w-5" />
                            {tool.serverSide ? "Convert PDF" : "Process PDF"}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Suspense>

            <div className="mt-12 md:mt-16">
              <ToolContent toolId={toolId || ""} />
            </div>

            <div className="mt-12 md:mt-16">
              <ToolFAQ toolId={toolId || ""} toolTitle={tool.title} />
            </div>

            <div className="mt-12 md:mt-16">
              <RelatedTools currentToolId={toolId || ""} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
