# Valentine's Day Website — Implementation Plan

> **Deadline:** June 12 (3 days) | **Stack:** Vanilla HTML/CSS/JS | **Deploy:** Docker on VPS

---

## 1. Context & Why

This is a personal, emotionally meaningful gift — a website that functions as a love letter delivered through code. The goal is to create an experience that feels intimate and handcrafted, not like a template. Every interaction should feel like it was made specifically for one person.

**Why vanilla HTML/CSS/JS (no framework):**
- Zero build tooling overhead means faster iteration in a 3-day sprint
- The entire project is portable — a single folder that runs anywhere
- Easier to edit messages and swap assets without knowing React/Vue
- Docker deployment is trivially simple with a static file server

**Why Docker:**
- Reproducible environment on any VPS
- Easy to update: `git pull && docker-compose up -d --build`
- HTTPS via reverse proxy (Nginx or Caddy) in front of the container
- Port isolation — the site runs on a predictable internal port

---

## 2. Architecture Decisions

### Static Site + Nginx Container
No server-side logic is needed. A container running Nginx serves static files. This means:
- No database, no backend, no Node.js runtime in production
- The entire site is a folder of HTML/CSS/JS/assets
- Updates are just file replacements + container restart

### Messages Stored as JS Config
All text content (messages, captions, names) lives in a single `config.js` file. The rest of the JS reads from it. This means editing the content never requires touching layout or logic code.

### Assets Organised by Type
Photos, videos, and music go in clearly named subdirectories. The gallery and player components read from manifest arrays in `config.js`, so adding a new photo is one line.

### Mobile-First Responsive Design
The site will likely be viewed on a phone. All layouts default to single-column and scale up for desktop.

### Login / Password Protection Screen ✅ **REQUIRED**

