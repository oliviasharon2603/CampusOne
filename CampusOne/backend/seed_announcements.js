import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

async function run() {
  try {
    const announcements = [
      {
        title: "Campus Wi-Fi Maintenance",
        content: "The campus Wi-Fi will be down for maintenance this Saturday from 2 AM to 4 AM. Please plan accordingly."
      },
      {
        title: "Library Extended Hours",
        content: "Due to upcoming mid-semester examinations, the central library will remain open until midnight starting next week."
      },
      {
        title: "Blood Donation Drive",
        content: "NSS is organizing a blood donation drive in the main auditorium tomorrow. All eligible students are encouraged to participate."
      }
    ];

    for (const ann of announcements) {
      await pool.query('INSERT INTO announcements (title, content) VALUES (?, ?)', [ann.title, ann.content]);
    }
    console.log("Announcements seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
