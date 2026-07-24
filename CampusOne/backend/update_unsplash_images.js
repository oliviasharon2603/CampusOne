import https from 'https';
import mysql from 'mysql2/promise';

async function fetchUnsplashImage(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find something like "photo-12345..."
        const match = data.match(/"id":"([^"]{10,15})","slug":"[^"]+"/);
        if (match && match[1]) {
           resolve(`https://images.unsplash.com/photo-${match[1]}?auto=format&fit=crop&q=80&w=200&h=200`);
        } else {
           resolve(null);
        }
      });
    }).on('error', reject);
  });
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  const updates = [
    { type: 'special_meals', id: 5, query: 'paneer-butter-masala' },
    { type: 'special_meals', id: 6, query: 'fried-fish' },
    { type: 'special_meals', id: 8, query: 'chicken-tikka' },
    { type: 'canteen_items', id: 5, query: 'iced-coffee' },
    { type: 'canteen_items', id: 7, query: 'dosa' }
  ];

  for (const item of updates) {
    const url = await fetchUnsplashImage(item.query);
    if (url) {
      await pool.query(`UPDATE ${item.type} SET image_url = ? WHERE id = ?`, [url, item.id]);
      console.log(`Updated ID ${item.id} in ${item.type} with ${url}`);
    } else {
      console.log(`Failed to find Unsplash image for ${item.query}`);
    }
  }
  process.exit(0);
}

run();
