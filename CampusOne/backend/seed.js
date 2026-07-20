import mysql from 'mysql2/promise';

const seedDatabase = async () => {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'campusone', // using the existing one
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to MySQL.');

    // Clear existing data safely
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE books');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Mock data mapped to actual schema
    // Fields: id (auto_increment), title, author, category_id, available_copies, total_copies, cover_url
    const MOCK_BOOKS = [
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category_id: 1, available: 5, total: 10, cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Data Structures using C', author: 'Reema Thareja', category_id: 1, available: 2, total: 8, cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Python Crash Course', author: 'Eric Matthes', category_id: 1, available: 0, total: 5, cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Clean Code', author: 'Robert C. Martin', category_id: 1, available: 3, total: 6, cover: 'https://images.unsplash.com/photo-1589087394125-9aee00bc6880?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Digital Design', author: 'M. Morris Mano', category_id: 5, available: 4, total: 7, cover: 'https://images.unsplash.com/photo-1592659762303-90081d37b9f4?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Head First Java', author: 'Paul Barry', category_id: 1, available: 6, total: 10, cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Design Patterns', author: 'Erich Gamma', category_id: 1, available: 1, total: 4, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category_id: 1, available: 8, total: 12, cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Operating Systems', author: 'Silberschatz', category_id: 1, available: 3, total: 8, cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=300' },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', category_id: 1, available: 7, total: 10, cover: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=200&h=300' }
    ];

    for (const book of MOCK_BOOKS) {
      await pool.query(
        'INSERT INTO books (title, author, category_id, available_copies, total_copies, cover_url) VALUES (?, ?, ?, ?, ?, ?)',
        [book.title, book.author, book.category_id, book.available, book.total, book.cover]
      );
    }
    
    console.log('Books seeded successfully.');

    // --- EVENTS SEEDING ---
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE events');
    await pool.query('TRUNCATE TABLE event_registrations');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Convert date string 'Aug 20, 2026' to SQL format '2026-08-20 00:00:00'
    const MOCK_EVENTS = [
      { title: 'AI & Future of Work Workshop', category: 'Academic', date: '2026-08-20 00:00:00', time: '10:00 AM', venue: 'Lab 301', seats: 12, poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600' },
      { title: 'Inter-College Basketball Final', category: 'Sports', date: '2026-08-22 00:00:00', time: '04:00 PM', venue: 'Sports Complex', seats: 150, poster_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600' },
      { title: 'Google Cloud Campus Connect', category: 'Technical', date: '2026-08-15 00:00:00', time: '09:00 AM', venue: 'Seminar Hall', seats: 5, poster_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' },
      { title: 'TCS Placement Drive', category: 'Placement', date: '2026-09-05 00:00:00', time: '08:30 AM', venue: 'Placement Cell', seats: 200, poster_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600' },
      { title: 'Freshers Welcome Party', category: 'Cultural', date: '2026-08-10 00:00:00', time: '06:00 PM', venue: 'Open Air Theatre', seats: 0, poster_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600' },
      { title: 'Web3 Builders Hackathon', category: 'Hackathons', date: '2026-09-12 00:00:00', time: '10:00 AM', venue: 'Innovation Lab', seats: 45, poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600' }
    ];

    for (const ev of MOCK_EVENTS) {
      await pool.query(
        'INSERT INTO events (title, category, event_date, time, venue, seats, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [ev.title, ev.category, ev.date, ev.time, ev.venue, ev.seats, ev.poster_url]
      );
    }
    console.log('Events seeded successfully.');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
