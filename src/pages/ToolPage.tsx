import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Settings, FileText, RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  rotatePDF,
  addWatermark,
  addPageNumbers,
  imagesToPDF,
  downloadFile,
  getPDFInfo,
} from "@/lib/pdf-utils";

const toolInfo: Record<string, { 
  title: string; 
  description: string; 
  color: string;
  acceptedFiles: string;
  minFiles?: number;
  maxFiles?: number;
  hasOptions?: boolean;
}> = {
  "merge-pdf": {
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single document. Just upload your files and we'll do the rest.",
    color: "bg-tool-merge",
    acceptedFiles: ".pdf",
    minFiles: 2,
    maxFiles: 20,
  },
  "split-pdf": {
    title: "Split PDF",
    description: "Extract pages or split your PDF into multiple separate documents.",
    color: "bg-tool-split",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compress-pdf": {
    title: "Compress PDF",
    description: "Reduce the file size of your PDFs while maintaining quality.",
    color: "bg-tool-compress",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert your PDF documents to editable Word files in seconds.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Extract data from PDFs and convert to Excel spreadsheets.",
    color: "bg-tool-convert",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert your PDFs to editable PowerPoint presentations.",
    color: "bg-tool-convert",
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
    description: "Convert your JPG images to PDF format quickly and easily.",
    color: "bg-tool-convert",
    acceptedFiles: ".jpg,.jpeg,.png",
    minFiles: 1,
    maxFiles: 20,
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format with perfect formatting.",
    color: "bg-tool-convert",
    acceptedFiles: ".doc,.docx",
    minFiles: 1,
    maxFiles: 10,
  },
  "edit-pdf": {
    title: "Edit PDF",
    description: "Add text, images, shapes, and annotations to your PDF documents.",
    color: "bg-tool-edit",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "rotate-pdf": {
    title: "Rotate PDF",
    description: "Rotate your PDF pages to the correct orientation.",
    color: "bg-tool-rotate",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
    hasOptions: true,
  },
  "add-watermark": {
    title: "Add Watermark",
    description: "Add custom text or image watermarks to your PDF pages.",
    color: "bg-tool-watermark",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
    hasOptions: true,
  },
  "protect-pdf": {
    title: "Protect PDF",
    description: "Add password protection to encrypt your PDF documents.",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
    hasOptions: true,
  },
  "unlock-pdf": {
    title: "Unlock PDF",
    description: "Remove password protection from your PDF files.",
    color: "bg-tool-unlock",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
  },
  "organize-pages": {
    title: "Organize Pages",
    description: "Reorder, rotate, and delete pages within your PDF.",
    color: "bg-tool-organize",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "add-page-numbers": {
    title: "Add Page Numbers",
    description: "Insert page numbers to your PDF documents with custom styling.",
    color: "bg-tool-edit",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 10,
    hasOptions: true,
  },
  "sign-pdf": {
    title: "Sign PDF",
    description: "Add your signature to PDF documents electronically.",
    color: "bg-tool-protect",
    acceptedFiles: ".pdf",
    minFiles: 1,
    maxFiles: 1,
  },
  "compare-pdf": {
    title: "Compare PDFs",
    description: "Find and highlight differences between two PDF documents.",
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
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number } | null>(null);
  
  // Options state
  const [rotation, setRotation] = useState<"90" | "180" | "270">("90");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [pageNumberPosition, setPageNumberPosition] = useState<"bottom-center" | "bottom-left" | "bottom-right">("bottom-center");

  const tool = toolId ? toolInfo[toolId] : null;

  const handleFilesSelected = async (newFiles: File[]) => {
    setFiles(newFiles);
    
    // Get PDF info for the first file
    if (newFiles.length > 0 && newFiles[0].name.endsWith('.pdf')) {
      try {
        const info = await getPDFInfo(newFiles[0]);
        setPdfInfo({ pageCount: info.pageCount });
      } catch (e) {
        setPdfInfo(null);
      }
    } else {
      setPdfInfo(null);
    }
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

    try {
      switch (toolId) {
        case "merge-pdf": {
          const blob = await mergePDFs(files);
          downloadFile(blob, "merged.pdf");
          toast.success("PDFs merged successfully!");
          break;
        }

        case "split-pdf": {
          const blobs = await splitPDF(files[0]);
          // Download each page as a separate file
          blobs.forEach((blob, index) => {
            downloadFile(blob, `page-${index + 1}.pdf`);
          });
          toast.success(`PDF split into ${blobs.length} pages!`);
          break;
        }

        case "compress-pdf": {
          for (const file of files) {
            const blob = await compressPDF(file);
            const originalSize = file.size;
            const newSize = blob.size;
            const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
            downloadFile(blob, `compressed-${file.name}`);
            toast.success(`Compressed ${file.name} (${reduction}% smaller)`);
          }
          break;
        }

        case "rotate-pdf": {
          const rotationAngle = parseInt(rotation) as 90 | 180 | 270;
          for (const file of files) {
            const blob = await rotatePDF(file, rotationAngle);
            downloadFile(blob, `rotated-${file.name}`);
          }
          toast.success(`PDF(s) rotated ${rotation}°!`);
          break;
        }

        case "add-watermark": {
          for (const file of files) {
            const blob = await addWatermark(file, watermarkText);
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
          toast.success("Page numbers added successfully!");
          break;
        }

        case "jpg-to-pdf": {
          const blob = await imagesToPDF(files);
          downloadFile(blob, "converted.pdf");
          toast.success("Images converted to PDF!");
          break;
        }

        case "pdf-to-jpg":
        case "pdf-to-word":
        case "pdf-to-excel":
        case "pdf-to-powerpoint":
        case "word-to-pdf":
          toast.info("This conversion requires a server-side API. Coming soon!");
          break;

        case "protect-pdf":
        case "unlock-pdf":
          toast.info("Password protection features coming soon!");
          break;

        case "edit-pdf":
        case "sign-pdf":
          toast.info("Interactive PDF editing coming soon!");
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
                  {pdfInfo.pageCount} page{pdfInfo.pageCount !== 1 ? 's' : ''} detected
                </span>
              </div>
            )}

            {/* Tool-specific options */}
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
                      {angle}°
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && toolId === "add-watermark" && (
              <div className="mt-6 p-4 bg-secondary rounded-xl">
                <Label className="text-sm font-medium text-foreground mb-3 block">
                  Watermark Text
                </Label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                  className="bg-background"
                />
              </div>
            )}

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
                  </SelectContent>
                </Select>
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
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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
            <p>Your files are processed locally in your browser and never uploaded to our servers.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
