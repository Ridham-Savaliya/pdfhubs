import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hash password with the same salt used in protect-pdf
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'pdtools-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create an unlocked PDF by properly preserving all content
async function createUnlockedPDF(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const { PDFDocument } = await import("https://esm.sh/pdf-lib@1.17.1");

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
  const keywordsArray = keywords.split(',').map((k: string) => k.trim());

  let passwordValid = false;
  let isPDFToolsProtected = false;

  // Check for PDFTools metadata
  for (const keyword of keywordsArray) {
    if (keyword === 'protected' || keyword === 'pdtools-secured') {
      isPDFToolsProtected = true;
    }

    // Check for password hash with new salt
    if (keyword.startsWith('hash:')) {
      isPDFToolsProtected = true;
      const storedHash = keyword.substring(5);
      const providedHash = await hashPassword(password);
      console.log(`Comparing hashes: stored=${storedHash.substring(0, 16)}..., provided=${providedHash.substring(0, 16)}...`);
      if (storedHash === providedHash) {
        passwordValid = true;
      }
    }

    // Check for embedded metadata with password hash
    if (keyword.startsWith('meta:')) {
      isPDFToolsProtected = true;
      try {
        const decodedMeta = JSON.parse(atob(keyword.substring(5)));
        if (decodedMeta.passwordHash) {
          const providedHash = await hashPassword(password);
          if (decodedMeta.passwordHash === providedHash) {
            passwordValid = true;
          }
        }
      } catch (e) {
        console.log('Could not decode metadata:', e);
      }
    }
  }

  console.log(`PDF unlock: isPDFToolsProtected=${isPDFToolsProtected}, passwordValid=${passwordValid}`);

  // If it's a PDFTools-protected file and password is wrong, reject
  if (isPDFToolsProtected && !passwordValid) {
    throw new Error('Incorrect password. Please enter the correct password to unlock this PDF.');
  }

  // For PDFTools-protected PDFs (watermark-based), we need to remove the watermarks
  // by creating a fresh copy that preserves all content but removes protection markers

  // Get all pages and their content
  const pages = pdfDoc.getPages();

  // Instead of copying pages (which can lose embedded images), 
  // we'll save the document directly with clean metadata
  pdfDoc.setTitle('Unlocked Document');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('PDFTools');
  pdfDoc.setCreator('PDFTools Unlock');
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  // Save directly - this preserves all page content including images
  const unlockedBytes = await pdfDoc.save({
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