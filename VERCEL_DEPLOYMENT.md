# Vercel Deployment Guide

This project is configured for optimal Vercel deployment with cost-saving measures.

## 🚀 Quick Deploy

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Vite configuration

2. **Build Settings (Auto-detected):**
   - Framework Preset: Vite
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm ci` (faster, uses lock file)

## 💰 Cost-Saving Features

### 1. Smart Build Ignoring
The `ignoreCommand` in `vercel.json` prevents builds when:
- Only documentation files (`.md`) are changed
- Only `.gitignore` or `.vercelignore` are changed
- No source code files are modified

**Builds will trigger only when:**
- Files in `src/`, `components/`, `hooks/` are changed
- Configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`) are modified
- Source files (`App.tsx`, `index.tsx`, `constants.ts`, `types.ts`) are updated

### 2. Optimized Install Command
- Uses `npm ci` instead of `npm install` for faster, reproducible builds
- Leverages `package-lock.json` for exact dependency versions

### 3. Caching Headers
- Static assets are cached for 1 year
- Reduces bandwidth and improves performance

## 📋 Manual Deployment Checklist

Before deploying, ensure:
- [ ] All environment variables are set in Vercel dashboard
- [ ] Build passes locally (`npm run build`)
- [ ] No TypeScript errors (`npm run build` should complete successfully)
- [ ] `.vercelignore` excludes unnecessary files

## 🔧 Environment Variables

If your app uses environment variables (like `GEMINI_API_KEY`), add them in:
**Vercel Dashboard → Project Settings → Environment Variables**

## 🛠️ Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Ensure all dependencies are in `package.json`

### Unnecessary Builds
- Check if `ignoreCommand` is working correctly
- Review changed files in git history
- Verify `.vercelignore` is properly configured

### Build Timeouts
- Optimize dependencies (remove unused packages)
- Check for large files in repository
- Review build logs for bottlenecks

## 📝 Notes

- **Branch Deployments:** Vercel automatically deploys all branches
- **Preview Deployments:** Every PR gets a preview URL
- **Production:** Only `main` branch deploys to production (configurable)

## 🔒 Security

- Never commit `.env` files
- Use Vercel's environment variables for secrets
- `.vercelignore` ensures sensitive files aren't included in builds

