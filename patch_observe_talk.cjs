const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const observeTarget = `  const handleObserve = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setHintBonus(true);
    setDialogue(\`OBSERVE: \${foe.clue} (Jawaban salah berikutnya hanya memberikan damage 1 HP!)\`);
  };`;

const observeReplacement = `  const handleObserve = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setHintBonus(true);
    const currentQ = questions[qIndex % questions.length];
    const correctAns = currentQ.a[currentQ.ok];
    setDialogue(\`OBSERVE: \${foe.clue} (Info: Jawaban benarnya adalah "\${correctAns}". Damage salah sisa 1 HP!)\`);
  };`;
  
content = content.replace(observeTarget, observeReplacement);

const talkTarget = `  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setMercyActive(true);
    setDialogue(\`TALK: "Jawablah dengan tenang," kata \${foe.label}. Durasi gelombang peluru berikutnya menjadi lebih singkat!\`);
  };`;

const talkReplacement = `  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setMercyActive(true);
    const healedHp = Math.min(progress.maxHp, progress.hp + 2);
    if (healedHp > progress.hp) {
      onUpdateHpRef.current(healedHp);
    }
    setDialogue(\`TALK: Kamu berdiskusi dengan \${foe.label}. (+2 HP! Gelombang peluru berikutnya akan menjadi sangat singkat!)\`);
  };`;

content = content.replace(talkTarget, talkReplacement);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched Observe and Talk');
