/**
 * Lofi Zen Lab - Main Entry Point
 * Orchestrates all modules and initializes the app
 */

import { Player } from './js/player.js';
import { Ambience } from './js/ambience.js';
import { Timer } from './js/timer.js';
import { Notes } from './js/notes.js';
import { Todos } from './js/todos.js';
import { Stats } from './js/stats.js';
import { Settings } from './js/settings.js';
import { Store } from './js/store.js';
import { showToast, showLoading, hideLoading } from './js/utils.js';

// Global app state
let app = {
    player: null,
    ambience: null,
    timer: null,
    notes: null,
    todos: null,
    stats: null,
    settings: null,
    store: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoading();
        
        // Initialize store
        app.store = new Store();
        await app.store.init();
        
        // Initialize settings first (needed by other modules)
        app.settings = new Settings(app.store);
        await app.settings.init();
        
        // Initialize modules
        app.player = new Player(app.store);
        app.ambience = new Ambience(app.store);
        app.timer = new Timer(app.store, app.stats);
        app.notes = new Notes(app.store);
        app.todos = new Todos(app.store);
        app.stats = new Stats(app.store);
        app.timer.stats = app.stats; // Link timer to stats
        
        // Wait for YouTube API to be ready
        if (window.YT && window.YT.Player) {
            await app.player.init();
        } else {
            window.onYouTubeIframeAPIReady = () => app.player.init();
        }
        
        await app.ambience.init();
        await app.notes.init();
        await app.todos.init();
        await app.stats.init();
        
        // Setup UI event handlers
        setupUIHandlers();
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .catch(err => console.warn('Service Worker registration failed:', err));
        }
        
        hideLoading();
        showToast('Welcome to Lofi Zen Lab! 🎵', 'success');
        
    } catch (error) {
        console.error('Initialization error:', error);
        hideLoading();
        showToast('Failed to initialize app. Please refresh.', 'error');
    }
});

/**
 * Setup UI event handlers
 */
function setupUIHandlers() {
    // Header navigation
    document.getElementById('btn-library').addEventListener('click', () => toggleDrawer('library'));
    document.getElementById('btn-timer').addEventListener('click', () => togglePanel('timer'));
    document.getElementById('btn-notes').addEventListener('click', () => togglePanel('notes'));
    document.getElementById('btn-stats').addEventListener('click', () => togglePanel('stats'));
    document.getElementById('btn-settings').addEventListener('click', () => togglePanel('settings'));
    
    // Drawer close buttons
    document.getElementById('close-library').addEventListener('click', () => toggleDrawer('library'));
    document.getElementById('close-ambience').addEventListener('click', () => toggleDrawer('ambience'));
    
    // Panel close buttons
    document.getElementById('close-timer').addEventListener('click', () => togglePanel('timer'));
    document.getElementById('close-notes').addEventListener('click', () => togglePanel('notes'));
    document.getElementById('close-todos').addEventListener('click', () => togglePanel('todos'));
    document.getElementById('close-stats').addEventListener('click', () => togglePanel('stats'));
    document.getElementById('close-settings').addEventListener('click', () => togglePanel('settings'));
    
    // Control bar buttons
    document.getElementById('btn-play-pause').addEventListener('click', () => app.player.togglePlayPause());
    document.getElementById('btn-prev').addEventListener('click', () => app.player.previous());
    document.getElementById('btn-next').addEventListener('click', () => app.player.next());
    document.getElementById('btn-mute').addEventListener('click', () => app.player.toggleMute());
    document.getElementById('btn-ambience').addEventListener('click', () => toggleDrawer('ambience'));
    document.getElementById('btn-loop').addEventListener('click', () => app.player.toggleLoop());
    
    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        app.player.setVolume(parseInt(e.target.value));
    });
    
    // Close panels/drawers on backdrop click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('panel') || e.target.classList.contains('drawer')) {
            e.target.classList.remove('open');
            e.target.setAttribute('aria-hidden', 'true');
        }
    });
}

/**
 * Toggle drawer visibility
 */
function toggleDrawer(name) {
    const drawer = document.getElementById(`drawer-${name}`);
    const isOpen = drawer.classList.contains('open');
    
    // Close all drawers first
    document.querySelectorAll('.drawer').forEach(d => {
        d.classList.remove('open');
        d.setAttribute('aria-hidden', 'true');
    });
    
    if (!isOpen) {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Toggle panel visibility
 */
function togglePanel(name) {
    const panel = document.getElementById(`panel-${name}`);
    const isOpen = panel.classList.contains('open');
    
    // Close all panels first
    document.querySelectorAll('.panel').forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-hidden', 'true');
    });
    
    if (!isOpen) {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Space: Play/Pause
        if (e.code === 'Space') {
            e.preventDefault();
            app.player.togglePlayPause();
        }
        
        // N: Next track
        if (e.code === 'KeyN' && !e.shiftKey) {
            e.preventDefault();
            app.player.next();
        }
        
        // P: Previous track
        if (e.code === 'KeyP' && !e.shiftKey) {
            e.preventDefault();
            app.player.previous();
        }
        
        // T: Timer
        if (e.code === 'KeyT') {
            e.preventDefault();
            togglePanel('timer');
        }
        
        // A: Ambience
        if (e.code === 'KeyA') {
            e.preventDefault();
            toggleDrawer('ambience');
        }
        
        // L: Library
        if (e.code === 'KeyL') {
            e.preventDefault();
            toggleDrawer('library');
        }
        
        // S: Stats
        if (e.code === 'KeyS') {
            e.preventDefault();
            togglePanel('stats');
        }
        
        // M: Mute
        if (e.code === 'KeyM') {
            e.preventDefault();
            app.player.toggleMute();
        }
        
        // /: Settings
        if (e.code === 'Slash') {
            e.preventDefault();
            togglePanel('settings');
        }
        
        // Escape: Close all panels/drawers
        if (e.code === 'Escape') {
            document.querySelectorAll('.panel.open, .drawer.open').forEach(el => {
                el.classList.remove('open');
                el.setAttribute('aria-hidden', 'true');
            });
        }
    });
}

// Export app instance for debugging
window.app = app;

