import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  const updates = [
    { type: 'special_meals', id: 5, url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Paneer_Butter_Masala_%26_Naan.jpg' },
    { type: 'special_meals', id: 6, url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Kerala_Fish_Fry.jpg' },
    { type: 'special_meals', id: 8, url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Chicken_tikka_masala.jpg' },
    { type: 'canteen_items', id: 5, url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Cold_Coffee.jpg' },
    { type: 'canteen_items', id: 7, url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_and_ghee.jpg' }
  ];

  for (const item of updates) {
    await pool.query(`UPDATE ${item.type} SET image_url = ? WHERE id = ?`, [item.url, item.id]);
    console.log(`Updated ID ${item.id} in ${item.type}.`);
  }
  process.exit(0);
}

run();
