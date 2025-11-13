/**
 * CalmCove - Main JavaScript
 * Handles scene switching, music player, clock, timer, and todos
 */

// ============================================
// CONFIGURATION - Change these values
// ============================================

// Replace these with your own image URLs
// Use high resolution (4K) images for best quality
const SCENES = [
    {
        id: 'bedroom',
        name: 'Sunlit Bedroom',
        // Replace these paths with your actual image files
        // Place images in /assets/ folder
        image4k: '/assets/bedroom-scene-4k.jpg',      // For screens 1920px+
        imageHd: '/assets/bedroom-scene-hd.jpg',       // For screens 1280px+
        imageTablet: '/assets/bedroom-scene-tablet.jpg', // For tablets
        imageMobile: '/assets/bedroom-scene-mobile.jpg'  // For mobile
    },
    {
        id: 'cafe',
        name: 'Cozy Café',
        image4k: '/assets/cafe-scene-4k.jpg',
        imageHd: '/assets/cafe-scene-hd.jpg',
        imageTablet: '/assets/cafe-scene-tablet.jpg',
        imageMobile: '/assets/cafe-scene-mobile.jpg'
    },
    {
        id: 'studio',
        name: 'Creative Studio',
        image4k: '/assets/studio-scene-4k.jpg',
        imageHd: '/assets/studio-scene-hd.jpg',
        imageTablet: '/assets/studio-scene-tablet.jpg',
        imageMobile: '/assets/studio-scene-mobile.jpg'
    }
    // Add more scenes here by copying the object above and changing the values
];

// Replace these with your own audio file URLs
// You can use local files or streaming URLs
const PLAYLIST = [
    {
        title: 'Calm Morning',
        artist: 'Ambient Sounds',
        src: '/assets/audio/calm-morning.mp3'  // Replace with your audio file path
    },
    {
        title: 'Peaceful Rain',
        artist: 'Nature Sounds',
        src: '/assets/audio/peaceful-rain.mp3'  // Replace with your audio file path
    },
    {
        title: 'Café Ambience',
        artist: 'Background Music',
        src: '/assets/audio/cafe-ambience.mp3'  // Replace with your audio file path
    }
    // Add more tracks here by copying the object above and changing the values
];

// ============================================
// APPLICATION STATE
// ============================================

let currentSceneIndex = 0;
let currentTrackIndex = 0;
let isPlaying = false;
let timerInterval = null;
let timerSeconds = 25 * 60; // 25 minutes default
let todos = JSON.parse(localStorage.getItem('calmcove-todos') || '[]');

// ============================================
// DOM ELEMENTS
// ============================================

const sceneContainer = document.getElementById('scene-container');
const sceneBackground = document.getElementById('scene-background');
const sceneOverlay = document.getElementById('scene-overlay');
const sceneImage = document.getElementById('scene-image');
const audioPlayer = document.getElementById('audio-player');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnMute = document.getElementById('btn-mute');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const clockTime = document.getElementById('clock-time');
const clockDate = document.getElementById('clock-date');
const timerDisplay = document.getElementById('timer-display');
const timerStart = document.getElementById('timer-start');
const timerPause = document.getElementById('timer-pause');
const timerReset = document.getElementById('timer-reset');
const todoInput = document.getElementById('todo-input');
const todoAdd = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const sceneGrid = document.getElementById('scene-grid');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeScenes();
    initializePlayer();
    initializeClock();
    initializeTimer();
    initializeTodos();
    setupEventListeners();
    
    // Load first track if available
    if (PLAYLIST.length > 0) {
        loadTrack(0);
    }
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
});

// ============================================
// SCENE MANAGEMENT
// ============================================

function initializeScenes() {
    // Populate scene selector
    sceneGrid.innerHTML = '';
    SCENES.forEach((scene, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'scene-thumb';
        if (index === currentSceneIndex) thumb.classList.add('active');
        thumb.innerHTML = `
            <img src="${scene.imageHd}" alt="${scene.name}" loading="lazy">
            <div class="scene-thumb-label">${scene.name}</div>
        `;
        thumb.addEventListener('click', () => switchScene(index));
        sceneGrid.appendChild(thumb);
    });
}

function switchScene(index) {
    if (index === currentSceneIndex) return;
    
    const newScene = SCENES[index];
    currentSceneIndex = index;
    
    // Create new image element
    const newImg = document.createElement('img');
    newImg.src = newImg.srcset = '';
    newImg.alt = newScene.name;
    
    // Set responsive sources
    const picture = sceneBackground.querySelector('picture') || sceneBackground;
    if (picture.tagName === 'PICTURE') {
        const sources = picture.querySelectorAll('source');
        sources[0].srcset = newScene.image4k;
        sources[1].srcset = newScene.imageHd;
        sources[2].srcset = newScene.imageTablet;
        picture.querySelector('img').src = newScene.imageMobile;
    } else {
        // Fallback if picture element not supported
        newImg.src = newScene.imageHd;
    }
    
    // Fade transition
    sceneOverlay.classList.add('fade-in');
    
    setTimeout(() => {
        if (picture.tagName === 'PICTURE') {
            const img = picture.querySelector('img');
            img.src = newScene.imageMobile;
            img.srcset = `${newScene.imageMobile} 1x, ${newScene.imageTablet} 2x`;
        } else {
            sceneImage.src = newScene.imageHd;
        }
        
        // Update active scene in selector
        document.querySelectorAll('.scene-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        sceneOverlay.classList.remove('fade-in');
    }, 500);
}

// ============================================
// MUSIC PLAYER
// ============================================

function initializePlayer() {
    // Set initial volume
    audioPlayer.volume = volumeSlider.value / 100;
    
    // Update progress bar as audio plays
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration || 100;
    });
    audioPlayer.addEventListener('ended', () => {
        // Auto-play next track if enabled
        const autoPlay = document.getElementById('auto-play')?.checked;
        if (autoPlay && PLAYLIST.length > 1) {
            nextTrack();
        } else {
            isPlaying = false;
            updatePlayButton();
        }
    });
}

