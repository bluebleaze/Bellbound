const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

const talkRegex = /const handleTalk = \(\) => \{\n\s*audioEngine\.playSelect\(\);\n\s*setShowQuestions\(false\);\n\s*if \(hasUsedMercy\) \{\n\s*setDialogue\(`MERCY: Kamu mencoba berdiskusi lagi dengan \$\{foe\.label\}, tapi dia sudah tidak mau mendengarkan\.\.\. \(Durasi tidak berkurang lagi\)`\);\n\s*return;\n\s*\}\n\s*setHasUsedMercy\(true\);\n\s*setMercyActive\(true\);\n\s*const healedHp = Math\.min\(progress\.maxHp, progress\.hp \+ 2\);\n\s*if \(healedHp > progress\.hp\) \{\n\s*onUpdateHpRef\.current\(healedHp\);\n\s*\}\n\s*setDialogue\(`MERCY: Kamu berdiskusi dengan \$\{foe\.label\}\. \(\+2 HP! Gelombang peluru berikutnya akan menjadi lebih singkat!\)`\);\n\s*\};/m;

const newTalk = `  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    
    const currentQ = questions[qIndex % questions.length];
    setDialogue(\`MERCY: Kamu berdiskusi dengan \${foe.label}. (Kisi-kisi: \${currentQ.explanation})\`);
  };`;

if (code.match(talkRegex)) {
  code = code.replace(talkRegex, newTalk);
  fs.writeFileSync('src/components/BattleArena.tsx', code);
  console.log('Mercy logic patched');
} else {
  console.log('Regex not matched');
}
