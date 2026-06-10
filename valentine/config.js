// config.js — Edit this file to change all content
// Generate password hash in browser console:
// await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
// Then convert to hex: Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('')

const CONFIG = {

  // ── Site Identity ──────────────────────────────────────────────
  recipientName: "Clara Estrela",
  senderName: "Vitor Arthur",
  siteTitle: "Para Clara, com amor ♥",

  // ── Login / Password Protection ────────────────────────────────
  login: {
    enabled: true,
    // Simple hash (FNV-1a)
    // Generate new hash in browser console: LOGIN.hash('sua-senha')
    passwordHash: "96a8d93496a8d93496a8d93496a8d93496a8d93496a8d93496a8d93496a8d934",
    hint: "Tu receberás a senha por email, meu amor, no dia 12 às 16h. 💌",
    maxAttemptsBeforeHint: 3,
    unlockQueryParam: "unlock"
  },

  // ── Hero Section ───────────────────────────────────────────────
  heroMessage: "Every day with you is my favourite day.",
  heroSubtitle: "Here's a little something I made, just for you.",

  // ── Photo Gallery ──────────────────────────────────────────────
  // Add/remove objects to add/remove photos. caption is shown in lightbox.
  // For videos, add type: "video"
  gallery: [
    { src: "assets/photos/01-first-date.jpg",  caption: "The night everything changed. You wore that red jacket." },
    { src: "assets/photos/02-beach-trip.jpg",  caption: "I still think about that sunset. You were glowing." },
    { src: "assets/photos/03-cooking.jpg",      caption: "The pasta disaster of 2023. We laughed for an hour." },
    { src: "assets/videos/our-trip.mp4",       caption: "The road trip. I was so nervous.", type: "video" },
  ],

  // ── Music Player ───────────────────────────────────────────────
  playlist: [
    //{ title: "Our Song",      artist: "Artist Name"},//   src: "assets/music/song1.mp3" },
    //{ title: "Another Fav",   artist: "Artist Name"},//   src: "assets/music/song2.mp3" },
  ],

  // ── Reasons I Love You ─────────────────────────────────────────
  reasons: [
    "The way you laugh when something really catches you off guard.",
    "How you remember small details about things I mentioned once.",
    "You make ordinary Tuesday evenings feel special.",
    "The face you make when you're concentrating on something.",
    "How kind you are to strangers, without even thinking about it.",
    "The way your eyes light up when you talk about something you love.",
    "How you make me want to be a better person every single day.",
    "The little notes you leave around the house.",
    "Your patience when I'm being difficult.",
    "The fact that you're my best friend and my great love.",
  ],

  // ── Runaway Button ─────────────────────────────────────────────
  runawayCatchMessage: "Okay, okay — I love you too. 💕",
  runawayButtonLabel: "Click me if you dare",
  runawayEscapeMessages: [
    "Nope!", "Too slow!", "Nice try!", "Almost!", "Hehe~", "Catch me!"
  ],

  // ── Puzzle / Game (Option B: Cipher Decoder) ───────────────────
  // Write your love letter here, then use the encryption helper to generate blocks
  // Or manually define blocks with encryptedText (use Caesar cipher shift of 3 for simple version)
  puzzle: {
    // Full letter for reference (will be encrypted into blocks)
    fullLetter: "My dearest Ana, every moment with you feels like a dream I never want to wake up from. From our first coffee at Milano to watching Interstellar on our third date, every memory is etched in my heart. When you asked what I was thinking about and I said 'you' — that was the truest thing I've ever said. You make ordinary Tuesdays magical, you remember the smallest details, and your laugh is my favorite sound. I love you more than words can express, and I'll spend every day showing you.",

    // Pre-split blocks with questions and encrypted text (Caesar cipher shift 3)
    // To encrypt: shift each letter by 3 (a->d, b->e, etc.), keep spaces/punctuation
    blocks: [
      {
        question: "What was the name of the café where we had our first coffee?",
        answer: "milano",
        encryptedText: "Pb ghdulhvw Dqd, hyhu phrphqw zlwk brx ihhov olnh d guchp L qhyhu zdqw wr zdnh xs iurp."
      },
      {
        question: "What movie did we watch on our third date?",
        answer: "interstellar",
        encryptedText: "Iurp rxu iluvwriffhh dw plodqrv wr zdwfklqj Lqwhuvwhoodu rq rxu wkug gdwh, hyhu phpru\075 lv hwfkhg lq pb khduw."
      },
      {
        question: "What did I say when you asked what I was thinking about?",
        answer: "you",
        encryptedText: "Zkhq brx dVnhg ZkdW L ZDV WklqnLqj DErxW Dqg L Vdlg \'|ux|\' — WkdW ZDV Wkh WuxhvW Wklqj L\'Yh HYHU VDLG."
      },
      {
        question: "What makes ordinary Tuesdays feel magical?",
        answer: "you",
        encryptedText: "Brx PdNH RUGLQDUV GdxVDV PDJLFDO, BrX UHPHPEHU WKH VPDOOHVW GHWDLOV, DqG BrXu ODXJK LV PB IDYRULWH VRXQG."
      },
      {
        question: "How much do I love you?",
        answer: "more than words can express",
        encryptedText: "L Oryh BrX PrUH WKDQ ZrGV FDQ H[SUHVV, DqG L\'OO VSHQG Hyhu\075 GD\ VKRZLQJ BrX."
      }
    ],
    revealMessage: "You figured it out. Just like I knew you would. I love you."
  },

};