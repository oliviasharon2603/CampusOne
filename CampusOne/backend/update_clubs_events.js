import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

const clubEvents = {
  1: "Hackathon 2026 - Build the Future",
  2: "Summer Dance Fest Showcase",
  3: "RoboWars Regional Championship",
  4: "Campus Cleanliness Drive",
  5: "Annual Cultural Fest Rehearsals",
  6: "Code Optimization Workshop",
  7: "AI in Healthcare Seminar",
  8: "Cloud Computing Basics Bootcamp",
  9: "Circuit Design Competition",
  10: "Smart Grid Technologies Guest Lecture",
  11: "AutoCAD Design Challenge",
  12: "Bridge Building Contest",
  13: "Genomics Research Symposium",
  14: "Polymers and Materials Expo"
};

async function run() {
  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM clubs LIKE "upcoming_event"');
    if (columns.length === 0) {
      await pool.query('ALTER TABLE clubs ADD COLUMN upcoming_event VARCHAR(255) DEFAULT NULL');
      console.log('Added column "upcoming_event" to clubs table');
    }

    for (const [id, event] of Object.entries(clubEvents)) {
      await pool.query('UPDATE clubs SET upcoming_event = ? WHERE id = ?', [event, id]);
    }
    
    console.log('Successfully added upcoming events for all clubs.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

run();
