const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Find files
let publicDir = __dirname;
if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
  publicDir = path.join(__dirname, 'public');
}

// Serve static files
app.use(express.static(publicDir));

// Detect non-Safari mobile browsers (iPhone, Android)
function needsSafari(ua) {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return false;

  // If it contains ANY of these, it's NOT Safari
  if (/CriOS/i.test(ua)) return true;   // Chrome on iOS
  if (/EdgiOS/i.test(ua)) return true;   // Edge on iOS
  if (/FxiOS/i.test(ua)) return true;    // Firefox on iOS
  if (/OPiOS/i.test(ua)) return true;    // Opera on iOS
  if (/Chrome\//i.test(ua)) return true;  // Chrome on Android
  if (/Edg\//i.test(ua)) return true;     // Edge on Android

  return false;
}

// Main route
app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';

  if (needsSafari(ua)) {
    // Send a clean page with NO ElevenLabs code at all
    return res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ViaSegura — Abre en Safari</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f1114; color: #F2F2F2; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 24px; }
    .stripe { width: 100%; height: 8px; background: repeating-linear-gradient(-45deg, #FFD600, #FFD600 12px, #111 12px, #111 24px); position: fixed; top: 0; left: 0; }
    .icon { font-size: 64px; margin-bottom: 24px; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #FF6B00, #FFD600); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { font-size: 16px; line-height: 1.7; color: #8A919A; max-width: 400px; margin-bottom: 20px; }
    .url-box { background: #1c2127; border: 2px solid #FFD600; border-radius: 12px; padding: 16px 24px; font-size: 20px; font-weight: 700; color: #FFD600; letter-spacing: 1px; margin-bottom: 16px; }
    .copy-btn { background: linear-gradient(135deg, #FF6B00, #FFD600); color: #0f1114; border: none; padding: 14px 36px; border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; margin-bottom: 32px; }
    .copy-btn:active { transform: scale(0.95); }
    .copied { color: #4ADE80; font-size: 14px; margin-top: 8px; display: none; }
    .divider { width: 60px; height: 2px; background: rgba(255,107,0,.2); margin: 20px auto; }
    .steps { font-size: 13px; color: #8A919A; line-height: 1.8; }
    .steps strong { color: #F2F2F2; }
  </style>
</head>
<body>
  <div class="stripe"></div>
  <div class="icon">🚧</div>
  <h1>Abre en Safari</h1>
  <p>El asistente de voz ViaSegura funciona mejor en Safari. Copia el enlace y ábrelo en Safari para comenzar tu visita.</p>
  <p style="font-size:14px;">The ViaSegura voice assistant works best in Safari. Copy the link and open it in Safari to start your tour.</p>
  <div class="url-box">viasegura.zone</div>
  <button class="copy-btn" onclick="copyURL()">Copiar Enlace / Copy Link</button>
  <div class="copied" id="copiedMsg">✓ Copiado / Copied!</div>
  <div class="divider"></div>
  <div class="steps">
    <strong>1.</strong> Toca "Copiar Enlace" / Tap "Copy Link"<br>
    <strong>2.</strong> Abre Safari / Open Safari<br>
    <strong>3.</strong> Pega el enlace / Paste the link<br>
    <strong>4.</strong> ¡Comienza tu visita! / Start your tour!
  </div>
  <script>
    function copyURL() {
      navigator.clipboard.writeText('https://viasegura.zone').then(function() {
        document.getElementById('copiedMsg').style.display = 'block';
        setTimeout(function() { document.getElementById('copiedMsg').style.display = 'none'; }, 3000);
      });
    }
  </script>
</body>
</html>`);
  }

  // Safari and desktop — serve normal page with widget
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log('ViaSegura running on port ' + PORT);
  console.log('Serving files from: ' + publicDir);
});