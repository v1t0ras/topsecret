// puzzle.js — Cipher Decoder Logic

const PUZZLE = {
  currentBlock: 0,
  revealedBlocks: new Set(),
  blocks: [],

  init() {
    this.blocks = CONFIG.puzzle.blocks || [];
    this.buildProgressSegments();
    this.renderLetterDisplay();
    this.renderQuestion();
    this.bindEvents();
  },

  buildProgressSegments() {
    const container = document.getElementById('progress-segments');
    if (!container) return;

    container.innerHTML = '';
    this.blocks.forEach((_, index) => {
      const segment = document.createElement('div');
      segment.className = 'progress-segment';
      segment.dataset.index = index;
      segment.textContent = index + 1;
      segment.setAttribute('role', 'listitem');
      segment.setAttribute('aria-label', `Bloco ${index + 1}`);
      container.appendChild(segment);
    });

    this.updateProgressUI();
  },

  renderLetterDisplay() {
    const display = document.getElementById('letter-display');
    if (!display) return;

    display.innerHTML = '';

    this.blocks.forEach((block, index) => {
      const blockEl = document.createElement('div');
      blockEl.className = 'letter-block';
      blockEl.dataset.index = index;
      blockEl.setAttribute('aria-live', 'polite');

      if (this.revealedBlocks.has(index)) {
        blockEl.classList.add('revealed');
        blockEl.textContent = this.decrypt(block.encryptedText);
      } else {
        blockEl.textContent = this.scramble(block.encryptedText);
      }

      display.appendChild(blockEl);
    });
  },

  // Simple Caesar cipher decryption (shift -3)
  decrypt(text) {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) - 3 + 26) % 26 + 'a'.charCodeAt(0));
      }
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) - 3 + 26) % 26 + 'A'.charCodeAt(0));
      }
      return char;
    }).join('');
  },

  // Scramble for display (show encrypted version)
  scramble(text) {
    return text.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        // Show as symbol or keep some letters visible
        const symbols = '◆◇○●■□▲△★☆';
        return symbols[Math.floor(Math.random() * symbols.length)];
      }
      return char;
    }).join('');
  },

  // Animate character-by-character reveal
  async animateReveal(blockIndex) {
    const blockEl = document.querySelector(`.letter-block[data-index="${blockIndex}"]`);
    if (!blockEl) return;

    const decrypted = this.decrypt(this.blocks[blockIndex].encryptedText);
    blockEl.classList.add('decrypting');

    // Character by character reveal
    for (let i = 0; i <= decrypted.length; i++) {
      blockEl.textContent = decrypted.slice(0, i) + this.scramble(decrypted.slice(i));
      await this.sleep(30);
    }

    blockEl.classList.remove('decrypting');
    blockEl.classList.add('revealed');
    blockEl.textContent = decrypted;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  renderQuestion() {
    const area = document.getElementById('question-area');
    if (!area) return;

    if (this.currentBlock >= this.blocks.length) {
      this.showReveal();
      return;
    }

    const block = this.blocks[this.currentBlock];

    // Skip if already revealed
    if (this.revealedBlocks.has(this.currentBlock)) {
      this.nextBlock();
      return;
    }

    area.innerHTML = `
      <div class="question-card">
        <p class="question-card__text">${block.question}</p>
        <div class="question-input-group">
          <input
            type="text"
            class="question-input"
            id="question-input"
            placeholder="Sua resposta"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            aria-label="Resposta para a pergunta"
          >
          <button class="question-submit" id="question-submit">Confirmar</button>
        </div>
        <p class="question-hint hidden" id="question-hint"></p>
        <p class="question-error hidden" id="question-error"></p>
        <p class="question-attempts" id="question-attempts"></p>
      </div>
    `;

    this.bindQuestionEvents();
    this.updateProgressUI();
  },

  bindQuestionEvents() {
    const input = document.getElementById('question-input');
    const submit = document.getElementById('question-submit');
    const hintEl = document.getElementById('question-hint');
    const errorEl = document.getElementById('question-error');

    if (!input || !submit) return;

    const block = this.blocks[this.currentBlock];
    let attempts = 0;

    const checkAnswer = async () => {
      const answer = input.value.trim().toLowerCase();
      const correct = block.answer.toLowerCase();

      if (!answer) {
        this.showError('Digite uma resposta');
        input.focus();
        return;
      }

      if (answer === correct) {
        // Correct!
        input.classList.remove('error');
        input.classList.add('success');
        submit.disabled = true;

        // Mark as revealed
        this.revealedBlocks.add(this.currentBlock);

        // Animate reveal
        await this.animateReveal(this.currentBlock);

        // Update UI
        this.updateProgressUI();

        // Next block after delay
        setTimeout(() => this.nextBlock(), 800);
      } else {
        // Wrong
        attempts++;
        input.classList.add('error');
        input.classList.remove('success');
        this.showError('Resposta incorreta. Tente novamente.');

        setTimeout(() => input.classList.remove('error'), 400);

        // Show hint after 3 attempts
        if (attempts >= 3) {
          hintEl.textContent = `Dica: a resposta tem ${correct.length} letras e começa com "${correct[0]}"`;
          hintEl.classList.remove('hidden');
        }

        document.getElementById('question-attempts').textContent = `Tentativas: ${attempts}`;
        input.value = '';
        input.focus();
      }
    };

    submit.addEventListener('click', checkAnswer);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });

    // Clear error on input
    input.addEventListener('input', () => {
      errorEl.classList.add('hidden');
      input.classList.remove('error');
    });

    // Focus input
    setTimeout(() => input.focus(), 100);
  },

  showError(message) {
    const errorEl = document.getElementById('question-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  },

  nextBlock() {
    this.currentBlock++;
    this.renderQuestion();
  },

  showReveal() {
    const area = document.getElementById('question-area');
    const reveal = document.getElementById('puzzle-reveal');
    const message = document.getElementById('reveal-message');

    if (area) area.style.display = 'none';
    if (reveal) {
      reveal.classList.remove('hidden');
      document.querySelector('.puzzle-container').classList.add('puzzle-complete');
    }
    if (message) message.textContent = CONFIG.puzzle.revealMessage;

    // Create celebration hearts
    const heartsContainer = document.querySelector('.reveal-hearts');
    if (heartsContainer) {
      heartsContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement('span');
        heart.className = 'reveal-heart';
        heart.textContent = ['💕', '💖', '💗', '💓', '💞'][i];
        heartsContainer.appendChild(heart);
      }
    }
  },

  updateProgressUI() {
    // Update progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${this.revealedBlocks.size} de ${this.blocks.length} blocos revelados`;
    }

    // Update segments
    document.querySelectorAll('.progress-segment').forEach((seg, index) => {
      seg.classList.toggle('revealed', this.revealedBlocks.has(index));
      seg.classList.toggle('current', index === this.currentBlock && !this.revealedBlocks.has(index));
    });
  },

  bindEvents() {
    // No global events needed for now
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PUZZLE.init());
} else {
  PUZZLE.init();
}

window.PUZZLE = PUZZLE;