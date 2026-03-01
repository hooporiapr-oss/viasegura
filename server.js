const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (images, CSS, other pages)
app.use(express.static(path.join(__dirname, 'public')));

// Browser detection middleware
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
  
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  
  if (badBrowser) {
    // Remove the ElevenLabs widget entirely
    html = html.replace(
      /<!--WIDGET_START-->[\s\S]*?<!--WIDGET_END-->/,
      '<!--WIDGET_REMOVED_FOR_BROWSER_COMPAT-->'
    );
    // Show the Safari warning
    html = html.replace('id="browserWarning" style="display:none;', 'id="browserWarning" style="display:block;');
  }
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`ViaSegura running on port ${PORT}`);
});
