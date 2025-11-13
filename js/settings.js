/**
 * Settings - Theme, scene, and app preferences
 * Handles theme switching, background scenes, and keyboard shortcuts
 */

export class Settings {
    constructor(store) {
        this.store = store;
        this.settings = {
            theme: 'dark',
            colorTheme: 'default',
            scene: 'sunlit-loft',
            analytics: false
        };
        this.scenes = [
            { id: 'zen-desk', name: 'Zen Desk' },
            { id: 'sunlit-loft', name: 'Sunlit Loft' },
            { id: 'cozy-cafe', name: 'Cozy Café' },
            { id: 'night-cafe', name: 'Night Café' },
            { id: 'stormy-cabin', name: 'Stormy Cabin' },
            { id: 'ocean-waves', name: 'Ocean Waves' },
            { id: 'minimal', name: 'Minimal' },
            { id: 'gradient-purple', name: 'Purple Gradient' },
            { id: 'gradient-blue', name: 'Blue Gradient' },
            { id: 'gradient-green', name: 'Green Gradient' },
            { id: 'gradient-orange', name: 'Orange Gradient' },
            { id: 'gradient-pink', name: 'Pink Gradient' }
        ];
        this.colorThemes = [
            { id: 'default', name: 'Default', color: '#533483' },
            { id: 'ocean', name: 'Ocean', color: '#2196f3' },
            { id: 'forest', name: 'Forest', color: '#4caf50' },
            { id: 'sunset', name: 'Sunset', color: '#ff5722' },
            { id: 'lavender', name: 'Lavender', color: '#9c27b0' },
            { id: 'coffee', name: 'Coffee', color: '#795548' }
        ];
    }

    async init() {
        // Load saved settings
        this.settings = await this.store.getSettings();
        
        // Apply settings
        this.applyTheme();
        this.applyScene();
        
        // Setup UI
        this.setupUI();
    }

    setupUI() {
        // Theme radio buttons
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.checked = radio.value === this.settings.theme;
            radio.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applyTheme();
                this.save();
            });
        });

        // Color theme selector
        const colorContainer = document.getElementById('color-theme-selector');
        colorContainer.innerHTML = '';
        this.colorThemes.forEach(theme => {
            const option = document.createElement('label');
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.gap = '0.5rem';
            option.innerHTML = `
                <div class="color-theme-option ${theme.id === this.settings.colorTheme ? 'selected' : ''}" 
                     style="background-color: ${theme.color}"></div>
                <span>${theme.name}</span>
            `;
            option.addEventListener('click', () => {
                this.settings.colorTheme = theme.id;
                this.applyTheme();
                this.save();
                // Update selected state
                document.querySelectorAll('.color-theme-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.querySelector('.color-theme-option').classList.add('selected');
            });
            colorContainer.appendChild(option);
        });

        // Scene selector
        const sceneSelect = document.getElementById('scene-selector');
        sceneSelect.innerHTML = '';
        this.scenes.forEach(scene => {
            const option = document.createElement('option');
            option.value = scene.id;
            option.textContent = scene.name;
            option.selected = scene.id === this.settings.scene;
            sceneSelect.appendChild(option);
        });
        sceneSelect.addEventListener('change', (e) => {
            this.settings.scene = e.target.value;
            this.applyScene();
            this.save();
        });

        // Analytics toggle
        const analyticsToggle = document.getElementById('analytics-toggle');
        analyticsToggle.checked = this.settings.analytics;
        analyticsToggle.addEventListener('change', (e) => {
            this.settings.analytics = e.target.checked;
            this.save();
            // Initialize analytics if enabled
            if (this.settings.analytics) {
                this.initAnalytics();
            }
        });

        // Keyboard shortcuts display
        this.renderShortcuts();
    }

    applyTheme() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        // Apply color theme
        if (this.settings.colorTheme !== 'default') {
            document.documentElement.setAttribute('data-color-theme', this.settings.colorTheme);
        } else {
            document.documentElement.removeAttribute('data-color-theme');
        }

        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = this.settings.theme === 'light' ? '#f5f5f5' : '#1a1a2e';
        }
    }

    applyScene() {
        const sceneBg = document.getElementById('scene-background');
        sceneBg.setAttribute('data-scene', this.settings.scene);
    }

    renderShortcuts() {
        const shortcuts = [
            { key: 'Space', action: 'Play/Pause' },
            { key: 'N', action: 'Next track' },
            { key: 'P', action: 'Previous track' },
            { key: 'T', action: 'Timer' },
            { key: 'A', action: 'Ambience mixer' },
            { key: 'L', action: 'Library' },
            { key: 'S', action: 'Stats' },
            { key: 'M', action: 'Mute/Unmute' },
            { key: '/', action: 'Settings' },
            { key: 'Esc', action: 'Close panels' }
        ];

        const container = document.getElementById('shortcuts-list');
        container.innerHTML = '';

        shortcuts.forEach(shortcut => {
            const item = document.createElement('div');
            item.className = 'shortcut-item';
            item.innerHTML = `
                <span>${shortcut.action}</span>
                <kbd class="shortcut-key">${shortcut.key}</kbd>
            `;
            container.appendChild(item);
        });
    }

    initAnalytics() {
        // Privacy-friendly analytics (e.g., GoatCounter or Plausible)
        // This is a placeholder - implement based on chosen service
        console.log('Analytics enabled (not implemented in starter)');
    }

    async save() {
        await this.store.saveSettings(this.settings);
    }
}

