import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Google Service Account JSON key
const KEY_FILE = path.join(__dirname, '../service-account.json');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ Error: service-account.json not found in the project root.');
    console.log('Follow these steps:');
    console.log('1. Go to Google Cloud Console');
    console.log('2. Create a Service Account and download the JSON key.');
    console.log('3. Rename it to "service-account.json" and place it in the root folder.');
    process.exit(1);
}

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing('v3');

async function getUrlsFromSitemap() {
    const content = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const urls = [];
    const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    return urls;
}

async function indexUrl(url) {
    try {
        const authClient = await auth.getClient();
        const result = await indexing.urlNotifications.publish({
            auth: authClient,
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });
        console.log(`✅ Indexed: ${url}`);
        return result;
    } catch (error) {
        console.error(`❌ Failed to index ${url}:`, error.message);
    }
}

async function runIndexer() {
    console.log('🚀 Starting Google Indexing API push...');
    const urls = await getUrlsFromSitemap();

    if (urls.length === 0) {
        console.log('⚠️ No URLs found in sitemap.');
        return;
    }

    console.log(`Found ${urls.length} URLs in sitemap.`);

    // Google has a quota (typically 200 URLs per day for most projects)
    // We'll process them sequentially to avoid overwhelming the API
    for (const url of urls) {
        await indexUrl(url);
        // Tiny delay to be safe
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('🏁 Indexing request sequence finished.');
}

runIndexer().catch(err => console.error('FATAL ERROR:', err));
