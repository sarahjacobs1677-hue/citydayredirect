# Redirect App

A React application that redirects to mm.ii.com with comprehensive bot protection.

## Features

- ✅ Automatic redirect to mm.ii.com
- ✅ Client-side bot detection
- ✅ Server-side bot detection via Vercel serverless function
- ✅ Blocks common crawlers and bots
- ✅ Vercel deployment ready

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Vercel will automatically detect the configuration and deploy

The app is configured with:
- `vercel.json` for routing and headers
- Serverless function at `/api/check-bot` for server-side bot detection
- Meta tags and headers to prevent indexing

## Bot Protection

The app uses multiple layers of bot detection:
- User-Agent pattern matching
- Browser indicator checks
- Server-side validation
- Request header analysis