**Concept:** A full-screen overlay that blocks access to all site content until the correct password is entered. Not real security (it's client-side), but Keeps casual browsers out and adds a deliberate "unlocking" moment that fits the gift narrative.

**Implementation:**
```
- Single HTML overlay (<div id="login-screen">) covering entire viewport
- Centered card with: site title, password input, submit button, subtle hint
- Password stored in config.js as a SHA-256 hash (not plaintext)
- On submit: hash entered value via Web Crypto API, compare to stored hash
- Success: fade out login screen, reveal site with entrance animation
- Failure: shake animation, increment attempt counter, show hint after 3 fails
- SessionStorage flag: "unlocked=true" persists for session (no re-prompt on refresh)
- Escape hatch: ?unlock=1 query param bypasses login (for your testing)
```

**config.js additions:**
```javascript
// Login / Password Protection
login: {
  enabled: true,
  passwordHash: "sha256:...",    // Generate with: crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
  hint: "Our anniversary date (DDMM)",  // Subtle hint shown after 3 failed attempts
  maxAttemptsBeforeHint: 3,
  unlockQueryParam: "unlock"     // ?unlock=1 bypasses for dev
}
```

**Login Screen HTML Structure:**
```html
<div id="login-screen" role="dialog" aria-modal="true" aria-label="Acesso ao site">
  <div class="login-card">
    <h1>Para você 💕</h1>
    <p class="login-subtitle">Digite a senha para continuar</p>
    <form id="login-form">
      <input 
        type="password" 
        id="password-input" 
        autocomplete="off" 
        placeholder="Senha"
        aria-label="Senha de acesso"
      >
      <button type="submit">Entrar</button>
    </form>
    <p id="login-hint" class="hidden" aria-live="polite"></p>
    <p id="login-error" class="hidden" aria-live="assertive"></p>
  </div>
</div>

<!-- All site content starts hidden -->
<main id="site-content" class="hidden">
  <!-- hero, gallery, puzzle, etc. -->
</main>
```

**CSS Key Points:**
- `#login-screen`: fixed, inset-0, flex center, z-index: 1000, background: var(--bg-dark)
- `.login-card`: max-width 360px, padding 2rem, border-radius, subtle glow
- `#site-content.hidden`: display: none (not opacity — prevent tab focus)
- Entrance animation: login screen fades out (opacity 0 → pointer-events none), site content fades in with stagger

**JS Logic (login.js):**
```javascript
// login.js
const LOGIN = {
  async hash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  },

  checkBypass() {
    return new URLSearchParams(window.location.search).has(CONFIG.login.unlockQueryParam);
  },

  async verify(password) {
    const hash = await this.hash(password.toLowerCase().trim());
    return hash === CONFIG.login.passwordHash.replace('sha256:', '');
  },

  showHint() {
    const hintEl = document.getElementById('login-hint');
    hintEl.textContent = `Dica: ${CONFIG.login.hint}`;
    hintEl.classList.remove('hidden');
  },

  init() {
    if (sessionStorage.getItem('unlocked') === 'true' || this.checkBypass()) {
      this.unlock();
      return;
    }
    // Show login screen, hide site content
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('site-content').classList.add('hidden');
    
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('password-input');
      const errorEl = document.getElementById('login-error');
      
      if (await this.verify(input.value)) {
        sessionStorage.setItem('unlocked', 'true');
        this.unlock();
      } else {
        this.attempts++;
        input.value = '';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
        errorEl.textContent = 'Senha incorreta. Tente novamente.';
        errorEl.classList.remove('hidden');
        if (this.attempts >= CONFIG.login.maxAttemptsBeforeHint) this.showHint();
      }
    });
  },

  unlock() {
    const loginScreen = document.getElementById('login-screen');
    const siteContent = document.getElementById('site-content');
    loginScreen.style.opacity = '0';
    loginScreen.style.pointerEvents = 'none';
    siteContent.classList.remove('hidden');
    // Trigger entrance animations for hero, etc.
    document.body.classList.add('unlocked');
  }
};

LOGIN.init();
```

**File Structure Update:**
```
valentine/
├── index.html
├── config.js
│
├── css/
│   ├── reset.css
│   ├── main.css
│   ├── gallery.css
│   ├── player.css
│   ├── runaway.css
│   ├── puzzle.css
│   └── login.css           ← NEW
│
├── js/
│   ├── gallery.js
│   ├── player.js
│   ├── runaway.js
│   ├── puzzle.js
│   └── login.js            ← NEW
│
├── assets/
│   ├── photos/
│   ├── videos/
│   └── music/
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
└── README.md
```

**Dev Workflow:**
- Generate hash once: open DevTools Console → `await crypto.subtle.digest('SHA-256', new TextEncoder().encode('sua-senha'))` → convert to hex → paste in config.js
- Test bypass: `http://localhost:8000/?unlock=1` skips login entirely

---

## 3. `config.js` — The Edit-Everything File

This is the only file a non-developer needs to touch after initial setup.

```javascript
// config.js — Edit this file to change all content

const CONFIG = {

  // ── Site Identity ──────────────────────────────────────────────
  recipientName: "Ana",
  senderName: "João",
  siteTitle: "For Ana, with love ♥",

  // ── Login / Password Protection ────────────────────────────────
  login: {
    enabled: true,
    passwordHash: "sha256:...",    // Generate: await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
    hint: "Our anniversary date (DDMM)",  // Subtle hint shown after 3 failed attempts
    maxAttemptsBeforeHint: 3,
    unlockQueryParam: "unlock"     // ?unlock=1 bypasses for dev
  },

  // ── Hero Section ───────────────────────────────────────────────
  heroMessage: "Every day with you is my favourite day.",
  heroSubtitle: "Here's a little something I made, just for you.",

  // ── Photo Gallery ──────────────────────────────────────────────
  // Add/remove objects to add/remove photos. caption is shown in lightbox.
  gallery: [
    { src: "assets/photos/01-first-date.jpg",  caption: "The night everything changed. You wore that red jacket." },
    { src: "assets/photos/02-beach-trip.jpg",  caption: "I still think about that sunset. You were glowing." },
    { src: "assets/photos/03-cooking.jpg",      caption: "The pasta disaster of 2023. We laughed for an hour." },
    // Videos: add type: "video" to render as <video> instead of <img>
    { src: "assets/videos/our-trip.mp4",       caption: "The road trip. I was so nervous.", type: "video" },
  ],

  // ── Music Player ───────────────────────────────────────────────
  playlist: [
    { title: "Our Song",      artist: "Artist Name",   src: "assets/music/song1.mp3" },
    { title: "Another Fav",   artist: "Artist Name",   src: "assets/music/song2.mp3" },
  ],

  // ── Reasons I Love You ─────────────────────────────────────────
  // Rendered as a scrollable list; used in the puzzle reveal too
  reasons: [
    "The way you laugh when something really catches you off guard.",
    "How you remember small details about things I mentioned once.",
    "You make ordinary Tuesday evenings feel special.",
    "The face you make when you're concentrating on something.",
    "How kind you are to strangers, without even thinking about it.",
    // Add as many as you want
  ],

  // ── Runaway Button ─────────────────────────────────────────────
  runawayCatchMessage: "Okay, okay — I love you too. 💕",
  runawayButtonLabel: "Click me if you dare",
  runawayEscapeMessages: [
    "Nope!", "Too slow!", "Nice try!", "Almost!", "Hehe~", "Catch me!"
  ],

  // ── Puzzle / Game (Option B: Cipher Decoder) ───────────────────
  puzzle: {
    // Full encrypted letter (generate with the encryption script)
    encryptedLetter: "...",
    // Or: pre-split blocks with their questions
    blocks: [
      { 
        question: "What was the name of the café where we had our first coffee?",  
        answer: "milano",
        encryptedText: "..."  // This block's encrypted portion
      },
      { 
        question: "What movie did we watch on our third date?",                     
        answer: "interstellar",
        encryptedText: "..."
      },
      { 
        question: "What did I say when you asked what I was thinking about?",       
        answer: "you",
        encryptedText: "..."
      },
    ],
    revealMessage: "You figured it out. Just like I knew you would. I love you."
  },

};
```

---

## 4. Game / Puzzle Options — **DECIDED: Option B (Cipher Decoder)**

### Option A — Memory Match (Photo Pairs)

**Concept:** A 4×4 (or 4×5) card grid. Each card has a personal photo on the back. Cards are flipped in pairs; find all matches to unlock a final message with a photo slideshow and the "reasons I love you" list revealed one by one.

**Implementation:**
```
- 8–10 cropped/square versions of your photos
- Cards flip with CSS 3D transform (rotateY 180deg)
- Match detection in JS: compare data-id attributes
- On all matched: trigger fullscreen reveal animation
- Difficulty: add a 30-second timer for "speed mode"
```

**Pros:**
- Visually beautiful with personal photos
- Skill-neutral — anyone can play regardless of gaming experience
- Completion is satisfying and guaranteed (no fail state if you make it forgiving)
- The reveal of each photo while playing IS the emotional content

**Cons:**
- Relatively common game concept
- Requires square crops of your photos (minor prep work)
- Less "puzzle" feel, more "game" feel

---

### Option B — Cipher / Love Letter Decoder ✅ **SELECTED**

**Concept:** A love letter is displayed with every word scrambled or encrypted with a simple substitution cipher (ROT-13 or a custom alphabet). The player is given hints that are actually personal facts only your partner would know (e.g., "What city did we first meet?" → answer decodes the next block). Correct answers progressively reveal the letter.

**Implementation:**
```
- Write a heartfelt paragraph (200–300 words) in config.js
- Encrypt it at build time with a JS function (Caesar cipher, ROT-13, or visual scramble)
- Split letter into 4–5 blocks, each locked behind a personal question
- Questions & answers stored in config.js (case-insensitive match)
- Correct answer animates the decryption of that block (character-by-character reveal)
- All blocks decoded → full letter glows into view + hearts animation
```

**Sample questions:**
```javascript
puzzleQuestions: [
  { question: "What was the name of the café where we had our first coffee?",  answer: "milano" },
  { question: "What movie did we watch on our third date?",                     answer: "interstellar" },
  { question: "What did I say when you asked what I was thinking about?",       answer: "you" },
]
```

**Pros:**
- The most emotionally resonant option — the reward IS the letter
- Highly personal, impossible for anyone else to complete
- The "decoding" animation is visually dramatic and satisfying
- Easy to write all content in `config.js` (just text + Q&A pairs)
- No complex game logic — just string comparison + animation

**Cons:**
- Partner must remember specific answers; have a hint system ready
- Less replayable after the first time
- Requires you to write a heartfelt letter (worth it)

---

### Option C — Jigsaw Puzzle (Custom Photo)

**Concept:** A beloved photo is cut into 12–20 pieces and scrambled. The player drags and drops pieces into place. On completion, the image "comes alive" with a subtle Ken Burns effect and text fades in over it.

**Implementation:**
```
- Choose one perfect photo
- JS splits it into a grid using canvas (crop to pieces, display as backgrounds)
- Drag-and-drop via mouse/touch events (or pointer events API)
- Snap-to-grid when piece is within 20px of correct position
- Progress indicator (X/20 pieces placed)
- Completion: pieces lock, photo glows, text overlays
```

**Pros:**
- Very visual — the photo is the puzzle AND the reward
- Works well on desktop; satisfying drag-and-drop feel
- Completion is obvious and celebratory

**Cons:**
- Touch/drag implementation is the most complex of the three options
- Harder on mobile (small pieces on a phone screen)
- Requires one perfect, high-resolution photo
- Canvas manipulation adds implementation time (≈4–6 hours)

---

### Decision Rationale

**Option B (Cipher Decoder) is the chosen game** for this project because:
1. **Highest emotional payoff** — the reward is the love letter itself
2. **Simplest implementation** — string manipulation + CSS animations, no complex game mechanics
3. **Zero asset prep** — only text content in `config.js`
4. **Perfectly personal** — only someone who knows your shared history can complete it
5. **Fits 3-day timeline** — estimated 3–4 hours implementation vs 6+ for jigsaw

---

## 5. Music Integration Approaches

### Approach A — Self-hosted MP3 (Recommended)

Store `.mp3` files in `assets/music/`. The HTML5 `<audio>` API handles playback.

```javascript
// player.js — core logic
const audio = new Audio();
audio.src = CONFIG.playlist[currentIndex].src;
audio.play();
```

**How to get the files:**
- **YouTube to MP3:** Use `yt-dlp` locally — `yt-dlp -x --audio-format mp3 "URL"` — for personal use only
- **Spotify:** Use a tool like `spotdl` locally — `spotdl "song name"` — for personal use only
- **Apple Music / bought tracks:** Export from iTunes as MP3 (Files → Convert → Create MP3 Version)
- **Free/legal sources:** Free Music Archive (freemusicarchive.org), ccMixter, or Pixabay Music

**Recommended songs to consider (replace with YOUR songs):**
- A song that was playing on a meaningful date
- A song one of you introduced the other to
- "Your song" — whatever that means to you two

**File size guidance:** A 3-minute MP3 at 128kbps ≈ 2.8MB. Keep the total playlist under 30MB for fast page load. Use `ffmpeg -i input.mp3 -b:a 128k output.mp3` to compress if needed.

---

### Approach B — Streaming Embed (YouTube/Spotify)

Embed iframes from YouTube or Spotify. Simpler to set up, no file hosting needed.

```html
<!-- YouTube embed -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID?autoplay=0" 
        allow="autoplay" frameborder="0"></iframe>
```

**Pros:** No file storage, always legal, Spotify shows the album art  
**Cons:** Requires internet, iframe styling is limited, autoplay is blocked by browsers, less control over UI

---

### Approach C — Web Audio API Visualiser

Use self-hosted MP3s + the Web Audio API to render a real-time frequency bar visualiser (like those animated music bars) synced to the audio.

```javascript
const ctx = new AudioContext();
const analyser = ctx.createAnalyser();
const source = ctx.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(ctx.destination);
// Read analyser.getByteFrequencyData() on requestAnimationFrame
// Draw bars on <canvas>
```

**Pros:** Visually stunning, very impressive  
**Cons:** Adds ~2 hours of implementation; requires user gesture to start (browser autoplay policy)

**Recommendation:** Start with Approach A (self-hosted MP3 with a custom HTML5 player). Add the visualiser from Approach C on Day 3 if time allows — it's a great visual detail.

---

## 6. Runaway Button — Implementation Detail

The button physically moves away from the cursor on hover and on click. After enough failed attempts, it gives up and lets itself be caught.

```javascript
// runaway.js
const btn = document.getElementById('runaway-btn');
let attempts = 0;
const MAX_ATTEMPTS = 8; // After this many, the button lets itself be caught

btn.addEventListener('mousemove', (e) => {
  if (attempts >= MAX_ATTEMPTS) return; // Stop running

  const btnRect = btn.getBoundingClientRect();
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  // Vector from cursor to button center (flee direction)
  const dx = btnCenterX - e.clientX;
  const dy = btnCenterY - e.clientY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 150; // px to flee

  const newX = btnCenterX + (dx / distance) * speed;
  const newY = btnCenterY + (dy / distance) * speed;

  // Clamp to viewport
  const clampedX = Math.min(Math.max(newX, 60), window.innerWidth - 60);
  const clampedY = Math.min(Math.max(newY, 60), window.innerHeight - 60);

  btn.style.position = 'fixed';
  btn.style.left = `${clampedX - btn.offsetWidth / 2}px`;
  btn.style.top = `${clampedY - btn.offsetHeight / 2}px`;
  btn.style.transition = 'left 0.1s, top 0.1s';
});

btn.addEventListener('click', () => {
  attempts++;
  if (attempts >= MAX_ATTEMPTS) {
    // Button "gives up"
    btn.textContent = CONFIG.runawayCatchMessage;
    btn.classList.add('caught');
    triggerHeartExplosion(); // Fun CSS animation
  } else {
    // Show random escape message
    const msg = CONFIG.runawayEscapeMessages[Math.floor(Math.random() * CONFIG.runawayEscapeMessages.length)];
    showFloatingText(msg, btn); // Text floats up and fades
  }
});
```

**Touch support:** Mirror the `mousemove` logic on `touchmove` with `e.touches[0]` coordinates.

---

## 7. Implementation Phases

### Day 1 — Foundation, Login & Gallery (≈7 hours)

**Morning (3h):**
- [ ] Set up file structure exactly as specified above (includes `login.css`, `login.js`)
- [ ] Write `config.js` with placeholder content (incl. `login.passwordHash`, `login.hint`)
- [ ] Generate password hash: `await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))` → paste in config.js
- [ ] `index.html`: scaffold all sections including login overlay + site content wrapper
- [ ] `main.css`: CSS variables (colors, fonts, spacing), global styles, responsive grid
- [ ] `login.css`: login screen styles (centered card, animations, hidden state)
- [ ] Decide on color palette (deep rose/burgundy + cream is classic; dark navy + gold is elegant)

**Afternoon (4h):**
- [ ] `login.js`: implement verification logic (hash compare, sessionStorage, bypass param, hint system)
- [ ] Test login: wrong password → shake + error; 3 fails → hint shows; correct → unlock + entrance animation
- [ ] `gallery.js` + `gallery.css`: grid layout, lightbox overlay, keyboard navigation (arrow keys to browse)
- [ ] Video support in gallery (autoplay on open, pause on close)
- [ ] Test gallery on mobile (touch swipe to navigate between photos)
- [ ] Add all your actual photos to `assets/photos/` and update `config.js`

**End of Day 1 checkpoint:** Login screen working + Hero section + working gallery with real photos.

---

### Day 2 — Games & Music Player (≈7 hours)

**Morning (3–4h) — Puzzle/Game:**
- [ ] Implement chosen puzzle (recommend: Cipher Decoder)
- [ ] Write the actual love letter content in `config.js`
- [ ] Write all personal questions + answers in `config.js`
- [ ] Implement decryption animation (character reveal with `setTimeout` stagger)
- [ ] Test that all answers work (case-insensitive, trim whitespace)
- [ ] Add a subtle hint system: after 3 wrong attempts, show first letter of answer

**Afternoon (2–3h) — Music Player + Runaway Button:**
- [ ] `player.js` + `player.css`: custom audio player (play/pause, prev/next, progress bar, track title)
- [ ] Add actual MP3 files to `assets/music/`
- [ ] `runaway.js`: implement full runaway logic including mobile touch support
- [ ] Style runaway section — make it playful (pastel background, whimsical font)

**End of Day 2 checkpoint:** All features functional, real content loaded, playable on phone.

---

### Day 3 — Polish, Docker & Deploy (≈5 hours)

**Morning (2h) — Visual polish:**
- [ ] Animations: scroll-triggered fade-ins (`IntersectionObserver`), hero particle/heart effect
- [ ] Micro-interactions: hover states, button feedback, gallery thumbnail hover
- [ ] Typography pass: make sure fonts, sizes, and line-heights feel considered
- [ ] Loading: add a brief animated splash screen (her name fades in, then site loads)
- [ ] Test on real phone — fix any touch/layout issues

**Afternoon (2h) — Docker setup:**
- [ ] Write `Dockerfile`, `docker-compose.yml`, `nginx.conf` (see Section 8)
- [ ] Build image locally: `docker build -t valentine .`
- [ ] Test locally: `docker-compose up` → visit `localhost:8080`
- [ ] Verify all assets load (check browser Network tab for 404s)

**Late afternoon (1h) — Deploy to VPS:**
- [ ] `git push` to a private repo (GitHub private repo — never make this public)
- [ ] SSH to VPS: `git clone`, `docker-compose up -d`
- [ ] Set up domain/subdomain pointing to VPS (e.g., `for-ana.yourdomain.com`)
- [ ] If using Caddy as reverse proxy: automatic HTTPS with one config line
- [ ] Final end-to-end test from a real phone on cellular (not WiFi) to verify load times

---

## 8. Docker Setup

### `docker/Dockerfile`

```dockerfile
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/valentine.conf

# Copy all site files into nginx serving directory
COPY . /usr/share/nginx/html/

# Exclude docker folder from serving (not strictly necessary but clean)
RUN rm -rf /usr/share/nginx/html/docker

EXPOSE 80
```

### `docker/docker-compose.yml`

```yaml
version: "3.8"

services:
  valentine:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: valentine-site
    restart: unless-stopped
    ports:
      - "8080:80"          # Change 8080 to any free port on your VPS
    volumes:
      # Optional: mount assets separately so you can update photos without rebuilding
      - ../assets:/usr/share/nginx/html/assets:ro
    labels:
      - "traefik.enable=false"   # Remove if using Traefik

# If using Caddy as reverse proxy on the VPS, add a Caddyfile entry:
# for-ana.yourdomain.com {
#   reverse_proxy localhost:8080
# }
```

### `docker/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Serve all static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Aggressive caching for assets (photos, music, videos)
    location ~* \.(jpg|jpeg|png|webp|gif|mp4|mp3|svg|ico|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # No caching for HTML and JS (so updates are instant)
    location ~* \.(html|js|css)$ {
        expires off;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # Enable gzip for text files
    gzip on;
    gzip_types text/css application/javascript text/html;
    gzip_min_length 1000;
}
```

### Build & Deploy Commands

```bash
# ── Local development ──────────────────────────────────────
# Any static file server works; Python is always available:
python3 -m http.server 8000
# Then visit: http://localhost:8000

# ── Build Docker image ──────────────────────────────────────
cd valentine/
docker build -f docker/Dockerfile -t valentine-site .

# ── Run locally with Docker ─────────────────────────────────
docker-compose -f docker/docker-compose.yml up -d
# Visit: http://localhost:8080

# ── Stop ────────────────────────────────────────────────────
docker-compose -f docker/docker-compose.yml down

# ── Deploy to VPS ───────────────────────────────────────────
# On your local machine:
git add .
git commit -m "ready to deploy"
git push origin main

# SSH into VPS:
ssh user@your-vps-ip
git clone https://github.com/you/valentine.git   # first time only
cd valentine
git pull                                          # subsequent updates
docker-compose -f docker/docker-compose.yml up -d --build

# ── Update content without rebuild (if using volume mount) ──
# Just copy new files to assets/ on the VPS — no restart needed
scp assets/photos/new-photo.jpg user@vps:/path/to/valentine/assets/photos/
```

---

## 9. Verification Steps

### Functional Checklist

**Login Screen:**
- [ ] Login overlay displays on first visit (no sessionStorage flag)
- [ ] Correct password hashes match and unlocks the site
- [ ] Wrong password shows shake animation + error message
- [ ] After 3 failed attempts, hint appears
- [ ] `?unlock=1` query param bypasses login (for dev)
- [ ] Session persists on refresh (sessionStorage `unlocked=true`)
- [ ] No access to site content before unlock (tab focus trapped, content hidden)
- [ ] Entrance animation plays on unlock (login fades out, site fades in)

**Gallery:**
- [ ] All photos load without 404 errors
- [ ] Videos autoplay on open, pause on close (check browser console for errors)
- [ ] Lightbox opens and closes (click backdrop or press Escape)
- [ ] Arrow keys navigate between photos in lightbox
- [ ] Touch swipe works on mobile
- [ ] Captions display correctly

**Music Player:**
- [ ] All MP3 files load and play
- [ ] Next/previous track work
- [ ] Progress bar scrubs correctly
- [ ] Track title and artist update on track change
- [ ] Player doesn't break if playlist has only one song

**Runaway Button:**
- [ ] Button flees on hover (desktop)
- [ ] Button flees on touch (mobile)
- [ ] Button stays within viewport (doesn't escape off-screen)
- [ ] After MAX_ATTEMPTS, button allows itself to be clicked
- [ ] Caught message displays correctly

**Puzzle (Cipher Decoder):**
- [ ] Encoded text displays correctly
- [ ] All question answers work (test each one)
- [ ] Case-insensitive matching works ("Milano" = "milano" = "MILANO")
- [ ] Decryption animation plays smoothly
- [ ] Final reveal triggers when all blocks are decoded
- [ ] Hint system shows after 3 wrong attempts

### Performance Checklist

- [ ] Run Lighthouse in Chrome DevTools — aim for Performance score > 85
- [ ] Total page weight < 15MB (photos compressed, videos optimised)
- [ ] First Contentful Paint < 3s on a slow mobile connection
- [ ] No console errors on load
- [ ] Test on Safari (iOS) — audio autoplay rules are strictest here

### Mobile Checklist (test on a real device, not just Chrome DevTools)

- [ ] All text is readable without zooming
- [ ] Buttons and tap targets are ≥ 44px
- [ ] Gallery grid reflows to 2 columns (or 1 column on small phones)
- [ ] Music player controls are usable with thumbs
- [ ] Runaway button doesn't escape to unreachable areas
- [ ] No horizontal scroll anywhere

### Docker / Deploy Checklist

- [ ] `docker-compose up` starts without errors
- [ ] All assets accessible via browser at `localhost:8080`
- [ ] Container restarts automatically after VPS reboot (`restart: unless-stopped`)
- [ ] HTTPS works (if using Caddy/Certbot)
- [ ] Domain resolves correctly
- [ ] Site loads on cellular data (test from phone with WiFi disabled)
- [ ] Private repo confirmed — double check it's not public on GitHub

---

## 10. Optional Enhancements (If Time Permits)

- **Particle heart effect on hero:** Canvas-based hearts that float upward (plenty of copy-paste examples online; ~30 min to adapt)
- **Scroll progress indicator:** A thin heart-shaped progress bar at the top of the page
- **"Our timeline" section:** A vertical timeline of key dates with photos, rendered from a `config.js` array
- **Audio visualiser bars:** Web Audio API canvas bars under the music player
- **Confetti on puzzle completion:** `npm install canvas-confetti` → single function call; or inline the minified source to avoid any build step

> **Note:** Password protection is now a **required** feature (see Login section), not optional.

---

## 11. Quick Reference — Key Commands

```bash
# Compress a photo for web (requires imagemagick)
convert input.jpg -resize 1920x1920\> -quality 85 output.jpg

# Compress all photos in a folder
mogrify -resize 1920x1920\> -quality 85 -path assets/photos/ raw-photos/*.jpg

# Optimise video for web (requires ffmpeg)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -acodec aac -movflags faststart output.mp4

# Compress MP3 to 128kbps
ffmpeg -i input.mp3 -b:a 128k output.mp3

# Check Docker container logs
docker logs valentine-site -f

# Rebuild and restart container
docker-compose -f docker/docker-compose.yml up -d --build

# Check what's running on your VPS
docker ps
```

---

*Good luck — she's going to love it. 💕*
