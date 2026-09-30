const fs = require('fs');
const path = require('path');
const https = require('https');

const clothesQueries = [
  { key: 'dhoti', queries: ['Dhoti', 'Dhoti kurta India', 'Dhoti traditional'] },
  { key: 'pheta', queries: ['Pheta', 'Puneri Pagadi', 'Pheta turban', 'Maharashtrian pheta'] },
  { key: 'kurta_sadra', queries: ['Kurta', 'Kurta India', 'Men kurta India'] },
  { key: 'bandi_waistcoat', queries: ['Nehru jacket', 'Bandi jacket', 'Indian waistcoat men'] },
  { key: 'kolhapuri_chappals', queries: ['Kolhapuri chappal', 'Kolhapuri chappals'] },
  { key: 'nauvari_saree', queries: ['Nauvari', 'Nauvari saree', 'Kashta saree'] },
  { key: 'choli_blouse', queries: ['Choli', 'Saree blouse', 'Ravike'] },
  { key: 'paithani_saree', queries: ['Paithani', 'Paithani saree', 'Paithani silk'] },
  { key: 'mundavalya', queries: ['Mundavalya', 'Maharashtrian wedding', 'Marathi wedding'] },
  { key: 'green_glass_bangles', queries: ['Green bangles', 'Glass bangles India', 'Bangles market India'] }
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
  const outDir = path.join(__dirname, '..', 'public', 'clothes');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of clothesQueries) {
    const dest = path.join(outDir, `${item.key}.jpg`);
    let downloaded = false;

    for (const q of item.queries) {
      if (downloaded) break;
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&format=json`;
      try {
        console.log(`Searching for ${item.key} with query: "${q}"...`);
        const data = await fetchJson(searchUrl);
        const pages = data.query ? Object.values(data.query.pages) : [];
        const goodPage = pages.find(p => {
          const info = p.imageinfo?.[0];
          return info && (info.mime === 'image/jpeg' || info.mime === 'image/png') && info.size > 25000;
        });

        if (goodPage && goodPage.imageinfo?.[0]?.url) {
          const imgUrl = goodPage.imageinfo[0].url;
          console.log(`Downloading ${goodPage.title} -> ${item.key}.jpg`);
          await downloadFile(imgUrl, dest);
          console.log(`Saved ${item.key}.jpg (${fs.statSync(dest).size} bytes)`);
          downloaded = true;
        }
      } catch (err) {
        console.error(`Error querying ${q}:`, err.message);
      }
    }

    if (!downloaded) {
      console.log(`No image found for ${item.key}`);
    }
  }
}

run();
