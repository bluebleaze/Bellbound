const fs = require('fs');
let code = fs.readFileSync('src/components/GameSidebar.tsx', 'utf8');

code = code.replace(
  'fixed top-0 right-0 h-full',
  'absolute top-0 right-0 h-full'
);

fs.writeFileSync('src/components/GameSidebar.tsx', code);
console.log('GameSidebar.tsx css patched');
