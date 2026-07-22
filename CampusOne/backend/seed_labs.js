import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

const deptLabs = {
  1: [ // CSE
    { name: 'Software Engineering Lab', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Fri: 9:00 AM - 12:30 PM' },
    { name: 'Cloud Computing Center', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600', schedule: 'Tue-Thu: 1:30 PM - 5:00 PM' },
    { name: 'Network Security Lab', img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Wed: 10:00 AM - 3:00 PM' },
    { name: 'AI Research Lab', img: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=600', schedule: 'Fri: 9:00 AM - 4:00 PM' }
  ],
  2: [ // AIDS
    { name: 'Data Analytics Center', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Wed: 9:30 AM - 1:00 PM' },
    { name: 'Machine Learning Lab', img: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=600', schedule: 'Thu-Fri: 11:00 AM - 4:30 PM' },
    { name: 'Computer Vision Lab', img: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&q=80&w=600', schedule: 'Tue: 9:00 AM - 2:00 PM' },
    { name: 'Big Data Processing Unit', img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600', schedule: 'Wed-Fri: 2:00 PM - 6:00 PM' }
  ],
  3: [ // IT
    { name: 'Web Technologies Lab', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Wed, Fri: 8:30 AM - 12:30 PM' },
    { name: 'Cyber Forensics Center', img: 'https://images.unsplash.com/photo-1510511459019-5efa325852ea?auto=format&fit=crop&q=80&w=600', schedule: 'Tue, Thu: 1:00 PM - 5:00 PM' },
    { name: 'IoT Innovation Lab', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Thu: 3:00 PM - 6:00 PM' },
    { name: 'Mobile App Development Lab', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600', schedule: 'Wed: 9:00 AM - 5:00 PM' }
  ],
  4: [ // ECE
    { name: 'Microprocessor Lab', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Tue: 10:00 AM - 1:00 PM' },
    { name: 'VLSI Design Center', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600', schedule: 'Wed-Fri: 9:00 AM - 2:00 PM' },
    { name: 'Embedded Systems Lab', img: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600', schedule: 'Thu: 1:30 PM - 5:30 PM' },
    { name: 'Signal Processing Lab', img: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Fri: 2:00 PM - 6:00 PM' }
  ],
  5: [ // EEE
    { name: 'High Voltage Lab', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Thu: 8:00 AM - 12:00 PM' },
    { name: 'Power Electronics Center', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', schedule: 'Tue, Wed: 10:00 AM - 3:00 PM' },
    { name: 'Electrical Machines Lab', img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=600', schedule: 'Fri: 9:00 AM - 5:00 PM' },
    { name: 'Control Systems Lab', img: 'https://images.unsplash.com/photo-1574706599723-57a911739c94?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Wed: 2:00 PM - 5:00 PM' }
  ],
  6: [ // MECH
    { name: 'Thermodynamics Lab', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', schedule: 'Tue, Thu: 9:00 AM - 1:00 PM' },
    { name: 'CAD/CAM Center', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Wed: 1:30 PM - 4:30 PM' },
    { name: 'Fluid Mechanics Lab', img: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600', schedule: 'Fri: 10:00 AM - 2:00 PM' },
    { name: 'Robotics & Automation Unit', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600', schedule: 'Wed, Fri: 2:30 PM - 5:30 PM' }
  ],
  7: [ // CIVIL
    { name: 'Structural Engineering Lab', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Wed: 9:00 AM - 12:00 PM' },
    { name: 'Surveying Center', img: 'https://images.unsplash.com/photo-1516570656361-9c606d573d47?auto=format&fit=crop&q=80&w=600', schedule: 'Thu-Fri: 8:00 AM - 1:00 PM' },
    { name: 'Geotech Lab', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600', schedule: 'Tue: 2:00 PM - 6:00 PM' },
    { name: 'Materials Testing Unit', img: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Thu: 1:30 PM - 4:30 PM' }
  ],
  8: [ // BIOTECH
    { name: 'Genetic Engineering Lab', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Tue: 10:00 AM - 3:00 PM' },
    { name: 'Bio-informatics Center', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600', schedule: 'Wed, Thu: 9:00 AM - 12:30 PM' },
    { name: 'Microbiology Lab', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600', schedule: 'Fri: 9:00 AM - 2:00 PM' },
    { name: 'Bioprocessing Unit', img: 'https://images.unsplash.com/photo-1583339832623-e2213a0fc353?auto=format&fit=crop&q=80&w=600', schedule: 'Mon, Wed: 1:00 PM - 5:00 PM' }
  ],
  9: [ // CHEM
    { name: 'Organic Chemistry Lab', img: 'https://images.unsplash.com/photo-1614032906148-f3d6de5ef75a?auto=format&fit=crop&q=80&w=600', schedule: 'Mon-Thu: 9:30 AM - 12:30 PM' },
    { name: 'Heat Transfer Lab', img: 'https://images.unsplash.com/photo-1579169888921-b3b3a69a23ea?auto=format&fit=crop&q=80&w=600', schedule: 'Tue, Fri: 1:00 PM - 4:00 PM' },
    { name: 'Mass Transfer Center', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600', schedule: 'Wed: 10:00 AM - 4:00 PM' },
    { name: 'Chemical Reaction Unit', img: 'https://images.unsplash.com/photo-1571167439360-844db3be307f?auto=format&fit=crop&q=80&w=600', schedule: 'Thu: 1:30 PM - 5:30 PM' }
  ]
};

async function run() {
  try {
    console.log('Clearing existing labs...');
    await pool.query('DELETE FROM labs');

    console.log('Seeding unique labs for all departments...');
    for (const [deptId, labs] of Object.entries(deptLabs)) {
      for (const lab of labs) {
        await pool.query(
          'INSERT INTO labs (department_id, name, description, image_url, schedule) VALUES (?, ?, ?, ?, ?)',
          [deptId, lab.name, `State of the art facility for ${lab.name} with modern equipment.`, lab.img, lab.schedule]
        );
      }
    }

    console.log('Successfully seeded unique labs!');
  } catch (error) {
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('schedule')) {
      // If schedule doesn't exist, we must add it
      console.log('Adding schedule column to labs table...');
      await pool.query('ALTER TABLE labs ADD COLUMN schedule VARCHAR(100)');
      run(); // Retry
      return;
    }
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

run();
