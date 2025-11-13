import React, { useState } from 'react'
import { mixerSliders, mixerModes } from '../../config/mixer'
import MixerHeader from './MixerHeader'
import MixerTabs from './MixerTabs'
import MixerModeChips from './MixerModeChips'
import MixerSliderGroup from './MixerSliderGroup'

export default function MixerPanel() {
  const [activeTab, setActiveTab] = useState('calmcove')
  const [activeMode, setActiveMode] = useState('all')
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
    <div className="glass-strong p-6 animate-fade-in max-h-[85vh] overflow-y-auto scrollbar-thin">
      {/* Header - Lofizen style */}
      <MixerHeader />

      {/* Tabs */}
      <MixerTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mode chips - Lofizen style */}
      <MixerModeChips activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Slider groups - Lofizen style detailed controls */}
      <div className="mt-6 space-y-4">
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

