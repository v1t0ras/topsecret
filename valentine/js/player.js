// player.js — Music Player Logic

const PLAYER = {
  audio: null,
  currentIndex: 0,
  isPlaying: false,
  duration: 0,
  updateInterval: null,

  init() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';

    this.bindAudioEvents();
    this.bindUIEvents();
    this.loadTrack(0);
    this.updateUI();
  },

  bindAudioEvents() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.updateTimeDisplay();
      this.updateProgressUI();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgressUI();
      this.updateTimeDisplay();
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayButton();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayButton();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.showError('Erro ao carregar a música');
      this.next();
    });

    this.audio.addEventListener('waiting', () => {
      // Could show loading state
    });

    this.audio.addEventListener('canplay', () => {
      // Ready to play
    });
  },

  bindUIEvents() {
    // Play/Pause
    document.getElementById('btn-play')?.addEventListener('click', () => this.togglePlay());

    // Prev/Next
    document.getElementById('btn-prev')?.addEventListener('click', () => this.prev());
    document.getElementById('btn-next')?.addEventListener('click', () => this.next());

    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.addEventListener('input', (e) => this.seek(e));
      progressBar.addEventListener('change', (e) => this.seek(e));
      // Click to seek
      progressBar.addEventListener('click', (e) => {
        if (e.target === progressBar || e.target.classList.contains('progress-fill')) {
          const rect = progressBar.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          this.seekToPercent(percent);
        }
      });
    }

    // Volume
    const volumeBtn = document.getElementById('btn-volume');
    const volumeSlider = document.getElementById('volume-slider');

    volumeBtn?.addEventListener('click', () => this.toggleMute());
    volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));

    // Keyboard shortcuts (when player focused)
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowLeft') {
        this.seekRelative(-10);
      } else if (e.code === 'ArrowRight') {
        this.seekRelative(10);
      } else if (e.code === 'ArrowUp') {
        this.setVolume(Math.min(1, this.audio.volume + 0.1));
      } else if (e.code === 'ArrowDown') {
        this.setVolume(Math.max(0, this.audio.volume - 0.1));
      } else if (e.code === 'KeyM') {
        this.toggleMute();
      }
    });
  },

  loadTrack(index) {
    const playlist = CONFIG.playlist;
    if (!playlist.length) {
      this.setEmptyState();
      return;
    }

    this.currentIndex = (index + playlist.length) % playlist.length;
    const track = playlist[this.currentIndex];

    this.audio.src = track.src;
    this.audio.load();

    // Update track info
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;

    // Update track art (placeholder for now)
    const artEl = document.getElementById('track-art');
    if (artEl) {
      artEl.textContent = '♪';
    }

    this.clearError();
  },

  play() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Autoplay blocked:', err);
        // User interaction required
      });
    }
  },

  pause() {
    this.audio.pause();
  },

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  prev() {
    this.loadTrack(this.currentIndex - 1);
    this.play();
  },

  next() {
    this.loadTrack(this.currentIndex + 1);
    this.play();
  },

  seek(e) {
    const percent = e.target.value / 100;
    this.seekToPercent(percent);
  },

  seekToPercent(percent) {
    if (this.duration) {
      this.audio.currentTime = this.duration * percent;
    }
  },

  seekRelative(seconds) {
    if (this.duration) {
      this.audio.currentTime = Math.max(0, Math.min(this.duration, this.audio.currentTime + seconds));
    }
  },

  setVolume(value) {
    const vol = parseFloat(value);
    this.audio.volume = vol;
    this.updateVolumeUI(vol);
  },

  toggleMute() {
    if (this.audio.volume > 0) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = 0.7; // Default volume
      document.getElementById('volume-slider').value = 0.7;
    }
    this.updateVolumeUI(this.audio.volume);
  },

  updatePlayButton() {
    const btn = document.getElementById('btn-play');
    if (btn) {
      btn.classList.toggle('playing', this.isPlaying);
      btn.setAttribute('aria-label', this.isPlaying ? 'Pausar' : 'Tocar');
    }
  },

  updateProgressUI() {
    if (!this.duration) return;

    const percent = (this.audio.currentTime / this.duration) * 100;
    const fill = document.getElementById('progress-fill');
    const handle = document.getElementById('progress-handle');
    const bar = document.getElementById('progress-bar');

    if (fill) fill.style.width = `${percent}%`;
    if (handle) handle.style.left = `${percent}%`;
    if (bar) {
      bar.setAttribute('aria-valuenow', Math.round(percent));
      bar.value = percent;
    }
  },

  updateTimeDisplay() {
    const currentEl = document.getElementById('time-current');
    const totalEl = document.getElementById('time-total');

    if (currentEl) currentEl.textContent = this.formatTime(this.audio.currentTime);
    if (totalEl) totalEl.textContent = this.formatTime(this.duration);
  },

  updateVolumeUI(volume) {
    const btn = document.getElementById('btn-volume');
    const slider = document.getElementById('volume-slider');

    if (btn) {
      btn.classList.toggle('muted', volume === 0);
      btn.setAttribute('aria-label', volume === 0 ? 'Ativar som' : 'Silenciar');
    }
    if (slider) slider.value = volume;
  },

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  showError(message) {
    const player = document.getElementById('music-player');
    if (player) {
      player.dataset.error = message;
    }
  },

  clearError() {
    const player = document.getElementById('music-player');
    if (player) {
      delete player.dataset.error;
    }
  },

  setEmptyState() {
    const player = document.getElementById('music-player');
    if (player) {
      player.dataset.empty = 'true';
    }
  },

  updateUI() {
    this.updatePlayButton();
    this.updateProgressUI();
    this.updateTimeDisplay();
    this.updateVolumeUI(this.audio.volume);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PLAYER.init());
} else {
  PLAYER.init();
}

window.PLAYER = PLAYER;