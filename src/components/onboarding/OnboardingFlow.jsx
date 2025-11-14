import React, { useState, useEffect } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import { IconClose, IconPlay } from '../icons/Icons'

/**
 * First-run onboarding flow
 * Two-step lightweight setup with "Start a Focus Session" CTA
 */
export default function OnboardingFlow({ onComplete, onStartFocus }) {
  const { settings } = useSettings()
  const [step, setStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('calmcove_onboarding_complete')
    if (!hasCompletedOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('calmcove_onboarding_complete', 'true')
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  const handleStartFocus = () => {
    handleComplete()
    if (onStartFocus) onStartFocus()
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="panel-strong max-w-lg w-full mx-4 animate-scale-in">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></div>
              <button
                onClick={handleComplete}
                className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
                aria-label="Skip onboarding"
              >
                <IconClose />
              </button>
            </div>
            
            <h2 id="onboarding-title" className="text-2xl font-sans font-semibold text-text-primary mb-3">
              Welcome to CalmCove
            </h2>
            <p className="text-base text-text-secondary mb-8 leading-relaxed">
              Your zen corner for deep focus and productivity. Let's set up your perfect focus environment in just two quick steps.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="btn-primary flex-1 py-3 px-6 rounded-xl text-base font-medium"
              >
                Get Started
              </button>
              <button
                onClick={handleComplete}
                className="btn-secondary flex-1 py-3 px-6 rounded-xl text-base font-medium"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quick Setup */}
        {step === 2 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/60"></div>
                <span className="text-xs text-text-tertiary">Step 2 of 2</span>
              </div>
              <button
                onClick={handleComplete}
                className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>
            
            <h2 className="text-2xl font-sans font-semibold text-text-primary mb-3">
              Quick Setup
            </h2>
            <p className="text-base text-text-secondary mb-6 leading-relaxed">
              Choose your preferred focus style. You can always change this later in settings.
            </p>
            
            <div className="space-y-3 mb-8">
              <button
                onClick={handleStartFocus}
                className="w-full p-4 rounded-xl bg-surface-secondary border border-border hover:bg-surface-tertiary hover:border-accent-primary/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center group-hover:bg-accent-primary/30 transition-colors">
                    <IconPlay className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">Start a Focus Session</div>
                    <div className="text-xs text-text-tertiary mt-0.5">Begin with default settings</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={handleComplete}
                className="w-full p-4 rounded-xl bg-surface-secondary border border-border hover:bg-surface-tertiary hover:border-accent-primary/30 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">Customize First</div>
                    <div className="text-xs text-text-tertiary mt-0.5">Explore settings and preferences</div>
                  </div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setStep(1)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

