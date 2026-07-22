import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  try {
    // 1. Fetch 90 random Indian users
    console.log('Fetching 90 random Indian profiles...');
    const res = await fetch('https://randomuser.me/api/?nat=in&results=90');
    const data = await res.json();
    const users = data.results;

    // 2. Fetch departments
    const [depts] = await pool.query('SELECT id FROM departments ORDER BY id');
    if (depts.length === 0) {
      console.log('No departments found.');
      process.exit(1);
    }

    // 3. Clear existing faculty
    console.log('Clearing existing faculty...');
    await pool.query('DELETE FROM faculty');

    let userIndex = 0;
    
    const designations = [
      'Head of Department',
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Assistant Professor',
      'Assistant Professor',
      'Assistant Professor',
      'Lecturer',
      'Lecturer',
      'Visiting Faculty'
    ];

    // 4. Insert 10 unique faculty per department
    for (const dept of depts) {
      console.log(`Seeding 10 faculty for dept ${dept.id}...`);
      for (let i = 0; i < 10; i++) {
        if (userIndex >= users.length) break;
        
        const u = users[userIndex++];
        const name = `${u.name.title} ${u.name.first} ${u.name.last}`;
        const photo_url = u.picture.large;
        const designation = designations[i % designations.length];
        
        await pool.query(
          'INSERT INTO faculty (department_id, name, designation, photo_url) VALUES (?, ?, ?, ?)',
          [dept.id, name, designation, photo_url]
        );
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

run();
