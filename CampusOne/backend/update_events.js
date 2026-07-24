import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

const updates = {
  1: { category: 'Technical', venue: 'Lab 402', time: '10:00 AM', seats: 45, offsetDays: -10 },
  2: { category: 'Cultural', venue: 'Main Auditorium', time: '09:00 AM', seats: 200, offsetDays: -15 },
  3: { category: 'Academic', venue: 'Seminar Hall A', time: '01:00 PM', seats: 80, offsetDays: -5 },
  4: { category: 'Academic', venue: 'Conference Room 1', time: '11:30 AM', seats: 30, offsetDays: -2 },
  5: { category: 'Hackathons', venue: 'Main Auditorium', time: '08:00 AM', seats: 300, offsetDays: 10 },
  6: { category: 'Cultural', venue: 'Open Air Theatre', time: '05:00 PM', seats: 500, offsetDays: 14 },
  7: { category: 'Technical', venue: 'Exhibition Hall', time: '10:00 AM', seats: 150, offsetDays: 5 },
  8: { category: 'Academic', venue: 'Alumni House', time: '04:00 PM', seats: 100, offsetDays: 7 },
  9: { category: 'Technical', venue: 'Computer Centre', time: '11:00 AM', seats: 60, offsetDays: 1 },
  10: { category: 'Cultural', venue: 'Art Gallery', time: '02:00 PM', seats: 40, offsetDays: 2 },
  11: { category: 'Sports', venue: 'Indoor Stadium', time: '03:00 PM', seats: 200, offsetDays: 0 },
  12: { category: 'Placement', venue: 'Placement Cell', time: '09:00 AM', seats: 120, offsetDays: 3 },
  13: { category: 'Sports', venue: 'Yoga Centre', time: '06:00 AM', seats: 50, offsetDays: 2 }
};

async function run() {
  const now = new Date();
  
  for (const [id, data] of Object.entries(updates)) {
    const eventDate = new Date(now.getTime() + data.offsetDays * 24 * 60 * 60 * 1000);
    const dateStr = eventDate.toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.query(
      'UPDATE events SET category = ?, venue = ?, time = ?, seats = ?, event_date = ? WHERE id = ?',
      [data.category, data.venue, data.time, data.seats, dateStr, id]
    );
  }
  
  console.log('Events successfully updated.');
  process.exit();
}

run().catch(console.error);
