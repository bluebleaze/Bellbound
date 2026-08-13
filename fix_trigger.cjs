const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'className="fixed top-0 left-0 w-16 h-16 z-[9999] opacity-0 cursor-default"',
  'className="fixed bottom-0 right-0 w-16 h-16 z-[9999] opacity-0 cursor-default"'
);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed trigger position');
