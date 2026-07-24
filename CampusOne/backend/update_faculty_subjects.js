import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

const subjectsMap = {
  1: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "Database Systems", "Software Engineering", "Compiler Design", "Cloud Computing", "Cyber Security", "Web Technologies"],
  2: ["Machine Learning", "Data Mining", "Deep Learning", "Big Data Analytics", "Natural Language Processing", "Computer Vision", "Data Visualization", "Predictive Analytics", "AI Ethics", "Statistical Modeling"],
  3: ["Information Security", "Web Development", "Network Administration", "IT Infrastructure", "Mobile App Dev", "Internet of Things", "E-Commerce", "Data Warehousing", "Cloud Architecture", "System Integration"],
  4: ["Digital Electronics", "Signals & Systems", "VLSI Design", "Embedded Systems", "Communication Systems", "Microprocessors", "Antenna Design", "Optical Communication", "Wireless Networks", "Digital Signal Processing"],
  5: ["Circuit Theory", "Electrical Machines", "Power Systems", "Control Systems", "Power Electronics", "Renewable Energy", "High Voltage Engg", "Electric Drives", "Smart Grid", "Electromagnetic Fields"],
  6: ["Thermodynamics", "Fluid Mechanics", "Solid Mechanics", "Heat Transfer", "Manufacturing Tech", "Machine Design", "Automobile Engg", "Robotics", "CAD/CAM", "Mechatronics"],
  7: ["Structural Analysis", "Fluid Dynamics", "Geotechnical Engg", "Surveying", "Transportation Engg", "Environmental Engg", "Construction Mgmt", "Concrete Technology", "Water Resources", "Urban Planning"],
  8: ["Machine Learning", "Deep Learning", "Neural Networks", "Reinforcement Learning", "AI Algorithms", "Cognitive Computing", "Robotics Vision", "Pattern Recognition", "AI Programming", "Heuristic Search"],
  9: ["Control Systems", "Industrial Instrumentation", "Process Control", "Transducers", "PLC & SCADA", "Biomedical Instr.", "Analytical Instr.", "Optoelectronics", "Virtual Instrumentation", "Sensor Networks"]
};

async function run() {
  try {
    // 1. Add column if it doesn't exist
    const [columns] = await pool.query('SHOW COLUMNS FROM faculty LIKE "subject"');
    if (columns.length === 0) {
      await pool.query('ALTER TABLE faculty ADD COLUMN subject VARCHAR(100) DEFAULT NULL');
      console.log('Added column "subject" to faculty table');
    }

    // 2. Fetch all faculty
    const [faculty] = await pool.query('SELECT id, department_id FROM faculty ORDER BY department_id, id');
    
    // 3. Assign subjects
    let deptCounts = {};
    
    for (const f of faculty) {
      const dId = f.department_id;
      if (!deptCounts[dId]) deptCounts[dId] = 0;
      
      const subs = subjectsMap[dId] || ["General Engineering"];
      const sub = subs[deptCounts[dId] % subs.length];
      
      await pool.query('UPDATE faculty SET subject = ? WHERE id = ?', [sub, f.id]);
      deptCounts[dId]++;
    }
    
    console.log('Successfully assigned subjects to all faculty.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

run();
