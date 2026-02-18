# Task Mangement (Vite + React)

## Local
1. Copy `.env.example` to `.env.local` and fill Firebase values.
2. `npm i`
3. `npm run dev`

## Build
`npm run build` → output in `dist/`

## Deploy on Vercel
1. Push this repo to GitHub (or import directly in Vercel).
2. Create a new Vercel project and select this repository.
3. Framework preset: Vite
4. Environment Variables (Project Settings → Environment Variables):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_FIREBASE_MEASUREMENT_ID (optional)
5. Build Command: `npm run build`  
   Output Directory: `dist`
6. Deploy

Notes:
- App uses HashRouter, so no special rewrites are needed for routes.
- See `vercel.json` for basic headers and build config.
