// Background scenes configuration for CalmCove
// Add your 4K background images here
// Use multiple resolutions for optimal performance on different devices

export const backgrounds = [
  {
    id: 'bedroom-day',
    name: 'Sunlit Bedroom',
    // Replace these paths with your actual image files
    // Place images in: src/assets/images/backgrounds/
    srcLarge: '/assets/images/backgrounds/bedroom-day-large.jpg',   // 4K (3840x2160)
    srcMedium: '/assets/images/backgrounds/bedroom-day-medium.jpg', // HD (1920x1080)
    srcSmall: '/assets/images/backgrounds/bedroom-day-small.jpg',   // Tablet (1024x768)
  },
  {
    id: 'cafe-courtyard',
    name: 'Cozy Café',
    srcLarge: '/assets/images/backgrounds/cafe-courtyard-large.jpg',
    srcMedium: '/assets/images/backgrounds/cafe-courtyard-medium.jpg',
    srcSmall: '/assets/images/backgrounds/cafe-courtyard-small.jpg',
  },
  {
    id: 'city-night',
    name: 'City Night',
    srcLarge: '/assets/images/backgrounds/city-night-large.jpg',
    srcMedium: '/assets/images/backgrounds/city-night-medium.jpg',
    srcSmall: '/assets/images/backgrounds/city-night-small.jpg',
  },
  // Add more scenes by copying the object above and updating the values
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

