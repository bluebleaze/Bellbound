const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  const handleLoginStart = () => {
    audioEngine.playSelect();
    setProgress({
      ...INITIAL_PROGRESS,
      customization: progress.customization, // keep customization
    });
    setGameState('level_popup');
  };`,
  `  const handleLoginStart = (finalForm?: any) => {
    audioEngine.playSelect();
    setProgress(prev => ({
      ...INITIAL_PROGRESS,
      customization: finalForm || prev.customization, // use updated form if provided
    }));
    setGameState('level_popup');
  };`
);

code = code.replace(
  `            onStart={handleLoginStart}`,
  `            onStart={() => handleLoginStart(progress.customization)}`
);

// Wait, the LoginScreen has its own local form state. Let's pass the form back via onStart!

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
