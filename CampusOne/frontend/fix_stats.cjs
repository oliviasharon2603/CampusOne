const fs = require('fs');
const f = 'd:/projects/CampusOne-1/CampusOne/frontend/src/data/departmentsData.js';
let content = fs.readFileSync(f, 'utf8');
content = content.replace(/\{ label: "Faculty", value: "\d+" \}/g, '{ label: "Faculty", value: "10" }');
fs.writeFileSync(f, content);
console.log('Stats updated');
