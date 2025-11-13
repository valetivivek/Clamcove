/**
 * Ambience - Ambient sound mixer
 * Handles multiple audio loops with independent volume control
 */

export class Ambience {
    constructor(store) {
        this.store = store;
        this.sounds = {};
        this.state = {
            active: {},
            volumes: {},
            masterVolume: 50
        };
        this.audioContext = null;
        this.masterGain = null;
    }

    async init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            // Fallback to HTMLAudioElement
        }

        // Load saved state
        this.state = await this.store.getAmbienceState();

        // Define available ambience sounds
        this.soundDefs = [
            { id: 'rain', name: 'Rain', icon: '🌧️', file: '/assets/audio/rain.mp3' },
            { id: 'cafe', name: 'Café', icon: '☕', file: '/assets/audio/cafe.mp3' },
            { id: 'fireplace', name: 'Fireplace', icon: '🔥', file: '/assets/audio/fireplace.mp3' },
            { id: 'waves', name: 'Ocean Waves', icon: '🌊', file: '/assets/audio/waves.mp3' },
            { id: 'forest', name: 'Forest', icon: '🌲', file: '/assets/audio/forest.mp3' },
            { id: 'wind', name: 'Wind', icon: '💨', file: '/assets/audio/wind.mp3' },
            { id: 'thunder', name: 'Thunder', icon: '⚡', file: '/assets/audio/thunder.mp3' },
            { id: 'birds', name: 'Birds', icon: '🐦', file: '/assets/audio/birds.mp3' },
            { id: 'city', name: 'City', icon: '🏙️', file: '/assets/audio/city.mp3' },
            { id: 'white-noise', name: 'White Noise', icon: '📻', file: '/assets/audio/white-noise.mp3' },
            { id: 'brown-noise', name: 'Brown Noise', icon: '📻', file: '/assets/audio/brown-noise.mp3' },
            { id: 'pink-noise', name: 'Pink Noise', icon: '📻', file: '/assets/audio/pink-noise.mp3' },
            { id: 'fan', name: 'Fan', icon: '🌀', file: '/assets/audio/fan.mp3' },
            { id: 'train', name: 'Train', icon: '🚂', file: '/assets/audio/train.mp3' },
            { id: 'library', name: 'Library', icon: '📚', file: '/assets/audio/library.mp3' }
        ];

        // Setup UI
        this.setupUI();

        // Restore active sounds
        for (const [id, active] of Object.entries(this.state.active)) {
            if (active) {
                this.toggleSound(id);
            }
        }

        // Restore volumes
        this.setMasterVolume(this.state.masterVolume);
    }

    setupUI() {
        const container = document.getElementById('ambience-controls');
        container.innerHTML = '';

        this.soundDefs.forEach(def => {
            const toggle = document.createElement('div');
            toggle.className = 'ambience-toggle';
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('tabindex', '0');
            toggle.setAttribute('aria-label', `Toggle ${def.name}`);
            
            if (this.state.active[def.id]) {
                toggle.classList.add('active');
            }

            const volume = this.state.volumes[def.id] || 50;
            
            toggle.innerHTML = `
                <span class="ambience-toggle-icon">${def.icon}</span>
                <span class="ambience-toggle-label">${def.name}</span>
                <input type="range" min="0" max="100" value="${volume}" 
                       class="ambience-volume" data-sound="${def.id}" 
                       aria-label="${def.name} volume">
            `;

            // Toggle on click
            toggle.addEventListener('click', (e) => {
                if (e.target.type !== 'range') {
                    this.toggleSound(def.id);
                }
            });

            // Volume control
            const volumeSlider = toggle.querySelector('.ambience-volume');
            volumeSlider.addEventListener('input', (e) => {
                this.setSoundVolume(def.id, parseInt(e.target.value));
            });

            container.appendChild(toggle);
        });

        // Master volume controls
        const ambienceVolume = document.getElementById('ambience-volume');
        ambienceVolume.value = this.state.masterVolume;
        ambienceVolume.addEventListener('input', (e) => {
            this.setMasterVolume(parseInt(e.target.value));
        });
    }

    async toggleSound(id) {
        const def = this.soundDefs.find(s => s.id === id);
        if (!def) return;

        const isActive = this.state.active[id] || false;

        if (isActive) {
            // Stop sound
            if (this.sounds[id]) {
                if (this.sounds[id].source) {
                    this.sounds[id].source.stop();
                } else if (this.sounds[id].element) {
                    this.sounds[id].element.pause();
                    this.sounds[id].element.currentTime = 0;
                }
                delete this.sounds[id];
            }
            this.state.active[id] = false;
        } else {
            // Start sound
            await this.loadSound(id);
            this.state.active[id] = true;
        }

        // Update UI
        const toggle = document.querySelector(`[data-sound="${id}"]`)?.closest('.ambience-toggle');
        if (toggle) {
            toggle.classList.toggle('active', this.state.active[id]);
        }

        this.saveState();
    }

    async loadSound(id) {
        const def = this.soundDefs.find(s => s.id === id);
        if (!def) return;

        try {
            if (this.audioContext && this.masterGain) {
                // Use Web Audio API for better control
                const response = await fetch(def.file);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = audioBuffer;
                source.loop = true;
                source.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                const volume = (this.state.volumes[id] || 50) / 100;
                gainNode.gain.value = volume * (this.state.masterVolume / 100);
                
                source.start(0);
                
                this.sounds[id] = {
                    source,
                    gainNode,
                    type: 'webaudio'
                };
            } else {
                // Fallback to HTMLAudioElement
                const audio = new Audio(def.file);
                audio.loop = true;
                audio.volume = ((this.state.volumes[id] || 50) / 100) * (this.state.masterVolume / 100);
                await audio.play();
                
                this.sounds[id] = {
                    element: audio,
                    type: 'htmlaudio'
                };
            }
        } catch (error) {
            console.error(`Failed to load sound ${id}:`, error);
            // Silently fail - sound file might not exist yet
        }
    }

    setSoundVolume(id, volume) {
        this.state.volumes[id] = Math.max(0, Math.min(100, volume));

        if (this.sounds[id]) {
            if (this.sounds[id].gainNode) {
                // Web Audio API
                const vol = (volume / 100) * (this.state.masterVolume / 100);
                this.sounds[id].gainNode.gain.value = vol;
            } else if (this.sounds[id].element) {
                // HTMLAudioElement
                this.sounds[id].element.volume = (volume / 100) * (this.state.masterVolume / 100);
            }
        }

        this.saveState();
    }

    setMasterVolume(volume) {
        this.state.masterVolume = Math.max(0, Math.min(100, volume));

        // Update all active sounds
        for (const [id, sound] of Object.entries(this.sounds)) {
            const soundVolume = this.state.volumes[id] || 50;
            if (sound.gainNode) {
                sound.gainNode.gain.value = (soundVolume / 100) * (this.state.masterVolume / 100);
            } else if (sound.element) {
                sound.element.volume = (soundVolume / 100) * (this.state.masterVolume / 100);
            }
        }

        // Update UI
        document.getElementById('ambience-volume-value').textContent = `${this.state.masterVolume}%`;

        this.saveState();
    }

    async saveState() {
        await this.store.saveAmbienceState(this.state);
    }
}

