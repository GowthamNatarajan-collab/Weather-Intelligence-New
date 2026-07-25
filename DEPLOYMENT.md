# Cloudflare Pages Deployment Guide

Follow these steps to deploy the **Weather Intelligence** app. **Important**: You must use **Cloudflare Pages**, not a standalone Worker.

## 1. Export to GitHub
1. In Google AI Studio, click on **Settings** (gear icon) > **Export to GitHub**.
2. Complete the export to a new or existing repository.

## 2. Connect to Cloudflare Pages (NOT Workers)
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** (Select the Pages tab).
3. Click **Connect to Git** and select your repository.
4. **Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`  <-- **CRITICAL: DO NOT LEAVE THIS EMPTY**
5. Click **Save and Deploy**.

## 3. Critical Settings (Required for API to work)
After the first deployment starts, go to your project settings:

### Runtime Settings
1. Go to **Settings** > **Functions** > **Compatibility flags**.
2. Add `nodejs_compat` for both **Production** and **Preview**.

### Environment Variables
1. Go to **Settings** > **Variables and Secrets**.
2. Add a variable:
   - Name: `GEMINI_API_KEY`
   - Value: *[Your Google AI Studio API Key]*

## 4. Trigger a Redeploy
Cloudflare only applies flags and variables on a **new build**. 
1. Go to the **Deployments** tab.
2. Click the three dots `...` next to your latest deployment.
3. Select **Retry deployment**.

## 5. Verification
Your app will be available at `https://[project-name].pages.dev`.
- If you see `index.html` content instead of weather data, double-check that the `functions` folder is at the root of your GitHub repo.
- If you see a "Node.js" error, check that the `nodejs_compat` flag is active.
