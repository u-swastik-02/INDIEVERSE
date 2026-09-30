const fs = require('fs');
const path = require('path');
const https = require('https');

const festivals = [
  { key: 'dahi_handi', query: 'Dahi Handi Mumbai human pyramid' },
  { key: 'makar_sankranti', query: 'Makar Sankranti kites India' },
  { key: 'pandharpur_wari', query: 'Pandharpur Wari Varkari pilgrimage' },
  { key: 'nag_panchami', query: 'Nag Panchami festival snake' },
  { key: 'narali_pournima', query: 'Narali Pournima coconut festival' },
  { key: 'bhau_beej', query: 'Bhai Dooj festival India aarti' },
  { key: 'mangala_gauri', query: 'Mangala Gauri puja Maharashtra' },
  { key: 'bail_pola', query: 'Bail Pola festival bullock Maharashtra' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'IndiverseEducationalApp/1.0 (contact@indiverse.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
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
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', reject);
  });
}

async function run() {
  const outDir = path.join(__dirname, '..', 'public', 'festivals');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of festivals) {
    try {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(item.query)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&format=json`;
      console.log(`Searching for ${item.key}...`);
      const data = await fetchJson(searchUrl);
      const pages = data.query ? Object.values(data.query.pages) : [];
      console.log(`Found ${pages.length} files for ${item.key}`);
      const imagePage = pages.find(p => {
        const info = p.imageinfo?.[0];
        return info && (info.mime === 'image/jpeg' || info.mime === 'image/png') && info.size > 20000;
      });

      if (imagePage && imagePage.imageinfo?.[0]?.url) {
        const imgUrl = imagePage.imageinfo[0].url;
        console.log(`Found image for ${item.key}: ${imgUrl}`);
        const dest = path.join(outDir, `${item.key}.jpg`);
        await downloadFile(imgUrl, dest);
        console.log(`Saved ${item.key}.jpg (${fs.statSync(dest).size} bytes)`);
      } else {
        console.log(`No direct image found for ${item.key}`);
      }
    } catch (err) {
      console.error(`Error processing ${item.key}:`, err.message);
    }
  }
}

run();
