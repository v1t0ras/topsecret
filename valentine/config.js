// config.js — Edit this file to change all content
// Generate password hash in browser console:

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
    hint: "Meu amor, tu receberás a senha por email no dia 12 às 16h. 💌",
    maxAttemptsBeforeHint: 3,
    unlockQueryParam: "unlock"
  },

  // ── Hero Section ───────────────────────────────────────────────
  heroMessage: "Todo dia contigo é meu dia favorito. ❤️",
  heroSubtitle: "Aqui está um coisinha que fiz para ti. \n\nFeliz dia dos namorados, Clara estrela!",

  // ── Photo Gallery ──────────────────────────────────────────────
  // Add/remove objects to add/remove photos. caption is shown in lightbox.
  // For videos, add type: "video"
  gallery: [
    { src: "assets/photos/IMG_3078.JPG",  caption: "Tu na tua pose clássica." },
    { src: "assets/photos/IMG_3058.JPG",  caption: "Casal mais lindo do meu país, RS" },
    { src: "assets/photos/IMG_2990.JPG",  caption: "Tu gostando de mim com lua cheia ao fundo." },
    { src: "assets/photos/IMG_2913.JPG",  caption: "Eu gostando de ti." },
    { src: "assets/photos/IMG_2844.JPG",  caption: "Dia do anel" },
    { src: "assets/photos/IMG_2834.JPG",  caption: "Acho que gostou" },
    { src: "assets/photos/IMG_2657.JPG",  caption: "Fude no friozinho" },
    { src: "assets/photos/IMG_2601.JPG",  caption: "Primeira atividade de ter casa própria" },
    { src: "assets/photos/IMG_2369.JPG",  caption: "Passeio" },
    { src: "assets/photos/IMG_2337.JPG",  caption: "Adorei comer meu presente de páscoa!!!!!" },
    { src: "assets/photos/IMG_2176.JPG",  caption: "Lugar aquele lá que a gente foi e tu tava linda como sempre" },
    { src: "assets/photos/IMG_2169.JPG",  caption: "Us" },
    { src: "assets/photos/IMG_1838.JPG",  caption: "Flores que eu espero que tenha gostado" },
    { src: "assets/photos/IMG_1682.JPG",  caption: "Gosto do jeito que me olha nessa, parece uma felicidade genuína" },
    { src: "assets/photos/IMG_1507.JPG",  caption: "Acho que essa é da festa que a gente ficou por meia hora mas ganhamos fotos legais hahaha" },
    { src: "assets/photos/IMG_1382.JPG",  caption: "Quando tu fez aquilo de face na minha cara" },
    { src: "assets/photos/IMG_1348.JPG",  caption: "Adoro quando a minha cozinheira preferida cozinha pra mim!!!" },
    { src: "assets/photos/IMG_1299.JPG",  caption: "haha" },
    { src: "assets/videos/IMG_1293.GIF",  caption: "HAHAHA" },
    { src: "assets/photos/RLPK4696.JPG",  caption: "Patinete!" },
    { src: "assets/photos/VBPS6440.JPG",  caption: "Clara & Vitor" },
    { src: "assets/photos/WHWR4659.PNG",  caption: "Melhor parte do meu ano novo ( tu )" },
    { src: "assets/photos/IMG_1173.JPG",  caption: "Primeira foto que postamos juntos ou algo assim" },
    { src: "assets/photos/IMG_1082.JPG",  caption: "Divertimentos" },
    { src: "assets/photos/IMG_1010.JPG",  caption: "Tu já falou que gosta dessa foto pelo jeito que eu te olho" },
    { src: "assets/photos/IMG_0991.JPG",  caption: "Primeira foto juntos" },
  ],

  // ── Music Player ───────────────────────────────────────────────
  playlist: [
    { title: "Buddy Holly",      artist: "Versão inglês", src: "assets/music/buddyholly.mp3"},
    { title: "Sarà perché ti amo",   artist: "la casa de papel", src: "assets/music/italiana.mp3" },
    { title: "All I Wanted",   artist: "Paramore", src: "assets/music/alliwanted.mp3" },
    { title: "Última Lembrança",   artist: "gaudério", src: "assets/music/ultima.mp3" },
  ],

  // ── Reasons I Love You ─────────────────────────────────────────
  reasons: [
    "Primeiro que eu amo tudo em ti sem exceção, então isso já um motivo enorme.",
    "Tuas gracinhas e humor",
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
  runawayCatchMessage: "Tá bom , linda, também te amo 💕",
  runawayButtonLabel: "CLique-me se for audaz",
  runawayEscapeMessages: [
    "Não!", "Muito devagar!", "Bobona!", "Quase!", "haha", "Tenta bbzuda!"
  ],

  // ── Puzzle / Game (Option B: Cipher Decoder) ───────────────────
  // Write your love letter here, then use the encryption helper to generate blocks
  // Or manually define blocks with encryptedText (use Caesar cipher shift of 3 for simple version)
  puzzle: {
    // Full letter for reference (will be encrypted into blocks)
    fullLetter: "Não sou bom com textinhos mas vamos lá... Querida Clara Estrela do meu coração, tu é o amor da minha vida, minha patente entupida. Eu me encantei por ti desde de a primeira vez que te vi, espero que tu entenda isso como o quão genuíno é meu amor por ti. Eu realmente queria conseguir expressar o quanto eu te amo e te acho perfeita em todos os aspectos, do quão linda és, engraçada, inteligente, amorosa ( só comigo ), respeitosa e esforçada com as coisas que tu faz. Adoro teu humor e como tu me faz rir, adoro tuas dancinha ( gosto muito mesmo ), adoro o quanto tu é LINDA, tão linda que até me da umas crises de ciúmes. Eu lembro nas nossas primeiras vezes juntos, no rodeio e no aniversário da minha mãe, no if também, de como eu ficava nervoso, mas não era um nervoso ruim de não me sentir confortável contigo ou algo assim, mas sim porque eu sempre te achei tão bonita e bom, isso é o tal das borboletas na barriga DO AMOR VERDADEIRO - PORQUE É ISSO QUE SINTO POR TI CLARA ESTRELA. Eu simplesmente espero que passamos o resto das nossas vidas juntos e esse desejo fala por si."

              +"Ass. Amor da tua vida"

              +"Espero que estejamos fazendo algo legal enquanto tu faz isso, porque eu não planejei nada."

              +"Beijão, te amo. ",
    // Pre-split blocks with questions and encrypted text (Caesar cipher shift 3)
    // To encrypt: shift each letter by 3 (a->d, b->e, etc.), keep spaces/punctuation
    blocks: [
      {
        question: "Onde foi nosso primeiro encontro, fora do if",
        answer: "ctg joão sobrinho",
        encryptedText: "Qãr vrx erp frp whawlqkrv pdv ydprv oá..."
      },
      {
        question: "Quando foi nosso primeiro beijo!? (dd/mm/yyyy)",
        answer: "04/09/2025",
        encryptedText: "Txhulgd Fodud Hvwuhod gr phx frudçãr, wx é r dpru gd plqkd ylgd, plqkd sdwhqwh hqwxslgd. Hx ph hqfdqwhl sru wl ghvgh gh d sulphlud yhc txh wh yl, hvshur txh wx hqwhqgd lvvr frpr r txãr jhqxíqr é phx dpru sru wl."
      },
      {
        question: "Onde foi nosso primeiro encontro de verdade?",
        answer: "the petit",
        encryptedText: "Hx uhdophqwh txhuld frqvhjxlu hasuhvvdu r txdqwr hx wh dpr h wh dfkr shuihlwd hp wrgrv rv dvshfwrv, gr txãr olqgd év, hqjudçdgd, lqwholjhqwh, dprurvd ( vó frpljr ), uhvshlwrvd h hviruçdgd frp dv frlvdv txh wx idc. Dgrur whx kxpru h frpr wx ph idc ulu, dgrur wxdv gdqflqkd ( jrvwr pxlwr phvpr ), dgrur r txdqwr wx é OLQGD, wãr olqgd txh dwé ph gd xpdv fulvhv gh flúphv."
      },
      {
        question: "Qual foi a melhor coisa que me aconteceu esse ano?",
        answer: "eu",
        encryptedText: "Hx ohpeur qdv qrvvdv sulphludv yhchv mxqwrv, qr urghlr h qr dqlyhuváulr gd plqkd pãh, qr li wdpeép, gh frpr hx ilfdyd qhuyrvr, pdv qãr hud xp qhuyrvr uxlp gh qãr ph vhqwlu frqiruwáyho frqwljr rx dojr dvvlp, pdv vlp srutxh hx vhpsuh wh dfkhl wãr erqlwd h erp, lvvr é r wdo gdv eruerohwdv qd eduuljd GR DPRU YHUGDGHLUR - SRUTXH É LVVR TXH VLQWR SRU WL FODUD HVWUHOD. Hx vlpsohvphqwh hvshur txh sdvvdprv r uhvwr gdv qrvvdv ylgdv mxqwrv h hvvh ghvhmr idod sru vl."
      },
      {
        question: "O que estamos fazendo agora?",
        answer: "Se divertindo",
        encryptedText: "Dvv. Dpru gd wxd ylgd Hvshur txh hvwhmdprv idchqgr dojr ohjdo hqtxdqwr wx idc lvvr, srutxh hx qãr sodqhmhl qdgd. Ehlmãr, wh dpr."
      }
    ],
    revealMessage: "Tu conseguiu decifrar minha cartinha secreta! Espero que tenha gostado, meu amor!!"
  },

};