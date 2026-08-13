const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldReset = `  const handleResetGame = () => {
    if (window.confirm('Kembali ke Main Menu?')) {
      audioEngine.playSelect();
      setGameState('title');
      setCurrentRoom('pkn');
      setActiveBattleSubject(null);
    }
  };`;

const newReset = `  const handleResetGame = () => {
    if (window.confirm('Apakah kamu yakin ingin mengulang permainan dari awal?')) {
      audioEngine.playSelect();
      setProgress(INITIAL_PROGRESS);
      setGameState('title');
      setCurrentRoom('pkn');
      setActiveBattleSubject(null);
      localStorage.removeItem('last_classroom_progress');
    }
  };`;

code = code.replace(oldReset, newReset);
fs.writeFileSync('src/App.tsx', code);
console.log('Reset logic patched back');
