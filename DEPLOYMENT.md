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

## 3. Configure Environment Variables (CRITICAL)
For the AI recommendations to work, you must provide your Gemini API key to the Cloudflare environment:
1. In your Cloudflare Pages project, go to **Settings** > **Variables and Secrets**.
2. Under **Environment variables**, click **Add variable**.
3. Variable Name: `GEMINI_API_KEY`
4. Value: *[Your Google AI Studio API Key]*
5. **Important**: You must trigger a **new deployment** after adding this variable for it to take effect.

## 4. Verification
Once the build completes:
1. Open the provided `*.pages.dev` URL.
2. Search for a city (e.g., "Paris").
3. Verify that:
   - Current weather and location data appear.
   - The 24h Trend chart renders.
   - The 7-Day Outlook displays.
   - **Intelligence Insights** (AI recommendations) generate successfully.
