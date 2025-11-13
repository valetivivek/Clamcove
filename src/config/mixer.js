// Mixer slider configuration
// Each slider group represents a sound layer that can be controlled independently

export const mixerSliders = [
  {
    id: 'volume',
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 70,
    icon: null, // No icon for main volume
  },
  {
    id: 'music',
    label: 'Music',
    min: 0,
    max: 100,
    defaultValue: 60,
    icon: 'music',
  },
  {
    id: 'static',
    label: 'Static Sounds',
    min: 0,
    max: 100,
    defaultValue: 40,
    icon: 'wave',
  },
  {
    id: 'whiteNoise',
    label: 'White Noise',
    min: 0,
    max: 100,
    defaultValue: 0,
    icon: 'sound',
  },
  {
    id: 'brownNoise',
    label: 'Brown Noise',
    min: 0,
    max: 100,
    defaultValue: 0,
    icon: 'sound',
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    min: 0,
    max: 100,
    defaultValue: 0,
    icon: 'keyboard',
  },
  {
    id: 'rain',
    label: 'Rain',
    min: 0,
    max: 100,
    defaultValue: 0,
    icon: 'rain',
  },
  {
    id: 'cafe',
    label: 'Café',
    min: 0,
    max: 100,
    defaultValue: 0,
    icon: 'cafe',
  },
]

// Mode chips for filtering/categorizing sounds
export const mixerModes = [
  { id: 'all', label: 'All' },
  { id: 'chill', label: 'Chill' },
  { id: 'energy', label: 'Energy' },
  { id: 'jazzy', label: 'Jazzy' },
]

