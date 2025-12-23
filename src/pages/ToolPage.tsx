import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const toolInfo: Record<string, { title: string; description: string; color: string }> = {
  "merge-pdf": {
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single document. Just upload your files and we'll do the rest.",
    color: "bg-tool-merge",
  },
  "split-pdf": {
    title: "Split PDF",
    description: "Extract pages or split your PDF into multiple separate documents.",
    color: "bg-tool-split",
  },
  "compress-pdf": {
    title: "Compress PDF",
    description: "Reduce the file size of your PDFs while maintaining quality.",
    color: "bg-tool-compress",
  },
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert your PDF documents to editable Word files in seconds.",
    color: "bg-tool-convert",
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Extract data from PDFs and convert to Excel spreadsheets.",
    color: "bg-tool-convert",
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert your PDFs to editable PowerPoint presentations.",
    color: "bg-tool-convert",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    description: "Convert each page of your PDF into a high-quality JPG image.",
    color: "bg-tool-convert",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description: "Convert your JPG images to PDF format quickly and easily.",
    color: "bg-tool-convert",
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format with perfect formatting.",
    color: "bg-tool-convert",
  },
  "edit-pdf": {
    title: "Edit PDF",
    description: "Add text, images, shapes, and annotations to your PDF documents.",
    color: "bg-tool-edit",
  },
  "rotate-pdf": {
    title: "Rotate PDF",
    description: "Rotate your PDF pages to the correct orientation.",
    color: "bg-tool-rotate",
  },
  "add-watermark": {
    title: "Add Watermark",
    description: "Add custom text or image watermarks to your PDF pages.",
    color: "bg-tool-watermark",
  },
  "protect-pdf": {
    title: "Protect PDF",
    description: "Add password protection to encrypt your PDF documents.",
    color: "bg-tool-protect",
  },
  "unlock-pdf": {
    title: "Unlock PDF",
    description: "Remove password protection from your PDF files.",
    color: "bg-tool-unlock",
  },
  "organize-pages": {
    title: "Organize Pages",
    description: "Reorder, rotate, and delete pages within your PDF.",
    color: "bg-tool-organize",
  },
  "add-page-numbers": {
    title: "Add Page Numbers",
    description: "Insert page numbers to your PDF documents with custom styling.",
    color: "bg-tool-edit",
  },
  "sign-pdf": {
    title: "Sign PDF",
    description: "Add your signature to PDF documents electronically.",
    color: "bg-tool-protect",
  },
  "compare-pdf": {
    title: "Compare PDFs",
    description: "Find and highlight differences between two PDF documents.",
    color: "bg-tool-organize",
  },
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const tool = toolId ? toolInfo[toolId] : null;

  const handleProcess = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Files processed successfully!");
    }, 2000);
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
              onFilesSelected={setFiles}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />

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
            <p>Your files are secure and will be automatically deleted after processing.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
