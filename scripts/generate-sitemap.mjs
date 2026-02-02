import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.pdfhubs.site'; // Official URL from index.html

const staticRoutes = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
];

// Top 4 most important tools ONLY
const topTools = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'pdf-to-word',
    'edit-pdf'
];

const generateSitemap = () => {
    // 1. Filter Top Tools
    const toolUrls = topTools.map(id => `/tool/${id}`);

    // 2. Extract Top 2 Blog Posts
    const blogPath = path.resolve(__dirname, '../src/data/blogPosts.ts');
    let blogUrls = [];
    try {
        const blogContent = fs.readFileSync(blogPath, 'utf-8');
        const blogRegex = /slug:\s*'([^']+)'/g;
        let match;
        while ((match = blogRegex.exec(blogContent)) !== null && blogUrls.length < 2) {
            blogUrls.push(`/blog/${match[1]}`);
        }
    } catch (e) {
        console.warn('Could not read blog posts for sitemap');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Primary Pages (Max 3) -->
    ${staticRoutes.map(route => `
    <url>
        <loc>${BASE_URL}${route.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}

    <!-- Top Tools (Max 5) -->
    ${toolUrls.map(url => `
    <url>
        <loc>${BASE_URL}${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}

    <!-- Top Blog Content (Max 2) -->
    ${blogUrls.map(url => `
    <url>
        <loc>${BASE_URL}${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}

</urlset>`;

    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, sitemap.trim());
    console.log(`✅ Sitemap optimized at ${publicPath} (Total URLs: ${staticRoutes.length + toolUrls.length + blogUrls.length})`);
};

generateSitemap();
