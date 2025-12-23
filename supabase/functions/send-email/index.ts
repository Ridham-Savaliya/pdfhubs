import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'promotional' | 'inactivity' | 'daily_tip' | 'feature_highlight' | 'competitor_comparison';
  email: string;
  fullName?: string;
  userId?: string;
  subject?: string;
  content?: string;
  templateData?: Record<string, any>;
}

// ============== WELCOME EMAIL TEMPLATE ==============
const getWelcomeEmailHtml = (fullName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PDFTools</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header with animated gradient feel -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #eab308 100%); border-radius: 24px 24px 0 0; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
      <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 800; position: relative; z-index: 1;">🎉 Welcome to PDFTools!</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-top: 12px; position: relative; z-index: 1;">Your PDF powerhouse is ready</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 50px 40px; border-radius: 0 0 24px 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.15);">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hey${fullName ? ` ${fullName}` : ''}! 👋</h2>
      <p style="color: #6b7280; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
        You've just unlocked the most powerful suite of PDF tools on the web. No subscriptions, no limits – just pure PDF magic!
      </p>
      
      <!-- Feature Cards -->
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 35px;">
        <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">⚡</div>
          <strong style="color: #92400e;">Lightning Fast</strong>
          <p style="color: #a16207; font-size: 13px; margin: 8px 0 0 0;">Process PDFs in seconds</p>
        </div>
        <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🔒</div>
          <strong style="color: #1e40af;">100% Secure</strong>
          <p style="color: #1d4ed8; font-size: 13px; margin: 8px 0 0 0;">Files auto-delete after processing</p>
        </div>
      </div>
      
      <!-- Tool List -->
      <div style="background: #f9fafb; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">🛠️ Your Toolkit Includes:</h3>
        <div style="display: grid; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">📎</span>
            <span style="color: #4b5563;"><strong>Merge</strong> – Combine multiple PDFs</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: #f97316; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">✂️</span>
            <span style="color: #4b5563;"><strong>Split</strong> – Extract specific pages</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: #22c55e; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">📦</span>
            <span style="color: #4b5563;"><strong>Compress</strong> – Reduce file sizes</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;">🔄</span>
            <span style="color: #4b5563;"><strong>Convert</strong> – PDF to Word, Excel & more</span>
          </div>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 10px 30px rgba(239,68,68,0.4); transition: all 0.3s;">
          Start Creating Magic ✨
        </a>
      </div>
      
      <p style="color: #9ca3af; font-size: 14px; margin-top: 35px; text-align: center; line-height: 1.6;">
        Questions? Just reply to this email – we read every message!<br>
        <span style="color: #d1d5db;">—</span> The PDFTools Team 💪
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
        © 2024 PDFTools. All rights reserved.<br>
        <a href="#" style="color: rgba(255,255,255,0.9);">Unsubscribe</a> · <a href="#" style="color: rgba(255,255,255,0.9);">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// ============== INACTIVITY REMINDER TEMPLATE ==============
