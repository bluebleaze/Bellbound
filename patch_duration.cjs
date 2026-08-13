const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

const durationRegex = /currentDurationRef\.current = mercyActiveRef\.current \? 4500 : Math\.floor\(6500 \+ Math\.random\(\) \* 8500\);/g;
code = code.replace(durationRegex, 'currentDurationRef.current = Math.floor(6500 + Math.random() * 8500);');

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Duration patched');
