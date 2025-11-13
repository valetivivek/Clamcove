/**
 * Stats - Session tracking and achievements
 * Handles focus time, streaks, and achievement badges
 */

export class Stats {
    constructor(store) {
        this.store = store;
        this.stats = {
            totalMinutes: 0,
            todayMinutes: 0,
            sessions: 0,
            streak: 0,
            lastSessionDate: null,
            achievements: []
        };
        this.achievements = [
            { id: 'first-session', name: 'First Steps', icon: '👶', description: 'Complete your first focus session', unlocked: false },
            { id: '10-sessions', name: 'Dedicated', icon: '🔥', description: 'Complete 10 focus sessions', unlocked: false },
            { id: '100-sessions', name: 'Master', icon: '👑', description: 'Complete 100 focus sessions', unlocked: false },
            { id: '3-day-streak', name: 'Consistent', icon: '📅', description: 'Maintain a 3-day streak', unlocked: false },
            { id: '7-day-streak', name: 'Unstoppable', icon: '💪', description: 'Maintain a 7-day streak', unlocked: false },
            { id: '30-day-streak', name: 'Legendary', icon: '🌟', description: 'Maintain a 30-day streak', unlocked: false },
            { id: '10-hours', name: 'Focused', icon: '⏰', description: 'Accumulate 10 hours of focus time', unlocked: false },
            { id: '100-hours', name: 'Zen Master', icon: '🧘', description: 'Accumulate 100 hours of focus time', unlocked: false }
        ];
    }

    async init() {
        // Load saved stats
        this.stats = await this.store.getStats();
        
        // Update today's minutes (reset if new day)
        this.updateToday();
        
        // Check achievements
        this.checkAchievements();
        
        // Setup UI
        this.setupUI();
        this.render();
    }

    setupUI() {
        // Stats will be updated via render()
    }

    updateToday() {
        const today = new Date().toDateString();
        const lastDate = this.stats.lastSessionDate ? new Date(this.stats.lastSessionDate).toDateString() : null;

        if (lastDate !== today) {
            // New day - update streak
            if (lastDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastDate === yesterday.toDateString()) {
                    // Consecutive day
                    this.stats.streak++;
                } else {
                    // Streak broken
                    this.stats.streak = 1;
                }
            } else {
                this.stats.streak = 1;
            }

            // Reset today's minutes if it's a new day
            if (lastDate && lastDate !== today) {
                this.stats.todayMinutes = 0;
            }
        }
    }

    recordSession(minutes) {
        this.stats.sessions++;
        this.stats.totalMinutes += minutes;
        this.stats.todayMinutes += minutes;
        this.stats.lastSessionDate = new Date().toISOString();

        this.updateToday();
        this.checkAchievements();
        this.save();
        this.render();
    }

    checkAchievements() {
        let newAchievements = false;

        // First session
        if (this.stats.sessions >= 1 && !this.hasAchievement('first-session')) {
            this.unlockAchievement('first-session');
            newAchievements = true;
        }

        // 10 sessions
        if (this.stats.sessions >= 10 && !this.hasAchievement('10-sessions')) {
            this.unlockAchievement('10-sessions');
            newAchievements = true;
        }

        // 100 sessions
        if (this.stats.sessions >= 100 && !this.hasAchievement('100-sessions')) {
            this.unlockAchievement('100-sessions');
            newAchievements = true;
        }

        // Streaks
        if (this.stats.streak >= 3 && !this.hasAchievement('3-day-streak')) {
            this.unlockAchievement('3-day-streak');
            newAchievements = true;
        }

        if (this.stats.streak >= 7 && !this.hasAchievement('7-day-streak')) {
            this.unlockAchievement('7-day-streak');
            newAchievements = true;
        }

        if (this.stats.streak >= 30 && !this.hasAchievement('30-day-streak')) {
            this.unlockAchievement('30-day-streak');
            newAchievements = true;
        }

        // Total hours
        const totalHours = this.stats.totalMinutes / 60;
        if (totalHours >= 10 && !this.hasAchievement('10-hours')) {
            this.unlockAchievement('10-hours');
            newAchievements = true;
        }

        if (totalHours >= 100 && !this.hasAchievement('100-hours')) {
            this.unlockAchievement('100-hours');
            newAchievements = true;
        }

        if (newAchievements) {
            this.save();
        }
    }

    hasAchievement(id) {
        return this.stats.achievements.includes(id);
    }

    unlockAchievement(id) {
        if (!this.stats.achievements.includes(id)) {
            this.stats.achievements.push(id);
            const achievement = this.achievements.find(a => a.id === id);
            if (achievement) {
                achievement.unlocked = true;
                // Show notification (import showToast if needed)
                if (window.showToast) {
                    window.showToast(`Achievement unlocked: ${achievement.name} ${achievement.icon}`, 'success');
                }
            }
        }
    }

    render() {
        // Update stat cards
        document.getElementById('stat-today').textContent = `${Math.floor(this.stats.todayMinutes / 60)}h`;
        document.getElementById('stat-streak').textContent = this.stats.streak;
        document.getElementById('stat-sessions').textContent = this.stats.sessions;
        document.getElementById('stat-total').textContent = `${Math.floor(this.stats.totalMinutes / 60)}h`;

        // Render achievements
        const container = document.getElementById('achievements-grid');
        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : ''}`;
            badge.setAttribute('title', achievement.description);
            badge.innerHTML = `
                <span class="achievement-badge-icon">${achievement.icon}</span>
                <span class="achievement-badge-label">${achievement.name}</span>
            `;
            container.appendChild(badge);
        });
    }

    async save() {
        await this.store.saveStats(this.stats);
    }
}

