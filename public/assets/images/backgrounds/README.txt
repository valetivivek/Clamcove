VIDEO WALLPAPERS SETUP
======================

The video wallpapers are excluded from git due to their large file sizes (total ~419MB).

To use the live wallpapers, place your video files in this directory:

Required files:
- autumn-bedroom-moewalls-com.mp4 (28MB)
- convenience-store-in-the-rain-moewalls-com.mp4 (97MB)
- flower-shop-beachside-moewalls-com.mp4 (8.9MB)
- night-city-pixel-moewalls-com.mp4 (175MB)
- temple-gate-amidst-autumn-mountains-moewalls-com.mp4 (110MB)

Alternative options:
1. Compress the videos using HandBrake or FFmpeg to reduce file size
2. Use Git LFS (Large File Storage) if you need version control
3. Host videos on a CDN and update paths in src/config/backgrounds.js
4. Use smaller resolution videos (1080p instead of 4K)

The app will work without these files - it will just show the fallback gradient background.

