# Valentine's Day Website 💕

Um site pessoal feito com carinho — uma carta de amor entregue através de código.

## 📋 Funcionalidades

- **Tela de Login** — Proteção por senha (SHA-256 client-side) com dica após 3 tentativas
- **Hero Section** — Mensagem romântica com efeito de partículas (corações flutuando)
- **Galeria de Fotos/Vídeos** — Lightbox com navegação por teclado, swipe no mobile
- **Player de Música** — Controles completos (play/pause, prev/next, progress, volume)
- **Botão Fugitivo** — Mini-game divertido: o botão foge do cursor/toque
- **Cipher Decoder (Jogo Principal)** — Carta de amor criptografada, revelada através de perguntas pessoais
- **Lista de Motivos** — "Por que eu te amo" animada

## 🚀 Quick Start (Desenvolvimento Local)

### Pré-requisitos
- Python 3 (para servidor simples) OU Docker

### Opção 1: Python (mais rápido)
```bash
cd valentine
python3 -m http.server 8000
# Abra http://localhost:8000
# Para bypassar login: http://localhost:8000/?unlock=1
```

### Opção 2: Docker
```bash
cd valentine
docker-compose -f docker/docker-compose.yml up -d
# Abra http://localhost:8080
```

## 🔐 Configurando a Senha

1. Abra o DevTools do navegador (F12) → Console
2. Execute:
```js
// Substitua 'sua-senha-secreta' pela senha desejada
const encoder = new TextEncoder();
const data = encoder.encode('sua-senha-secreta');
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hash = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0')).join('');
console.log('sha256:' + hash);
```
3. Copie o hash gerado (ex: `sha256:abc123...`)
4. Edite `config.js` → `login.passwordHash` com o hash

## 📝 Personalizando o Conteúdo

Edite **apenas** o arquivo `config.js`:

```javascript
const CONFIG = {
  recipientName: "Nome dela",
  senderName: "Seu nome",
  siteTitle: "Título da aba",

  login: {
    passwordHash: "sha256:...",  // Gere conforme instruções acima
    hint: "Dica para a senha",
  },

  heroMessage: "Sua mensagem principal",
  heroSubtitle: "Subtítulo",

  gallery: [
    { src: "assets/photos/foto1.jpg", caption: "Legenda" },
    { src: "assets/videos/video.mp4", caption: "Legenda", type: "video" },
  ],

  playlist: [
    { title: "Música 1", artist: "Artista", src: "assets/music/musica1.mp3" },
  ],

  reasons: [
    "Motivo 1",
    "Motivo 2",
  ],

  puzzle: {
    blocks: [
      {
        question: "Pergunta pessoal?",
        answer: "resposta",
        encryptedText: "..." // Use o script de criptografia
      },
    ],
    revealMessage: "Mensagem final ao completar"
  }
};
```

### Criptografando a Carta (Cipher Decoder)

Use Caesar cipher (shift 3) para criptografar os blocos:

```js
// No console do navegador
function caesarEncrypt(text, shift = 3) {
  return text.split('').map(c => {
    if (c >= 'a' && c <= 'z') return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
    if (c >= 'A' && c <= 'Z') return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
    return c;
  }).join('');
}

const carta = "Sua carta de amor aqui...";
console.log(caesarEncrypt(carta));
```

## 📦 Deploy no VPS

### 1. Prepare o repositório (PRIVADO!)
```bash
git init
git add .
git commit -m "Initial commit"
# Crie repo PRIVADO no GitHub/GitLab
git remote add origin https://github.com/seu-user/valentine.git
git push -u origin main
```

### 2. No VPS
```bash
# Clone o repo
git clone https://github.com/seu-user/valentine.git
cd valentine

# Build e start
docker-compose -f docker/docker-compose.yml up -d --build

# Verifique
docker ps
docker logs valentine-site -f
```

### 3. HTTPS com Caddy (recomendado)
Instale o Caddy e adicione ao `Caddyfile`:

```
seu-dominio.com {
    reverse_proxy localhost:8080
}
```

O Caddy gerencia HTTPS automaticamente (Let's Encrypt).

### 4. Atualizações futuras
```bash
# No VPS
cd valentine
git pull
docker-compose -f docker/docker-compose.yml up -d --build
```

### 5. Atualizar apenas assets (sem rebuild)
```bash
# Se usou volume mount no docker-compose.yml
scp assets/photos/nova-foto.jpg user@vps:/caminho/valentine/assets/photos/
# Não precisa reiniciar!
```

## 📁 Estrutura de Arquivos

```
valentine/
├── index.html          # HTML principal
├── config.js           # ✏️ EDITE AQUI - Todo conteúdo
├── css/
│   ├── reset.css
│   ├── main.css
│   ├── login.css
│   ├── gallery.css
│   ├── player.css
│   ├── runaway.css
│   └── puzzle.css
├── js/
│   ├── login.js
│   ├── gallery.js
│   ├── player.js
│   ├── runaway.js
│   ├── puzzle.js
│   └── main.js
├── assets/
│   ├── photos/         # Suas fotos (.jpg/.webp)
│   ├── videos/         # Seus vídeos (.mp4, <30MB cada)
│   └── music/          # Suas músicas (.mp3)
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
└── README.md
```

## ✅ Checklist Pré-Entrega

- [ ] Senha definida e testada
- [ ] Carta de amor escrita e criptografada
- [ ] Perguntas/respostas pessoais configuradas
- [ ] Fotos adicionadas em `assets/photos/`
- [ ] Vídeos otimizados (<30MB) em `assets/videos/`
- [ ] Músicas em `assets/music/`
- [ ] Testado no mobile (Chrome DevTools + dispositivo real)
- [ ] Repositório **PRIVADO** confirmado
- [ ] Deploy no VPS funcionando com HTTPS
- [ ] Teste final no 4G (WiFi desligado)

## 🎨 Dicas de Personalização

### Cores
Edite as variáveis CSS em `css/main.css`:
```css
:root {
  --color-primary: #b85c7a;      /* Rosa principal */
  --color-accent: #c97b8f;       /* Rosa claro */
  --color-accent-gold: #d4a574;  /* Dourado */
}
```

### Fontes
Troque no `<head>` do `index.html` (Google Fonts):
```html
<link href="https://fonts.googleapis.com/css2?family=SUA_FONTE&display=swap" rel="stylesheet">
```

### Efeito de Partículas
Desative em `js/main.js` se preferir:
```js
// Comente initHeroCanvas();
```

## 📱 Compatibilidade

- ✅ Chrome/Edge (desktop + mobile)
- ✅ Firefox (desktop + mobile)
- ✅ Safari (desktop + mobile)
- ✅ Samsung Internet
- ⚠️ Requer HTTPS para áudio autoplay no iOS

## 🔒 Segurança

> **Importante:** A proteção por senha é **client-side only** (JavaScript). Não é segurança real — serve apenas para evitar acessos casuais e criar o momento de "desbloqueio". Não armazene segredos reais aqui.

## 📄 Licença

Uso pessoal apenas. Não redistribua.

---

*Feito com amor para alguém especial.* 💕