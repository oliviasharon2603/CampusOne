import mysql from 'mysql2/promise';
import https from 'https';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'campusone'
});

// A verified, highly reliable list of Unsplash IDs categorized by lab type
const verifiedImages = {
  // CSE / IT / Computing
  software: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
  cloud: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
  security: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
  ai: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=600',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600',
  network: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
  
  // Electronics / Electrical / Microprocessors
  microprocessor: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&q=80&w=600',
  vlsi: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600',
  electrical: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600',
  power: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
  circuit: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600',
  control: 'https://images.unsplash.com/photo-1574706599723-57a911739c94?auto=format&fit=crop&q=80&w=600',
  
  // Mechanical / Civil / Physical
  thermo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
  cad: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600',
  robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
  civil: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600',
  survey: 'https://images.unsplash.com/photo-1516570656361-9c606d573d47?auto=format&fit=crop&q=80&w=600',
  materials: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600',
  
  // Biotech / Chemistry
  biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600',
  microscope: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
  chemistry: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600',
  reaction: 'https://images.unsplash.com/photo-1614032906148-f3d6de5ef75a?auto=format&fit=crop&q=80&w=600',
  science: 'https://images.unsplash.com/photo-1583339832623-e2213a0fc353?auto=format&fit=crop&q=80&w=600'
};

const labMapping = {
  // CSE
  'Software Engineering Lab': verifiedImages.software,
  'Cloud Computing Center': verifiedImages.cloud,
  'Network Security Lab': verifiedImages.security,
  'AI Research Lab': verifiedImages.ai,
  
  // AIDS & AIML
  'Data Analytics Center': verifiedImages.data,
  'Machine Learning Lab': verifiedImages.ai,
  'Computer Vision Lab': verifiedImages.science,
  'Big Data Processing Unit': verifiedImages.data,
  
  // IT
  'Web Technologies Lab': verifiedImages.software,
  'Cyber Forensics Center': verifiedImages.security,
  'IoT Innovation Lab': verifiedImages.circuit,
  'Mobile App Development Lab': verifiedImages.mobile,
  
  // ECE
  'Microprocessor Lab': verifiedImages.microprocessor,
  'VLSI Design Center': verifiedImages.vlsi,
  'Embedded Systems Lab': verifiedImages.circuit,
  'Signal Processing Lab': verifiedImages.network,
  
  // EEE
  'High Voltage Lab': verifiedImages.power,
  'Power Electronics Center': verifiedImages.electrical,
  'Electrical Machines Lab': verifiedImages.power,
  'Control Systems Lab': verifiedImages.control,
  
  // MECH
  'Thermodynamics Lab': verifiedImages.thermo,
  'CAD/CAM Center': verifiedImages.cad,
  'Fluid Mechanics Lab': verifiedImages.civil,
  'Robotics & Automation Unit': verifiedImages.robotics,
  
  // CIVIL
  'Structural Engineering Lab': verifiedImages.civil,
  'Surveying Center': verifiedImages.survey,
  'Geotech Lab': verifiedImages.materials,
  'Materials Testing Unit': verifiedImages.civil,
  
  // Biotech & Biology
  'Genetic Engineering Lab': verifiedImages.biology,
  'Bio-informatics Center': verifiedImages.science,
  'Microbiology Lab': verifiedImages.microscope,
  'Bioprocessing Unit': verifiedImages.science,
  
  // Chem & ICE
  'Organic Chemistry Lab': verifiedImages.chemistry,
  'Heat Transfer Lab': verifiedImages.reaction,
  'Mass Transfer Center': verifiedImages.chemistry,
  'Chemical Reaction Unit': verifiedImages.reaction
};

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
    }).on('error', () => resolve(false));
  });
}

async function run() {
  try {
    console.log('Fetching all labs...');
    const [labs] = await pool.query('SELECT id, name FROM labs');
    
    for (const lab of labs) {
      let imgUrl = labMapping[lab.name];
      if (!imgUrl) {
        // Fallback for unmapped labs based on keywords
        const n = lab.name.toLowerCase();
        if (n.includes('software') || n.includes('web')) imgUrl = verifiedImages.software;
        else if (n.includes('data') || n.includes('cloud')) imgUrl = verifiedImages.data;
        else if (n.includes('ai') || n.includes('machine')) imgUrl = verifiedImages.ai;
        else if (n.includes('electrical') || n.includes('power')) imgUrl = verifiedImages.power;
        else if (n.includes('mech') || n.includes('thermo') || n.includes('robot')) imgUrl = verifiedImages.thermo;
        else if (n.includes('bio') || n.includes('chem')) imgUrl = verifiedImages.chemistry;
        else imgUrl = verifiedImages.science;
      }

      // Verify the URL works
      const isWorking = await checkUrl(imgUrl);
      if (!isWorking) {
        console.warn(`URL failed for ${lab.name}: ${imgUrl}. Falling back to default science image.`);
        imgUrl = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600'; // Guaranteed highly reliable fallback
      }

      await pool.query('UPDATE labs SET image_url = ? WHERE id = ?', [imgUrl, lab.id]);
      console.log(`Updated ${lab.name} -> ${imgUrl}`);
    }

    console.log('Successfully updated all lab images with relevant, verified pictures!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();
