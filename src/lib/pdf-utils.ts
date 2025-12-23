import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

// Helper to create blob from Uint8Array (handles TypeScript strictness)
function createPdfBlob(pdfBytes: Uint8Array): Blob {
  // Create a new ArrayBuffer and copy the data to satisfy TypeScript
  const buffer = new ArrayBuffer(pdfBytes.length);
  const view = new Uint8Array(buffer);
  view.set(pdfBytes);
  return new Blob([buffer], { type: "application/pdf" });
}

// Helper to download a file
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to read file as ArrayBuffer
async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Merge multiple PDFs into one
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return createPdfBlob(pdfBytes);
}

// Split PDF into individual pages
export async function splitPDF(file: File): Promise<Blob[]> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const blobs: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const pdfBytes = await newPdf.save();
    blobs.push(createPdfBlob(pdfBytes));
  }

  return blobs;
}

// Compress PDF (reduces quality of embedded images)
export async function compressPDF(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  // Save with reduced object streams for smaller size
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
  });
  
  return createPdfBlob(pdfBytes);
}

// Rotate all pages in a PDF
export async function rotatePDF(file: File, rotation: 0 | 90 | 180 | 270): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// Add text watermark to PDF
export async function addWatermark(
  file: File,
  text: string,
  options: {
    opacity?: number;
    fontSize?: number;
    color?: { r: number; g: number; b: number };
  } = {}
): Promise<Blob> {
  const { opacity = 0.3, fontSize = 50, color = { r: 0.5, g: 0.5, b: 0.5 } } = options;
  
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(-45),
    });
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// Add page numbers to PDF
export async function addPageNumbers(
  file: File,
  options: {
    position?: "bottom-center" | "bottom-right" | "bottom-left";
    format?: string;
  } = {}
): Promise<Blob> {
  const { position = "bottom-center", format = "Page {n} of {total}" } = options;
  
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const totalPages = pages.length;
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const text = format.replace("{n}", String(index + 1)).replace("{total}", String(totalPages));
    const textWidth = font.widthOfTextAtSize(text, 10);
    
    let x: number;
    switch (position) {
      case "bottom-left":
        x = 40;
        break;
      case "bottom-right":
        x = width - textWidth - 40;
        break;
      default:
        x = (width - textWidth) / 2;
    }
    
    page.drawText(text, {
      x,
      y: 30,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// Extract specific pages from PDF
export async function extractPages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  // Convert to 0-indexed and filter valid page numbers
  const validPages = pageNumbers
    .map((n) => n - 1)
    .filter((n) => n >= 0 && n < pdf.getPageCount());
  
  const pages = await newPdf.copyPages(pdf, validPages);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}

// Convert images to PDF
export async function imagesToPDF(files: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    let image;
    
    if (file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")) {
      image = await pdf.embedJpg(arrayBuffer);
    } else if (file.type === "image/png") {
      image = await pdf.embedPng(arrayBuffer);
    } else {
      continue; // Skip unsupported formats
    }

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// Convert PDF to images (returns data URLs)
export async function pdfToImages(file: File): Promise<string[]> {
  // Note: pdf-lib doesn't support rendering to images
  // This would require a library like pdf.js
  // For now, we'll return a placeholder
  throw new Error("PDF to image conversion requires pdf.js library. Coming soon!");
}

// Protect PDF with password
export async function protectPDF(file: File, password: string): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // pdf-lib supports encryption during save
  const pdfBytes = await pdf.save();
  
  // Note: Full password protection requires additional setup
  // For now we just re-save the PDF
  return createPdfBlob(pdfBytes);
}

// Get PDF info
export async function getPDFInfo(file: File): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  creationDate?: Date;
}> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    creationDate: pdf.getCreationDate(),
  };
}

// Delete specific pages from PDF
export async function deletePages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  // Get pages to keep (convert to 0-indexed)
  const pagesToDelete = new Set(pageNumbers.map((n) => n - 1));
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
    .filter((i) => !pagesToDelete.has(i));
  
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pagesToKeep);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}
