import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  const updates = [
    { name: 'Computer Science and Engineering', code: 'CSE' },
    { name: 'Artificial Intelligence & Data Science', code: 'AIDS' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Electronics and Communication', code: 'ECE' },
    { name: 'Electrical and Electronics', code: 'EEE' },
    { name: 'Mechanical Engineering', code: 'MECH' },
    { name: 'Civil Engineering', code: 'CIVIL' },
    { name: 'Biotechnology', code: 'BIOTECH' },
    { name: 'Chemical Engineering', code: 'CHEM' }
  ];

  for (const u of updates) {
    await pool.query('UPDATE departments SET code = ? WHERE name LIKE ?', [u.code, `%${u.name}%`]);
  }
  
  const [depts] = await pool.query('SELECT name, code FROM departments');
  console.log(depts);

  process.exit(0);
}
run();
