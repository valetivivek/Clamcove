import React from 'react'

const tabs = [
  { id: 'calmcove', label: 'CalmCove' },
  { id: 'external', label: 'External' },
]

export default function MixerTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 mb-4 border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
            activeTab === tab.id
              ? 'text-primaryAccent'
              : 'text-textPrimary-muted hover:text-textPrimary'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryAccent rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

