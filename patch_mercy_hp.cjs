const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

// 1. Add state for hasUsedMercy
const targetState = `  const [actUsesLeft, setActUsesLeft] = useState(2);`;
const replacementState = `  const [actUsesLeft, setActUsesLeft] = useState(2);
  const [hasUsedMercy, setHasUsedMercy] = useState(false);`;
content = content.replace(targetState, replacementState);

// 2. Modify handleTalk
const targetTalk = `  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setMercyActive(true);
    const healedHp = Math.min(progress.maxHp, progress.hp + 2);
    if (healedHp > progress.hp) {
      onUpdateHpRef.current(healedHp);
    }
    setDialogue(\`TALK: Kamu berdiskusi dengan \${foe.label}. (+2 HP! Gelombang peluru berikutnya akan menjadi lebih singkat!)\`);
  };`;

const replacementTalk = `  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    
    if (hasUsedMercy) {
      setDialogue(\`MERCY: Kamu mencoba berdiskusi lagi dengan \${foe.label}, tapi dia sudah tidak mau mendengarkan... (Durasi tidak berkurang lagi)\`);
      return;
    }
    
    setHasUsedMercy(true);
    setMercyActive(true);
    const healedHp = Math.min(progress.maxHp, progress.hp + 2);
    if (healedHp > progress.hp) {
      onUpdateHpRef.current(healedHp);
    }
    setDialogue(\`MERCY: Kamu berdiskusi dengan \${foe.label}. (+2 HP! Gelombang peluru berikutnya akan menjadi lebih singkat!)\`);
  };`;

content = content.replace(targetTalk, replacementTalk);
fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched BattleArena handleTalk');
