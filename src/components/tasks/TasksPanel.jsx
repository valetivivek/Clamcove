import React, { useState, useEffect, useRef } from 'react'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose, IconAdd, IconDelete } from '../icons/Icons'

export default function TasksPanel({ isOpen, onClose }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('calmcove-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const dragHandleRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('calmcove-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
        },
      ])
      setInputValue('')
    }
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 animate-scale-in">
        <DraggablePanel dragHandleRef={dragHandleRef}>
          <div className="glass-strong max-h-[85vh] flex flex-col overflow-hidden">
            {/* Drag handle - header area */}
            <div 
              ref={dragHandleRef}
              className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-glass-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-coolBlue/60"></div>
                <h3 className="text-xl font-display font-semibold text-textPrimary tracking-tight">Tasks</h3>
                {tasks.length > 0 && (
                  <span className="text-xs font-medium text-textPrimary-dim bg-glass-soft px-2 py-0.5 rounded-full">
                    {tasks.filter(t => !t.completed).length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100" aria-label="Close">
                <IconClose />
              </button>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="input-base flex-1 text-sm py-3 px-4 rounded-xl"
                />
                <button 
                  onClick={addTask} 
                  className="btn-primary w-12 h-12 rounded-xl flex-shrink-0 shadow-medium hover:shadow-glow"
                  aria-label="Add task"
                >
                  <IconAdd />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-soft flex items-center justify-center">
                      <svg className="w-8 h-8 text-textPrimary-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-textPrimary-dim text-sm font-medium">No tasks yet</p>
                    <p className="text-textPrimary-dim text-xs mt-1">Add your first task above</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-3 p-4 rounded-xl bg-glass-soft border border-glass-border/50 hover:bg-glass-medium hover:border-coolBlue/20 transition-all duration-200 ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-5 h-5 rounded-md border-glass-border bg-glass-medium text-coolBlue focus:ring-2 focus:ring-coolBlue/30 cursor-pointer transition-all"
                      />
                      <span
                        className={`flex-1 text-sm font-medium ${
                          task.completed ? 'line-through text-textPrimary-dim' : 'text-textPrimary'
                        }`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn-icon w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete task"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

