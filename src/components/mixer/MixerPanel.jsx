import React, { useState } from 'react'
import { mixerSliders, mixerModes } from '../../config/mixer'
import MixerHeader from './MixerHeader'
import MixerModeChips from './MixerModeChips'
import MixerSliderGroup from './MixerSliderGroup'
import { usePlayer } from '../player/PlayerContext'

export default function MixerPanel({ onClose }) {
  const [activeMode, setActiveMode] = useState('chill')
  const { currentTrack } = usePlayer()
  const [sliderValues, setSliderValues] = useState(() => {
    const initial = {}
    mixerSliders.forEach((slider) => {
      initial[slider.id] = slider.defaultValue
    })
    return initial
  })

  const handleSliderChange = (sliderId, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [sliderId]: value,
    }))
  }

  const handleToggle = (sliderId) => {
    const currentValue = sliderValues[sliderId]
    if (currentValue > 0) {
      handleSliderChange(sliderId, 0)
    } else {
      const slider = mixerSliders.find((s) => s.id === sliderId)
      handleSliderChange(sliderId, slider?.defaultValue || 50)
    }
  }

  return (
    <div className="matte-panel w-full max-h-[50vh] overflow-y-auto no-scrollbar" style={{ pointerEvents: 'auto' }}>
      {/* Header */}
      <MixerHeader onClose={onClose} />


      {/* Mode chips */}
      <MixerModeChips activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Track info */}
      <div className="mb-2 px-3">
        <div className="text-[10px] text-textPrimary-muted mb-0.5">
          <span className="tabular-nums">00:00</span> / <span className="tabular-nums">01:49</span>
        </div>
        <div className="text-xs font-medium text-textPrimary">{currentTrack?.title || 'Color Backdrop'}</div>
        <div className="text-[10px] text-textPrimary-dim">{currentTrack?.artist || 'Premium Music Odyssey'}</div>
      </div>

      {/* Slider groups */}
      <div className="space-y-2 px-3 pb-3">
        {mixerSliders.map((slider) => (
          <MixerSliderGroup
            key={slider.id}
            slider={slider}
            value={sliderValues[slider.id]}
            onChange={(value) => handleSliderChange(slider.id, value)}
            onToggle={() => handleToggle(slider.id)}
          />
        ))}
      </div>
    </div>
  )
}

