const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'IndiverseEducationalApp/1.0 (contact@indiverse.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'IndiverseEducationalApp/1.0 (contact@indiverse.org)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(destPath)));
    }).on('error', reject);
  });
}

async function run() {
  const queries = ['Kolhapuri Pheta', 'Puneri Pagadi', 'Pheta turban', 'Pagadi turban'];
  for (const q of queries) {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&format=json`;
    const data = await fetchJson(searchUrl);
    const pages = Object.values(data.query?.pages || {});
    console.log(`Query ${q}:`, pages.map(p => p.title));
    const goodPage = pages.find(p => {
      const t = p.title.toLowerCase();
      return (t.includes('pheta') || t.includes('pagadi') || t.includes('turban') || t.includes('ranade')) && !t.includes('feta cheese');
    });
    if (goodPage && goodPage.imageinfo?.[0]?.url) {
      const dest = path.join(__dirname, '..', 'public', 'clothes', 'pheta.jpg');
      console.log(`Downloading ${goodPage.title} to pheta.jpg...`);
      await downloadFile(goodPage.imageinfo[0].url, dest);
      console.log(`Downloaded pheta.jpg (${fs.statSync(dest).size} bytes)`);
      break;
    }
  }
}

run();
