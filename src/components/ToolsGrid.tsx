import { 
  Combine, 
  Scissors, 
  FileDown, 
  FileType, 
  FileEdit, 
  RotateCw, 
  Droplets, 
  Lock, 
  Unlock, 
  LayoutGrid,
  FileImage,
  Image,
  FileSpreadsheet,
  Presentation,
  FileSignature,
  Scale,
  Hash,
  FileUp
} from "lucide-react";
import { ToolCard } from "./ToolCard";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one seamlessly.",
    icon: Combine,
    href: "/tool/merge-pdf",
    color: "bg-tool-merge",
  },
  {
    title: "Split PDF",
    description: "Separate PDF pages into individual files.",
    icon: Scissors,
    href: "/tool/split-pdf",
    color: "bg-tool-split",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while maintaining quality.",
    icon: FileDown,
    href: "/tool/compress-pdf",
    color: "bg-tool-compress",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents.",
    icon: FileType,
    href: "/tool/pdf-to-word",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to Excel",
    description: "Extract tables and data to Excel format.",
    icon: FileSpreadsheet,
    href: "/tool/pdf-to-excel",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to PowerPoint",
    description: "Transform PDFs into editable presentations.",
    icon: Presentation,
    href: "/tool/pdf-to-powerpoint",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages to high-quality images.",
    icon: FileImage,
    href: "/tool/pdf-to-jpg",
    color: "bg-tool-convert",
  },
  {
    title: "JPG to PDF",
    description: "Create PDFs from your image collection.",
    icon: Image,
    href: "/tool/jpg-to-pdf",
    color: "bg-tool-convert",
  },
  {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format.",
    icon: FileUp,
    href: "/tool/word-to-pdf",
    color: "bg-tool-convert",
  },
  {
    title: "Edit PDF",
    description: "Add text, images, and annotations to PDFs.",
    icon: FileEdit,
    href: "/tool/edit-pdf",
    color: "bg-tool-edit",
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages to the correct orientation.",
    icon: RotateCw,
    href: "/tool/rotate-pdf",
    color: "bg-tool-rotate",
  },
  {
    title: "Add Watermark",
    description: "Protect documents with custom watermarks.",
    icon: Droplets,
    href: "/tool/add-watermark",
    color: "bg-tool-watermark",
  },
  {
    title: "Add Page Numbers",
    description: "Insert page numbers with custom positioning.",
    icon: Hash,
    href: "/tool/add-page-numbers",
    color: "bg-tool-edit",
  },
  {
    title: "Protect PDF",
    description: "Secure PDFs with password protection.",
    icon: Lock,
    href: "/tool/protect-pdf",
    color: "bg-tool-protect",
  },
  {
    title: "Unlock PDF",
    description: "Remove PDF password restrictions.",
    icon: Unlock,
    href: "/tool/unlock-pdf",
    color: "bg-tool-unlock",
  },
  {
    title: "Organize Pages",
    description: "Reorder, delete, and organize PDF pages.",
    icon: LayoutGrid,
    href: "/tool/organize-pages",
    color: "bg-tool-organize",
  },
  {
    title: "Sign PDF",
    description: "Add digital signatures to documents.",
    icon: FileSignature,
    href: "/tool/sign-pdf",
    color: "bg-tool-protect",
  },
  {
    title: "Compare PDFs",
    description: "Find differences between PDF documents.",
    icon: Scale,
    href: "/tool/compare-pdf",
    color: "bg-tool-organize",
  },
];

export function ToolsGrid() {
  return (
    <section className="py-20 md:py-28 bg-gradient-surface relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-up">
            All PDF Tools You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "100ms" }}>
            Professional-grade PDF tools that work instantly in your browser. No installation, no signup.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.title}
              {...tool}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
