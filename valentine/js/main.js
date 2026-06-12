// main.js — Global Initialization & Utilities

// Set page title from config
document.title = CONFIG.siteTitle || document.title;

// Populate dynamic content from config
function populateContent() {
  // Hero
  const heroMessage = document.getElementById('hero-message');
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroMessage) heroMessage.textContent = CONFIG.heroMessage;
  if (heroSubtitle) heroSubtitle.textContent = CONFIG.heroSubtitle;

  // Footer
  const footerText = document.getElementById('footer-text');
  if (footerText) {
    footerText.textContent = `Feito com amor por ${CONFIG.senderName} para ${CONFIG.recipientName} 💕`;
  }

  // Reasons
  const reasonsList = document.getElementById('reasons-list');
  if (reasonsList && CONFIG.reasons) {
    reasonsList.innerHTML = CONFIG.reasons.map((reason, i) => `
      <li class="reason-item" style="animation-delay: ${i * 100}ms">
        <span class="reason-bullet">♥</span>
        <span class="reason-text">${reason}</span>
      </li>
    `).join('');
  }
}

// IntersectionObserver for scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe sections
  document.querySelectorAll('.section').forEach(section => {
    if (!section.classList.contains('hero')) {
      observer.observe(section);
    }
  });
}

// Hero canvas particle effect (hearts floating up)
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let hearts = [];
  let animationId = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function createHeart() {
    const size = 40 + Math.random() * 60;
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + size,
      size,
      speed: 0.5 + Math.random() * 1,
      sway: Math.random() * 2 - 1,
      swaySpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.1 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  function drawHeart(ctx, heart) {
    ctx.save();
    ctx.translate(heart.x, heart.y);
    ctx.rotate(heart.rotation);
    ctx.globalAlpha = heart.opacity;
    ctx.font = `${heart.size}px Arial`;
    ctx.fillText('♥', 0, 0);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new hearts occasionally
    if (Math.random() < 0.02 && hearts.length < 30) {
      hearts.push(createHeart());
    }

    // Update and draw hearts
    hearts = hearts.filter(heart => {
      heart.y -= heart.speed;
      heart.x += heart.sway;
      heart.sway *= 0.99;
      heart.rotation += heart.rotationSpeed;

      drawHeart(ctx, heart);

      return heart.y > -heart.size;
    });

    animationId = requestAnimationFrame(animate);
  }

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  });

  // Start animation
  resize();
  animate();

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Detect if user prefers reduced motion
function respectsReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize everything
function init() {
  populateContent();

  if (!respectsReducedMotion()) {
    initHeroCanvas();
    initScrollAnimations();
  }

  initSmoothScroll();

  // Add loaded class for CSS transitions
  document.body.classList.add('loaded');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Utility: Format time helper (shared)
window.formatTime = function(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Export for debugging
window.CONFIG = CONFIG;