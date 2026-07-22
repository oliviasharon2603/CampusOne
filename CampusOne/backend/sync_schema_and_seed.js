import mysql from 'mysql2/promise';

const DEPARTMENTS = [
  { name: 'Computer Science and Engineering', count: 24, labs: 6 },
  { name: 'Artificial Intelligence & Data Science', count: 18, labs: 4 },
  { name: 'Information Technology', count: 20, labs: 5 },
  { name: 'Electronics and Communication', count: 22, labs: 4 },
  { name: 'Electrical and Electronics', count: 16, labs: 3 },
  { name: 'Mechanical Engineering', count: 20, labs: 4 },
  { name: 'Civil Engineering', count: 15, labs: 3 },
  { name: 'Biotechnology', count: 14, labs: 2 },
  { name: 'Chemical Engineering', count: 12, labs: 2 }
];

const CLUBS_DATA = [
  { name: "TechNova Coding Club", category: "Technical", description: "The official computer science club...", incharge: "Dr. R. Karthik", contact: "technova@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" },
  { name: "CampusOne Dance Troupe", category: "Cultural", description: "Join the most energetic society on campus!", incharge: "Ms. Priya S.", contact: "dance@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600" },
  { name: "Robotics & Automation Society", category: "Technical", description: "We design, build, and program robots.", incharge: "Dr. Arun K.", contact: "robotics@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600" },
  { name: "National Service Scheme (NSS)", category: "Social", description: "Empowering youth through community service.", incharge: "Mr. Venkatesh", contact: "nss@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=600" },
  { name: "Cultural Committee", category: "Cultural", description: "Organizing the biggest fests and celebrations.", incharge: "Dr. Latha V.", contact: "cultural@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600" },
  { name: "CSE Society", category: "Departmental", description: "Official club for CSE students.", incharge: "Dr. M. Suresh", contact: "cse@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600" },
  { name: "AI&DS Innovators", category: "Departmental", description: "Exploring AI, ML, and Data Science.", incharge: "Dr. S. Kumar", contact: "aids@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600" },
  { name: "IT Network Nexus", category: "Departmental", description: "Networking, cloud computing, and IT.", incharge: "Ms. Ramya", contact: "it@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600" },
  { name: "ECE Spark Club", category: "Departmental", description: "Electronics circuits and VLSI design.", incharge: "Dr. B. Prasad", contact: "ece@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
  { name: "EEE Voltage", category: "Departmental", description: "Power systems and electrical innovations.", incharge: "Mr. T. Raj", contact: "eee@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600" },
  { name: "Mech Gears", category: "Departmental", description: "Automobile and mechanical design.", incharge: "Dr. V. Raman", contact: "mech@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" },
  { name: "Civil Structures", category: "Departmental", description: "Construction and structural engineering.", incharge: "Ms. S. Kavitha", contact: "civil@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600" },
  { name: "BioTech Genome", category: "Departmental", description: "Genetics and bioinformatics research.", incharge: "Dr. K. Nithya", contact: "biotech@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600" },
  { name: "Chem Reactions", category: "Departmental", description: "Chemical processes and material science.", incharge: "Mr. J. Peter", contact: "chem@campusone.edu", members: Math.floor(Math.random() * 200) + 50, logo_url: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600" }
];

const ROUTES_DATA = [
  { name: "Chatram to Panjappur", busNo: "TN-45-AT-1001", driver: "Murugan K.", contact: "+91 98765 43210", departure: "07:30 AM", arrival: "08:45 AM" },
  { name: "Central to Panjappur", busNo: "TN-45-AT-2045", driver: "Ramesh P.", contact: "+91 98765 43211", departure: "07:45 AM", arrival: "08:40 AM" },
  { name: "Srirangam to Panjappur", busNo: "TN-45-AT-3012", driver: "Karthik M.", contact: "+91 98765 43212", departure: "07:15 AM", arrival: "08:30 AM" },
  { name: "Thillai Nagar to Panjappur", busNo: "TN-45-AT-4055", driver: "Selvam S.", contact: "+91 98765 43213", departure: "08:00 AM", arrival: "08:50 AM" }
];

const MENU_DATA = [
  { name: 'Paneer Tikka', section: 'Starters', desc: 'Delicious grilled paneer marinated in spices.', price: 120, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Chicken 65', section: 'Starters', desc: 'Spicy, deep-fried chicken appetizer.', price: 140, is_veg: 0, is_available: 1, image_url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Gobi Manchurian', section: 'Starters', desc: 'Crispy cauliflower tossed in manchurian sauce.', price: 90, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Filter Coffee', section: 'Beverages', desc: 'Authentic South Indian filter coffee.', price: 30, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Cold Coffee', section: 'Beverages', desc: 'Chilled creamy coffee with ice cream.', price: 60, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1517701550927-30cf0b6af76e?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Fresh Orange Juice', section: 'Fresh Juices', desc: 'Freshly squeezed oranges.', price: 50, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Masala Dosa', section: 'Breakfast', desc: 'Crispy crepe filled with potato masala.', price: 60, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Chicken Sausage Omelette', section: 'Breakfast', desc: 'Fluffy omelette stuffed with sausages.', price: 90, is_veg: 0, is_available: 1, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Veg Dum Biryani', section: 'Main Course', desc: 'Aromatic basmati rice cooked with mixed veggies.', price: 130, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Chicken Biryani', section: 'Main Course', desc: 'Classic fragrant biryani with tender chicken pieces.', price: 140, is_veg: 0, is_available: 1, image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Samosa Chat', section: 'Snacks', desc: 'Smashed samosas topped with yogurt and chutneys.', price: 45, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Peri Peri French Fries', section: 'Snacks', desc: 'Crispy fries tossed in spicy peri peri mix.', price: 60, is_veg: 1, is_available: 1, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200&h=200' }
];

const SPECIAL_MEALS = [
  { name: 'Special Veg Meals', type: 'Veg', day_of_week: 'Monday', price: 80, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Special Non-Veg Meals', type: 'Non-Veg', day_of_week: 'Monday', price: 120, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Mushroom Biryani', type: 'Veg', day_of_week: 'Tuesday', price: 90, image_url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Mutton Curry Meals', type: 'Non-Veg', day_of_week: 'Tuesday', price: 150, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Paneer Butter Masala Combo', type: 'Veg', day_of_week: 'Wednesday', price: 110, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Fish Fry Meals', type: 'Non-Veg', day_of_week: 'Wednesday', price: 140, image_url: 'https://images.unsplash.com/photo-1599487405705-8ebf1b3e9a59?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Ghee Roast Combo', type: 'Veg', day_of_week: 'Thursday', price: 75, image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Chicken Tikka Meals', type: 'Non-Veg', day_of_week: 'Thursday', price: 130, image_url: 'https://images.unsplash.com/photo-1599487405705-8ebf1b3e9a59?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Vegetable Pulao', type: 'Veg', day_of_week: 'Friday', price: 85, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Prawn Masala Meals', type: 'Non-Veg', day_of_week: 'Friday', price: 160, image_url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=200&h=200' }
];

const EVENTS_DATA = [
  // Completed (4)
  { title: "AI & ML Workshop", description: "Hands on workshop by industry experts.", status: "Completed", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600" },
  { title: "Freshers' Orientation", description: "Welcome event for the batch of 2026.", status: "Completed", image_url: "https://images.unsplash.com/photo-1523580494112-071dcb92a71d?auto=format&fit=crop&q=80&w=600" },
  { title: "Inter-College Debate", description: "National level debate competition.", status: "Completed", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600" },
  { title: "Startup Pitch Deck", description: "Present your ideas to top VCs.", status: "Completed", image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600" },
  
  // Upcoming (4)
  { title: "Annual TechNova Hackathon", description: "24-hour coding challenge for all students.", status: "Upcoming", image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600" },
  { title: "Cultural Fest 2026", description: "The biggest celebration of arts, music and culture.", status: "Upcoming", image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600" },
  { title: "Robotics Expo", description: "Showcase of autonomous robots.", status: "Upcoming", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600" },
  { title: "Alumni Meet", description: "Networking session with successful alumni.", status: "Upcoming", image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600" },

  // Current (5)
  { title: "Google Cloud Session", description: "Learn cloud deployment.", status: "Current", image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },
  { title: "Photography Contest", description: "Capture the campus life.", status: "Current", image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600" },
  { title: "E-Sports Tournament", description: "Valorant and BGMI championship.", status: "Current", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600" },
  { title: "Placement Drive", description: "TCS and Infosys recruitment.", status: "Current", image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600" },
  { title: "Yoga & Wellness", description: "Mental health and fitness session.", status: "Current", image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600" }
];

const BOOKS_DATA = [
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category_id: 1, cover: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400", copies: 5, rack: "A-12" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", category_id: 1, cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400", copies: 3, rack: "A-15" },
  { title: "Data Structures in C", author: "Reema Thareja", category_id: 1, cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400", copies: 8, rack: "B-02" },
  { title: "Engineering Mathematics", author: "B.S. Grewal", category_id: 2, cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400", copies: 15, rack: "C-01" },
  { title: "Digital Logic Design", author: "Morris Mano", category_id: 3, cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", copies: 4, rack: "D-10" },
  { title: "Clean Code", author: "Robert C. Martin", category_id: 1, cover: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=400", copies: 7, rack: "A-05" },
  { title: "Design Patterns", author: "Erich Gamma", category_id: 1, cover: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400", copies: 6, rack: "A-07" },
  { title: "Thermodynamics", author: "P.K. Nag", category_id: 6, cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400", copies: 10, rack: "E-12" },
  { title: "Structural Analysis", author: "R.C. Hibbeler", category_id: 7, cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", copies: 5, rack: "F-04" },
  { title: "Molecular Biology", author: "Bruce Alberts", category_id: 8, cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400", copies: 12, rack: "G-11" }
];

const INDIAN_FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Rayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Aadhya', 'Diya', 'Kashvi', 'Ananya', 'Myra', 'Vamika', 'Rhea', 'Navya', 'Avni', 'Saanvi', 'Karthik', 'Murugan', 'Rahul', 'Priya', 'Sneha', 'Deepak', 'Sanjay', 'Manoj', 'Kavya', 'Divya'];
const INDIAN_LAST_NAMES = ['Iyer', 'Menon', 'Nair', 'Pillai', 'Rao', 'Reddy', 'Sharma', 'Singh', 'Verma', 'Kumar', 'Gowda', 'Shetty', 'Patel', 'Babu', 'Natarajan', 'Krishnan', 'Raj'];

const getIndianName = () => {
  const first = INDIAN_FIRST_NAMES[Math.floor(Math.random() * INDIAN_FIRST_NAMES.length)];
  const last = INDIAN_LAST_NAMES[Math.floor(Math.random() * INDIAN_LAST_NAMES.length)];
  return `${first} ${last}`;
};

const INDIAN_FACES = [
  "https://images.unsplash.com/photo-1532073150508-0c1df02a715c?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1618641986557-1de223cb2f4f?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?auto=format&fit=crop&q=80&w=200",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200"
];

async function syncAndSeed() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'campusone'
    });

    console.log('Syncing database schema...');

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DROP TABLE IF EXISTS users, attendance_records, transport_routes, library_wishlist, clubs, club_members_new, event_registrations, canteen_items, special_meals, events, departments, faculty, labs, books');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Users and related tables (mock)
    await pool.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, uid VARCHAR(255) UNIQUE, email VARCHAR(255), full_name VARCHAR(255), avatar_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date DATE,
        status ENUM('Present', 'Absent', 'On Leave') DEFAULT 'Present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transport_routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        bus_no VARCHAR(50),
        driver_name VARCHAR(100),
        contact_number VARCHAR(50),
        departure_time VARCHAR(50),
        arrival_time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Library Wishlist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS library_wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        book_id INT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clubs update
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clubs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        incharge_name VARCHAR(150),
        contact_details VARCHAR(150),
        members_count INT DEFAULT 0,
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events Registrations update
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT,
        user_id INT,
        name VARCHAR(150),
        form_data JSON,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Canteen update
    await pool.query(`
      CREATE TABLE IF NOT EXISTS canteen_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        section ENUM('Starters', 'Beverages', 'Breakfast', 'Main Course', 'Snacks', 'Fresh Juices'),
        description TEXT,
        price DECIMAL(10, 2),
        is_veg BOOLEAN DEFAULT true,
        is_available BOOLEAN DEFAULT true,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS special_meals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150),
        type VARCHAR(50),
        day_of_week VARCHAR(50),
        price DECIMAL(10, 2),
        image_url VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        code VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_id INT,
        name VARCHAR(150) NOT NULL,
        designation VARCHAR(100),
        photo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS labs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_id INT,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        author VARCHAR(150),
        category_id INT,
        total_copies INT DEFAULT 1,
        available_copies INT DEFAULT 1,
        rack_info VARCHAR(50),
        cover_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        title VARCHAR(200), 
        description TEXT, 
        category VARCHAR(100), 
        status VARCHAR(50), 
        poster_url VARCHAR(255), 
        event_date DATETIME, 
        seats INT DEFAULT 100
      )
    `);

    console.log('Tables created & altered successfully.');

    // Seed Data
    console.log('Seeding mock data...');
    
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE clubs');
    await pool.query('TRUNCATE TABLE transport_routes');
    await pool.query('TRUNCATE TABLE canteen_items');
    await pool.query('TRUNCATE TABLE special_meals');
    await pool.query('TRUNCATE TABLE events');
    await pool.query('TRUNCATE TABLE departments');
    await pool.query('TRUNCATE TABLE faculty');
    await pool.query('TRUNCATE TABLE labs');
    await pool.query('TRUNCATE TABLE books');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    for (const club of CLUBS_DATA) {
      await pool.query('INSERT INTO clubs (name, category, description, incharge_name, contact_details, members_count, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [club.name, club.category, club.description, club.incharge, club.contact, club.members, club.logo_url]);
    }

    for (const route of ROUTES_DATA) {
      await pool.query('INSERT INTO transport_routes (name, bus_no, driver_name, contact_number, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?, ?)', 
        [route.name, route.busNo, route.driver, route.contact, route.departure, route.arrival]);
    }

    for (const event of EVENTS_DATA) {
      await pool.query('INSERT INTO events (title, description, status, poster_url, event_date) VALUES (?, ?, ?, ?, NOW())', 
        [event.title, event.description, event.status, event.image_url]);
    }

    for (const item of MENU_DATA) {
      await pool.query('INSERT INTO canteen_items (name, section, description, price, is_veg, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [item.name, item.section, item.desc, item.price, item.is_veg, item.is_available, item.image_url]);
    }

    for (const meal of SPECIAL_MEALS) {
      await pool.query('INSERT INTO special_meals (name, type, day_of_week, price, image_url) VALUES (?, ?, ?, ?, ?)',
        [meal.name, meal.type, meal.day_of_week, meal.price, meal.image_url]);
    }

    for (const book of BOOKS_DATA) {
      await pool.query('INSERT INTO books (title, author, category_id, total_copies, available_copies, rack_info, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [book.title, book.author, book.category_id, book.copies, book.copies, book.rack, book.cover]);
    }

    // Generate Departments, Faculty, and Labs
    let facultyCounter = 0;
    for (let d = 0; d < DEPARTMENTS.length; d++) {
      const dept = DEPARTMENTS[d];
      const deptName = dept.name;
      const deptCode = deptName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 4);
      const [deptResult] = await pool.query('INSERT INTO departments (name, code, description) VALUES (?, ?, ?)', 
        [deptName, deptCode, `The Department of ${deptName} is committed to academic excellence and research.`]);
      const deptId = deptResult.insertId;

      // Exact number of faculty per department as requested
      for (let i = 0; i < dept.count; i++) {
        facultyCounter++;
        const photoUrl = INDIAN_FACES[facultyCounter % INDIAN_FACES.length];
        const designation = i === 0 ? 'Head of Department' : (i < Math.max(5, dept.count/4) ? 'Professor' : 'Assistant Professor');
        
        await pool.query('INSERT INTO faculty (department_id, name, designation, photo_url) VALUES (?, ?, ?, ?)', 
          [deptId, 'Prof. ' + getIndianName(), designation, photoUrl]);
      }

      // Labs per department
      for (let i = 1; i <= dept.labs; i++) {
        await pool.query('INSERT INTO labs (department_id, name, description, image_url) VALUES (?, ?, ?, ?)', [
          deptId, 
          `${deptName} Lab ${i}`, 
          `State of the art facility for ${deptName} experiments and practicals.`, 
          `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&sig=${deptId}${i}`
        ]);
      }
    }

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in sync_schema_and_seed:', error);
    process.exit(1);
  }
}

syncAndSeed();
