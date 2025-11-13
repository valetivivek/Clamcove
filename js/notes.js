/**
 * Notes - Markdown-lite notes editor
 * Handles note storage and export
 */

export class Notes {
    constructor(store) {
        this.store = store;
        this.content = '';
    }

    async init() {
        // Load saved notes
        this.content = await this.store.getNotes();
        
        // Setup UI
        const editor = document.getElementById('notes-editor');
        editor.value = this.content;

        // Auto-save on input
        editor.addEventListener('input', (e) => {
            this.content = e.target.value;
            this.save();
        });

        // Export button
        document.getElementById('notes-export').addEventListener('click', () => this.export());

        // Clear button
        document.getElementById('notes-clear').addEventListener('click', () => {
            if (confirm('Clear all notes? This cannot be undone.')) {
                this.clear();
            }
        });
    }

    async save() {
        await this.store.saveNotes(this.content);
    }

    export() {
        const blob = new Blob([this.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lofi-zen-notes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async clear() {
        this.content = '';
        document.getElementById('notes-editor').value = '';
        await this.save();
    }
}

