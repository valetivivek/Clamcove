import React, { useState, useEffect, useRef } from 'react'
import DraggablePanel from '../ui/DraggablePanel'
import { IconClose, IconAdd, IconDelete, IconNotes, IconChecklist } from '../icons/Icons'

export default function TasksNotesPanel({ isOpen, onClose, initialTab = 'tasks' }) {
  const [activeTab, setActiveTab] = useState(initialTab) // 'tasks' or 'notes'
  
  // Update activeTab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('calmcove-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('calmcove-notes')
    return saved || ''
  })
  const [taskInput, setTaskInput] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTaskText, setEditTaskText] = useState('')
  const textareaRef = useRef(null)
  const dragHandleRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('calmcove-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('calmcove-notes', notes)
  }, [notes])

  useEffect(() => {
    if (isOpen && activeTab === 'notes' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen, activeTab])

  // Tasks functions
  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: taskInput.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ])
      setTaskInput('')
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
    if (editingTaskId === id) {
      setEditingTaskId(null)
      setEditTaskText('')
    }
  }

  const startEditTask = (task) => {
    setEditingTaskId(task.id)
    setEditTaskText(task.text)
  }

  const saveEditTask = (id) => {
    if (editTaskText.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: editTaskText.trim() } : task
        )
      )
    }
    setEditingTaskId(null)
    setEditTaskText('')
  }

  const cancelEditTask = () => {
    setEditingTaskId(null)
    setEditTaskText('')
  }

  const clearCompletedTasks = () => {
    if (window.confirm('Clear all completed tasks?')) {
      setTasks(tasks.filter((task) => !task.completed))
    }
  }

  // Notes functions
  const handleExportNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calmcove-notes-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearNotes = () => {
    if (window.confirm('Clear all notes? This cannot be undone.')) {
      setNotes('')
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const activeTasks = tasks.filter(t => !t.completed).length
  const completedTasks = tasks.filter(t => t.completed).length

  if (!isOpen) return null

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[600px] max-w-[90vw] animate-scale-in" style={{ pointerEvents: 'none' }}>
        <DraggablePanel dragHandleRef={dragHandleRef} panelId="tasks">
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
                <h3 className="text-xl font-sans font-semibold text-text-primary tracking-tight">
                  {activeTab === 'tasks' ? 'Tasks' : 'Notes'}
                </h3>
                {activeTab === 'tasks' && tasks.length > 0 && (
                  <span className="text-xs font-medium text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded-full">
                    {activeTasks} active
                  </span>
                )}
                {activeTab === 'notes' && notes.length > 0 && (
                  <span className="text-xs font-medium text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded-full">
                    {notes.length} chars
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeTab === 'notes' && notes.length > 0 && (
                  <>
                    <button
                      onClick={handleExportNotes}
                      className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg"
                      aria-label="Export notes"
                    >
                      Export
                    </button>
                    <button
                      onClick={handleClearNotes}
                      className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg text-status-error hover:bg-status-error/10"
                      aria-label="Clear notes"
                    >
                      Clear
                    </button>
                  </>
                )}
                {activeTab === 'tasks' && completedTasks > 0 && (
                  <button
                    onClick={clearCompletedTasks}
                    className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg text-status-error hover:bg-status-error/10"
                    aria-label="Clear completed"
                  >
                    Clear Done
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="btn-icon w-8 h-8 rounded-lg opacity-70 hover:opacity-100" 
                  aria-label="Close"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 pt-4 border-b border-border/30">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'tasks'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`}
                style={activeTab === 'tasks' ? { backgroundColor: 'var(--theme-color)' } : {}}
              >
                <IconChecklist className="w-4 h-4" />
                Tasks
                {tasks.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'tasks' ? 'bg-white/20' : 'bg-surface-tertiary'
                  }`}>
                    {tasks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'notes'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`}
                style={activeTab === 'notes' ? { backgroundColor: 'var(--theme-color)' } : {}}
              >
                <IconNotes className="w-4 h-4" />
                Notes
              </button>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
              {activeTab === 'tasks' ? (
                <>
                  {/* Add task input */}
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Add a new task..."
                      className="input-base flex-1"
                    />
                    <button 
                      onClick={addTask} 
                      className="btn-primary w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                      aria-label="Add task"
                    >
                      <IconAdd />
                    </button>
                  </div>

                  {/* Tasks list */}
                  <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
                          <IconChecklist className="w-8 h-8 text-text-tertiary" />
                        </div>
                        <p className="text-text-tertiary text-sm font-medium">No tasks yet</p>
                        <p className="text-text-tertiary text-xs mt-1">Add your first task above</p>
                      </div>
                    ) : (
                      <>
                        {tasks.filter(t => !t.completed).length > 0 && (
                          <div className="space-y-2 mb-4">
                            {tasks.filter(t => !t.completed).map((task) => (
                              <div
                                key={task.id}
                                className="group flex items-center gap-3 p-4 rounded-xl card hover:bg-surface-tertiary transition-all duration-200"
                                style={{}}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--theme-color-30, rgba(34, 197, 94, 0.3))'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--theme-color-border, rgba(34, 197, 94, 0.3))'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(task.id)}
                                  className="w-5 h-5 rounded-md border-border bg-surface-tertiary cursor-pointer transition-all flex-shrink-0"
                                  style={{
                                    accentColor: 'var(--theme-color)',
                                  }}
                                />
                                {editingTaskId === task.id ? (
                                  <input
                                    type="text"
                                    value={editTaskText}
                                    onChange={(e) => setEditTaskText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') saveEditTask(task.id)
                                      if (e.key === 'Escape') cancelEditTask()
                                    }}
                                    onBlur={() => saveEditTask(task.id)}
                                    className="input-base flex-1 text-sm"
                                    autoFocus
                                  />
                                ) : (
                                  <span
                                    onClick={() => startEditTask(task)}
                                    className="flex-1 text-sm font-medium text-text-primary cursor-text"
                                  >
                                    {task.text}
                                  </span>
                                )}
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="btn-icon w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  aria-label="Delete task"
                                >
                                  <IconDelete />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {completedTasks > 0 && (
                          <div className="pt-4 border-t border-border/30">
                            <div className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">
                              Completed ({completedTasks})
                            </div>
                            <div className="space-y-2">
                              {tasks.filter(t => t.completed).map((task) => (
                                <div
                                  key={task.id}
                                  className="group flex items-center gap-3 p-4 rounded-xl card opacity-60 hover:opacity-100 hover:bg-surface-tertiary transition-all duration-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id)}
                                    className="w-5 h-5 rounded-md border-border bg-surface-tertiary cursor-pointer transition-all flex-shrink-0"
                                    style={{
                                      accentColor: 'var(--theme-color)',
                                    }}
                                  />
                                  <span className="flex-1 text-sm font-medium line-through text-text-tertiary">
                                    {task.text}
                                  </span>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="btn-icon w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    aria-label="Delete task"
                                  >
                                    <IconDelete />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Notes textarea */}
                  <textarea
                    ref={textareaRef}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Start writing your notes here..."
                    className="input-base flex-1 min-h-[400px] resize-none font-mono text-sm leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
                  />
                  <div className="mt-4 flex items-center justify-between text-xs text-text-tertiary">
                    <span>Auto-saved to browser</span>
                    <span>{notes.length} characters</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </DraggablePanel>
      </div>
    </>
  )
}

