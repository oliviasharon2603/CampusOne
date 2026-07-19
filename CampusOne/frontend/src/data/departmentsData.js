export const DEPARTMENTS_DATA = {
  cse: {
    id: "cse",
    name: "Computer Science & Engineering",
    code: "CSE",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
    description: "Empowering students with core computing principles, algorithms, and software engineering practices.",
    stats: [ { label: "Students", value: "320" }, { label: "Faculty", value: "24" }, { label: "Labs", value: "6" } ],
    notices: [
      { id: 1, title: 'Hackathon Registration Deadline Extended', date: 'Oct 12, 2026', type: 'important', content: 'The deadline for the upcoming inter-college hackathon has been extended to Oct 15th. Make sure to submit your team details.' },
      { id: 2, title: 'Workshop on Cloud Computing', date: 'Oct 10, 2026', type: 'event', content: 'A hands-on workshop on AWS and Azure will be held in Lab 1. Open for 3rd and 4th year students.' },
      { id: 3, title: 'Submission of Final Year Project Synopses', date: 'Oct 05, 2026', type: 'general', content: 'All final year students must submit their project synopses to their respective guides by this Friday.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Alan Turing', role: 'Head of Department', specialization: 'Theory of Computation', email: 'hod.cse@campusone.edu', phone: 'Ext: 301', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 2, name: 'Prof. Grace Hopper', role: 'Professor', specialization: 'Compiler Design', email: 'g.hopper@campusone.edu', phone: 'Ext: 302', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'CSE Syllabus (2024-28)', type: 'PDF', size: '2.1 MB', content: 'Syllabus details for Computer Science Engineering...' },
      { id: 2, title: 'Previous Question Papers - OS', type: 'ZIP', size: '15.0 MB', content: 'Archive of previous year Operating System questions...' }
    ],
    labs: [
      { id: 1, name: 'Software Engineering Lab', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600', description: 'Equipped with the latest IDEs and tools for full-stack software development.' }
    ]
  },
  aids: {
    id: "aids",
    name: "Artificial Intelligence & Data Science",
    code: "AI&DS",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    description: "Pioneering the future through intelligent systems and data-driven insights.",
    stats: [ { label: "Students", value: "240" }, { label: "Faculty", value: "18" }, { label: "Labs", value: "4" } ],
    notices: [
      { id: 1, title: 'Revised Schedule for Mid-Term Lab Exams', date: 'Aug 18, 2026', type: 'important', content: 'The mid-term exams for Machine Learning and Neural Networks have been postponed by one week.' },
      { id: 2, title: 'Call for Papers: AI Student Symposium', date: 'Aug 15, 2026', type: 'general', content: 'Submit your research papers for the upcoming symposium. Selected papers will be published in the department journal.' },
      { id: 3, title: 'Guest Lecture by Google Brain Scientist', date: 'Aug 12, 2026', type: 'event', content: 'Dr. John Doe from Google Brain will be giving a talk on the future of LLMs in the main auditorium.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Sarah Chen', role: 'Head of Department', specialization: 'Machine Learning', email: 'hod.aids@campusone.edu', phone: 'Ext: 401', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
      { id: 2, name: 'Prof. James Wilson', role: 'Associate Professor', specialization: 'Data Mining', email: 'j.wilson@campusone.edu', phone: 'Ext: 405', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'B.Tech AI&DS Syllabus (2024-28)', type: 'PDF', size: '2.4 MB', content: 'Syllabus details for Artificial Intelligence & Data Science...' },
      { id: 2, title: 'Third Year Time Table - Even Semester', type: 'PDF', size: '1.1 MB', content: 'Timetable details for Third Year AI&DS...' }
    ],
    labs: [
      { id: 1, name: 'Advanced AI Lab', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', description: 'Equipped with 60 high-performance workstations featuring NVIDIA RTX 4090 GPUs.' },
      { id: 2, name: 'Data Analytics Center', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', description: 'A specialized facility for big data processing featuring local Hadoop clusters.' }
    ]
  },
  aiml: {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    code: "AI&ML",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
    description: "Focusing on advanced machine learning algorithms and intelligent automation.",
    stats: [ { label: "Students", value: "180" }, { label: "Faculty", value: "15" }, { label: "Labs", value: "3" } ],
    notices: [
      { id: 1, title: 'ML Models Deployment Workshop', date: 'Sep 20, 2026', type: 'event', content: 'Learn how to deploy your trained models using Docker and Kubernetes.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Robert AI', role: 'Head of Department', specialization: 'Deep Learning', email: 'hod.aiml@campusone.edu', phone: 'Ext: 420', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'AIML Core Subjects Handout', type: 'PDF', size: '1.5 MB', content: 'Handout details for AIML...' }
    ],
    labs: [
      { id: 1, name: 'Robotics & Automation Lab', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600', description: 'State-of-the-art robotic arms and automation testing grounds.' }
    ]
  },
  it: {
    id: "it",
    name: "Information Technology",
    code: "IT",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    description: "Innovating network systems, cybersecurity, and modern web applications.",
    stats: [ { label: "Students", value: "280" }, { label: "Faculty", value: "20" }, { label: "Labs", value: "5" } ],
    notices: [
      { id: 1, title: 'Cybersecurity Awareness Seminar', date: 'Nov 01, 2026', type: 'general', content: 'Mandatory seminar on best practices for network security and data privacy.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Jane Network', role: 'Head of Department', specialization: 'Cybersecurity', email: 'hod.it@campusone.edu', phone: 'Ext: 350', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'Web Development Guide', type: 'PDF', size: '3.0 MB', content: 'Comprehensive guide to MERN stack...' }
    ],
    labs: [
      { id: 1, name: 'Network Security Lab', image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=600', description: 'Simulated environments for penetration testing and network defense.' }
    ]
  },
  civil: {
    id: "civil",
    name: "Civil Engineering",
    code: "CIVIL",
    image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
    description: "Designing and building the sustainable infrastructure of tomorrow.",
    stats: [ { label: "Students", value: "200" }, { label: "Faculty", value: "16" }, { label: "Labs", value: "8" } ],
    notices: [
      { id: 1, title: 'Surveying Camp Schedule', date: 'Oct 25, 2026', type: 'important', content: 'The annual surveying camp will commence on Nov 5th. All 3rd year students must register.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Build Master', role: 'Head of Department', specialization: 'Structural Engineering', email: 'hod.civil@campusone.edu', phone: 'Ext: 501', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'AutoCAD Shortcuts Manual', type: 'PDF', size: '5.2 MB', content: 'List of all essential AutoCAD commands...' }
    ],
    labs: [
      { id: 1, name: 'Materials Testing Lab', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600', description: 'Heavy machinery for testing concrete, steel, and other construction materials.' }
    ]
  },
  mech: {
    id: "mech",
    name: "Mechanical Engineering",
    code: "MECH",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    description: "Driving innovation in manufacturing, thermodynamics, and robotics.",
    stats: [ { label: "Students", value: "250" }, { label: "Faculty", value: "22" }, { label: "Labs", value: "10" } ],
    notices: [
      { id: 1, title: 'Formula SAE Team Selection', date: 'Sep 10, 2026', type: 'event', content: 'Auditions for the university racing team are open!' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Gear Shaft', role: 'Head of Department', specialization: 'Thermodynamics', email: 'hod.mech@campusone.edu', phone: 'Ext: 601', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'Thermodynamics Formula Sheet', type: 'PDF', size: '1.2 MB', content: 'Cheat sheet for all thermo formulas...' }
    ],
    labs: [
      { id: 1, name: 'Thermodynamics Lab', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=600', description: 'Advanced heat engines and refrigeration test rigs.' }
    ]
  },
  ice: {
    id: "ice",
    name: "Instrumentation & Control Engineering",
    code: "ICE",
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&q=80&w=1200",
    description: "Mastering the control systems that power industrial automation.",
    stats: [ { label: "Students", value: "120" }, { label: "Faculty", value: "12" }, { label: "Labs", value: "4" } ],
    notices: [
      { id: 1, title: 'PLC Programming Certification', date: 'Dec 01, 2026', type: 'general', content: 'Register for the upcoming Siemens PLC certification course.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Sensor Logic', role: 'Head of Department', specialization: 'Process Control', email: 'hod.ice@campusone.edu', phone: 'Ext: 701', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'Sensors and Transducers Guide', type: 'PDF', size: '4.1 MB', content: 'A complete manual on industrial sensors...' }
    ],
    labs: [
      { id: 1, name: 'Process Control Lab', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600', description: 'Real-time DCS and PLC trainers.' }
    ]
  },
  ece: {
    id: "ece",
    name: "Electronics & Communication",
    code: "ECE",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    description: "Connecting the world through microelectronics and communication networks.",
    stats: [ { label: "Students", value: "300" }, { label: "Faculty", value: "25" }, { label: "Labs", value: "7" } ],
    notices: [
      { id: 1, title: 'VLSI Design Mini-Project Submissions', date: 'Oct 30, 2026', type: 'important', content: 'Submit your completed VLSI chip layout designs by Oct 30.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Chip Maker', role: 'Head of Department', specialization: 'VLSI Design', email: 'hod.ece@campusone.edu', phone: 'Ext: 801', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'Digital Signal Processing Notes', type: 'PDF', size: '6.5 MB', content: 'Notes covering Z-transforms and FFT...' }
    ],
    labs: [
      { id: 1, name: 'Microprocessor Lab', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600', description: 'Kits for 8085, 8086, and ARM Cortex programming.' }
    ]
  },
  eee: {
    id: "eee",
    name: "Electrical & Electronics",
    code: "EEE",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
    description: "Powering the future with renewable energy and high-voltage engineering.",
    stats: [ { label: "Students", value: "220" }, { label: "Faculty", value: "18" }, { label: "Labs", value: "6" } ],
    notices: [
      { id: 1, title: 'Substation Visit', date: 'Nov 12, 2026', type: 'event', content: 'Industrial visit to the 220kV transmission substation scheduled.' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Power Grid', role: 'Head of Department', specialization: 'Power Systems', email: 'hod.eee@campusone.edu', phone: 'Ext: 901', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' }
    ],
    resources: [
      { id: 1, title: 'Power Electronics Lab Manual', type: 'PDF', size: '3.2 MB', content: 'Lab manual for inverters and converters...' }
    ],
    labs: [
      { id: 1, name: 'High Voltage Lab', image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=600', description: 'Testing equipment up to 100kV AC and DC.' }
    ]
  }
};
