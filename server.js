const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Find index.html
let publicDir = __dirname;
const possiblePaths = [
  path.join(__dirname, 'public'),
  __dirname
];
for (const p of possiblePaths) {
  if (fs.existsSync(path.join(p, 'index.html'))) {
    publicDir = p;
    break;
  }
}

// Serve static files
app.use(express.static(publicDir));

// Browser detection - catch ALL non-Safari mobile browsers
function isBadBrowser(ua) {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  if (!isMobile) return false;

  // iOS browsers that are NOT Safari
  const isChromeIOS = /CriOS/.test(ua);
  const isEdgeIOS = /EdgiOS/.test(ua);
  const isFirefoxIOS = /FxiOS/.test(ua);

  // Android/desktop Chrome and Edge
  const isChromeDesktop = /Chrome/.test(ua) && !/Edg/.test(ua) && !/CriOS/.test(ua);
  const isEdgeDesktop = /Edg\//.test(ua);

  return isChromeIOS || isEdgeIOS || isFirefoxIOS || isChromeDesktop || isEdgeDesktop;
}

// Main route
app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const badBrowser = isBadBrowser(ua);

  console.log('UA:', ua.substring(0, 100), '| Bad browser:', badBrowser);

  try {
    let html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

    if (badBrowser) {
      html = html.replace(
        /<!--WIDGET_START-->[\s\S]*?<!--WIDGET_END-->/,
        '<!--WIDGET_REMOVED-->'
      );
      html = html.replace('id="browserWarning" style="display:none;', 'id="browserWarning" style="display:block;');
    }

    res.send(html);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`ViaSegura running on port ${PORT}`);
  console.log(`Serving files from: ${publicDir}`);
});