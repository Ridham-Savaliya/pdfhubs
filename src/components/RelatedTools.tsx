import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Tool {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

interface RelatedToolsProps {
    currentToolId: string;
}

// Define tool relationships for better internal linking
const toolRelationships: Record<string, string[]> = {
    "merge-pdf": ["split-pdf", "compress-pdf", "organize-pages", "pdf-to-word"],
    "split-pdf": ["extract-pages", "merge-pdf", "organize-pages", "compress-pdf"],
    "extract-pages": ["split-pdf", "organize-pages", "merge-pdf", "delete-pages"],
    "compress-pdf": ["merge-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-word"],
    "pdf-to-word": ["merge-pdf", "pdf-to-excel", "pdf-to-ppt", "compress-pdf"],
    "pdf-to-excel": ["pdf-to-word", "pdf-to-ppt", "split-pdf", "merge-pdf"],
    "pdf-to-jpg": ["jpg-to-pdf", "split-pdf", "compress-pdf", "pdf-to-word"],
    "jpg-to-pdf": ["pdf-to-jpg", "merge-pdf", "compress-pdf", "add-watermark"],
    "pdf-to-ppt": ["pdf-to-word", "pdf-to-excel", "split-pdf", "merge-pdf"],
    "rotate-pdf": ["organize-pages", "split-pdf", "merge-pdf", "compress-pdf"],
    "add-watermark": ["sign-pdf", "protect-pdf", "merge-pdf", "compress-pdf"],
    "add-page-numbers": ["merge-pdf", "organize-pages", "add-watermark", "compress-pdf"],
    "edit-pdf": ["sign-pdf", "add-watermark", "merge-pdf", "organize-pages"],
    "protect-pdf": ["unlock-pdf", "sign-pdf", "add-watermark", "compress-pdf"],
    "unlock-pdf": ["protect-pdf", "sign-pdf", "merge-pdf", "compress-pdf"],
    "organize-pages": ["rotate-pdf", "merge-pdf", "split-pdf", "add-page-numbers"],
    "sign-pdf": ["protect-pdf", "add-watermark", "edit-pdf", "merge-pdf"],
    "compare-pdf": ["organize-pages", "merge-pdf", "split-pdf", "edit-pdf"],
};

const allTools: Record<string, Omit<Tool, "id">> = {
    "merge-pdf": {
        title: "Merge PDF",
        description: "Combine multiple PDFs into one document",
        icon: "🔗",
        color: "bg-tool-merge"
    },
    "split-pdf": {
        title: "Split PDF",
        description: "Split PDF into separate pages or sections",
        icon: "✂️",
        color: "bg-tool-split"
    },
    "extract-pages": {
        title: "Extract Pages",
        description: "Save specific PDF pages to new file",
        icon: "📄",
        color: "bg-tool-split"
    },
    "compress-pdf": {
        title: "Compress PDF",
        description: "Reduce PDF file size without losing quality",
        icon: "📦",
        color: "bg-tool-compress"
    },
    "pdf-to-word": {
        title: "PDF to Word",
        description: "Convert PDF to editable Word documents",
        icon: "📝",
        color: "bg-tool-convert"
    },
    "pdf-to-excel": {
        title: "PDF to Excel",
        description: "Extract tables from PDF to Excel",
        icon: "📊",
        color: "bg-tool-convert"
    },
    "pdf-to-jpg": {
        title: "PDF to JPG",
        description: "Convert PDF pages to JPG images",
        icon: "🖼️",
        color: "bg-tool-convert"
    },
    "jpg-to-pdf": {
        title: "JPG to PDF",
        description: "Convert images to PDF format",
        icon: "📄",
        color: "bg-tool-convert"
    },
    "pdf-to-ppt": {
        title: "PDF to PowerPoint",
        description: "Convert PDF to PowerPoint presentations",
        icon: "📽️",
        color: "bg-tool-convert"
    },
    "rotate-pdf": {
        title: "Rotate PDF",
        description: "Rotate PDF pages to correct orientation",
        icon: "🔄",
        color: "bg-tool-rotate"
    },
    "add-watermark": {
        title: "Add Watermark",
        description: "Add text or image watermarks to PDFs",
        icon: "💧",
        color: "bg-tool-watermark"
    },
    "add-page-numbers": {
        title: "Add Page Numbers",
        description: "Insert page numbers to your PDFs",
        icon: "#️⃣",
        color: "bg-tool-edit"
    },
    "edit-pdf": {
        title: "Edit PDF",
        description: "Add text, images, and annotations to PDFs",
        icon: "✏️",
        color: "bg-tool-edit"
    },
    "protect-pdf": {
        title: "Protect PDF",
        description: "Add password protection to secure PDFs",
        icon: "🔒",
        color: "bg-tool-protect"
    },
    "unlock-pdf": {
        title: "Unlock PDF",
        description: "Remove password protection from PDFs",
        icon: "🔓",
        color: "bg-tool-unlock"
    },
    "organize-pages": {
        title: "Organize Pages",
        description: "Reorder, rotate, and delete PDF pages",
        icon: "📑",
        color: "bg-tool-organize"
    },
    "sign-pdf": {
        title: "Sign PDF",
        description: "Add digital signatures to PDFs",
        icon: "✍️",
        color: "bg-tool-protect"
    },
    "compare-pdf": {
        title: "Compare PDFs",
        description: "Find differences between two PDFs",
        icon: "⚖️",
        color: "bg-tool-organize"
    },
};

export function RelatedTools({ currentToolId }: RelatedToolsProps) {
    // Get related tool IDs
    const relatedIds = toolRelationships[currentToolId] || [];

    // Get tool details (take first 4)
    const relatedTools = relatedIds
        .slice(0, 4)
        .map(id => ({ id, ...allTools[id] }))
        .filter(tool => tool.title); // Filter out any undefined tools

    if (relatedTools.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 animate-fade-in">
            <div className="border-t border-border pt-12">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Related PDF Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedTools.map((tool) => (
                        <Link
                            key={tool.id}
                            to={`/tool/${tool.id}`}
                            className="group"
                        >
                            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                                <CardHeader>
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.color} shadow-sm text-2xl flex-shrink-0`}
                                        >
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm line-clamp-2">
                                                {tool.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                                        Try it
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
