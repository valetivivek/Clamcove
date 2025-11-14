// Mixer slider configuration
// Each slider group represents a sound layer that can be controlled independently

export const mixerSliders = [
  {
    id: 'volume',
    label: 'Master Volume',
    min: 0,
    max: 100,
    defaultValue: 70,
    icon: null,
  },
  {
    id: 'musicVolume',
    label: 'Music Volume',
    min: 0,
    max: 100,
    defaultValue: 60,
    icon: null,
  },
  {
    id: 'whiteNoise',
    label: 'White Noise',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'sound',
  },
  {
    id: 'brownNoise',
    label: 'Brown Noise',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'sound',
  },
  {
    id: 'rain',
    label: 'Rain',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'rain',
  },
  {
    id: 'cafe',
    label: 'Café',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'cafe',
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    min: 0,
    max: 100,
    defaultValue: 50,
    icon: 'keyboard',
  },
]

// Mode chips for filtering/categorizing sounds
export const mixerModes = [
  { id: 'chill', label: 'Chill' },
  { id: 'energy', label: 'Energy' },
  { id: 'focus', label: 'Focus' },
  { id: 'all', label: 'All' },
]

