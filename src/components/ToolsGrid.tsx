import {
  Combine,
  Scissors,
  FileDown,
  FileOutput,
  Pencil,
  RotateCw,
  Droplets,
  Lock,
  Unlock,
  LayoutGrid,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
  FileUp,
  Image,
  Hash,
  PenTool,
  FileSearch,
} from "lucide-react";
import { ToolCard } from "./ToolCard";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one single document in seconds.",
    icon: Combine,
    href: "/tool/merge-pdf",
    color: "bg-tool-merge",
  },
  {
    title: "Split PDF",
    description: "Extract pages or split your PDF into multiple files.",
    icon: Scissors,
    href: "/tool/split-pdf",
    color: "bg-tool-split",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while maintaining optimal quality.",
    icon: FileDown,
    href: "/tool/compress-pdf",
    color: "bg-tool-compress",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word files.",
    icon: FileText,
    href: "/tool/pdf-to-word",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to Excel",
    description: "Pull data from PDFs into Excel spreadsheets.",
    icon: FileSpreadsheet,
    href: "/tool/pdf-to-excel",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to PowerPoint",
    description: "Convert PDFs to editable PowerPoint presentations.",
    icon: Presentation,
    href: "/tool/pdf-to-powerpoint",
    color: "bg-tool-convert",
  },
  {
    title: "PDF to JPG",
    description: "Convert each PDF page into a high-quality JPG image.",
    icon: FileImage,
    href: "/tool/pdf-to-jpg",
    color: "bg-tool-convert",
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds.",
    icon: Image,
    href: "/tool/jpg-to-pdf",
    color: "bg-tool-convert",
  },
  {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format quickly.",
    icon: FileUp,
    href: "/tool/word-to-pdf",
    color: "bg-tool-convert",
  },
  {
    title: "Edit PDF",
    description: "Add text, images, shapes and annotations to your PDF.",
    icon: Pencil,
    href: "/tool/edit-pdf",
    color: "bg-tool-edit",
  },
  {
    title: "Rotate PDF",
    description: "Rotate your PDF pages the way you need them.",
    icon: RotateCw,
    href: "/tool/rotate-pdf",
    color: "bg-tool-rotate",
  },
  {
    title: "Add Watermark",
    description: "Stamp an image or text over your PDF in seconds.",
    icon: Droplets,
    href: "/tool/add-watermark",
    color: "bg-tool-watermark",
  },
  {
    title: "Protect PDF",
    description: "Add a password to encrypt and protect your PDF.",
    icon: Lock,
    href: "/tool/protect-pdf",
    color: "bg-tool-protect",
  },
  {
    title: "Unlock PDF",
    description: "Remove password protection from your PDF files.",
    icon: Unlock,
    href: "/tool/unlock-pdf",
    color: "bg-tool-unlock",
  },
  {
    title: "Organize Pages",
    description: "Sort, delete, and arrange pages in your PDF.",
    icon: LayoutGrid,
    href: "/tool/organize-pages",
    color: "bg-tool-organize",
  },
  {
    title: "Add Page Numbers",
    description: "Insert page numbers to your PDF documents easily.",
    icon: Hash,
    href: "/tool/add-page-numbers",
    color: "bg-tool-edit",
  },
  {
    title: "Sign PDF",
    description: "Sign documents or request signatures from others.",
    icon: PenTool,
    href: "/tool/sign-pdf",
    color: "bg-tool-protect",
  },
  {
    title: "Compare PDFs",
    description: "Find differences between two PDF documents.",
    icon: FileSearch,
    href: "/tool/compare-pdf",
    color: "bg-tool-organize",
  },
];

export function ToolsGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            All PDF tools you need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We've got everything covered. Choose from our collection of powerful PDF tools.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
