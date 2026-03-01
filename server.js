const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Auto-detect where files are - public/ folder or root
const publicDir = fs.existsSync(path.join(__dirname, 'public', 'index.html'))
  ? path.join(__dirname, 'public')
  : __dirname;

// Serve static files (images, CSS, other pages)
app.use(express.static(publicDir));

// Browser detection
function isBadBrowser(ua) {
  const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isEdge = /Edg/.test(ua);
  const isMobile = /Mobi|Android/i.test(ua);
  return (isChrome || isEdge) && isMobile;
}

// Main route - serve index with or without widget
app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const badBrowser = isBadBrowser(ua);

  try {
    let html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

    if (badBrowser) {
      html = html.replace(
        /<!--WIDGET_START-->[\s\S]*?<!--WIDGET_END-->/,
        '<!--WIDGET_REMOVED_FOR_BROWSER_COMPAT-->'
      );
      html = html.replace('id="browserWarning" style="display:none;', 'id="browserWarning" style="display:block;');
    }

    res.send(html);
  } catch (err) {
    console.error('Error reading index.html:', err.message);
    res.status(500).send('Server starting up. Please refresh in a moment.');
  }
});

app.listen(PORT, () => {
  console.log(`ViaSegura running on port ${PORT}`);
  console.log(`Serving files from: ${publicDir}`);
});
