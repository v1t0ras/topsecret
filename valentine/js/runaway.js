// runaway.js — Runaway Button Logic

const RUNAWAY = {
  btn: null,
  container: null,
  attempts: 0,
  maxAttempts: 8,
  caught: false,
  isMobile: false,

  init() {
    this.btn = document.getElementById('runaway-btn');
    this.container = document.getElementById('runaway-container');
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!this.btn || !this.container) return;

    this.btn.textContent = CONFIG.runawayButtonLabel;
    this.bindEvents();

    // Initial position - center of container
    this.positionButton();
  },

  bindEvents() {
    if (this.isMobile) {
      // On mobile: only run on touch/click
      this.btn.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
      this.btn.addEventListener('click', () => this.handleClick());
    } else {
      // On desktop: run on hover and click
      this.btn.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.btn.addEventListener('click', () => this.handleClick());
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    // Reposition on resize
    window.addEventListener('resize', () => this.positionButton());

    // Reposition on scroll
    window.addEventListener('scroll', () => this.positionButton());
  },

  handleMouseMove(e) {
    if (this.caught) return;

    const btnRect = this.btn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // Vector from cursor to button center (flee direction)
    const dx = btnCenterX - e.clientX;
    const dy = btnCenterY - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only flee if cursor is close enough (~150px)
    if (distance < 150) {
      const speed = 180; // px to flee
      const newX = btnCenterX + (dx / distance) * speed;
      const newY = btnCenterY + (dy / distance) * speed;

      this.setPosition(newX, newY);
    }
  },

  handleTouch(e) {
    if (this.caught) return;
    // On touch, just trigger the click handler
    // The button will run away after the tap
  },

  handleClick() {
    if (this.caught) return;

    this.attempts++;

    if (this.attempts >= this.maxAttempts) {
      this.catch();
    } else {
      this.escape();
      // Flee to random nearby position on click
      this.fleeRandom();
    }
  },

  escape() {
    const messages = CONFIG.runawayEscapeMessages;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    this.showMessage(msg);
  },

  catch() {
    this.caught = true;
    this.btn.textContent = CONFIG.runawayCatchMessage;
    this.btn.classList.add('caught');
    this.btn.disabled = true;

    // Show celebration
    this.showCelebration();
  },

  fleeRandom() {
    const containerRect = this.container.getBoundingClientRect();
    const btnRect = this.btn.getBoundingClientRect();

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 80;
    const newX = btnRect.left + btnRect.width / 2 + Math.cos(angle) * distance;
    const newY = btnRect.top + btnRect.height / 2 + Math.sin(angle) * distance;

    this.setPosition(newX, newY);
  },

  setPosition(x, y) {
    const containerRect = this.container.getBoundingClientRect();
    const btnWidth = this.btn.offsetWidth;
    const btnHeight = this.btn.offsetHeight;

    // Convert to container-relative coordinates
    let relX = x - containerRect.left - btnWidth / 2;
    let relY = y - containerRect.top - btnHeight / 2;

    // Clamp to container bounds with padding
    const padding = 20;
    relX = Math.max(padding, Math.min(relX, containerRect.width - btnWidth - padding));
    relY = Math.max(padding, Math.min(relY, containerRect.height - btnHeight - padding));

    this.btn.style.position = 'absolute';
    this.btn.style.left = `${relX}px`;
    this.btn.style.top = `${relY}px`;
    this.btn.style.transform = 'none';
  },

  positionButton() {
    // Center the button in container
    const containerRect = this.container.getBoundingClientRect();
    const btnWidth = this.btn.offsetWidth;
    const btnHeight = this.btn.offsetHeight;

    const relX = (containerRect.width - btnWidth) / 2;
    const relY = (containerRect.height - btnHeight) / 2;

    this.btn.style.position = 'absolute';
    this.btn.style.left = `${relX}px`;
    this.btn.style.top = `${relY}px`;
    this.btn.style.transform = 'none';
  },

  showMessage(text) {
    const msgEl = document.getElementById('runaway-message');
    if (!msgEl) return;

    const btnRect = this.btn.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    msgEl.textContent = text;
    msgEl.style.left = `${btnRect.left - containerRect.left + btnRect.width / 2}px`;
    msgEl.style.top = `${btnRect.top - containerRect.top - 10}px`;
    msgEl.classList.remove('hidden');

    // Trigger animation
    msgEl.style.animation = 'none';
    msgEl.offsetHeight; // Force reflow
    msgEl.style.animation = 'floatUp 1.5s ease-out forwards';

    setTimeout(() => {
      msgEl.classList.add('hidden');
    }, 1500);
  },

  showCelebration() {
    // Create burst of hearts
    for (let i = 0; i < 12; i++) {
      setTimeout(() => this.createHeart(), i * 80);
    }

    // Show caught message
    const msgEl = document.getElementById('runaway-message');
    if (msgEl) {
      msgEl.textContent = CONFIG.runawayCatchMessage;
      msgEl.style.left = '50%';
      msgEl.style.top = '50%';
      msgEl.style.transform = 'translate(-50%, -50%)';
      msgEl.style.fontSize = '1.5rem';
      msgEl.classList.remove('hidden');
    }
  },

  createHeart() {
    const heart = document.createElement('div');
    heart.className = 'celebration-heart';
    heart.textContent = ['💕', '💖', '💗', '💓', '💞'][Math.floor(Math.random() * 5)];

    const btnRect = this.btn.getBoundingClientRect();
    heart.style.left = `${btnRect.left + btnRect.width / 2}px`;
    heart.style.top = `${btnRect.top + btnRect.height / 2}px`;

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RUNAWAY.init());
} else {
  RUNAWAY.init();
}

window.RUNAWAY = RUNAWAY;