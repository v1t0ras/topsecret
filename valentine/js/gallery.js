// gallery.js — Gallery Lightbox Logic

const GALLERY = {
  currentIndex: 0,
  items: [],
  touchStartX: 0,

  init() {
    this.buildGrid();
    this.buildLightbox();
    this.bindEvents();
  },

  buildGrid() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    CONFIG.gallery.forEach((item, index) => {
      const isVideo = item.type === 'video' || (item.src && item.src.endsWith('.mp4'));
      const el = document.createElement(isVideo ? 'div' : 'figure');
      el.className = `gallery-item${isVideo ? ' gallery-item--video' : ''}`;
      el.dataset.index = index;
      el.tabIndex = 0;
      el.setAttribute('role', 'listitem');
      el.setAttribute('aria-label', item.caption || `Foto ${index + 1}`);

      if (isVideo) {
        el.innerHTML = `
          <video class="gallery-thumb" src="${item.src}" muted preload="metadata" playsinline></video>
          <div class="gallery-play-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <figcaption class="gallery-item__caption">${item.caption || ''}</figcaption>
        `;
      } else {
        el.innerHTML = `
          <img class="gallery-thumb" src="${item.src}" alt="${item.caption || ''}" loading="lazy">
          <figcaption class="gallery-item__caption">${item.caption || ''}</figcaption>
        `;
      }

      el.addEventListener('click', () => this.open(index));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });

      grid.appendChild(el);
    });

    this.items = Array.from(grid.children);
  },

  buildLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visualizador de mídia');
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Próxima">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <div class="lightbox__content">
        <!-- Media injected here -->
        <p class="lightbox__caption"></p>
      </div>
      <span class="lightbox__counter" aria-live="polite"></span>
      <div class="lightbox__hint" aria-hidden="true">
        <span>← / → Navegar</span>
        <span>Espaço Play/Pause</span>
        <span>Esc Fechar</span>
      </div>
    `;
    document.body.appendChild(lightbox);

    this.lightbox = lightbox;
    this.lightboxContent = lightbox.querySelector('.lightbox__content');
    this.lightboxCaption = lightbox.querySelector('.lightbox__caption');
    this.lightboxCounter = lightbox.querySelector('.lightbox__counter');
    this.lightboxClose = lightbox.querySelector('.lightbox__close');
    this.lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
    this.lightboxNext = lightbox.querySelector('.lightbox__nav--next');
  },

  bindEvents() {
    this.lightboxClose.addEventListener('click', () => this.close());
    this.lightboxPrev.addEventListener('click', () => this.prev());
    this.lightboxNext.addEventListener('click', () => this.next());

    // Close on background click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Touch swipe
    this.lightbox.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      if (Math.abs(dx) > 50) {
        dx > 0 ? this.prev() : this.next();
      }
    }, { passive: true });

    // Prevent body scroll when open
    this.lightbox.addEventListener('touchmove', (e) => {
      if (this.lightbox.classList.contains('open')) {
        e.preventDefault();
      }
    }, { passive: false });
  },

  handleKeydown(e) {
    if (!this.lightbox.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case ' ': // Space for video play/pause
        const media = this.lightboxContent.querySelector('video');
        if (media) {
          e.preventDefault();
          media.paused ? media.play() : media.pause();
        }
        break;
    }
  },

  open(index) {
    this.currentIndex = index;
    this.renderMedia();
    this.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.updateCounter();
    this.updateNav();

    // Focus trap
    this.lightboxClose.focus();
  },

  close() {
    this.lightbox.classList.remove('open');
    document.body.style.overflow = '';

    // Pause any playing video
    const video = this.lightboxContent.querySelector('video');
    if (video) video.pause();

    // Return focus to gallery item
    this.items[this.currentIndex]?.focus();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
    this.renderMedia();
    this.updateCounter();
    this.updateNav();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % CONFIG.gallery.length;
    this.renderMedia();
    this.updateCounter();
    this.updateNav();
  },

  renderMedia() {
    const item = CONFIG.gallery[this.currentIndex];
    const isVideo = item.type === 'video' || (item.src && item.src.endsWith('.mp4'));

    this.lightboxContent.innerHTML = '';

    if (isVideo) {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsinline = true;
      video.className = 'lightbox__media';
      this.lightboxContent.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || '';
      img.className = 'lightbox__media';
      this.lightboxContent.appendChild(img);
    }

    this.lightboxCaption.textContent = item.caption || '';
  },

  updateCounter() {
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${CONFIG.gallery.length}`;
  },

  updateNav() {
    // Nav buttons always visible on desktop, hidden on mobile via CSS
    this.lightboxPrev.disabled = false;
    this.lightboxNext.disabled = false;
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GALLERY.init());
} else {
  GALLERY.init();
}

window.GALLERY = GALLERY;