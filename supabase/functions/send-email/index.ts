import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'promotional';
  email: string;
  fullName?: string;
  subject?: string;
  content?: string;
}

const getWelcomeEmailHtml = (fullName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PDFTools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">📄 PDFTools</h1>
    </div>
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #1f2937; margin-top: 0;">Welcome${fullName ? `, ${fullName}` : ''}! 🎉</h2>
      <p style="color: #6b7280; line-height: 1.6;">
        Thank you for joining PDFTools! You now have access to our complete suite of PDF tools:
      </p>
      <ul style="color: #6b7280; line-height: 1.8;">
        <li><strong>Merge PDFs</strong> - Combine multiple PDFs into one</li>
        <li><strong>Split PDF</strong> - Extract pages from your documents</li>
        <li><strong>Compress PDF</strong> - Reduce file sizes without quality loss</li>
        <li><strong>Convert PDF</strong> - Transform PDFs to Word, Excel, and more</li>
        <li><strong>Edit PDF</strong> - Add watermarks, page numbers, and annotations</li>
      </ul>
      <p style="color: #6b7280; line-height: 1.6;">
        Your conversion history is now saved automatically, so you can always access your previous work.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Start Using PDFTools
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; text-align: center;">
        Have questions? Just reply to this email - we're here to help!
      </p>
    </div>
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
      © 2024 PDFTools. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

const getPromotionalEmailHtml = (subject: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">📄 PDFTools</h1>
    </div>
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #1f2937; margin-top: 0;">${subject}</h2>
      <div style="color: #6b7280; line-height: 1.6;">
        ${content}
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Explore PDFTools
        </a>
      </div>
    </div>
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
      © 2024 PDFTools. All rights reserved.<br>
      <a href="#" style="color: #9ca3af;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Send email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, fullName, subject, content }: EmailRequest = await req.json();
    
    console.log(`Sending ${type} email to: ${email}`);

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPassword) {
      console.error("Gmail credentials not configured");
      throw new Error("Email service not configured");
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    });

    let emailSubject: string;
    let emailHtml: string;

    if (type === 'welcome') {
      emailSubject = "Welcome to PDFTools! 🎉";
      emailHtml = getWelcomeEmailHtml(fullName);
    } else if (type === 'promotional') {
      emailSubject = subject || "News from PDFTools";
      emailHtml = getPromotionalEmailHtml(emailSubject, content || "");
    } else {
      throw new Error("Invalid email type");
    }

    await client.send({
      from: gmailUser,
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

    await client.close();

    console.log(`Email sent successfully to: ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
