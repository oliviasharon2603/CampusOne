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
      SELECT b.id, b.title, b.author, c.name as category, b.available_copies as available, b.total_copies as total, b.cover_url as cover, b.rack_info as rack 
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
  const { bookId, userId = 1, name = 'Student' } = req.body;
  if (!bookId) return res.status(400).json({ success: false, message: 'bookId required' });
  try {
    const [result] = await pool.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0',
      [bookId]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Book unavailable or not found' });
    }
    
    // Log borrowed book
    await pool.query('INSERT INTO borrow_history (book_id, user_id, status) VALUES (?, ?, ?)', [bookId, userId, 'borrowed']);

    res.json({ success: true, message: 'Book requested successfully' });
  } catch (error) {
    console.error('Error requesting book:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/v1/library/wishlist', async (req, res) => {
  const { userId = 1 } = req.query;
  try {
    const [rows] = await pool.query('SELECT book_id FROM library_wishlist WHERE user_id = ?', [userId]);
    res.json({ success: true, data: rows.map(r => r.book_id) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/library/wishlist', async (req, res) => {
  const { userId = 1, bookId } = req.body;
  if (!bookId) return res.status(400).json({ success: false, message: 'bookId required' });
  try {
    const [existing] = await pool.query('SELECT id FROM library_wishlist WHERE user_id = ? AND book_id = ?', [userId, bookId]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM library_wishlist WHERE id = ?', [existing[0].id]);
      res.json({ success: true, action: 'removed' });
    } else {
      await pool.query('INSERT INTO library_wishlist (user_id, book_id) VALUES (?, ?)', [userId, bookId]);
      res.json({ success: true, action: 'added' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/library/ai-search', async (req, res) => {
  const { query } = req.body;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const [rows] = await pool.query(`
      SELECT b.id, b.title, b.author, c.name as category, b.available_copies as available, b.total_copies as total, b.cover_url as cover, b.rack_info as rack 
      FROM books b 
      LEFT JOIN book_categories c ON b.category_id = c.id
      ORDER BY RAND() LIMIT 2
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/v1/library/borrow-history', async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await pool.query(`
      SELECT bh.*, b.title as book_title, b.cover_url as book_cover 
      FROM borrow_history bh 
      JOIN books b ON bh.book_id = b.id 
      WHERE bh.user_id = ? 
      ORDER BY bh.borrowed_at DESC
    `, [userId || 1]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.get('/api/v1/library/requests', async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await pool.query(`
      SELECT br.*, b.title as book_title, b.cover_url as book_cover 
      FROM book_requests br 
      JOIN books b ON br.book_id = b.id 
      WHERE br.user_id = ? 
      ORDER BY br.requested_at DESC
    `, [userId || 1]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Dashboard API Routes
app.get('/api/v1/dashboard', async (req, res) => {
  const { userId = 1 } = req.query;
  try {
    const [attRecords] = await pool.query('SELECT status FROM attendance_records WHERE user_id = ?', [userId]);
    let attendancePercent = 88; // Default mock if no records
    if (attRecords.length > 0) {
      const present = attRecords.filter(r => r.status === 'Present').length;
      attendancePercent = Math.round((present / attRecords.length) * 100);
    }

    const dashboardData = {
      success: true,
      data: {
        attendance: attendancePercent,
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

// Announcements API
app.get('/api/v1/announcements', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Notifications API
app.get('/api/v1/notifications', async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId || 1]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Events API Routes
app.get('/api/v1/events', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM events');
    const [registrations] = await pool.query('SELECT event_id FROM event_registrations');
    const registeredIds = registrations.map(r => r.event_id);

    const formattedEvents = events.map(ev => {
      let type = ev.status ? ev.status.toLowerCase() : 'upcoming';

      return {
        id: ev.id,
        title: ev.title,
        category: ev.category || 'General',
        date: ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA',
        time: ev.time || '10:00 AM',
        venue: ev.venue || 'Campus',
        seats: ev.seats || 100,
        image: ev.poster_url || ev.image_url,
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
  const { eventId, userId = 1, name = 'Student', formData = {} } = req.body;
  if (!eventId) return res.status(400).json({ success: false, message: 'eventId required' });
  
  try {
    // 1. Check if already registered
    const [existing] = await pool.query('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?', [eventId, userId]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already registered' });

    // 2. Decrement seats
    const [updateResult] = await pool.query('UPDATE events SET seats = seats - 1 WHERE id = ? AND seats > 0', [eventId]);
    if (updateResult.affectedRows === 0) return res.status(400).json({ success: false, message: 'No seats available' });

    // 3. Create registration record
    await pool.query('INSERT INTO event_registrations (event_id, user_id, name, form_data) VALUES (?, ?, ?, ?)', [eventId, userId, name, JSON.stringify(formData)]);

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// User Sync API
app.post('/api/v1/users/sync', async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  if (!uid || !email) return res.status(400).json({ success: false, message: 'Missing user data' });
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE uid = ?', [uid]);
    if (existing.length === 0) {
      await pool.query('INSERT INTO users (uid, email, full_name, avatar_url) VALUES (?, ?, ?, ?)', [uid, email, displayName || 'Student', photoURL || null]);
    }
    const [user] = await pool.query('SELECT id FROM users WHERE uid = ?', [uid]);
    res.json({ success: true, userId: user[0].id });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Clubs API
app.get('/api/v1/clubs', async (req, res) => {
  const { userId } = req.query;
  try {
    const [clubs] = await pool.query('SELECT * FROM clubs');
    let joinedIds = [];
    if (userId) {
      const [memberships] = await pool.query('SELECT club_id FROM club_members WHERE user_id = ? OR email = ?', [userId, userId]);
      joinedIds = memberships.map(m => m.club_id);
    }
    const formatted = clubs.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      image: c.logo_url,
      members: c.members_count || 0,
      incharge_name: c.incharge_name,
      contact_details: c.contact_details,
      isMember: joinedIds.includes(c.id)
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/clubs/:id/join', async (req, res) => {
  const clubId = req.params.id;
  const { student_name, email, reason } = req.body;
  if (!student_name || !email || !reason) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  try {
    await pool.query(
      'INSERT INTO club_members (club_id, student_name, email, reason, status) VALUES (?, ?, ?, ?, ?)',
      [clubId, student_name, email, reason, 'pending']
    );
    await pool.query('UPDATE clubs SET members_count = members_count + 1 WHERE id = ?', [clubId]);
    res.json({ success: true, message: 'Joined successfully' });
  } catch (error) {
    console.error('Error joining club:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Transport API
app.get('/api/v1/transport', async (req, res) => {
  try {
    const [routes] = await pool.query('SELECT * FROM transport_routes');
    res.json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Canteen API
app.get('/api/v1/canteen', async (req, res) => {
  try {
    const [items] = await pool.query('SELECT * FROM canteen_items');
    // Group by category
    const grouped = items.reduce((acc, item) => {
      const cat = acc.find(c => c.category === item.section);
      if (cat) cat.items.push(item);
      else acc.push({ category: item.section, items: [item] });
      return acc;
    }, []);

    const [specialMeals] = await pool.query('SELECT * FROM special_meals');
    grouped.unshift({ category: 'Special Meals of the Day', items: specialMeals.map(sm => ({
      id: `special_${sm.id}`,
      name: sm.name,
      description: `${sm.type} - Today's special meal`,
      price: sm.price,
      is_veg: sm.type === 'Veg' ? 1 : 0,
      image_url: sm.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200'
    })) });

    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Complaints API
app.get('/api/v1/complaints', async (req, res) => {
  const { userId } = req.query;
  try {
    const [complaints] = await pool.query('SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC', [userId || 1]);
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/complaints', async (req, res) => {
  const { userId, title, category, description } = req.body;
  if (!userId || !title) return res.status(400).json({ success: false, message: 'Invalid data' });
  try {
    await pool.query('INSERT INTO complaints (user_id, title, category, description) VALUES (?, ?, ?, ?)', [userId, title, category, description]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Lost and Found API
app.get('/api/v1/lost-found', async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT l.*, u.full_name as author_name, u.avatar_url 
      FROM lost_found l 
      LEFT JOIN users u ON l.user_id = u.id 
      ORDER BY l.created_at DESC
    `);
    const formatted = items.map(i => ({
      id: i.id,
      type: i.status === 'Lost' ? 'LOST' : 'FOUND',
      author: { name: i.author_name || 'Student', avatar: i.avatar_url || 'https://ui-avatars.com/api/?name=Student&background=6366f1&color=fff' },
      timestamp: i.created_at,
      location: i.location,
      description: i.description,
      image: null,
      replies: []
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Documents API
app.get('/api/v1/documents', async (req, res) => {
  const { userId } = req.query;
  try {
    const [docs] = await pool.query('SELECT * FROM documents WHERE user_id = ?', [userId || 1]);
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/v1/documents', async (req, res) => {
  const { userId, title, type } = req.body;
  if (!userId || !title) return res.status(400).json({ success: false, message: 'Invalid data' });
  try {
    await pool.query('INSERT INTO documents (user_id, title, type, status) VALUES (?, ?, ?, ?)', [userId, title, type, 'Verified']);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// Departments API
app.get('/api/v1/departments', async (req, res) => {
  try {
    const [departments] = await pool.query('SELECT * FROM departments');
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Faculty by Department API
app.get('/api/v1/departments/:id/faculty', async (req, res) => {
  try {
    const [faculty] = await pool.query('SELECT * FROM faculty WHERE department_id = ?', [req.params.id]);
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Labs by Department API
app.get('/api/v1/departments/:id/labs', async (req, res) => {
  try {
    const [labs] = await pool.query('SELECT * FROM labs WHERE department_id = ?', [req.params.id]);
    res.json({ success: true, data: labs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default pool;
