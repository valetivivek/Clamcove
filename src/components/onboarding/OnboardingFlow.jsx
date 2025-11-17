import React, { useState, useEffect } from 'react'
import { IconClose } from '../icons/Icons'

/**
 * Welcome modal matching lofizen.co design
 * Two-column layout: gradient left, content right
 */
export default function OnboardingFlow({ onComplete, onStartFocus }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show onboarding in a new tab/browser session
    // sessionStorage resets when tab/browser is closed, so this ensures
    // it only shows when opening in a new tab or new browser
    const hasSeenThisSession = sessionStorage.getItem('calmcove_session_started')
    
    if (!hasSeenThisSession) {
      setIsVisible(true)
      sessionStorage.setItem('calmcove_session_started', 'true')
    }
  }, [])

  const handleComplete = () => {
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  const handleStartFocus = () => {
    handleComplete()
    // Just close the modal, don't open pomodoro timer
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="panel-strong max-w-5xl w-full mx-4 animate-scale-in overflow-hidden flex">
        {/* Left Section - Gradient with wavy lines (matching lofizen) */}
        <div className="w-1/3 bg-gradient-to-b from-white/5 via-accent-primary/20 to-accent-primary/30 p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Wavy lines overlay */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 200 400" preserveAspectRatio="none">
              <path d="M0,0 Q50,30 100,0 T200,0" fill="none" stroke="white" strokeWidth="2" opacity="0.4"/>
              <path d="M0,80 Q50,110 100,80 T200,80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
              <path d="M0,160 Q50,190 100,160 T200,160" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
              <path d="M0,240 Q50,270 100,240 T200,240" fill="none" stroke="white" strokeWidth="1" opacity="0.15"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="text-sm font-medium text-text-primary mb-2">
              Ready for a more <span className="bg-accent-primary/30 px-2 py-0.5 rounded text-accent-primary font-semibold">productive</span> Monday?
            </div>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="flex-1 p-8 bg-glass-medium relative">
          <button
            onClick={handleComplete}
            className="absolute top-6 right-6 btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100"
            aria-label="Close onboarding"
          >
            <IconClose />
          </button>
          
          <h2 id="onboarding-title" className="text-2xl font-semibold text-text-primary mb-6">
            Welcome to <span className="text-accent-primary">CalmCove</span>!
          </h2>
          
          <div className="space-y-4 mb-8 text-sm text-text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p>Press <span className="text-accent-primary font-medium">[Play]</span> from the control bar on the bottom and enjoy LoFi beats for Focus</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                </svg>
              </div>
              <p>Press <span className="text-accent-primary font-medium">[Mixer]</span> to change genre and add in ambient sounds</p>
            </div>
          </div>
          
          <div className="text-xs text-text-tertiary mb-6">
            Create an account to unlock more productivity features:
          </div>
          
          <div className="flex gap-3 mb-6">
            <button className="w-12 h-12 rounded-full bg-glass-soft border border-glass-border flex items-center justify-center hover:bg-glass-medium transition-colors">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-glass-soft border border-glass-border flex items-center justify-center hover:bg-glass-medium transition-colors">
              <span className="text-lg font-bold text-text-primary">G</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-glass-soft border border-glass-border flex items-center justify-center hover:bg-glass-medium transition-colors">
              <svg className="w-5 h-5 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </button>
          </div>
          
          <div className="text-[10px] text-text-tertiary mb-6">
            By registering you agree to our terms and conditions
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleStartFocus}
              className="btn-primary py-3 px-8 rounded-xl text-base font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
