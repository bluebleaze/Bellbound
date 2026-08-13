const fs = require('fs');
let code = fs.readFileSync('src/components/VictoryModal.tsx', 'utf8');

code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/VictoryModal.tsx', code);
console.log('Fixed victory');
