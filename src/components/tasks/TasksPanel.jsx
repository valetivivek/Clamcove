import React, { useState, useEffect } from 'react'

export default function TasksPanel({ isOpen, onClose }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('calmcove-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')

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

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 animate-slide-in-right">
        <div className="glass-strong p-6 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-textPrimary">Tasks</h3>
            <button onClick={onClose} className="btn-icon w-8 h-8" aria-label="Close">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add task..."
              className="input-base flex-1 text-sm"
            />
            <button onClick={addTask} className="btn-icon bg-primaryAccent text-white hover:bg-primaryAccent-light">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-textPrimary-dim py-8 text-sm">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-surfaceDark hover:bg-surfaceDark-hover transition-colors ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-white/20 bg-surfaceDark text-primaryAccent focus:ring-2 focus:ring-primaryAccent"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      task.completed ? 'line-through text-textPrimary-dim' : 'text-textPrimary'
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-icon w-7 h-7"
                    aria-label="Delete task"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

