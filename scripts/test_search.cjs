const https = require('https');

function test(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=imageinfo&iiprop=url|mime|size&format=json`;
  https.get(url, { headers: { 'User-Agent': 'IndiverseMarketplaceApp/1.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      console.log(query, json.query ? Object.keys(json.query.pages).length : 'None');
      if (json.query) {
        Object.values(json.query.pages).forEach(p => console.log(' - ', p.title, p.imageinfo?.[0]?.url));
      }
    });
  });
}

test('Warli painting');
test('Modak');
test('Ganesha brass');
