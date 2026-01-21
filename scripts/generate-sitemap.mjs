import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.pdfhubs.site'; // Official URL from index.html

const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/history', priority: '0.7', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
];

const generateSitemap = () => {
    // 1. Extract Tools
    const toolsPath = path.resolve(__dirname, '../src/components/ToolsGrid.tsx');
    const toolsContent = fs.readFileSync(toolsPath, 'utf-8');
    const toolRegex = /href:\s*"(tool\/[^"]+)"/g;
    const toolUrls = [];
    let match;
    while ((match = toolRegex.exec(toolsContent)) !== null) {
        toolUrls.push(`/${match[1]}`);
    }

    // 2. Extract Blog Posts
    const blogPath = path.resolve(__dirname, '../src/data/blogPosts.ts');
    const blogContent = fs.readFileSync(blogPath, 'utf-8');
    const blogRegex = /slug:\s*'([^']+)'/g;
    const blogUrls = [];
    while ((match = blogRegex.exec(blogContent)) !== null) {
        blogUrls.push(`/blog/${match[1]}`);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Static Pages -->
    ${staticRoutes.map(route => `
    <url>
        <loc>${BASE_URL}${route.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}

    <!-- PDF Tools -->
    ${toolUrls.map(url => `
    <url>
        <loc>${BASE_URL}${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}

    <!-- Blog Posts -->
    ${blogUrls.map(url => `
    <url>
        <loc>${BASE_URL}${url}</loc>
        <lastmod>2025-01-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}

</urlset>`;

    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, sitemap.trim());
    console.log(`✅ Sitemap updated at ${publicPath}`);
};

generateSitemap();
