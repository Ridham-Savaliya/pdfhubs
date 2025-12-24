import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize pdfmake with virtual file system fonts
if (pdfFonts && (pdfFonts as any).pdfMake) {
  pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
} else if ((pdfFonts as any).default?.pdfMake) {
  pdfMake.vfs = (pdfFonts as any).default.pdfMake.vfs;
}

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface EncryptionOptions {
  userPassword: string;
  ownerPassword?: string;
  permissions?: {
    printing?: 'lowResolution' | 'highResolution';
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
    contentAccessibility?: boolean;
    documentAssembly?: boolean;
  };
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

// Render PDF page to canvas
async function renderPageToCanvas(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
  scale: number = 2.0
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;
  
  return canvas;
}

// Convert canvas to base64 data URL
function canvasToDataURL(canvas: HTMLCanvasElement, quality: number = 0.92): string {
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Creates a truly encrypted PDF using pdfmake
 * This converts the PDF pages to images and creates a new encrypted PDF
 */
export async function createEncryptedPDF(
  file: File,
  options: EncryptionOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(5);
  
  // Load the original PDF with pdfjs
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  
  if (onProgress) onProgress(10);
  
  // Convert each page to an image
  const pageImages: { image: string; width: number; height: number }[] = [];
  
  for (let i = 1; i <= numPages; i++) {
    const canvas = await renderPageToCanvas(pdfDoc, i, 2.0);
    const dataUrl = canvasToDataURL(canvas, 0.92);
    
    // Get original page dimensions
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    
    pageImages.push({
      image: dataUrl,
      width: viewport.width,
      height: viewport.height,
    });
    
    if (onProgress) {
      onProgress(10 + (i / numPages) * 60);
    }
  }
  
  if (onProgress) onProgress(75);
  
  // Create document definition for pdfmake
  const docDefinition: any = {
    userPassword: options.userPassword,
    ownerPassword: options.ownerPassword || options.userPassword + '_owner',
    permissions: {
      printing: options.permissions?.printing || 'highResolution',
      modifying: options.permissions?.modifying ?? false,
      copying: options.permissions?.copying ?? false,
      annotating: options.permissions?.annotating ?? true,
      fillingForms: options.permissions?.fillingForms ?? true,
      contentAccessibility: options.permissions?.contentAccessibility ?? true,
      documentAssembly: options.permissions?.documentAssembly ?? false,
    },
    pageSize: {
      width: pageImages[0]?.width || 595,
      height: pageImages[0]?.height || 842,
    },
    pageMargins: [0, 0, 0, 0],
    content: pageImages.map((pageImg, index) => ({
      image: pageImg.image,
      width: pageImg.width,
      height: pageImg.height,
      pageBreak: index < pageImages.length - 1 ? 'after' : undefined,
    })),
    info: {
      title: `Protected - ${file.name}`,
      author: 'PDFTools',
      subject: 'Password Protected Document',
      creator: 'PDFTools Encryption Engine',
    },
  };
  
  if (onProgress) onProgress(85);
  
  // Generate the encrypted PDF
  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob((blob: Blob) => {
        if (onProgress) onProgress(100);
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Create a simple encrypted PDF for text-based content
 * Useful when you don't need to preserve exact layout
 */
export async function createSimpleEncryptedPDF(
  content: string,
  options: EncryptionOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(20);
  
  const docDefinition: any = {
    userPassword: options.userPassword,
    ownerPassword: options.ownerPassword || options.userPassword + '_owner',
    permissions: {
      printing: options.permissions?.printing || 'highResolution',
      modifying: options.permissions?.modifying ?? false,
      copying: options.permissions?.copying ?? false,
      annotating: options.permissions?.annotating ?? true,
      fillingForms: options.permissions?.fillingForms ?? true,
      contentAccessibility: options.permissions?.contentAccessibility ?? true,
      documentAssembly: options.permissions?.documentAssembly ?? false,
    },
    content: [
      { text: content, fontSize: 12 },
    ],
    info: {
      title: 'Protected Document',
      author: 'PDFTools',
      subject: 'Password Protected Document',
      creator: 'PDFTools Encryption Engine',
    },
  };
  
  if (onProgress) onProgress(50);
  
  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob((blob: Blob) => {
        if (onProgress) onProgress(100);
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
}
