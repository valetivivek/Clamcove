import React, { useRef } from 'react'
import DraggablePanel from '../ui/DraggablePanel'
import BackgroundSelector from './BackgroundSelector'
import { IconClose } from '../icons/Icons'

export default function BackgroundPanel({ isOpen, onClose, currentBackgroundId, onBackgroundChange }) {
  const dragHandleRef = useRef(null)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[600px] max-w-[90vw] animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef} panelId="background">
          <div className="panel-strong max-h-[85vh] flex flex-col overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Drag handle - header area */}
            <div 
              ref={dragHandleRef}
              className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--theme-color-60, rgba(34, 197, 94, 0.6))' }}
                ></div>
                <h3 className="text-xl font-sans font-semibold text-text-primary tracking-tight">Backgrounds</h3>
              </div>
              <button 
                onClick={onClose} 
                className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100" 
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar flex-1">
              <BackgroundSelector
                currentBackgroundId={currentBackgroundId}
                onSelect={onBackgroundChange}
              />
            </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

