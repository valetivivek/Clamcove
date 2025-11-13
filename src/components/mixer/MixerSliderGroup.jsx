import React from 'react'

// Visualizer component - vertical bars
const Visualizer = ({ value, max = 100, isGreen = false }) => {
  const bars = 20
  const barWidth = 2
  const barGap = 1.5
  const maxHeight = 16

  return (
    <div className="flex items-end gap-0.5 h-4" style={{ width: `${bars * (barWidth + barGap)}px` }}>
      {Array.from({ length: bars }).map((_, i) => {
        const barValue = Math.random() * value * 0.8 + value * 0.2
        const height = (barValue / max) * maxHeight
        const isActive = (i / bars) * 100 < value
        return (
          <div
            key={i}
            className={`transition-all duration-150 ${
              isActive 
                ? isGreen 
                  ? 'bg-green-500' 
                  : 'bg-white' 
                : 'bg-white/20'
            }`}
            style={{
              width: `${barWidth}px`,
              height: `${Math.max(2, height)}px`,
              minHeight: '2px',
            }}
          />
        )
      })}
    </div>
  )
}

// Toggle switch component
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        checked ? 'bg-green-500' : 'bg-white/20'
      }`}
      aria-label="Toggle"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function MixerSliderGroup({ slider, value, onChange, onToggle }) {
  const isMuted = value === 0
  const isVolume = slider.id === 'volume'
  const isMusic = slider.id === 'music'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-textPrimary-muted font-medium">{slider.label}:</span>
        {isVolume && <ToggleSwitch checked={!isMuted} onChange={onToggle} />}
      </div>

      <div className="flex items-center gap-4">
        {/* Visualizer bars */}
        <div className="flex-1">
          <Visualizer value={value} isGreen={isVolume} />
        </div>

        {/* Toggle or play button */}
        <div className="flex items-center gap-2">
          {isMusic ? (
            <button
              onClick={onToggle}
              className="w-6 h-6 flex items-center justify-center text-textPrimary hover:text-white transition-colors"
              aria-label="Play/Pause"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : slider.id === 'rain' || slider.id === 'whiteNoise' ? (
            <button
              onClick={onToggle}
              className="w-6 h-6 flex items-center justify-center text-textPrimary-muted hover:text-white transition-colors"
              aria-label="Settings"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Hidden slider for actual control - positioned over visualizer */}
      <div className="relative -mt-4" style={{ pointerEvents: 'auto' }}>
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-matte w-full h-4"
          style={{ pointerEvents: 'auto' }}
          aria-label={slider.label}
        />
      </div>
    </div>
  )
}

