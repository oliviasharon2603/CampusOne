import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  const updates = [
    { type: 'special_meals', id: 5, url: 'https://loremflickr.com/200/200/curry,naan,paneer/all' },
    { type: 'special_meals', id: 6, url: 'https://loremflickr.com/200/200/fried,fish,food/all' },
    { type: 'special_meals', id: 8, url: 'https://loremflickr.com/200/200/chicken,tikka,kebab/all' },
    { type: 'canteen_items', id: 5, url: 'https://loremflickr.com/200/200/cold,coffee,glass/all' },
    { type: 'canteen_items', id: 7, url: 'https://loremflickr.com/200/200/masala,dosa,indian/all' }
  ];

  for (const item of updates) {
    await pool.query(`UPDATE ${item.type} SET image_url = ? WHERE id = ?`, [item.url, item.id]);
    console.log(`Updated ID ${item.id} in ${item.type} with ${item.url}`);
  }
  process.exit(0);
}

run();
