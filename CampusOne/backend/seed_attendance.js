import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  try {
    await pool.query('TRUNCATE TABLE attendance_records');
    
    const [users] = await pool.query('SELECT id FROM users');
    
    // We will generate 40 days of records for each user
    for (const u of users) {
      let userId = u.id;
      let presentCount = userId === 1 ? 25 : 36; // User 1 gets < 75% (25/40 = 62.5%)
      
      for (let i = 0; i < 40; i++) {
        let status = 'Absent';
        if (i < presentCount) status = 'Present';
        else if (i === 39) status = 'On Leave';
        
        let d = new Date();
        d.setDate(d.getDate() - i);
        let dateStr = d.toISOString().split('T')[0];
        
        await pool.query('INSERT INTO attendance_records (user_id, date, status) VALUES (?, ?, ?)', [userId, dateStr, status]);
      }
    }
    console.log("Attendance seeded. User 1 has < 75% attendance.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
