const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if(!content.includes('const startActualBattle = () => {')) {
  const replaceEnter = `  const startActualBattle = () => {
    audioEngine.playHit();
    setGameState('battle_intro');
    
    setTimeout(() => {
      audioEngine.playBgm('battle');
      setGameState('battle');
    }, 1200);
  };
  
  // On Battle Start
  const handleEnterBattle = (subject: SubjectId) => {`;
  content = content.replace("  // On Battle Start\n  const handleEnterBattle = (subject: SubjectId) => {", replaceEnter);
}

fs.writeFileSync('src/App.tsx', content);
