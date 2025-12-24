import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'promotional' | 'inactivity' | 
        'daily_tip' | 'feature_highlight' | 'competitor_comparison';
  email: string;
  fullName?: string;
  userId?: string;
  subject?: string;
  content?: string;
  templateData?: Record<string, any>;
}

// Base styles as constants to keep lines short
const fontStack = "Arial, Helvetica, sans-serif";
const primaryColor = "#ef4444";
const secondaryColor = "#f97316";

// ============== WELCOME EMAIL ==============
function getWelcomeEmailHtml(fullName?: string): string {
  const name = fullName ? ` ${fullName}` : "";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Welcome to PDFTools</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:${primaryColor};
border-radius:16px 16px 0 0;
padding:40px;text-align:center;">
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:28px;">
Welcome to PDFTools!
</h1>
<p style="color:#fecaca;margin:10px 0 0;
font-family:${fontStack};font-size:16px;">
Your PDF powerhouse is ready
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;">
<h2 style="color:#1f2937;margin:0 0 20px;
font-family:${fontStack};font-size:22px;">
Hey${name}! 
</h2>
<p style="color:#6b7280;line-height:1.7;
font-family:${fontStack};font-size:15px;margin:0 0 25px;">
You have unlocked the most powerful suite of PDF tools. 
No subscriptions, no limits - just pure PDF magic!
</p>

<!-- Features -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="background:#fef3c7;border-radius:12px;
padding:20px;text-align:center;">
<div style="font-size:28px;margin-bottom:8px;">
&#9889;
</div>
<strong style="color:#92400e;
font-family:${fontStack};">Lightning Fast</strong>
<p style="color:#a16207;margin:8px 0 0;
font-family:${fontStack};font-size:13px;">
Process PDFs in seconds
</p>
</td>
<td width="15"></td>
<td style="background:#dbeafe;border-radius:12px;
padding:20px;text-align:center;">
<div style="font-size:28px;margin-bottom:8px;">
&#128274;
</div>
<strong style="color:#1e40af;
font-family:${fontStack};">100% Secure</strong>
<p style="color:#1d4ed8;margin:8px 0 0;
font-family:${fontStack};font-size:13px;">
Files auto-delete after processing
</p>
</td>
</tr>
</table>

<!-- Tools List -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:25px;">
<tr>
<td style="background:#f9fafb;border-radius:12px;padding:20px;">
<h3 style="color:#374151;margin:0 0 15px;
font-family:${fontStack};font-size:16px;">
Your Toolkit Includes:
</h3>
<p style="color:#4b5563;margin:0 0 8px;
font-family:${fontStack};font-size:14px;">
<strong>Merge</strong> - Combine multiple PDFs
</p>
<p style="color:#4b5563;margin:0 0 8px;
font-family:${fontStack};font-size:14px;">
<strong>Split</strong> - Extract specific pages
</p>
<p style="color:#4b5563;margin:0 0 8px;
font-family:${fontStack};font-size:14px;">
<strong>Compress</strong> - Reduce file sizes
</p>
<p style="color:#4b5563;margin:0;
font-family:${fontStack};font-size:14px;">
<strong>Convert</strong> - PDF to Word, Excel and more
</p>
</td>
</tr>
</table>

<!-- CTA Button -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:30px;">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:${primaryColor};
color:#ffffff;padding:16px 40px;
text-decoration:none;border-radius:10px;
font-family:${fontStack};font-weight:bold;
font-size:16px;">
Start Creating Magic
</a>
</td>
</tr>
</table>

<p style="color:#9ca3af;font-size:13px;
margin:30px 0 0;text-align:center;
font-family:${fontStack};line-height:1.6;">
Questions? Just reply to this email!<br>
- The PDFTools Team
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== INACTIVITY EMAIL ==============
function getInactivityEmailHtml(
  fullName?: string, 
  daysInactive?: number
): string {
  const name = fullName ? ` ${fullName}` : "";
  const days = daysInactive || "a few";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>We Miss You</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:#8b5cf6;
border-radius:16px 16px 0 0;
padding:40px;text-align:center;">
<div style="font-size:50px;margin-bottom:10px;">
&#128546;
</div>
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:28px;">
We Miss You!
</h1>
<p style="color:#e9d5ff;margin:10px 0 0;
font-family:${fontStack};font-size:15px;">
It has been ${days} days since your last visit
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;">
<h2 style="color:#1f2937;margin:0 0 20px;
font-family:${fontStack};font-size:22px;">
Hey${name}!
</h2>
<p style="color:#6b7280;line-height:1.7;
font-family:${fontStack};font-size:15px;margin:0 0 25px;">
Your PDFs are getting lonely! While you were away, 
we have been working on making PDFTools even better.
</p>

<!-- What's New -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="background:#faf5ff;
border-left:4px solid #8b5cf6;
border-radius:0 12px 12px 0;padding:20px;">
<h3 style="color:#6b21a8;margin:0 0 12px;
font-family:${fontStack};font-size:16px;">
What is New:
</h3>
<p style="color:#7c3aed;margin:0 0 6px;
font-family:${fontStack};font-size:14px;">
- Faster PDF compression (2x faster!)
</p>
<p style="color:#7c3aed;margin:0 0 6px;
font-family:${fontStack};font-size:14px;">
- New signature tool with touch support
</p>
<p style="color:#7c3aed;margin:0;
font-family:${fontStack};font-size:14px;">
- Improved PDF to Word conversion
</p>
</td>
</tr>
</table>

<!-- Comparison Box -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:25px;">
<tr>
<td style="background:#fef3c7;border-radius:12px;
padding:20px;text-align:center;">
<p style="color:#92400e;margin:0;
font-family:${fontStack};font-size:14px;
font-weight:bold;">
Unlike iLovePDF, we do not limit your conversions!
</p>
<p style="color:#a16207;margin:8px 0 0;
font-family:${fontStack};font-size:13px;">
Unlimited everything, always free.
</p>
</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:30px;">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:#8b5cf6;
color:#ffffff;padding:16px 40px;
text-decoration:none;border-radius:10px;
font-family:${fontStack};font-weight:bold;
font-size:16px;">
Come Back and Explore
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== DAILY TIP EMAIL ==============
const dailyTips = [
  {
    tip: "Merge Like a Pro",
    desc: "Drag and drop to reorder PDFs before merging!",
    color: "#ef4444"
  },
  {
    tip: "Compress Without Quality Loss",
    desc: "Smart compression removes duplicates while keeping clarity.",
    color: "#22c55e"
  },
  {
    tip: "Split by Page Range",
    desc: "Extract pages 1-5, 10, 15-20 all at once with commas!",
    color: "#f97316"
  },
  {
    tip: "Convert to Word Perfectly",
    desc: "AI-powered converter maintains formatting and tables.",
    color: "#3b82f6"
  },
  {
    tip: "Add Watermarks in Seconds",
    desc: "Custom text or image watermarks with adjustable opacity.",
    color: "#06b6d4"
  },
  {
    tip: "Sign Documents Digitally",
    desc: "Draw, type, or upload your signature anywhere on PDF.",
    color: "#8b5cf6"
  },
  {
    tip: "Organize Pages Easily",
    desc: "Drag, rotate, and delete pages with visual thumbnails!",
    color: "#ec4899"
  }
];

function getDailyTipEmailHtml(
  fullName?: string, 
  tipIndex?: number
): string {
  const tip = dailyTips[(tipIndex || 0) % dailyTips.length];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Daily PDF Tip</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:${tip.color};
border-radius:16px 16px 0 0;
padding:40px;text-align:center;">
<div style="font-size:40px;margin-bottom:10px;">
&#128161;
</div>
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:26px;">
Daily PDF Tip
</h1>
<p style="color:rgba(255,255,255,0.9);margin:8px 0 0;
font-family:${fontStack};font-size:14px;">
Get more done in less time
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;">
<h2 style="color:${tip.color};margin:0 0 20px;
font-family:${fontStack};font-size:22px;">
${tip.tip}
</h2>
<p style="color:#4b5563;line-height:1.7;
font-family:${fontStack};font-size:15px;margin:0 0 30px;">
${tip.desc}
</p>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:${tip.color};
color:#ffffff;padding:14px 36px;
text-decoration:none;border-radius:10px;
font-family:${fontStack};font-weight:bold;
font-size:15px;">
Try It Now
</a>
</td>
</tr>
</table>

<hr style="border:none;border-top:1px solid #e5e7eb;
margin:30px 0;">

<p style="color:#9ca3af;font-size:13px;
margin:0;text-align:center;
font-family:${fontStack};">
New tip every day! Stay tuned for more.
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== FEATURE HIGHLIGHT EMAIL ==============
function getFeatureHighlightEmailHtml(fullName?: string): string {
  const name = fullName ? ` ${fullName}` : "";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Feature Spotlight</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:#2563eb;
border-radius:16px 16px 0 0;
padding:40px;text-align:center;">
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:28px;">
Feature Spotlight
</h1>
<p style="color:#bfdbfe;margin:10px 0 0;
font-family:${fontStack};font-size:15px;">
Discover what makes PDFTools special
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;">
<h2 style="color:#1e293b;margin:0 0 25px;
font-family:${fontStack};font-size:22px;">
Hey${name}!
</h2>

<!-- Feature 1 -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-bottom:15px;">
<tr>
<td style="background:#ecfeff;border-radius:12px;padding:20px;">
<table cellpadding="0" cellspacing="0">
<tr>
<td width="50" valign="top">
<div style="background:#0891b2;width:45px;height:45px;
border-radius:10px;text-align:center;line-height:45px;
font-size:20px;">
&#128202;
</div>
</td>
<td style="padding-left:15px;">
<h3 style="color:#0e7490;margin:0 0 5px;
font-family:${fontStack};font-size:17px;">
PDF to Excel
</h3>
<p style="color:#0891b2;margin:0;
font-family:${fontStack};font-size:14px;">
Extract tables directly into spreadsheets
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>

<!-- Feature 2 -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-bottom:15px;">
<tr>
<td style="background:#fdf4ff;border-radius:12px;padding:20px;">
<table cellpadding="0" cellspacing="0">
<tr>
<td width="50" valign="top">
<div style="background:#a855f7;width:45px;height:45px;
border-radius:10px;text-align:center;line-height:45px;
font-size:20px;">
&#128272;
</div>
</td>
<td style="padding-left:15px;">
<h3 style="color:#7e22ce;margin:0 0 5px;
font-family:${fontStack};font-size:17px;">
Password Protection
</h3>
<p style="color:#a855f7;margin:0;
font-family:${fontStack};font-size:14px;">
Secure documents with encryption
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>

<!-- Feature 3 -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="background:#f0fdf4;border-radius:12px;padding:20px;">
<table cellpadding="0" cellspacing="0">
<tr>
<td width="50" valign="top">
<div style="background:#22c55e;width:45px;height:45px;
border-radius:10px;text-align:center;line-height:45px;
font-size:20px;">
&#128260;
</div>
</td>
<td style="padding-left:15px;">
<h3 style="color:#15803d;margin:0 0 5px;
font-family:${fontStack};font-size:17px;">
Compare PDFs
</h3>
<p style="color:#22c55e;margin:0;
font-family:${fontStack};font-size:14px;">
Spot differences between versions
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:30px;">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:#2563eb;
color:#ffffff;padding:16px 40px;
text-decoration:none;border-radius:10px;
font-family:${fontStack};font-weight:bold;
font-size:16px;">
Explore All Features
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== COMPETITOR COMPARISON EMAIL ==============
function getCompetitorComparisonEmailHtml(fullName?: string): string {
  const name = fullName ? ` ${fullName}` : "";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Why PDFTools</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:${primaryColor};
border-radius:16px 16px 0 0;
padding:40px;text-align:center;">
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:28px;">
Why PDFTools?
</h1>
<p style="color:#fecaca;margin:10px 0 0;
font-family:${fontStack};font-size:15px;">
See how we compare to competition
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;">
<h2 style="color:#1f2937;margin:0 0 25px;
font-family:${fontStack};font-size:22px;">
Hey${name}!
</h2>

<!-- Comparison Table -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="border:2px solid #e5e7eb;border-radius:12px;
overflow:hidden;margin-bottom:25px;">

<!-- Header Row -->
<tr style="background:#f9fafb;">
<td style="padding:12px;font-family:${fontStack};
font-size:13px;color:#374151;font-weight:bold;">
Feature
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:13px;
color:${primaryColor};font-weight:bold;">
PDFTools
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:13px;
color:#9ca3af;font-weight:bold;">
iLovePDF
</td>
</tr>

<!-- Row 1 -->
<tr style="border-top:1px solid #e5e7eb;">
<td style="padding:12px;font-family:${fontStack};
font-size:14px;color:#4b5563;">
Daily Limit
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#22c55e;font-weight:bold;">
Unlimited
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:${primaryColor};">
2-3 files
</td>
</tr>

<!-- Row 2 -->
<tr style="border-top:1px solid #e5e7eb;background:#fafafa;">
<td style="padding:12px;font-family:${fontStack};
font-size:14px;color:#4b5563;">
File Size
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#22c55e;font-weight:bold;">
100MB+
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:${primaryColor};">
25MB free
</td>
</tr>

<!-- Row 3 -->
<tr style="border-top:1px solid #e5e7eb;">
<td style="padding:12px;font-family:${fontStack};
font-size:14px;color:#4b5563;">
Account Required
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#22c55e;font-weight:bold;">
Optional
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#f97316;">
Required
</td>
</tr>

<!-- Row 4 -->
<tr style="border-top:1px solid #e5e7eb;background:#fafafa;">
<td style="padding:12px;font-family:${fontStack};
font-size:14px;color:#4b5563;">
Watermarks
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#22c55e;font-weight:bold;">
None
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:${primaryColor};">
On free tier
</td>
</tr>

<!-- Row 5 -->
<tr style="border-top:1px solid #e5e7eb;">
<td style="padding:12px;font-family:${fontStack};
font-size:14px;color:#4b5563;">
All Tools Free
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:#22c55e;font-weight:bold;">
Yes
</td>
<td style="padding:12px;text-align:center;
font-family:${fontStack};font-size:14px;
color:${primaryColor};">
Premium only
</td>
</tr>
</table>

<!-- Highlight Box -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-bottom:25px;">
<tr>
<td style="background:#ecfdf5;border:2px solid #22c55e;
border-radius:12px;padding:20px;text-align:center;">
<p style="color:#166534;margin:0;
font-family:${fontStack};font-size:16px;
font-weight:bold;">
Save money. Save time. Use PDFTools.
</p>
<p style="color:#15803d;margin:8px 0 0;
font-family:${fontStack};font-size:13px;">
No premium plan needed - everything is free, forever.
</p>
</td>
</tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:${primaryColor};
color:#ffffff;padding:16px 40px;
text-decoration:none;border-radius:10px;
font-family:${fontStack};font-weight:bold;
font-size:16px;">
Try PDFTools Free
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== PROMOTIONAL EMAIL ==============
function getPromotionalEmailHtml(
  subject: string, 
  content: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0">

<!-- Header -->
<tr>
<td style="background:${primaryColor};
border-radius:16px 16px 0 0;
padding:35px;text-align:center;">
<h1 style="color:#ffffff;margin:0;
font-family:${fontStack};font-size:24px;">
PDFTools
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="background:#ffffff;padding:40px;
border-radius:0 0 16px 16px;">
<h2 style="color:#1f2937;margin:0 0 20px;
font-family:${fontStack};font-size:22px;">
${subject}
</h2>
<div style="color:#6b7280;line-height:1.7;
font-family:${fontStack};font-size:15px;">
${content}
</div>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" 
style="margin-top:30px;">
<tr>
<td align="center">
<a href="https://pdftools.app" 
style="display:inline-block;
background:${primaryColor};
color:#ffffff;padding:14px 32px;
text-decoration:none;border-radius:8px;
font-family:${fontStack};font-weight:bold;
font-size:15px;">
Explore PDFTools
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;
margin:0;font-family:${fontStack};">
2024 PDFTools. All rights reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============== MAIN HANDLER ==============
const handler = async (req: Request): Promise<Response> => {
  console.log("Send email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();
    const { type, email, fullName, subject, content, templateData } = body;
    
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

    switch (type) {
      case "welcome":
        emailSubject = "Welcome to PDFTools! Your PDF Journey Starts Now";
        emailHtml = getWelcomeEmailHtml(fullName);
        break;
      case "inactivity":
        emailSubject = "We Miss You! Come Back to PDFTools";
        emailHtml = getInactivityEmailHtml(fullName, templateData?.daysInactive);
        break;
      case "daily_tip":
        emailSubject = "Your Daily PDF Tip from PDFTools";
        emailHtml = getDailyTipEmailHtml(fullName, templateData?.tipIndex);
        break;
      case "feature_highlight":
        emailSubject = "Discover Amazing Features on PDFTools";
        emailHtml = getFeatureHighlightEmailHtml(fullName);
        break;
      case "competitor_comparison":
        emailSubject = "Why PDFTools Beats the Competition";
        emailHtml = getCompetitorComparisonEmailHtml(fullName);
        break;
      case "promotional":
        emailSubject = subject || "News from PDFTools";
        emailHtml = getPromotionalEmailHtml(emailSubject, content || "");
        break;
      default:
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
      JSON.stringify({ success: true, message: "Email sent" }),
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
