import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  try {
    console.log('Fetching all clubs...');
    const [clubs] = await pool.query('SELECT id FROM clubs');
    
    for (const club of clubs) {
      // Generate a random number between 30 and 180
      const randomMembers = Math.floor(Math.random() * (180 - 30 + 1)) + 30;
      await pool.query('UPDATE clubs SET members_count = ? WHERE id = ?', [randomMembers, club.id]);
      console.log(`Updated club ID ${club.id} to have ${randomMembers} members.`);
    }

    console.log('Successfully added random members to all clubs!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();
