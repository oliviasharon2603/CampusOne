import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  try {
    console.log('Fixing department names to match frontend...');
    await pool.query('UPDATE departments SET name = ?, code = ? WHERE id = 8', ['Artificial Intelligence & Machine Learning', 'AIML']);
    await pool.query('UPDATE departments SET name = ?, code = ? WHERE id = 9', ['Instrumentation & Control Engineering', 'ICE']);

    console.log('Updating lab image URLs to guaranteed unique Picsum photos...');
    const [labs] = await pool.query('SELECT id, name FROM labs');
    for (const lab of labs) {
      // Create a deterministic seed based on lab name to get consistent unique images
      const seedName = lab.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const imgUrl = `https://picsum.photos/seed/${seedName}/600/400`;
      await pool.query('UPDATE labs SET image_url = ? WHERE id = ?', [imgUrl, lab.id]);
    }
    
    console.log('Successfully fixed lab images and department mappings!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();
