const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Regex to match "bg-white dark:bg-slate-800/([0-9]+)"
  // and replace it with "bg-white/$1 dark:bg-slate-800/$1"
  content = content.replace(/bg-white dark:bg-slate-800\/([0-9]+)/g, 'bg-white/$1 dark:bg-slate-800/$1');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed opacity in ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src'));
console.log('Opacity fix complete.');
