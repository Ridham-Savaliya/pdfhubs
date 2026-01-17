interface ToolContentProps {
    toolId: string;
}

// Rich content for each tool to improve SEO
const toolContent: Record<string, { howTo: string; whyUse: string; features: string[]; useCases: string[] }> = {
    "merge-pdf": {
        howTo: "Merging PDF files has never been easier with PDFHubs' free online merger. Simply upload your PDF documents in the order you want them combined, and our advanced processing engine will seamlessly merge them into a single, cohesive PDF file. The merger preserves all original formatting, bookmarks, hyperlinks, and interactive elements from your source PDFs. Whether you're consolidating business reports, combining scanned documents, merging chapters of a book, or creating a comprehensive portfolio, our tool handles files of any size with ease. The entire process happens securely in your browser, ensuring your sensitive documents remain private and never leave your device.",
        whyUse: "Unlike other PDF tools that require costly subscriptions or bulky desktop software, PDFHubs offers completely free, unlimited PDF merging with no file size restrictions or hidden costs. Our browser-based merger provides maximum security since all processing happens client-side on your device - your files never touch our servers. You can merge up to 20 PDF files at once, creating documents as large as you need without compression or quality loss. The tool works on any device with a modern browser, including Windows, Mac, Linux, iOS, and Android, with no installation or registration required.",
        features: [
            "Combine up to 20 PDF files in a single operation",
            "Preserves formatting, bookmarks, and interactive elements",
            "Drag-and-drop interface for easy page reordering",
            "No file size limits - merge files of any size",
            "100% secure browser-based processing",
            "Works on all devices and operating systems"
        ],
        useCases: [
            "Business professionals consolidating quarterly reports and presentations",
            "Students combining research papers, citations, and appendices for thesis submission",
            "Legal teams compiling contracts, agreements, and supporting documentation",
            "Real estate agents merging property listings, disclosure forms, and inspection reports"
        ]
    },
    "split-pdf": {
        howTo: "PDFHubs' PDF splitter allows you to extract individual pages or specific page ranges from any PDF document. Upload your large PDF file, preview all pages with thumbnail navigation, then choose which pages to extract. You can split a PDF into individual single-page documents, extract specific page ranges (like pages 1-5 and 10-15), or divide the document into equal parts. The split operation preserves the original quality and formatting of each page, including text, images, forms, and annotations. All processing happens instantly in your browser without uploading files to any server, ensuring complete privacy and security for your documents.",
        whyUse: "Splitting PDFs is essential when you need to share only relevant sections of a large document, reduce file sizes for email attachments, or organize chapters and sections separately. Our free PDF splitter requires no registration or software installation, works entirely in your browser, and supports PDFs of any size. Unlike many online tools that compress or watermark your files, we maintain 100% original quality with no modifications. The split process is instantaneous, and you can download individual pages or all split files as a convenient ZIP archive.",
        features: [
            "Extract specific pages or page ranges",
            "Split into individual single-page PDFs",
            "Divide document into equal parts automatically",
            "Preview all pages before splitting",
            "Download individual files or bulk ZIP",
            "Preserves original quality and formatting"
        ],
        useCases: [
            "Extracting single invoices or receipts from monthly statement PDFs",
            "Separating book chapters for individual distribution or sale",
            "Isolating specific contract pages that require signatures",
            "Creating handouts from presentation slides by extracting key pages"
        ]
    },
    "compress-pdf": {
        howTo: "Our intelligent PDF compressor reduces file sizes by up to 90% while maintaining document quality. Upload your PDF, select your desired compression level (high quality for printing, medium for balanced results, or low for maximum compression), and let our optimization algorithm work its magic. The compressor analyzes your PDF and applies advanced techniques like image optimization, font subsetting, metadata removal, and content stream compression. You can see the exact file size reduction before downloading, and process multiple PDFs simultaneously for batch optimization. The entire compression process happens in your browser, ensuring your files remain private.",
        whyUse: "Large PDF files create numerous problems: they bounce back from email servers, consume valuable storage space, load slowly on websites, and waste bandwidth. PDFHubs' compressor solves these issues by dramatically reducing file sizes without noticeable quality loss. Our three-tier compression system lets you choose the perfect balance between size and quality for your specific needs. Use high-quality compression for documents you'll print, medium compression for everyday sharing, or maximum compression for web publishing. All compression is free with no limits on file size or number of files.",
        features: [
            "Reduce file sizes by 60-90% on average",
            "Three compression levels: High, Medium, Low quality",
            "Smart image optimization preserving text clarity",
            "Batch processing for multiple PDFs",
            "See size reduction before downloading",
            "Original quality documents remain unmodified"
        ],
        useCases: [
            "Reducing large presentation files for email delivery under 10MB limits",
            "Optimizing website PDFs for faster page load times and better SEO",
            "Archiving old documents to save storage space on cloud drives",
            "Preparing files for mobile device viewing with limited bandwidth"
        ]
    },
    "pdf-to-word": {
        howTo: "Converting PDF to Word format enables you to edit content that was previously locked in PDF form. Our cloud-powered converter uses advanced OCR and layout recognition technology to transform your PDF into a fully editable Word document. Simply upload your PDF file, and our AI engine analyzes the document structure, identifies text blocks, tables, images, and formatting elements, then reconstructs them in DOCX format. The conversion preserves fonts, colors, paragraph styles, bullet points, headers, footers, and page layouts. Even complex multi-column layouts and embedded tables are accurately converted for easy editing in Microsoft Word, Google Docs, or any word processor.",
        whyUse: "PDF to Word conversion is essential when you need to update old documents, extract and repurpose content, or collaborate on documents where the original Word file is lost. Our converter handles both text-based PDFs and scanned image PDFs using OCR technology, making it versatile for any document type. The cloud-powered conversion delivers superior accuracy compared to desktop tools, correctly handling complex formatting, tables, and special characters. Unlike many converters that scramble layouts or lose formatting, our tool maintains document structure so you can start editing immediately without reformatting.",
        features: [
            "Converts both text and scanned PDFs using OCR",
            "Preserves formatting, tables, and images",
            "Cloud-powered AI for superior accuracy",
            "Handles multi-column layouts and complex documents",
            "Creates editable DOCX files compatible with all word processors",
            "Maintains fonts, colors, and paragraph styling"
        ],
        useCases: [
            "Updating company policies and procedures locked in old PDF files",
            "Extracting content from PDF ebooks for research and citations",
            "Converting client-provided PDFs into editable proposals and contracts",
            "Recovering content when original Word files are lost or corrupted"
        ]
    },
    "pdf-to-excel": {
        howTo: "Extracting tabular data from PDFs into Excel spreadsheets is effortless with our intelligent PDF to Excel converter. Upload your PDF containing tables, invoices, financial reports, or data sheets, and our converter automatically detects table structures and converts them into properly formatted Excel cells. The converter recognizes rows, columns, headers, and merged cells, preserving the data organization while making it fully editable in Excel. You can then sort, filter, create formulas, and analyze the data using Excel's powerful features. Our cloud-based conversion handles PDFs with multiple tables, split-page tables, and complex formatting that would be nearly impossible to extract manually.",
        whyUse: "Manual data entry from PDF tables to Excel is time-consuming, error-prone, and frustrating. Our PDF to Excel converter automates this process, saving hours of work while eliminating transcription errors. Whether you're processing financial statements, inventory reports, student grades, survey results, or scientific data, the converter accurately extracts numbers, text, and formulas into spreadsheet format. The tool is particularly valuable for accountants, data analysts, researchers, and anyone who regularly works with tabular PDF data and needs it in a manipulable format.",
        features: [
            "Automatic table detection and extraction",
            "Preserves cell formatting and merged cells",
            "Handles multiple tables per PDF",
            "Recognizes headers and row/column structure",
            "Processes financial reports and invoices accurately",
            "Creates XLSX files compatible with Excel and Google Sheets"
        ],
        useCases: [
            "Converting PDF bank statements into Excel for accounting and analysis",
            "Extracting inventory data from supplier PDFs into your management system",
            "Processing student grade reports for statistical analysis",
            "Converting scientific research data tables for further computation"
        ]
    },
    "pdf-to-jpg": {
        howTo: "Converting PDF pages to JPG images allows you to use PDF content in presentations, websites, documents, or anywhere images are needed. Upload your PDF, select the pages you want to convert (or convert all pages), choose your preferred output format (JPG for smaller files or PNG for lossless quality), and download high-resolution images. Each PDF page becomes a separate image file, maintaining the original layout and visual appearance. You can adjust image resolution and quality settings to balance file size and visual clarity based on your needs - use higher DPI for printing and lower DPI for web use.",
        whyUse: "Image formats are often more versatile than PDFs for certain applications. You might need PNGs for website graphics, JPGs for social media posts, or high-resolution images for presentations where PDF embedding isn't supported. Our converter produces crisp, clear images at resolutions suitable for both screen viewing and professional printing. Unlike taking screenshots, proper PDF to image conversion maintains full resolution and color fidelity, producing professional-quality results every time.",
        features: [
            "Convert to JPG (smaller files) or PNG (higher quality)",
            "Adjustable resolution and quality settings",
            "Convert all pages or select specific pages",
            "Maintains original layout and visual fidelity",
            "High-DPI output suitable for printing",
            "Batch download all images as ZIP"
        ],
        useCases: [
            "Creating website graphics from PDF marketing materials",
            "Extracting diagrams and charts for PowerPoint presentations",
            "Converting PDF certificates to images for embedding in emails",
            "Preparing PDF designs for social media posting and sharing"
        ]
    },
    "jpg-to-pdf": {
        howTo: "Transform your JPG, PNG, or WEBP images into professional PDF documents with our image to PDF converter. Upload single or multiple images, arrange them in your desired order using drag-and-drop, configure page settings like size (A4, Letter, Legal) and orientation (portrait or landscape), then convert and download your PDF. Each image can occupy its own page, or you can arrange multiple images per page in grid layouts. The converter automatically optimizes image quality and compression for the perfect balance between file size and visual clarity. You can combine hundreds of photos into a single PDF album or portfolio.",
        whyUse: "PDFs are superior to image files for document sharing because they maintain consistent appearance across all devices and operating systems, can't be easily edited (preserving authenticity), are easier to email as single files rather than multiple attachments, and are universally readable without special software. Converting images to PDF is essential for creating photo albums, assembling portfolios, digitizing scanned receipts, combining screenshots into tutorials, or preparing images for printing. Our converter handles batch conversion of hundreds of images, saving significant time compared to processing them individually.",
        features: [
            "Supports JPG, PNG, and WEBP image formats",
            "Combine unlimited images into one PDF",
            "Drag-and-drop ordering interface",
            "Adjustable page size and orientation",
            "Smart quality optimization",
            "Multiple layout options: one image per page or grid layouts"
        ],
        useCases: [
            "Creating photo albums from vacation pictures for easy sharing",
            "Building professional portfolios combining artwork or project images",
            "Digitizing paper receipts by photographing and converting to searchable PDFs",
            "Assembling screenshot tutorials and step-by-step guides"
        ]
    },
    "rotate-pdf": {
        howTo: "Fix orientation issues in your PDFs by rotating pages 90°, 180°, or 270° with our rotation tool. Upload your PDF, preview all pages with thumbnail navigation, select which pages need rotation (or rotate all pages), choose the rotation angle, and download your corrected PDF. This is particularly useful for scanned documents that were fed into the scanner incorrectly, mixed portrait and landscape pages that need consistent orientation, or PDF files created from photos taken with a phone or camera in the wrong rotation.",
        whyUse: "Incorrectly oriented PDFs are frustrating to read and unprofessional to share. Rather than craning your neck or constantly rotating your device, permanently fix the page orientation with our rotation tool. The corrected PDF will display properly on all devices and apps without requiring viewers to manually rotate pages. Our tool processes rotations losslessly - no quality degradation, no re-compression, just clean orientation adjustment.",
        features: [
            "Rotate pages 90°, 180°, or 270° clockwise",
            "Apply rotation to all pages or selected pages only",
            "Preview functionality before applying changes",
            "Lossless rotation with no quality degradation",
            "Handles scanned documents and camera photos",
            "Instant processing with immediate download"
        ],
        useCases: [
            "Correcting scanned documents that were fed into scanner upside-down",
            "Fixing PDF orientation on documents photographed with mobile phones",
            "Adjusting mixed landscape/portrait presentations to consistent orientation",
            "Preparing documents for printing where orientation matters"
        ]
    },
    "add-watermark": {
        howTo: "Protect your PDFs and establish ownership by adding custom text or image watermarks. Upload your PDF document, choose between text or image watermark type, customize the content (for text: enter your text, select font, size, and opacity; for images: upload your logo or stamp), position the watermark (center, diagonal across page, or tiled pattern), and generate your watermarked PDF. You can apply watermarks to all pages or select specific pages, making it perfect for draft documents where only certain sections need marking.",
        whyUse: "Watermarks serve multiple critical purposes: they deter unauthorized copying  or distribution of your intellectual property, indicate document status (DRAFT, CONFIDENTIAL, COPY, FINAL), provide branding by displaying company logos throughout documents, and maintain attribution by clearly marking content ownership. Our watermark tool gives you full control over appearance and placement, ensuring the watermark is visible enough to serve its purpose without obscuring the underlying content. Watermarks are embedded into the PDF and can't be easily removed without specialized software.",
        features: [
            "Text or image watermark options",
            "Customizable font, size, color, and opacity",
            "Multiple positioning: center, diagonal, tiled, corners",
            "Apply to all pages or selected pages only",
            "Transparent watermarks that don't obscure content",
            "Permanent embedding into PDF structure"
        ],
        useCases: [
            "Marking draft documents as CONFIDENTIAL before stakeholder review",
            "Adding company logos to reports and presentations for branding",
            "Protecting photography portfolios and artwork from unauthorized use",
            "Indicating document versions: DRAFT, REVISED, FINAL, COPY, ORIGINAL"
        ]
    },
    "add-page-numbers": {
        howTo: "Add professional page numbering to your PDF documents with full customization control. Upload your PDF, select page number format (1, 2, 3 or i, ii, iii or Page 1 of 10), choose position (bottom center, bottom-left, bottom-right, top-center, etc.), set the starting page number, customize font and size, and generate your numbered PDF. You can exclude cover pages from numbering, use different formats for different sections (Roman numerals for front matter, Arabic numerals for main content), and add prefixes or suffixes to numbers.",
        whyUse: "Page numbers are essential for professional documents, academic papers, legal contracts, and any multi-page document that might be printed, referenced in discussions, or used in table of contents. They facilitate easy navigation, enable precise referencing during meetings or reviews, maintain document structure when pages are shared separately, and meet formatting requirements for formal submissions. Our tool adds page numbers in a way that looks native to the document, not like an awkward overlay.",
        features: [
            "Multiple number formats: Arabic, Roman, letters, custom text",
            "Flexible positioning on page",
            "Customizable starting number",
            "Option to skip cover or title pages",
            "Different numbering for different sections",
            "Professional font matching for seamless integration"
        ],
        useCases: [
            "Numbering academic theses and dissertations per university requirements",
            "Adding page numbers to legal contracts for precise clause referencing",
            "Preparing presentations for printed handouts with navigation",
            "Organizing training manuals and employee handbooks"
        ]
    },
    "edit-pdf": {
        howTo: "Our comprehensive PDF editor allows you to modify PDF content directly in your browser without converting to other formats. Upload your PDF and access a full suite of editing tools: add text boxes with custom fonts and colors, insert images and logos, draw shapes and lines, add checkmarks and symbols, create annotations and comments, highlight important sections, redact sensitive information, and fill out PDF forms. All edits are applied directly to the PDF structure, creating a properly formatted PDF output rather than a flattened image.",
        whyUse: "Traditional PDF editors like Adobe Acrobat cost hundreds of dollars annually, while free alternatives offer limited functionality or require software installation. Our browser-based PDF editor provides professional-grade editing capabilities completely free with no installation, works on any device including Chromebooks and tablets, saves your edits properly into PDF structure (not as images), and processes everything locally in your browser for maximum security. Edit contracts, complete forms, add signatures, annotate documents, or make corrections quickly and easily.",
        features: [
            "Add and edit text with custom formatting",
            "Insert images, logos, and graphics",
            "Draw shapes, lines, and annotations",
            "Fill out PDF forms interactively",
            "Highlight, underline, and strikethrough text",
            "Full undo/redo functionality"
        ],
        useCases: [
            "Filling out PDF applications and forms without printing",
            "Adding company logos and branding to received PDFs",
            "Making corrections and edits to PDF contracts before signing",
            "Annotating documents with comments and notes for team review"
        ]
    },
    "protect-pdf": {
        howTo: "Secure your sensitive PDF documents with password protection and permission restrictions. Upload your PDF, set an opening password (required to view the document), optionally set a permissions password (controls what recipients can do with the document), configure specific permissions (allow/deny printing, text copying, editing, annotation, form filling), select encryption strength (128-bit or 256-bit AES), and download your protected PDF. The encrypted PDF can only be opened by users who know the password you set, and they'll be restricted to only the actions you've permitted.",
        whyUse: "Password protecting PDFs prevents unauthorized access to confidential information, controls how recipients can interact with your documents (view only, no printing, no copying, etc.), maintains document integrity by preventing unauthorized modifications, complies with data protection regulations requiring encrypted storage and transmission, and provides an audit trail of security measures taken. Our protection uses bank-grade AES encryption that's recognized as secure by government and industry standards worldwide.",
        features: [
            "Open password protection requiring password to view",
            "Permissions password controlling document usage",
            "Granular permission controls: print, copy, edit, annotate",
            "128-bit or 256-bit AES encryption",
            "Complies with security regulations",
            "Password hints and recovery options"
        ],
        useCases: [
            "Protecting confidential financial reports shared with stakeholders",
            "Securing HR documents containing personal employee information",
            "Restricting legal contracts to view-only to prevent unauthorized changes",
            "Protecting intellectual property in shared business proposals"
        ]
    },
    "unlock-pdf": {
        howTo: "Remove password protection from PDFs when you have authorization to do so. Upload your password-protected PDF, enter the password when prompted, choose whether to remove just the opening password or also clear all permission restrictions, and download the unlocked PDF. The unlocked file will open without password prompts and have all permissions enabled. Note: This tool only works if you know the current password - we cannot crack or bypass unknown passwords, ensuring security and legal compliance.",
        whyUse: "Sometimes PDFs are password-protected unnecessarily, creating friction when you need to work with the document. Common scenarios include: PDFs you created and forgot you encrypted, documents received from colleagues where password is known but annoying to enter repeatedly, files needing editing but locked with permission restrictions, or old archived files with outdated security. Our unlock tool removes these barriers while maintaining ethical use - you must know the password, making unauthorized unlocking impossible.",
        features: [
            "Remove opening password protection",
            "Clear permission restrictions",
            "Supports all PDF encryption types",
            "Batch unlock multiple PDFs with same password",
            "Maintains all document content and quality",
            "Requires knowledge of current password"
        ],
        useCases: [
            "Removing protection from your own old files where password entry is tedious",
            "Unlocking received documents where sender provided a password",
            "Clearing edit restrictions on documents you're authorized to modify",
            "Processing archived files that no longer require security protections"
        ]
    },
    "organize-pages": {
        howTo: "Take complete control of your PDF page structure with our page organization tool. Upload your PDF and see all pages displayed as draggable thumbnails. You can reorder pages by dragging them to new positions, rotate individual pages to correct orientation, delete unnecessary pages completely, duplicate pages you need multiple copies of, and extract selected pages to a new PDF. Changes are previewed in real-time so you see exactly what your reorganized PDF will look like before finalizing. Apply all changes with one click and download your newly organized document.",
        whyUse: "PDFs often need reorganization after creation - pages may be out of sequence, blank pages need deletion, duplicates require removal, or key pages need replication. Rather than using expensive desktop software or struggling with limited online tools, our page organizer provides complete control in an intuitive visual interface. The drag-and-drop functionality makes complex reorganization tasks simple and fast, while real-time preview eliminates guesswork and mistakes.",
        features: [
            "Visual drag-and-drop page reordering",
            "Rotate pages individually or in groups",
            "Delete unwanted or blank pages",
            "Duplicate pages within the document",
            "Extract selected pages to new PDF",
            "Real-time preview of changes"
        ],
        useCases: [
            "Reordering scanned pages that were fed into scanner out of sequence",
            "Removing blank pages from incorrectly scanned documents",
            "Duplicating signature pages that need multiple copies",
            "Organizing presentation slides after client feedback requires restructuring"
        ]
    },
    "sign-pdf": {
        howTo: "Add legally binding digital signatures to your PDF documents without printing or scanning. Upload your PDF, create your signature by drawing with mouse/touch, typing and selecting a font style, or uploading an image of your handwritten signature. Click on the PDF page where you want to place the signature, resize and position it precisely, optionally add signature date and text annotations, and download the signed PDF. The signature is embedded into the PDF permanently and cannot be easily removed or altered, providing authenticity verification.",
        whyUse: "Electronic signatures eliminate the need to print documents, sign by hand, scan them back to digital format, and email - saving time, paper, and hassle. Our signing tool creates legally valid signatures recognized under U.S. ESIGN Act, EU eIDAS regulation, and similar laws worldwide. Signatures are more than just images overlaid on a PDF - they're cryptographically embedded with timestamp and identity verification, making them suitable for contracts, agreements, forms, and official documents. Sign from anywhere on any device without specialized hardware or software.",
        features: [
            "Three signature creation methods: draw, type, upload",
            "Precise positioning and resizing",
            "Automatic timestamp recording",
            "Multiple signatures per document",
            "Legally binding in most jurisdictions",
            "Tamper-evident signature validation"
        ],
        useCases: [
            "Signing employment contracts and offer letters remotely",
            "Executing NDAs and business agreements electronically",
            "Authorizing invoices and purchase orders for accounts payabale",
            "Completing rental applications and lease agreements digitally"
        ]
    },
    "compare-pdf": {
        howTo: "Identify every change between two versions of a PDF document with our intelligent comparison tool. Upload both PDF versions (original and revised), and our algorithm analyzes them page by page to detect differences in text content, formatting changes, layout modifications, added or deleted pages, and image adjustments. Results are displayed in a comprehensive comparison view showing changes highlighted and categorized by type. You can review changes sequentially, jump to specific differences, generate comparison reports, and understand exactly what was modified between versions.",
        whyUse: "Manually comparing PDF versions is tedious and error-prone - it's easy to miss subtle changes in lengthy documents. Our automated comparison identifies every single modification, no matter how small, saving hours of manual review time. This is invaluable for legal contract review (comparing client revisions vs. original), document version auditing (tracking what changed between v1 and v2), quality control (verifying translated documents match source), and compliance verification (ensuring final documents match approved versions). The tool catches changes that human eyes might miss.",
        features: [
            "Text comparison detecting additions, deletions, modifications",
            "Visual comparison highlighting layout changes",
            "Page-by-page analysis with navigation",
            "Detailed comparison reports",
            "Side-by-side viewing of both versions",
            "Export comparison results as annotated PDF"
        ],
        useCases: [
            "Legal teams reviewing client revisions to contracts and agreements",
            "Quality assurance comparing translated documents to source material",
            "Compliance officers verifying regulatory filings match approved versions",
            "Editors tracking changes between draft and final manuscript versions"
        ]
    },
};

export function ToolContent({ toolId }: ToolContentProps) {
    const content = toolContent[toolId];

    if (!content) {
        return null;
    }

    return (
        <div className="mt-12 space-y-12 animate-fade-in">
            {/* How To Section */}
            <section className="prose prose-slate max-w-none dark:prose-invert">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    How It Works
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                    {content.howTo}
                </p>
            </section>

            {/* Why Use Section */}
            <section className="prose prose-slate max-w-none dark:prose-invert">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    Why Use This Tool?
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                    {content.whyUse}
                </p>
            </section>

            {/* Features Section */}
            <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    Key Features
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 text-base text-muted-foreground"
                        >
                            <span className="text-primary text-lg flex-shrink-0 mt-0.5">✓</span>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Use Cases Section */}
            <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    Common Use Cases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.useCases.map((useCase, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl"
                        >
                            <span className="text-2xl flex-shrink-0">{getUseCaseIcon(index)}</span>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {useCase}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function getUseCaseIcon(index: number): string {
    const icons = ["💼", "📚", "⚖️", "🏠", "🎓", "🏢", "📊", "🎨"];
    return icons[index % icons.length];
}
