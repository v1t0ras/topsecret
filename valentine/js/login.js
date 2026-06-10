// login.js — Login Screen Logic

const LOGIN = {
  attempts: 0,
  hintShown: false,

  // Simple hash function (works everywhere, not cryptographically secure)
  // FNV-1a 32-bit converted to 64-char hex string
  hash(input) {
    const str = input.toLowerCase().trim();
    let hash = 0x811c9dc5; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193); // FNV prime
    }
    // Convert to 64-char hex (padded) to match SHA-256 length format
    return (hash >>> 0).toString(16).padStart(8, '0').repeat(8).slice(0, 64);
  },

  checkBypass() {
    return new URLSearchParams(window.location.search).has(CONFIG.login.unlockQueryParam);
  },

  verify(password) {
    if (!password) return false;
    const hash = this.hash(password);
    const storedHash = CONFIG.login.passwordHash.replace('sha256:', '');
    return hash === storedHash;
  },

  showHint() {
    const hintEl = document.getElementById('login-hint');
    hintEl.textContent = `Dica: ${CONFIG.login.hint}`;
    hintEl.classList.remove('hidden');
    this.hintShown = true;
  },

  showError(message) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  },

  clearMessages() {
    document.getElementById('login-error').classList.add('hidden');
    // Don't auto-hide hint once shown
  },

  async unlock() {
    const loginScreen = document.getElementById('login-screen');
    const siteContent = document.getElementById('site-content');

    // Mark as unlocked in session
    sessionStorage.setItem('unlocked', 'true');

    // Animate out
    loginScreen.style.opacity = '0';
    loginScreen.style.pointerEvents = 'none';

    // Small delay then show content
    setTimeout(() => {
      loginScreen.classList.add('hidden');
      siteContent.classList.remove('hidden');
      document.body.classList.add('unlocked');

      // Trigger entrance animations
      this.triggerEntranceAnimations();
    }, 400);
  },

  triggerEntranceAnimations() {
    // Stagger section animations
    const sections = document.querySelectorAll('#site-content > section');
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.animation = `slideUp 0.8s ease ${index * 0.1}s forwards`;
    });
  },

  lock() {
    const loginScreen = document.getElementById('login-screen');
    const siteContent = document.getElementById('site-content');

    sessionStorage.removeItem('unlocked');
    siteContent.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginScreen.style.opacity = '1';
    loginScreen.style.pointerEvents = 'auto';
    document.body.classList.remove('unlocked');

    // Reset form
    document.getElementById('password-input').value = '';
    this.attempts = 0;
    this.hintShown = false;
    document.getElementById('login-hint').classList.add('hidden');
    document.getElementById('login-error').classList.add('hidden');
  },

  init() {
    // Check if already unlocked in this session
    if (sessionStorage.getItem('unlocked') === 'true' || this.checkBypass()) {
      // Skip login screen entirely
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('site-content').classList.remove('hidden');
      document.body.classList.add('unlocked');
      return;
    }

    // Show login screen, hide site content
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('site-content').classList.add('hidden');

    // Set title from config
    document.getElementById('login-title').textContent = `Para ${CONFIG.recipientName} 💕`;
    document.getElementById('login-subtitle').textContent = CONFIG.login.hint
      ? 'Digite a senha para continuar'
      : 'Digite a senha para continuar';

    // Form submit handler
    const form = document.getElementById('login-form');
    const input = document.getElementById('password-input');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearMessages();

      const password = input.value;
      if (!password) {
        this.showError('Por favor, digite uma senha');
        input.focus();
        return;
      }

      const isValid = await this.verify(password);

      if (isValid) {
        // Success
        input.classList.remove('shake');
        await this.unlock();
      } else {
        // Failure
        this.attempts++;
        input.value = '';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);

        this.showError('Senha incorreta. Tente novamente.');

        if (this.attempts >= CONFIG.login.maxAttemptsBeforeHint && !this.hintShown) {
          setTimeout(() => this.showHint(), 600);
        }

        input.focus();
      }
    });

    // Clear error on input
    input.addEventListener('input', () => {
      document.getElementById('login-error').classList.add('hidden');
      input.classList.remove('shake');
    });

    // Focus input on load
    setTimeout(() => input.focus(), 100);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LOGIN.init());
} else {
  LOGIN.init();
}

// Export for debugging
window.LOGIN = LOGIN;