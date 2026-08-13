const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const regex = /const scheduled = GAME_SCHEDULE\\[currentLevel\\];\n    if \\(teacher !== scheduled\\.subjectId\\) \\{[\\s\\S]*?\\} else \\{\n      onEnterBattle\\(teacher\\);\n    \\}/m;

code = code.replace(regex, `if (!isDoorUnlocked(teacher)) {
      setDialogueText(\`\${FOES[teacher].name}: "Maaf, kamu belum boleh mengambil kelas ini."\`);
    } else {
      onEnterBattle(teacher);
    }`);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Order fixed');