const getInactivityEmailHtml = (fullName?: string, daysInactive?: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%); border-radius: 24px 24px 0 0; padding: 50px 40px; text-align: center; position: relative;">
      <div style="font-size: 60px; margin-bottom: 15px;">😢</div>
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800;">We Miss You!</h1>
      <p style="color: rgba(255,255,255,0.85); font-size: 16px; margin-top: 10px;">It's been ${daysInactive || 'a few'} days since your last visit</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 50px 40px; border-radius: 0 0 24px 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.3);">
      <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hey${fullName ? ` ${fullName}` : ''}! 👋</h2>
      <p style="color: #6b7280; line-height: 1.8; font-size: 16px;">
        Your PDFs are getting lonely! While you were away, we've been working on making PDFTools even better for you.
      </p>
      
      <!-- What's New Section -->
      <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border-left: 4px solid #8b5cf6;">
        <h3 style="color: #6b21a8; margin: 0 0 15px 0;">🆕 What's New:</h3>
        <ul style="color: #7c3aed; margin: 0; padding-left: 20px; line-height: 2;">
          <li>Faster PDF compression (now 2x faster!)</li>
          <li>New signature tool with touch support</li>
          <li>Improved PDF to Word conversion accuracy</li>
        </ul>
      </div>
      
      <!-- Comparison Banner -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center;">
        <p style="color: #92400e; font-size: 15px; margin: 0; font-weight: 600;">
          ⚡ Unlike iLovePDF, we don't limit your daily conversions!<br>
          <span style="font-weight: 400; font-size: 14px;">Unlimited everything, always free.</span>
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 10px 30px rgba(139,92,246,0.4);">
          Come Back & Explore 🚀
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============== DAILY TIP EMAIL TEMPLATES ==============
const dailyTips = [
  {
    tip: "Merge Like a Pro",
    icon: "📎",
    description: "Did you know you can drag and drop to reorder PDFs before merging? Just grab and move!",
    color: "#ef4444"
  },
  {
    tip: "Compress Without Quality Loss",
    icon: "📦",
    description: "Our smart compression removes duplicate fonts and optimizes images while keeping your PDFs crystal clear.",
    color: "#22c55e"
  },
  {
    tip: "Split by Page Range",
    icon: "✂️",
    description: "Extract pages 1-5, 10, 15-20 all at once! Just use commas to separate ranges.",
    color: "#f97316"
  },
  {
    tip: "Convert to Word Perfectly",
    icon: "📝",
    description: "Our AI-powered converter maintains your original formatting, tables, and images.",
    color: "#3b82f6"
  },
  {
    tip: "Add Watermarks in Seconds",
    icon: "💧",
    description: "Protect your documents with custom text or image watermarks. Adjust opacity for subtle branding.",
    color: "#06b6d4"
  },
  {
    tip: "Sign Documents Digitally",
    icon: "✍️",
    description: "Draw, type, or upload your signature. Place it anywhere on your PDF with precision.",
    color: "#8b5cf6"
  },
  {
    tip: "Organize Pages Easily",
    icon: "📑",
    description: "Drag, rotate, and delete pages with our visual page organizer. See thumbnails as you work!",
    color: "#ec4899"
  }
];

const getDailyTipEmailHtml = (fullName?: string, tipIndex?: number) => {
  const tip = dailyTips[(tipIndex || 0) % dailyTips.length];
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0fdf4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, ${tip.color} 0%, ${tip.color}dd 100%); border-radius: 24px 24px 0 0; padding: 40px; text-align: center;">
      <div style="font-size: 50px; margin-bottom: 10px;">${tip.icon}</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Daily PDF Tip</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Get more done in less time</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 45px 40px; border-radius: 0 0 24px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
      <h2 style="color: ${tip.color}; margin: 0 0 20px 0; font-size: 24px;">${tip.tip}</h2>
      <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
        ${tip.description}
      </p>
      
      <div style="text-align: center;">
        <a href="https://pdftools.app" style="display: inline-block; background: ${tip.color}; color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
          Try It Now →
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
      
      <p style="color: #9ca3af; font-size: 13px; text-align: center;">
        💡 New tip every day! Stay tuned for more productivity hacks.
      </p>
    </div>
  </div>
