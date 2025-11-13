import React from 'react'

// Icon components for slider groups
const IconMusic = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
)

const IconWave = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
)

const IconSound = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
)

const IconKeyboard = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
)

const IconRain = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
)

const IconCafe = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const iconMap = {
  music: IconMusic,
  wave: IconWave,
  sound: IconSound,
  keyboard: IconKeyboard,
  rain: IconRain,
  cafe: IconCafe,
}

export default function MixerSliderGroup({ slider, value, onChange, onToggle }) {
  const Icon = slider.icon ? iconMap[slider.icon] : null
  const isMuted = value === 0

  return (
    <div className="flex items-center gap-4">
      {/* Left label */}
      <div className="w-32 text-sm text-textPrimary-muted font-medium">
        {slider.label}
      </div>

      {/* Center slider - Lofizen style with dots */}
      <div className="flex-1 relative">
        <div className="relative h-2">
          {/* Active fill bar */}
          <div
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-primaryAccent to-primaryAccent-light pointer-events-none transition-all duration-200"
            style={{ width: `${((value - slider.min) / (slider.max - slider.min)) * 100}%` }}
          />
          {/* Dotted background track */}
          <div className="absolute top-0 left-0 right-0 h-2 rounded-full bg-surfaceDark opacity-50 pointer-events-none"
               style={{
                 backgroundImage: 'repeating-linear-gradient(to right, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 2px, transparent 2px, transparent 6px)'
               }} />
          {/* Slider input */}
          <input
            type="range"
            min={slider.min}
            max={slider.max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="slider-dotted absolute top-0 left-0 right-0 w-full"
          />
        </div>
      </div>

      {/* Right side - value and icon */}
      <div className="flex items-center gap-2 w-20 justify-end">
        <span className="text-xs text-textPrimary-dim font-mono tabular-nums w-8 text-right">
          {value}%
        </span>
        {Icon && (
          <button
            onClick={onToggle}
            className={`btn-icon w-8 h-8 ${isMuted ? 'opacity-50' : ''}`}
            aria-label={`Toggle ${slider.label}`}
          >
            <Icon />
          </button>
        )}
      </div>
    </div>
  )
}

