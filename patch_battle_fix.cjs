const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

code = code.replace(
`      if (nextFoeHp <= 0) {
        audioEngine.playVictory();
        setDialogue(\`LULUS! \${foe.label} tersenyum bangga dan memberikan sertifikat kelulusan pelajaran!\`);
        setTimeout(() => onVictory(subject, { correct: correctAnswers + 1, total: totalQuestionsAnswered + 1 }), 1200);
      } else {
        setQIndex((prev) => prev + 1);
        setDialogue(\`BENAR! \${currentQ.explanation || 'Jawabanmu tepat!'}\`);
      }
    } else {
        setQIndex((prev) => prev + 1);
        setDialogue(\`BENAR! \${currentQ.explanation || 'Jawabanmu tepat!'}\`);
      }
    } else {`,
`      if (nextFoeHp <= 0) {
        audioEngine.playVictory();
        setDialogue(\`LULUS! \${foe.label} tersenyum bangga dan memberikan sertifikat kelulusan pelajaran!\`);
        setTimeout(() => onVictory(subject, { correct: correctAnswers + 1, total: totalQuestionsAnswered + 1 }), 1200);
      } else {
        setQIndex((prev) => prev + 1);
        setDialogue(\`BENAR! \${currentQ.explanation || 'Jawabanmu tepat!'}\`);
      }
    } else {`
);

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Fixed battle');
