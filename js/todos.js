/**
 * Todos - Task management with Kanban view
 * Handles todo list, completion, and drag-and-drop Kanban
 */

export class Todos {
    constructor(store) {
        this.store = store;
        this.todos = [];
        this.kanbanView = false;
    }

    async init() {
        // Load saved todos
        this.todos = await this.store.getTodos();
        
        // Setup UI
        this.setupUI();
        this.render();
    }

    setupUI() {
        // Add todo input
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('todo-add');

        const addTodo = () => {
            const text = input.value.trim();
            if (text) {
                this.addTodo(text);
                input.value = '';
            }
        };

        addBtn.addEventListener('click', addTodo);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Kanban toggle
        document.getElementById('toggle-kanban').addEventListener('click', () => {
            this.kanbanView = !this.kanbanView;
            this.render();
        });
    }

    addTodo(text) {
        const todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            status: 'todo',
            createdAt: new Date().toISOString()
        };
        this.todos.push(todo);
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                todo.status = 'done';
            }
            this.save();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    updateTodoStatus(id, status) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.status = status;
            todo.completed = status === 'done';
            this.save();
            this.render();
        }
    }

    render() {
        const listView = document.getElementById('todo-list');
        const kanbanView = document.getElementById('kanban-board');

        if (this.kanbanView) {
            listView.style.display = 'none';
            kanbanView.style.display = 'grid';
            this.renderKanban();
        } else {
            listView.style.display = 'flex';
            kanbanView.style.display = 'none';
            this.renderList();
        }
    }

    renderList() {
        const container = document.getElementById('todo-list');
        container.innerHTML = '';

        if (this.todos.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">No tasks yet. Add one above!</p>';
            return;
        }

        this.todos.forEach(todo => {
            const item = document.createElement('div');
            item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                       aria-label="Toggle ${todo.text}">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" aria-label="Delete ${todo.text}">🗑️</button>
            `;

            item.querySelector('.todo-checkbox').addEventListener('change', () => {
                this.toggleTodo(todo.id);
            });

            item.querySelector('.todo-delete').addEventListener('click', () => {
                this.deleteTodo(todo.id);
            });

            container.appendChild(item);
        });
    }

    renderKanban() {
        const columns = {
            todo: document.getElementById('kanban-todo'),
            doing: document.getElementById('kanban-doing'),
            done: document.getElementById('kanban-done')
        };

        // Clear columns
        Object.values(columns).forEach(col => col.innerHTML = '');

        // Group todos by status
        const byStatus = {
            todo: this.todos.filter(t => t.status === 'todo'),
            doing: this.todos.filter(t => t.status === 'doing'),
            done: this.todos.filter(t => t.status === 'done')
        };

        // Render each column
        Object.entries(byStatus).forEach(([status, todos]) => {
            todos.forEach(todo => {
                const item = document.createElement('div');
                item.className = 'kanban-item';
                item.draggable = true;
                item.dataset.id = todo.id;
                item.innerHTML = `<div>${this.escapeHtml(todo.text)}</div>`;

                // Drag and drop
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', todo.id);
                });

                item.addEventListener('click', () => {
                    // Cycle through statuses
                    const statuses = ['todo', 'doing', 'done'];
                    const currentIndex = statuses.indexOf(todo.status);
                    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                    this.updateTodoStatus(todo.id, nextStatus);
                });

                columns[status].appendChild(item);
            });
        });

        // Setup drop zones
        Object.entries(columns).forEach(([status, column]) => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.style.backgroundColor = 'var(--bg-primary)';
            });

            column.addEventListener('dragleave', () => {
                column.style.backgroundColor = '';
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.style.backgroundColor = '';
                const id = e.dataTransfer.getData('text/plain');
                this.updateTodoStatus(id, status);
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async save() {
        await this.store.saveTodos(this.todos);
    }
}

