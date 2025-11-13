import React, { useState, useEffect } from 'react'

export default function TodoPanel({ isOpen, onClose }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('calmcove-todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    localStorage.setItem('calmcove-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
        },
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="glass-strong w-full max-w-md p-6 pointer-events-auto animate-slide-up max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-textPrimary">Tasks</h2>
          <button
            onClick={onClose}
            className="btn-secondary w-8 h-8 rounded-lg text-lg leading-none"
            aria-label="Close todo panel"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a task..."
            className="input-base flex-1"
          />
          <button onClick={addTodo} className="btn-primary px-4 py-2 rounded-lg">
            Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {todos.length === 0 ? (
            <p className="text-center text-textPrimary-dim py-8">No tasks yet</p>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-bgSoft-light hover:bg-bgSoft-hover transition-colors ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded border-white/20 bg-bgSoft-light text-accent focus:ring-2 focus:ring-accent"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed ? 'line-through text-textPrimary-dim' : 'text-textPrimary'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn-secondary w-7 h-7 rounded text-lg leading-none"
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

