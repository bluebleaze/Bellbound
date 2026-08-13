const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const target = `currentDurationRef.current = mercyActiveRef.current ? 1500 : Math.floor(4000 + Math.random() * 4000);`;
const replacement = `currentDurationRef.current = mercyActiveRef.current ? 1500 : Math.floor(6500 + Math.random() * 8500);`;
content = content.replace(target, replacement);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched Duration to 6.5-15s');
