import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hash password to compare with stored hash
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// Create a clean unlocked PDF by removing protection markers
async function createUnlockedPDF(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts } = await import("https://esm.sh/pdf-lib@1.17.1");
  
  // Try to load the PDF
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
    });
  } catch (error) {
    console.error('Failed to load PDF:', error);
    throw new Error('Could not load PDF. The file may be corrupted or have unsupported encryption.');
  }
  
  // Check if password matches (for PDFTools-protected files)
  const keywords = pdfDoc.getKeywords() || '';
  const keywordsArray = keywords.split(',').map(k => k.trim());
  
  let passwordValid = false;
  
  // Check for PDFTools password hash
  for (const keyword of keywordsArray) {
    if (keyword.startsWith('hash:')) {
      const storedHash = keyword.substring(5);
      const providedHash = await hashPassword(password);
      if (storedHash === providedHash) {
        passwordValid = true;
        break;
      }
    }
    // Also check legacy base64 encoded password
    if (keyword.startsWith('password:')) {
      try {
        const storedPassword = atob(keyword.substring(9));
        if (storedPassword === password) {
          passwordValid = true;
          break;
        }
      } catch (e) {
        // Ignore decode errors
      }
    }
  }
  
  // If not a PDFTools-protected file, just proceed (it may be an unprotected PDF)
  const isPDFToolsProtected = keywordsArray.some(k => k === 'protected' || k === 'encrypted');
  
  if (isPDFToolsProtected && !passwordValid) {
    console.log('Password verification failed for PDFTools-protected file');
    throw new Error('Incorrect password. Please enter the correct password to unlock this PDF.');
  }
  
  console.log(`PDF unlock: isPDFToolsProtected=${isPDFToolsProtected}, passwordValid=${passwordValid}`);
  
  // Create a new clean PDF by copying all pages
  const newPdf = await PDFDocument.create();
  const font = await newPdf.embedFont(StandardFonts.Helvetica);
  
  // Copy all pages from the original
  const pageIndices = pdfDoc.getPageIndices();
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }
  
  // Set clean metadata
  const originalTitle = pdfDoc.getTitle() || '';
  const cleanTitle = originalTitle.replace('Protected - ', '').replace('Protected Document', 'Document');
  
  newPdf.setTitle(cleanTitle || 'Unlocked Document');
  newPdf.setSubject('');
  newPdf.setKeywords([]);
  newPdf.setProducer('PDFTools Unlock');
  newPdf.setCreator('PDFTools');
  newPdf.setCreationDate(new Date());
  newPdf.setModificationDate(new Date());
  
  // Save the unlocked PDF
  const unlockedBytes = await newPdf.save({
    useObjectStreams: false,
  });
  
  return unlockedBytes;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;

    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!password) {
      console.error('No password provided');
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Unlocking PDF: ${file.name}, size: ${file.size} bytes`);

    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const unlockedBytes = await createUnlockedPDF(pdfBytes, password);

    console.log(`PDF unlocked successfully, output size: ${unlockedBytes.length} bytes`);

    return new Response(unlockedBytes as unknown as BodyInit, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="unlocked-${file.name}"`,
      },
    });

  } catch (error) {
    console.error('Unlock error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unlock failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
