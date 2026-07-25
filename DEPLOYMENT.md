# Cloudflare Pages Deployment Guide (FIXED)

The errors you encountered (`Unexpected token '<'` and `Unknown command: "wrangler"`) are due to using **Cloudflare Workers** instead of **Cloudflare Pages**. This app is designed for **Pages**.

## 1. Correct Dashboard Selection
Do **NOT** create a "Worker". Instead:
1. Go to **Workers & Pages** in your Cloudflare Dashboard.
2. Click **Create application**.
3. Select the **Pages** tab (this is critical).
4. Click **Connect to Git** and select your repository.

## 2. Build Configuration (CRITICAL)
Use exactly these settings in the Cloudflare Dashboard:
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`
- **Deploy command**: (Leave this **EMPTY**. Cloudflare Pages deploys automatically from the build output).

## 3. Resolve "Unexpected token '<'" (HTML instead of JSON)
If you see this error, Cloudflare is serving `index.html` because it can't find your API.
1. Ensure the `functions` folder is at the **root of your repository** (same level as `package.json`).
2. **Compatibility Flag**: You **MUST** enable Node.js support for the Gemini API:
   - Go to **Settings** > **Functions** > **Compatibility flags**.
   - Add `nodejs_compat` to both **Production** and **Preview**.

## 4. Environment Variables
1. Go to **Settings** > **Variables and Secrets**.
2. Add `GEMINI_API_KEY` with your key from Google AI Studio.

## 5. Why "npm wrangler deploy" failed
You should not put `npm wrangler deploy` in the dashboard's "Build command" or "Deploy command" fields. Cloudflare Pages handles the deployment internally once the `npm run build` finishes.

**Final Step**: After updating these settings in the Cloudflare dashboard, you **must** trigger a new deployment by pushing a change to GitHub or clicking **Retry deployment** in the Cloudflare dashboard.
