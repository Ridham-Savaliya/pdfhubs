import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Settings, FileText, RotateCw, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  rotatePDF,
  addWatermark,
  addPageNumbers,
  imagesToPDF,
  pdfToImages,
  downloadFile,
  downloadFiles,
  getPDFInfo,
} from "@/lib/pdf-utils";

const toolInfo: Record<string, { 
  title: string; 
  description: string; 
  color: string;
  acceptedFiles: string;
  minFiles?: number;
  maxFiles?: number;
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
    description: "Convert PDF to editable Word format. (Requires server - coming soon)",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Extract tables from PDF to Excel. (Requires server - coming soon)",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint. (Requires server - coming soon)",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word to PDF. (Requires server - coming soon)",
    color: "bg-tool-convert",
    acceptedFiles: ".doc,.docx",
    minFiles: 1,
    maxFiles: 10,
  },
  "edit-pdf": {
    title: "Edit PDF",
    description: "Edit PDF content. (Interactive editor coming soon)",
    color: "bg-tool-edit",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "protect-pdf": {
    title: "Protect PDF",
    description: "Add password protection. (Coming soon)",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "unlock-pdf": {
    title: "Unlock PDF",
    description: "Remove password protection. (Coming soon)",
    color: "bg-tool-unlock",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "organize-pages": {
    title: "Organize Pages",
    description: "Reorder and delete pages. (Drag & drop coming soon)",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "sign-pdf": {
    title: "Sign PDF",
    description: "Add digital signature. (Coming soon)",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compare-pdf": {
    title: "Compare PDFs",
    description: "Compare two PDFs. (Coming soon)",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 2,
    maxFiles: 2,
  },
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
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

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles);
    setProgress(0);
    
    if (newFiles.length > 0 && newFiles[0].name.toLowerCase().endsWith('.pdf')) {
      try {
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
      switch (toolId) {
        case "merge-pdf": {
          const blob = await mergePDFs(files);
          downloadFile(blob, "merged.pdf");
          toast.success(`Successfully merged ${files.length} PDFs!`);
          break;
        }

        case "split-pdf": {
          const blobs = await splitPDF(files[0]);
          const baseName = files[0].name.replace(".pdf", "");
          const filenames = blobs.map((_, i) => `${baseName}-page-${i + 1}.pdf`);
          downloadFiles(blobs, filenames);
          toast.success(`Split into ${blobs.length} separate PDF files!`);
          break;
        }

        case "compress-pdf": {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const originalSize = file.size;
            
            const blob = await compressPDF(file, compressionQuality, (p) => {
              setProgress(((i + p / 100) / files.length) * 100);
            });
            
            const newSize = blob.size;
            const reduction = ((originalSize - newSize) / originalSize * 100);
            
            downloadFile(blob, `compressed-${file.name}`);
            toast.success(
              `${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(newSize)} (${reduction.toFixed(0)}% smaller)`
            );
          }
          break;
        }

        case "rotate-pdf": {
          const rotationAngle = parseInt(rotation) as 90 | 180 | 270;
          for (const file of files) {
            const blob = await rotatePDF(file, rotationAngle);
            downloadFile(blob, `rotated-${file.name}`);
          }
          toast.success(`Rotated ${files.length} PDF(s) by ${rotation}°`);
          break;
        }

        case "add-watermark": {
          if (!watermarkText.trim()) {
            toast.error("Please enter watermark text");
            return;
          }
          for (const file of files) {
            const blob = await addWatermark(file, watermarkText, { position: watermarkPosition });
            downloadFile(blob, `watermarked-${file.name}`);
          }
          toast.success("Watermark added successfully!");
          break;
        }

        case "add-page-numbers": {
          for (const file of files) {
            const blob = await addPageNumbers(file, { position: pageNumberPosition });
            downloadFile(blob, `numbered-${file.name}`);
          }
          toast.success("Page numbers added!");
          break;
        }

        case "jpg-to-pdf": {
          const blob = await imagesToPDF(files);
          downloadFile(blob, "images-converted.pdf");
          toast.success(`Converted ${files.length} image(s) to PDF!`);
          break;
        }

        case "pdf-to-jpg": {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const baseName = file.name.replace(".pdf", "");
            
            const blobs = await pdfToImages(file, { format: imageFormat, quality: 0.9 }, (p) => {
              setProgress(((i + p / 100) / files.length) * 100);
            });
            
            const ext = imageFormat === "png" ? "png" : "jpg";
            const filenames = blobs.map((_, j) => `${baseName}-page-${j + 1}.${ext}`);
            downloadFiles(blobs, filenames);
            toast.success(`Converted ${blobs.length} pages to ${imageFormat.toUpperCase()}!`);
          }
          break;
        }

        case "pdf-to-word":
        case "pdf-to-excel":
        case "pdf-to-powerpoint":
        case "word-to-pdf":
          toast.info("This conversion requires a server-side API. Enable Lovable Cloud to use this feature!");
          break;

        case "protect-pdf":
        case "unlock-pdf":
          toast.info("Password protection requires server-side processing. Coming soon!");
          break;

        case "edit-pdf":
        case "sign-pdf":
          toast.info("Interactive PDF editing is coming soon!");
          break;

        case "organize-pages":
        case "compare-pdf":
          toast.info("This feature is coming soon!");
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Tool not found
            </h1>
            <Link to="/">
              <Button>Go back home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-hero-soft">
        <div className="container max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all tools
          </Link>

          <div className="text-center mb-10">
            <div
              className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${tool.color}`}
            >
              <Settings className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {tool.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {tool.description}
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-lg p-8 border border-border">
            <FileUploader
              onFilesSelected={handleFilesSelected}
              accept={tool.acceptedFiles}
              maxFiles={tool.maxFiles}
            />

            {pdfInfo && (
              <div className="mt-4 p-4 bg-secondary rounded-xl flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">
                  {pdfInfo.pageCount} page{pdfInfo.pageCount !== 1 ? 's' : ''} • {formatFileSize(pdfInfo.fileSize)}
                </span>
              </div>
            )}

            {/* Compression Options */}
            {files.length > 0 && toolId === "compress-pdf" && (
              <div className="mt-6 p-4 bg-secondary rounded-xl space-y-4">
                <Label className="text-sm font-medium text-foreground block">
                  Compression Level
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={compressionQuality === level ? "default" : "outline"}
                      onClick={() => setCompressionQuality(level)}
                      className="flex-col h-auto py-3"
                    >
                      <span className="capitalize font-medium">{level}</span>
                      <span className="text-xs opacity-70">
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
              <div className="mt-6 p-4 bg-secondary rounded-xl">
                <Label className="text-sm font-medium text-foreground mb-3 block">
                  Rotation Angle
                </Label>
                <div className="flex gap-3">
                  {(["90", "180", "270"] as const).map((angle) => (
                    <Button
                      key={angle}
                      variant={rotation === angle ? "default" : "outline"}
                      onClick={() => setRotation(angle)}
                      className="flex-1"
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
              <div className="mt-6 p-4 bg-secondary rounded-xl space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Watermark Text
                  </Label>
                  <Input
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Style
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["diagonal", "center", "tiled"] as const).map((pos) => (
                      <Button
                        key={pos}
                        variant={watermarkPosition === pos ? "default" : "outline"}
                        onClick={() => setWatermarkPosition(pos)}
                        className="capitalize"
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
              <div className="mt-6 p-4 bg-secondary rounded-xl">
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
              <div className="mt-6 p-4 bg-secondary rounded-xl">
                <Label className="text-sm font-medium text-foreground mb-3 block">
                  Output Format
                </Label>
                <div className="flex gap-3">
                  {(["jpeg", "png"] as const).map((fmt) => (
                    <Button
                      key={fmt}
                      variant={imageFormat === fmt ? "default" : "outline"}
                      onClick={() => setImageFormat(fmt)}
                      className="flex-1 uppercase"
                    >
                      {fmt}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  JPEG: smaller files, good for photos. PNG: lossless, good for text/graphics.
                </p>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && progress > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
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
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-12 py-6 text-lg rounded-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Process & Download
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>🔒 Your files are processed entirely in your browser. Nothing is uploaded to any server.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
