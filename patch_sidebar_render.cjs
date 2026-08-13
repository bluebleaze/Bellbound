const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert GameSidebar inside the main container
const target = '<main className="w-full max-w-[1280px] aspect-[16/9] bg-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">';
code = code.replace(
  target,
  target + '\n        {(gameState === \'walk\' || gameState === \'battle\') && <GameSidebar progress={progress} />}\n'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx sidebar injected');
