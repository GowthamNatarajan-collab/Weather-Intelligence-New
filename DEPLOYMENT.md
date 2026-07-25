# Cloudflare Pages Deployment Guide

Follow these steps to deploy the **Weather Intelligence** app from Google AI Studio to Cloudflare Pages.

## 1. Export to GitHub
1. In Google AI Studio, click on **Settings** (gear icon).
2. Select **Export to GitHub**.
3. Choose your repository name and complete the export process.

## 2. Connect to Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the GitHub repository you just exported.
4. **Build Settings**:
   - **Framework preset**: `Vite` (or None).
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

## 3. Configure Cloudflare Settings (CRITICAL)
For the app to run correctly on Cloudflare, you must configure both Environment Variables and Runtime settings:

### Environment Variables
1. In your Cloudflare Pages project, go to **Settings** > **Variables and Secrets**.
2. Under **Environment variables**, click **Add variable**.
3. Variable Name: `GEMINI_API_KEY`
4. Value: *[Your Google AI Studio API Key]*

### Runtime Settings (Node.js Compatibility)
The Gemini SDK requires Node.js APIs. You must enable the Node.js compatibility flag:
1. Go to **Settings** > **Functions**.
2. Find **Compatibility flags**.
3. Add the `nodejs_compat` flag for both **Production** and **Preview**.

## 4. Troubleshooting: "Unexpected token '<'" Error
If you see this error, it means the API request is returning HTML (likely your `index.html`) instead of JSON. This happens if Cloudflare cannot find or execute your functions.

**Required Checks**:
- **Functions Folder Location**: Ensure the `functions` folder is at the absolute **root of your repository**, not inside `src` or `public`.
- **Node.js compatibility**: Ensure you have added the `nodejs_compat` flag in Cloudflare settings (see Step 3).
- **Commit & Push**: Cloudflare Pages only sees code that has been **pushed to GitHub**. Make sure you have committed the `functions/api/weather.ts` file.
- **Trigger Redeploy**: If you changed settings (like flags or variables), you **MUST** push a new commit or click "Retry deployment" in Cloudflare to apply them.

**Tip**: The `/api/weather.ts` function has been refactored to use the REST API directly, making it highly compatible with the Cloudflare runtime.

## 5. Verification
Once the build completes:
1. Open the provided `*.pages.dev` URL.
2. Search for a city (e.g., "Paris").
3. Verify that:
   - Current weather and location data appear.
   - The 24h Trend chart renders.
   - The 7-Day Outlook displays.
   - **Intelligence Insights** (AI recommendations) generate successfully.
