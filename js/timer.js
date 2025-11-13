/**
 * Timer - Pomodoro and custom focus timer
 * Handles timer logic, notifications, and break management
 */

import { showToast } from './utils.js';

export class Timer {
    constructor(store, stats) {
        this.store = store;
        this.stats = stats;
        this.state = {
            mode: 'pomodoro',
            duration: 25,
            shortBreak: 5,
            longBreak: 15,
            sessions: 0
        };
        this.currentTime = 0;
        this.isRunning = false;
        this.isBreak = false;
        this.interval = null;
        this.notificationPermission = null;
    }

    async init() {
        // Load saved state
        this.state = await this.store.getTimerState();
        this.currentTime = this.state.duration * 60;

        // Request notification permission
        if ('Notification' in window) {
            this.notificationPermission = Notification.permission;
            if (this.notificationPermission === 'default') {
                // Don't request immediately - wait for user interaction
            }
        }

        // Setup UI
        this.setupUI();

        // Update display
        this.updateDisplay();
    }

    setupUI() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.setDuration(minutes);
            });
        });

        // Control buttons
        document.getElementById('timer-start').addEventListener('click', () => this.start());
        document.getElementById('timer-pause').addEventListener('click', () => this.pause());
        document.getElementById('timer-reset').addEventListener('click', () => this.reset());

        // Mode radio buttons
        document.querySelectorAll('input[name="timer-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.mode = e.target.value;
                this.saveState();
            });
        });
    }

    setDuration(minutes) {
        this.currentTime = minutes * 60;
        this.state.duration = minutes;
        this.updateDisplay();
        this.saveState();
    }

    start() {
        if (this.isRunning) return;

        // Request notification permission if needed
        if (this.notificationPermission === 'default') {
            Notification.requestPermission().then(permission => {
                this.notificationPermission = permission;
            });
        }

        this.isRunning = true;
        this.interval = setInterval(() => this.tick(), 1000);

        // Update UI
        document.getElementById('timer-start').style.display = 'none';
        document.getElementById('timer-pause').style.display = 'inline-block';

        showToast('Timer started! 🎯', 'success');
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        // Update UI
        document.getElementById('timer-start').style.display = 'inline-block';
        document.getElementById('timer-pause').style.display = 'none';

        showToast('Timer paused', 'info');
    }

    reset() {
        this.pause();
        this.currentTime = this.state.duration * 60;
        this.isBreak = false;
        this.updateDisplay();
    }

    tick() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.updateDisplay();
        } else {
            this.complete();
        }
    }

    complete() {
        this.pause();

        if (this.isBreak) {
            // Break finished, start work session
            this.isBreak = false;
            this.currentTime = this.state.duration * 60;
            this.showNotification('Break finished! Time to focus. 🎯', 'Break Finished');
            showToast('Break finished! Time to focus.', 'success');
        } else {
            // Work session finished
            this.state.sessions++;
            if (this.stats) {
                this.stats.recordSession(this.state.duration);
            }

            if (this.state.mode === 'pomodoro') {
                // Start break
                const breakDuration = this.state.sessions % 4 === 0 
                    ? this.state.longBreak 
                    : this.state.shortBreak;
                this.isBreak = true;
                this.currentTime = breakDuration * 60;
                this.showNotification(`Great work! Take a ${breakDuration}-minute break. ☕`, 'Session Complete');
                showToast(`Session complete! Take a ${breakDuration}-minute break.`, 'success');
            } else {
                // Custom mode - just reset
                this.currentTime = this.state.duration * 60;
                this.showNotification('Timer finished! 🎉', 'Timer Complete');
                showToast('Timer finished!', 'success');
            }
        }

        this.updateDisplay();
        this.saveState();
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        document.getElementById('timer-display').textContent = display;

        // Update document title
        if (this.isRunning) {
            document.title = `(${display}) Lofi Zen Lab`;
        } else {
            document.title = 'Lofi Zen Lab';
        }
    }

    showNotification(message, title = 'Lofi Zen Lab') {
        if (this.notificationPermission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/assets/img/favicon.svg',
                badge: '/assets/img/favicon.svg',
                tag: 'timer',
                requireInteraction: false
            });
        }
    }

    async saveState() {
        await this.store.saveTimerState(this.state);
    }
}

