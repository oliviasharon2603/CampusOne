import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campusone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ status: 'ok', db: 'connected', time: new Date() });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});
// Library API Routes
app.get('/api/v1/library/books', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.title, b.author, c.name as category, b.available_copies as available, b.total_copies as total, b.cover_url as cover 
      FROM books b 
      LEFT JOIN book_categories c ON b.category_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/library/request', async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ success: false, message: 'bookId required' });
  try {
    const [result] = await pool.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0',
      [bookId]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Book unavailable or not found' });
    }
    res.json({ success: true, message: 'Book requested successfully' });
  } catch (error) {
    console.error('Error requesting book:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Dashboard API Routes
app.get('/api/v1/dashboard', async (req, res) => {
  try {
    // In a full implementation, we'd query attendance, timetable, and AI suggestions tables based on req.user
    // For this integration, we aggregate the modules required by the frontend
    const dashboardData = {
      success: true,
      data: {
        attendance: 88,
        aiTip: { 
          title: "Upcoming Deadlines", 
          desc: "You have 2 assignments due next week. Consider starting the Operating Systems project this weekend.", 
          isWarning: false 
        },
        todaySchedule: [
          { time: '09:00 AM', course: 'Machine Learning Lab', type: 'Lab', room: 'Lab 402' },
          { time: '11:15 AM', course: 'Data Structures', type: 'Lecture', room: 'Hall B' },
          { time: '02:00 PM', course: 'Linear Algebra', type: 'Lecture', room: 'Room 105' }
        ]
      }
    };
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Events API Routes
app.get('/api/v1/events', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM events');
    const [registrations] = await pool.query('SELECT event_id FROM event_registrations');
    const registeredIds = registrations.map(r => r.event_id);

    const now = new Date();
    
    const formattedEvents = events.map(ev => {
      let type = 'upcoming';
      const eventDate = new Date(ev.event_date);
      // Rough logic: if it's the exact same day, maybe current. If past, completed.
      if (eventDate < now && (now - eventDate) > 24 * 60 * 60 * 1000) {
        type = 'completed';
      } else if (eventDate <= now && (now - eventDate) <= 24 * 60 * 60 * 1000) {
        type = 'current';
      }

      // Format date for UI e.g., "Aug 20, 2026"
      const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        id: ev.id,
        title: ev.title,
        category: ev.category,
        date: dateStr,
        time: ev.time,
        venue: ev.venue,
        seats: ev.seats,
        image: ev.poster_url,
        type,
        registered: registeredIds.includes(ev.id)
      };
    });

    res.json({ success: true, data: formattedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/events/register', async (req, res) => {
  const { eventId, userId = 1 } = req.body; // Mock user ID 1 for now
  if (!eventId) return res.status(400).json({ success: false, message: 'eventId required' });
  
  try {
    // 1. Check if already registered
    const [existing] = await pool.query('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?', [eventId, userId]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already registered' });

    // 2. Decrement seats
    const [updateResult] = await pool.query('UPDATE events SET seats = seats - 1 WHERE id = ? AND seats > 0', [eventId]);
    if (updateResult.affectedRows === 0) return res.status(400).json({ success: false, message: 'No seats available' });

    // 3. Create registration record
    await pool.query('INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)', [eventId, userId]);

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default pool;