</body>
</html>
`;
};

// ============== FEATURE HIGHLIGHT EMAIL ==============
const getFeatureHighlightEmailHtml = (fullName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #7c3aed 100%); border-radius: 24px 24px 0 0; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0L60 30L30 60L0 30z\" fill=\"rgba(255,255,255,0.05)\"/%3E%3C/svg%3E');"></div>
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; position: relative;">🚀 Feature Spotlight</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px; position: relative;">Discover what makes PDFTools special</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 50px 40px; border-radius: 0 0 24px 24px;">
      <h2 style="color: #1e293b; margin: 0 0 25px 0;">Hey${fullName ? ` ${fullName}` : ''}! ✨</h2>
      
      <!-- Feature Grid -->
      <div style="display: grid; gap: 20px; margin-bottom: 35px;">
        <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 16px; padding: 25px; display: flex; gap: 20px; align-items: center;">
          <div style="background: #0891b2; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">📊</div>
          <div>
            <h3 style="color: #0e7490; margin: 0 0 5px 0; font-size: 18px;">PDF to Excel</h3>
            <p style="color: #0891b2; margin: 0; font-size: 14px;">Extract tables and data directly into spreadsheets</p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 16px; padding: 25px; display: flex; gap: 20px; align-items: center;">
          <div style="background: #a855f7; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🔐</div>
          <div>
            <h3 style="color: #7e22ce; margin: 0 0 5px 0; font-size: 18px;">Password Protection</h3>
            <p style="color: #a855f7; margin: 0; font-size: 14px;">Secure sensitive documents with encryption</p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 25px; display: flex; gap: 20px; align-items: center;">
          <div style="background: #22c55e; width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🔄</div>
          <div>
            <h3 style="color: #15803d; margin: 0 0 5px 0; font-size: 18px;">Compare PDFs</h3>
            <p style="color: #22c55e; margin: 0; font-size: 14px;">Spot differences between document versions instantly</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 10px 30px rgba(37,99,235,0.4);">
          Explore All Features 🎯
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============== COMPETITOR COMPARISON EMAIL ==============
const getCompetitorComparisonEmailHtml = (fullName?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 24px 24px 0 0; padding: 50px 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800;">Why PDFTools? 🏆</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">See how we stack up against the competition</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 50px 40px; border-radius: 0 0 24px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
      <h2 style="color: #1f2937; margin: 0 0 30px 0;">Hey${fullName ? ` ${fullName}` : ''}! 🎯</h2>
      
      <!-- Comparison Table -->
      <div style="border-radius: 16px; overflow: hidden; border: 2px solid #e5e7eb; margin-bottom: 35px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 15px; text-align: left; color: #374151; font-size: 14px;">Feature</th>
              <th style="padding: 15px; text-align: center; color: #ef4444; font-size: 14px;">PDFTools</th>
              <th style="padding: 15px; text-align: center; color: #9ca3af; font-size: 14px;">iLovePDF</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 15px; color: #4b5563;">Daily Limit</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ Unlimited</td>
              <td style="padding: 15px; text-align: center; color: #ef4444;">2-3 files</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb; background: #fafafa;">
              <td style="padding: 15px; color: #4b5563;">File Size Limit</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ 100MB+</td>
              <td style="padding: 15px; text-align: center; color: #ef4444;">25MB free</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 15px; color: #4b5563;">Account Required</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ Optional</td>
              <td style="padding: 15px; text-align: center; color: #f97316;">Required</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb; background: #fafafa;">
              <td style="padding: 15px; color: #4b5563;">Watermarks</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ None</td>
              <td style="padding: 15px; text-align: center; color: #ef4444;">On free tier</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 15px; color: #4b5563;">Processing Speed</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ Instant</td>
              <td style="padding: 15px; text-align: center; color: #f97316;">Queue wait</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb; background: #fafafa;">
              <td style="padding: 15px; color: #4b5563;">All Tools Free</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 600;">✓ Yes</td>
              <td style="padding: 15px; text-align: center; color: #ef4444;">Premium only</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Highlight Box -->
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center; border: 2px solid #22c55e;">
        <p style="color: #166534; font-size: 18px; font-weight: 700; margin: 0;">
          💚 Save money. Save time. Use PDFTools.
        </p>
        <p style="color: #15803d; font-size: 14px; margin: 10px 0 0 0;">
          No premium plan needed – everything is free, forever.
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://pdftools.app" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 10px 30px rgba(239,68,68,0.4);">
          Try PDFTools Free 🚀
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============== PROMOTIONAL EMAIL TEMPLATE ==============
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
    const { type, email, fullName, userId, subject, content, templateData }: EmailRequest = await req.json();
    
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
      case 'welcome':
        emailSubject = "Welcome to PDFTools! 🎉 Your PDF Journey Starts Now";
        emailHtml = getWelcomeEmailHtml(fullName);
        break;
      case 'inactivity':
        emailSubject = "We Miss You! 😢 Come Back to PDFTools";
        emailHtml = getInactivityEmailHtml(fullName, templateData?.daysInactive);
        break;
      case 'daily_tip':
        emailSubject = "💡 Your Daily PDF Tip from PDFTools";
        emailHtml = getDailyTipEmailHtml(fullName, templateData?.tipIndex);
        break;
      case 'feature_highlight':
        emailSubject = "🚀 Discover Amazing Features on PDFTools";
        emailHtml = getFeatureHighlightEmailHtml(fullName);
        break;
      case 'competitor_comparison':
        emailSubject = "🏆 Why PDFTools Beats the Competition";
        emailHtml = getCompetitorComparisonEmailHtml(fullName);
        break;
      case 'promotional':
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
