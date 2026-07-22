import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  const [depts] = await pool.query('SELECT * FROM departments');
  console.log('departments:', depts);
  const [faculty] = await pool.query('SELECT * FROM faculty');
  console.log('faculty count:', faculty.length);
  const [labs] = await pool.query('SELECT * FROM labs');
  console.log('labs count:', labs.length);
  
  process.exit(0);
}
run();
