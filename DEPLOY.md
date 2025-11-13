# CalmCove - Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

That's it! Vercel will automatically:
- Install dependencies (`npm install`)
- Build the project (`npm run build`)
- Deploy to production

## Project Structure

```
public/
  assets/
    images/
      backgrounds/    # Place your background images here
    audio/            # Place your audio files here
src/
  components/         # React components
  config/            # Configuration files
  styles/            # Global styles
```

## Adding Assets

### Background Images
Place your background images in `public/assets/images/backgrounds/`:
- `bedroom-day-small.jpg` (1024x768)
- `bedroom-day-medium.jpg` (1920x1080)
- `bedroom-day-large.jpg` (3840x2160)

### Audio Files
Place your audio files in `public/assets/audio/`:
- `track-one.mp3`
- `track-two.mp3`
- etc.

Update the paths in:
- `src/config/backgrounds.js` for backgrounds
- `src/config/tracks.js` for audio tracks

## Environment Variables

No environment variables required for basic deployment.

## Build Configuration

The project uses:
- **Framework**: Vite + React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher (auto-detected by Vercel)

## Custom Domain

After deployment, you can add a custom domain in Vercel project settings.

