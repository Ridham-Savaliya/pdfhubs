# 🚀 Google Indexing API Setup Guide

This guide will help you set up the Google Indexing API to get your pages indexed in **minutes** instead of days.

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **"Select a project"** at the top and then **"New Project"**.
3. Name it `PDFHubs-Indexing` (or anything you like) and click **Create**.

## Step 2: Enable the Indexing API
1. In the sidebar, go to **APIs & Services** > **Enabled APIs & Services**.
2. Click **"+ ENABLE APIS AND SERVICES"** at the top.
3. Search for **"Indexing API"**.
4. Click on it and then click **"Enable"**.

## Step 3: Create a Service Account & Key
1. Go to **APIs & Services** > **Credentials**.
2. Click **"+ CREATE CREDENTIALS"** > **Service Account**.
3. Name it `indexer` and click **Create and Continue**.
4. For the Role, select **Owner** (or Search Console Editor). Click **Continue** then **Done**.
5. Find your new service account in the list and click the **pencil icon (Edit)**.
6. Go to the **"Keys"** tab at the top.
7. Click **Add Key** > **Create new key**.
8. Select **JSON** and click **Create**.
9. **CRITICAL:** A file will download. Rename it to `service-account.json` and move it to the **root folder** of this project (`c:\Users\Ridham Savaliya\Desktop\PdfHubs\pdf-edit-pro\`).

## Step 4: Add the Service Account to Google Search Console
1. Copy the email address of your new service account (looks like `indexer@your-project.iam.gserviceaccount.com`).
2. Go to [Google Search Console](https://search.google.com/search-console).
3. Select your property: `https://pdfhubs.site/`.
4. Go to **Settings** > **Users and Permissions**.
5. Click **"Add User"**.
6. Paste the service account email and set the Permission to **Owner**. (This is required for the Indexing API to work on your behalf).

## Step 5: Run the Indexer
Once the `service-account.json` file is in your project root, simply run:
```bash
npm run index
```

### 💡 Pro Tip
Run this command every time you deploy a new version or add a blog post. It will instantly tell Google to come crawl your site!
