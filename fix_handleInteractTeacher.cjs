const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const targetStr = `  const handleInteractTeacher = (teacher: SubjectId) => {
    const currentLevel = completedSubjects.length;
    if (currentLevel >= GAME_SCHEDULE.length) return;
    
    const scheduled = GAME_SCHEDULE[currentLevel];
    if (teacher !== scheduled.subjectId) {
      setDialogueText(\`\${FOES[teacher].name}: "Maaf, ini bukan kelasmu saat ini. Cek jadwalmu, kelasmu sekarang adalah \${scheduled.name}."\`);
    } else {
      onEnterBattle(teacher);
    }
  };`;

const newStr = `  const handleInteractTeacher = (teacher: SubjectId) => {
    if (!isDoorUnlocked(teacher)) {
      setDialogueText(\`\${FOES[teacher].name}: "Maaf, kamu belum boleh mengambil kelas ini. Cek jadwalmu!"\`);
    } else {
      onEnterBattle(teacher);
    }
  };`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Function replaced');
