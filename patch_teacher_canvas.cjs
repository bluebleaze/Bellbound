const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const targetTeacher = `<canvas ref={teacherCanvasRef} width={140} height={130} className="pixelated animate-pulse" />`;
const replaceTeacher = `<canvas ref={teacherCanvasRef} width={140} height={130} className="animate-pulse" style={{ imageRendering: 'pixelated' }} />`;

content = content.replace(targetTeacher, replaceTeacher);
fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log("Patched teacher canvas");
