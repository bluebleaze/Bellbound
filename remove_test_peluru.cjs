const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

const regex = /\{!isDodging && \(\n\s*<button\n\s*onClick=\{handleTriggerDodge\}\n\s*className="text-\[10px\] bg-red-950 hover:bg-red-900 border border-red-500 text-red-300 px-1\.5 py-0\.5 rounded flex items-center gap-1"\n\s*>\n\s*<ShieldAlert size=\{12\} \/>\n\s*<span>TEST PELURU<\/span>\n\s*<\/button>\n\s*\)\}/m;

code = code.replace(regex, '');
fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Removed TEST PELURU');
