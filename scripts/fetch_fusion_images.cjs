const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'IndiverseGenZFusion/1.0 (contact@indiverse.org)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

function searchWikimedia(query) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|mime|size&format=json`;
    https.get(url, { headers: { 'User-Agent': 'IndiverseGenZFusion/1.0 (contact@indiverse.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query ? Object.values(json.query.pages) : [];
          resolve(pages);
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const items = [
    { name: 'denim_jacket', query: 'Denim jacket fashion' },
    { name: 'hoodie_streetwear', query: 'Hoodie streetwear clothing' },
    { name: 'platform_sandals', query: 'Platform sandals leather' },
    { name: 'skateboard_deck', query: 'Skateboard deck art' },
    { name: 'attar_perfume', query: 'Perfume bottle glass' },
    { name: 'copper_bottle', query: 'Copper water bottle vessel' },
    { name: 'cargo_pants', query: 'Cargo pants fashion clothing' },
    { name: 'silver_earrings', query: 'Silver earrings jewelry Indian' },
    { name: 'coffee_filter', query: 'Coffee dripper filter maker' }
  ];

  for (const item of items) {
    try {
      console.log(`Searching for ${item.name}...`);
      const pages = await searchWikimedia(item.query);
      const valid = pages.find(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url && (p.imageinfo[0].mime === 'image/jpeg' || p.imageinfo[0].mime === 'image/png') && (p.imageinfo[0].size > 20000));
      if (valid) {
        const dest = path.join(__dirname, '..', 'public', 'fusion', `${item.name}.jpg`);
        console.log(`Downloading ${valid.title} -> ${dest}`);
        await download(valid.imageinfo[0].url, dest);
        console.log(`Saved ${item.name}.jpg (${fs.statSync(dest).size} bytes)`);
      } else {
        console.log(`No valid image for ${item.name}`);
      }
    } catch(e) {
      console.error(`Error for ${item.name}:`, e.message);
    }
  }
}

main();