function loadTrack(index) {
    if (index < 0 || index >= PLAYLIST.length) return;
    
    currentTrackIndex = index;
    const track = PLAYLIST[index];
    
    audioPlayer.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Try to play (may fail due to autoplay restrictions)
    audioPlayer.load();
    if (isPlaying) {
        audioPlayer.play().catch(() => {
            isPlaying = false;
            updatePlayButton();
        });
    }
}

function togglePlayPause() {
    if (PLAYLIST.length === 0) {
        alert('No tracks available. Please add audio files to the PLAYLIST array in script.js');
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play().catch(err => {
            console.error('Playback failed:', err);
            alert('Unable to play audio. Please check your audio file paths.');
        });
        isPlaying = true;
    }
    updatePlayButton();
}

function updatePlayButton() {
    const playIcon = btnPlayPause.querySelector('.play-icon');
    const pauseIcon = btnPlayPause.querySelector('.pause-icon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

function previousTrack() {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : PLAYLIST.length - 1;
    loadTrack(newIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    loadTrack(newIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = audioPlayer.currentTime;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

function seekTo(event) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    const volumeIcon = btnMute.querySelector('.volume-icon');
    const muteIcon = btnMute.querySelector('.mute-icon');
    
    if (audioPlayer.muted) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
    } else {
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
    }
}

// ============================================
// CLOCK
// ============================================

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockTime.textContent = `${hours}:${minutes}`;
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    clockDate.textContent = now.toLocaleDateString('en-US', options);
}

// ============================================
// TIMER
// ============================================

function initializeTimer() {
    updateTimerDisplay();
}

function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            stopTimer();
            // Notification when timer completes
            if (Notification.permission === 'granted') {
                new Notification('Timer Complete!', {
                    body: 'Your focus session is complete.',
                    icon: '/favicon.ico'
                });
            }
        }
    }, 1000);
    
    timerStart.style.display = 'none';
    timerPause.style.display = 'inline-block';
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerStart.style.display = 'inline-block';
    timerPause.style.display = 'none';
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// TODO LIST
// ============================================

function initializeTodos() {
    renderTodos();
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    
    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    
    todoInput.value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('calmcove-todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:2rem;">No tasks yet</p>';
        return;
    }
    
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete">×</button>
        `;
        
        item.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        item.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(item);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// PANEL MANAGEMENT
// ============================================

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const isOpen = panel.classList.contains('open');
    
    // Close all panels
    document.querySelectorAll('.panel').forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-hidden', 'true');
    });
    
    if (!isOpen) {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Music player controls
    btnPlayPause.addEventListener('click', togglePlayPause);
    btnPrev.addEventListener('click', previousTrack);
    btnNext.addEventListener('click', nextTrack);
    btnMute.addEventListener('click', toggleMute);
    
    // Progress bar
    progressBar.addEventListener('input', (e) => {
        audioPlayer.currentTime = e.target.value;
    });
    progressBar.addEventListener('click', seekTo);
    
    // Volume
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
        document.getElementById('volume-value').textContent = `${e.target.value}%`;
    });
    
    // Toolbar buttons
    document.getElementById('btn-scenes').addEventListener('click', () => togglePanel('scene-panel'));
    document.getElementById('btn-timer').addEventListener('click', () => togglePanel('timer-panel'));
    document.getElementById('btn-todo').addEventListener('click', () => togglePanel('todo-panel'));
    document.getElementById('btn-settings').addEventListener('click', () => togglePanel('settings-panel'));
    
    // Panel close buttons
    document.getElementById('close-scenes').addEventListener('click', () => togglePanel('scene-panel'));
    document.getElementById('close-timer').addEventListener('click', () => togglePanel('timer-panel'));
    document.getElementById('close-todo').addEventListener('click', () => togglePanel('todo-panel'));
    document.getElementById('close-settings').addEventListener('click', () => togglePanel('settings-panel'));
    
    // Timer controls
    timerStart.addEventListener('click', startTimer);
    timerPause.addEventListener('click', pauseTimer);
    timerReset.addEventListener('click', resetTimer);
    
    // Timer presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            timerSeconds = minutes * 60;
            updateTimerDisplay();
        });
    });
    
    // Todo controls
    todoAdd.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            previousTrack();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextTrack();
        } else if (e.code === 'KeyM') {
            e.preventDefault();
            toggleMute();
        } else if (e.code === 'Escape') {
            document.querySelectorAll('.panel.open').forEach(p => togglePanel(p.id));
        }
    });
    
    // Request notification permission for timer
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

