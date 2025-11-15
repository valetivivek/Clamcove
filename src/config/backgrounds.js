// Background scenes configuration for CalmCove
// Supports both static images and live wallpapers (videos)
// Use multiple resolutions for optimal performance on different devices

export const backgrounds = [
  // Live Wallpapers (Videos)
  {
    id: 'autumn-bedroom',
    name: 'Autumn Bedroom',
    type: 'video',
    src: '/assets/images/backgrounds/autumn-bedroom-moewalls-com.mp4',
    description: 'Cozy autumn bedroom scene',
  },
  {
    id: 'convenience-store-rain',
    name: 'Convenience Store in Rain',
    type: 'video',
    src: '/assets/images/backgrounds/convenience-store-in-the-rain-moewalls-com.mp4',
    description: 'Rainy night at convenience store',
  },
  {
    id: 'flower-shop-beachside',
    name: 'Flower Shop Beachside',
    type: 'video',
    src: '/assets/images/backgrounds/flower-shop-beachside-moewalls-com.mp4',
    description: 'Beachside flower shop',
  },
  {
    id: 'night-city-pixel',
    name: 'Night City Pixel',
    type: 'video',
    src: '/assets/images/backgrounds/night-city-pixel-moewalls-com.mp4',
    description: 'Pixel art city at night',
  },
  {
    id: 'temple-gate-autumn',
    name: 'Temple Gate Autumn',
    type: 'video',
    src: '/assets/images/backgrounds/temple-gate-amidst-autumn-mountains-moewalls-com.mp4',
    description: 'Temple gate in autumn mountains',
  },
]

// Instructions for adding backgrounds:
// 1. Create your artwork or find royalty-free images
// 2. Export in multiple resolutions:
//    - Large: 3840x2160 (4K) for high-res displays
//    - Medium: 1920x1080 (HD) for standard displays
//    - Small: 1024x768 for tablets/mobile
// 3. Place files in public/assets/images/backgrounds/
// 4. Update the paths above to match your file names
//
// Free image sources:
// - Unsplash (unsplash.com) - High-quality photos
// - Pexels (pexels.com) - Free stock photos
// - Pixabay (pixabay.com) - Free illustrations
// - Your own artwork or commissioned illustrations
//
// Recommended style: Soft anime/lofi aesthetic, cozy, warm lighting

