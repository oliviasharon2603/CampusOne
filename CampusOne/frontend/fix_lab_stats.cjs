const fs = require('fs');
const f = 'd:/projects/CampusOne-1/CampusOne/frontend/src/data/departmentsData.js';
let content = fs.readFileSync(f, 'utf8');
content = content.replace(/\{ label: "Labs", value: "\d+" \}/g, '{ label: "Labs", value: "4" }');
fs.writeFileSync(f, content);
console.log('Lab stats updated to 4');
