const fs = require('fs');
const path = require('path');
const https = require('https');

const queries = [
  { key: 'narali_pournima', query: 'Nariyal Poornima' },
  { key: 'narali_pournima_alt', query: 'Koli fishermen Maharashtra' },
  { key: 'bhau_beej', query: 'Bhai Dooj' },
  { key: 'bhau_beej_alt', query: 'Bhai Tika' },
  { key: 'mangala_gauri', query: 'Gauri puja' },
  { key: 'mangala_gauri_alt', query: 'Hartalika' },
  { key: 'bail_pola', query: 'Pola festival' },
  { key: 'bail_pola_alt', query: 'Pola Maharashtra' }
];

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
  const outDir = path.join(__dirname, '..', 'public', 'festivals');
  for (const q of queries) {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q.query)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&format=json`;
    try {
      const data = await fetchJson(searchUrl);
      const pages = data.query ? Object.values(data.query.pages) : [];
      console.log(`${q.key} (${q.query}): ${pages.length} results`);
      const goodPage = pages.find(p => {
        const info = p.imageinfo?.[0];
        return info && (info.mime === 'image/jpeg' || info.mime === 'image/png') && info.size > 30000;
      });
      if (goodPage) {
        const baseKey = q.key.replace('_alt', '');
        const dest = path.join(outDir, `${baseKey}.jpg`);
        if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
          console.log(`Downloading ${goodPage.title} -> ${baseKey}.jpg`);
          await downloadFile(goodPage.imageinfo[0].url, dest);
          console.log(`Saved ${baseKey}.jpg (${fs.statSync(dest).size} bytes)`);
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
