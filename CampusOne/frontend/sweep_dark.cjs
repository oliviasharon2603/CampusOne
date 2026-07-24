const fs = require('fs');
const path = require('path');

const mappings = {
  'bg-primary-50': 'bg-primary-50 dark:bg-primary-900/30',
  'bg-primary-100': 'bg-primary-100 dark:bg-primary-900/40',
  'text-primary-900': 'text-primary-900 dark:text-primary-100',
  'text-primary-800': 'text-primary-800 dark:text-primary-200',
  'text-primary-700': 'text-primary-700 dark:text-primary-300',
  'text-primary-600': 'text-primary-600 dark:text-primary-400',
  'border-primary-100': 'border-primary-100 dark:border-primary-800',
  'border-primary-200': 'border-primary-200 dark:border-primary-700',
  
  'bg-danger-50': 'bg-danger-50 dark:bg-danger-900/30',
  'bg-danger-100': 'bg-danger-100 dark:bg-danger-900/40',
  'text-danger-900': 'text-danger-900 dark:text-danger-100',
  'text-danger-800': 'text-danger-800 dark:text-danger-200',
  'text-danger-700': 'text-danger-700 dark:text-danger-300',
  'text-danger-600': 'text-danger-600 dark:text-danger-400',
  'border-danger-100': 'border-danger-100 dark:border-danger-800',
  'border-danger-200': 'border-danger-200 dark:border-danger-700',

  'bg-success-50': 'bg-success-50 dark:bg-success-900/30',
  'bg-success-100': 'bg-success-100 dark:bg-success-900/40',
  'text-success-900': 'text-success-900 dark:text-success-100',
  'text-success-800': 'text-success-800 dark:text-success-200',
  'text-success-700': 'text-success-700 dark:text-success-300',
  'text-success-600': 'text-success-600 dark:text-success-400',
  
  'bg-warning-50': 'bg-warning-50 dark:bg-warning-900/30',
  'bg-warning-100': 'bg-warning-100 dark:bg-warning-900/40',
  'text-warning-900': 'text-warning-900 dark:text-warning-100',
  'text-warning-800': 'text-warning-800 dark:text-warning-200',
  'text-warning-700': 'text-warning-700 dark:text-warning-300',
  'text-warning-600': 'text-warning-600 dark:text-warning-400',

  'bg-indigo-50': 'bg-indigo-50 dark:bg-indigo-900/30',
  'bg-indigo-100': 'bg-indigo-100 dark:bg-indigo-900/40',
  'text-indigo-900': 'text-indigo-900 dark:text-indigo-100',
  'text-indigo-800': 'text-indigo-800 dark:text-indigo-200',
  'text-indigo-700': 'text-indigo-700 dark:text-indigo-300',
  'text-indigo-600': 'text-indigo-600 dark:text-indigo-400'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [key, value] of Object.entries(mappings)) {
    const regex = new RegExp(`\\b${key}\\b(?!\\s+dark:)`, 'g');
    content = content.replace(regex, value);
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
console.log('Sweep complete 2.');
