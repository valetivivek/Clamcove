/**
 * Player - YouTube IFrame Player integration
 * Handles music playback, playlists, favorites, and recent tracks
 */

import { showToast } from './utils.js';

export class Player {
    constructor(store) {
        this.store = store;
        this.ytPlayer = null;
        this.currentPlaylist = null;
        this.currentVideoIndex = 0;
        this.currentVideoId = null;
        this.playlists = {};
        this.state = {
            volume: 70,
            muted: false,
            loop: false,
            favorites: [],
            recent: []
        };
        this.apiKey = null; // Set via environment or config
        this.apiQuotaExceeded = false;
    }

    async init() {
        // Load playlists
        try {
            const response = await fetch('/data/playlists.json');
            const data = await response.json();
            this.playlists = data.playlists;
            this.apiKey = data.apiKey || null;
        } catch (error) {
            console.error('Failed to load playlists:', error);
            showToast('Failed to load playlists. Using fallback.', 'warning');
        }

        // Load saved state
        this.state = await this.store.getPlayerState();
        
        // Initialize YouTube IFrame Player
        if (window.YT && window.YT.Player) {
            this.createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = () => this.createPlayer();
        }

        // Setup UI
        this.setupUI();
    }

    createPlayer() {
        const container = document.getElementById('player-wrapper');
        
        this.ytPlayer = new window.YT.Player('player-wrapper', {
            height: '100%',
            width: '100%',
            videoId: '',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 0,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
                rel: 0
            },
            events: {
                onReady: (event) => this.onPlayerReady(event),
                onStateChange: (event) => this.onStateChange(event),
                onError: (event) => this.onError(event)
            }
        });
    }

    onPlayerReady(event) {
        // Restore volume
        this.setVolume(this.state.volume);
        if (this.state.muted) {
            this.ytPlayer.mute();
        }

        // Load last played if available
        if (this.state.currentVideo) {
            this.loadVideo(this.state.currentVideo);
        }

        // Update UI
        this.updatePlayButton();
    }

    onStateChange(event) {
        // YT.PlayerState.ENDED = 0
        // YT.PlayerState.PLAYING = 1
        // YT.PlayerState.PAUSED = 2
        // YT.PlayerState.BUFFERING = 3
        // YT.PlayerState.CUED = 5

        if (event.data === window.YT.PlayerState.ENDED) {
            if (this.state.loop) {
                this.ytPlayer.playVideo();
            } else {
                this.next();
            }
        }

        this.updatePlayButton();
        this.updateVideoInfo();
    }

    onError(event) {
        console.error('YouTube Player Error:', event.data);
        let message = 'Playback error occurred.';
        
        switch (event.data) {
            case 2: message = 'Invalid video ID.'; break;
            case 5: message = 'HTML5 player error.'; break;
            case 100: message = 'Video not found.'; break;
            case 101:
            case 150: message = 'Video not available for embedding.'; break;
        }
        
        showToast(message, 'error');
    }

    setupUI() {
        // Genre tabs
        document.querySelectorAll('.genre-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.genre-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                this.loadGenre(tab.dataset.genre);
            });
        });

        // Load default genre
        this.loadGenre('chill');
    }

    async loadGenre(genre) {
        const genrePlaylists = this.playlists[genre] || [];
        const grid = document.getElementById('playlist-grid');
        grid.innerHTML = '';

        for (const playlist of genrePlaylists) {
            const card = this.createPlaylistCard(playlist);
            grid.appendChild(card);
        }
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        
        if (playlist.id === this.currentPlaylist?.id) {
            card.classList.add('active');
        }

        card.innerHTML = `
            ${playlist.thumbnail ? `<img src="${playlist.thumbnail}" alt="${playlist.title}" loading="lazy">` : '<div style="aspect-ratio:1;background:var(--bg-tertiary);"></div>'}
            <div class="playlist-card-title">${playlist.title}</div>
        `;

        card.addEventListener('click', () => this.loadPlaylist(playlist));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.loadPlaylist(playlist);
            }
        });

        return card;
    }

    async loadPlaylist(playlist) {
        this.currentPlaylist = playlist;
        this.currentVideoIndex = 0;

        try {
            // Try to fetch playlist items via API
            if (this.apiKey && !this.apiQuotaExceeded) {
                const videos = await this.fetchPlaylistVideos(playlist.id);
                if (videos && videos.length > 0) {
                    playlist.videos = videos;
                    this.loadVideo(videos[0]);
                    return;
                }
            }

            // Fallback: use first video ID if available
            if (playlist.firstVideoId) {
                this.loadVideo({ id: playlist.firstVideoId, title: playlist.title });
            } else {
                showToast('Playlist data unavailable. Please check API configuration.', 'warning');
            }
        } catch (error) {
            console.error('Failed to load playlist:', error);
            showToast('Failed to load playlist.', 'error');
        }
    }

    async fetchPlaylistVideos(playlistId) {
        if (!this.apiKey) return null;

        try {
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                if (data.error.code === 403) {
                    this.apiQuotaExceeded = true;
                    showToast('API quota exceeded. Using fallback playlists.', 'warning');
                }
                return null;
            }

            return data.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                channel: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails?.medium?.url
            }));
        } catch (error) {
            console.error('API fetch error:', error);
            return null;
        }
    }

    loadVideo(video) {
        if (!this.ytPlayer) return;

        this.currentVideoId = video.id;
        this.ytPlayer.loadVideoById(video.id);

        // Update UI
        document.getElementById('player-title').textContent = video.title || 'Loading...';
        document.getElementById('player-channel').textContent = video.channel || '';

        // Save to recent
        this.addToRecent(video);

        // Save state
        this.state.currentVideo = video;
        this.saveState();
    }

    togglePlayPause() {
        if (!this.ytPlayer) return;

        const state = this.ytPlayer.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
            this.ytPlayer.pauseVideo();
        } else {
            this.ytPlayer.playVideo();
        }
    }

    next() {
        if (!this.currentPlaylist || !this.currentPlaylist.videos) return;

        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.currentPlaylist.videos.length;
        const nextVideo = this.currentPlaylist.videos[this.currentVideoIndex];
        this.loadVideo(nextVideo);
    }

    previous() {
        if (!this.currentPlaylist || !this.currentPlaylist.videos) return;

        this.currentVideoIndex = this.currentVideoIndex === 0 
            ? this.currentPlaylist.videos.length - 1 
            : this.currentVideoIndex - 1;
        const prevVideo = this.currentPlaylist.videos[this.currentVideoIndex];
        this.loadVideo(prevVideo);
    }

    setVolume(volume) {
        if (!this.ytPlayer) return;

        this.state.volume = Math.max(0, Math.min(100, volume));
        this.ytPlayer.setVolume(this.state.volume);
        
        // Update UI
        document.getElementById('volume-slider').value = this.state.volume;
        document.getElementById('music-volume').value = this.state.volume;
        document.getElementById('music-volume-value').textContent = `${this.state.volume}%`;
        
        this.saveState();
    }

    toggleMute() {
        if (!this.ytPlayer) return;

        if (this.state.muted) {
            this.ytPlayer.unMute();
            this.state.muted = false;
        } else {
            this.ytPlayer.mute();
            this.state.muted = true;
        }

        // Update UI
        const muteBtn = document.getElementById('btn-mute');
        muteBtn.querySelector('.icon').textContent = this.state.muted ? '🔇' : '🔊';
        
        this.saveState();
    }

    toggleLoop() {
        this.state.loop = !this.state.loop;
        
        // Update UI
        const loopBtn = document.getElementById('btn-loop');
        loopBtn.classList.toggle('active', this.state.loop);
        
        this.saveState();
    }

    updatePlayButton() {
        if (!this.ytPlayer) return;

        const state = this.ytPlayer.getPlayerState();
        const btn = document.getElementById('btn-play-pause');
        const icon = btn.querySelector('.icon');
        
        if (state === window.YT.PlayerState.PLAYING) {
            icon.textContent = '⏸';
            btn.setAttribute('aria-label', 'Pause');
        } else {
            icon.textContent = '▶';
            btn.setAttribute('aria-label', 'Play');
        }
    }

    updateVideoInfo() {
        // Video info is updated in loadVideo
        // This can be extended to fetch real-time info if needed
    }

    addToRecent(video) {
        // Remove if already exists
        this.state.recent = this.state.recent.filter(v => v.id !== video.id);
        // Add to beginning
        this.state.recent.unshift(video);
        // Keep only last 20
        this.state.recent = this.state.recent.slice(0, 20);
        
        this.updateRecentList();
        this.saveState();
    }

    toggleFavorite(video) {
        const index = this.state.favorites.findIndex(v => v.id === video.id);
        if (index >= 0) {
            this.state.favorites.splice(index, 1);
        } else {
            this.state.favorites.push(video);
        }
        
        this.updateFavoritesList();
        this.saveState();
    }

    updateFavoritesList() {
        const list = document.getElementById('favorites-list');
        list.innerHTML = '';
        
        this.state.favorites.forEach(video => {
            const item = document.createElement('div');
            item.className = 'playlist-card';
            item.innerHTML = `
                <div class="playlist-card-title">${video.title}</div>
            `;
            item.addEventListener('click', () => this.loadVideo(video));
            list.appendChild(item);
        });
    }

    updateRecentList() {
        const list = document.getElementById('recent-list');
        list.innerHTML = '';
        
        this.state.recent.slice(0, 10).forEach(video => {
            const item = document.createElement('div');
            item.className = 'playlist-card';
            item.innerHTML = `
                <div class="playlist-card-title">${video.title}</div>
            `;
            item.addEventListener('click', () => this.loadVideo(video));
            list.appendChild(item);
        });
    }

    async saveState() {
        this.state.currentPlaylist = this.currentPlaylist;
        await this.store.savePlayerState(this.state);
    }
}

