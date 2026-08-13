const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setGameState\('intro'\)/g, "setGameState('walk')");

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
