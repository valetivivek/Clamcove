/**
 * Store - IndexedDB wrapper using idb-keyval
 * Handles all persistent storage
 */

import { get, set, del, keys, clear } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

export class Store {
    constructor() {
        this.dbName = 'lofi-zen-lab';
        this.version = 1;
    }

    async init() {
        // idb-keyval handles initialization automatically
        // Just verify it works
        try {
            await get('test');
        } catch (error) {
            console.error('IndexedDB initialization failed:', error);
            throw error;
        }
    }

    // Player state
    async getPlayerState() {
        return await get('player-state') || {
            currentPlaylist: null,
            currentVideo: null,
            volume: 70,
            muted: false,
            loop: false,
            favorites: [],
            recent: []
        };
    }

    async savePlayerState(state) {
        await set('player-state', state);
    }

    // Ambience state
    async getAmbienceState() {
        return await get('ambience-state') || {
            active: {},
            volumes: {},
            masterVolume: 50
        };
    }

    async saveAmbienceState(state) {
        await set('ambience-state', state);
    }

    // Timer state
    async getTimerState() {
        return await get('timer-state') || {
            mode: 'pomodoro',
            duration: 25,
            shortBreak: 5,
            longBreak: 15,
            sessions: 0
        };
    }

    async saveTimerState(state) {
        await set('timer-state', state);
    }

    // Notes
    async getNotes() {
        return await get('notes') || '';
    }

    async saveNotes(content) {
        await set('notes', content);
    }

    // Todos
    async getTodos() {
        return await get('todos') || [];
    }

    async saveTodos(todos) {
        await set('todos', todos);
    }

    // Stats
    async getStats() {
        return await get('stats') || {
            totalMinutes: 0,
            todayMinutes: 0,
            sessions: 0,
            streak: 0,
            lastSessionDate: null,
            achievements: []
        };
    }

    async saveStats(stats) {
        await set('stats', stats);
    }

    // Settings
    async getSettings() {
        return await get('settings') || {
            theme: 'dark',
            colorTheme: 'default',
            scene: 'zen-desk',
            analytics: false
        };
    }

    async saveSettings(settings) {
        await set('settings', settings);
    }

    // Generic get/set for extensibility
    async get(key) {
        return await get(key);
    }

    async set(key, value) {
        await set(key, value);
    }

    async delete(key) {
        await del(key);
    }

    async clear() {
        await clear();
    }

    async getAllKeys() {
        return await keys();
    }
}

