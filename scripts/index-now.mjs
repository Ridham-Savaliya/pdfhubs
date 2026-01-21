import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'www.pdfhubs.site';
const KEY = '8cd9e9f1a0b34e5c8a9f2e3d4c5b6a71'; // Placeholder key
const KEY_LOCATION = `https://${HOST}/indexnow-key.txt`;

const getUrlsFromSitemap = () => {
    const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
        console.error('❌ Sitemap not found. Run generate-sitemap first.');
        return [];
    }
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
    const urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    return urls;
};

const submitToIndexNow = async () => {
    const urls = getUrlsFromSitemap();
    if (urls.length === 0) return;

    try {
        const response = await axios.post('https://api.indexnow.org/IndexNow', {
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList: urls
        });

        if (response.status === 200) {
            console.log('✅ IndexNow submission successful!');
        } else {
            console.error('❌ IndexNow submission failed:', response.status);
        }
    } catch (error) {
        console.error('❌ Error submitting to IndexNow:', error.message);
    }
};

submitToIndexNow();
