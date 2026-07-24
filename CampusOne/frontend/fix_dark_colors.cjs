const fs = require('fs');
const path = require('path');

const mappings = {
  // Fix unmapped gray-400 text (icons mostly)
  'text-gray-400': 'text-gray-400 dark:text-slate-300',
  // Make previously mapped slate-400 brighter
  'dark:text-slate-400': 'dark:text-slate-300',
  // Make previously mapped slate-300 brighter (optional, maybe keep it?)
  // Actually, slate-300 is #cbd5e1, which is very visible. So keeping it.
  
  // Fix unmapped placeholders
  'placeholder-gray-400': 'placeholder-gray-400 dark:placeholder-slate-400',
  'placeholder-gray-500': 'placeholder-gray-500 dark:placeholder-slate-400',
  
  // Fix backgrounds that were too transparent
  'dark:bg-slate-900/50': 'dark:bg-slate-900'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [key, value] of Object.entries(mappings)) {
    if (key.includes('dark:')) {
      // Simple string replacement for existing dark classes
      content = content.split(key).join(value);
    } else {
      // For unmapped light classes, replace only if it doesn't already have a dark variant
      const regex = new RegExp(`\\b${key}\\b(?!\\s+dark:)`, 'g');
      content = content.replace(regex, value);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
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
console.log('Visibility fix complete.');
