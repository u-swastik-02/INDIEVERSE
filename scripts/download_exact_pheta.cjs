const fs = require('fs');
const path = require('path');
const https = require('https');

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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'IndiverseEducationalApp/1.0 (contact@indiverse.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:Samarjeetsinh%20Ghatge%20in%20Maharashtrian%20attire.jpg&prop=imageinfo&iiprop=url&format=json`;
  const data = await fetchJson(fileUrl);
  const page = Object.values(data.query.pages)[0];
  const url = page.imageinfo[0].url;
  const dest = path.join(__dirname, '..', 'public', 'clothes', 'pheta.jpg');
  await downloadFile(url, dest);
  console.log(`Saved authentic Pheta image: ${fs.statSync(dest).size} bytes`);
}

run();
