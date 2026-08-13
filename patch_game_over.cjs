const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetGameOver = `        {/* GAME OVER SCREEN */}
        {gameState === 'game_over' && (
          <div className="max-w-md w-full bg-zinc-950 border-4 border-red-600 p-8 rounded shadow-2xl text-center space-y-6 my-auto">
            <div className="text-red-500 font-bold text-4xl animate-pulse">
              GAME OVER
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Jiwamu pecah menjadi serpihan cahaya. Jangan menyerah! Pelajari pola peluru guru dan buka catatan pelajaran untuk belajar lebih giat.
            </p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold border-2 border-red-300 rounded text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw size={18} />
              <span>COBA LAGI (RETRY)</span>
            </button>
          </div>
        )}`;

const replaceGameOver = `        {/* GAME OVER SCREEN */}
        {gameState === 'game_over' && (
          <div className="max-w-md w-full bg-white border-4 border-red-500 p-8 rounded-xl shadow-2xl text-center space-y-6 my-auto">
            <div className="text-red-600 font-black text-4xl animate-pulse drop-shadow-sm">
              GAME OVER
            </div>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed">
              Jiwamu pecah menjadi serpihan cahaya. Jangan menyerah! Pelajari pola peluru guru dan buka catatan pelajaran untuk belajar lebih giat.
            </p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold border-b-4 border-red-700 rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-1 active:border-b-0"
            >
              <RotateCcw size={18} />
              <span>COBA LAGI (RETRY)</span>
            </button>
          </div>
        )}`;

content = content.replace(targetGameOver, replaceGameOver);

// Footer styling
const targetFooter = `<footer className="bg-zinc-950 border-t-2 border-zinc-800 p-2 text-center text-zinc-500 text-xs font-mono">`;
const replaceFooter = `<footer className="bg-sky-100 border-t-2 border-sky-200 p-2 text-center text-sky-800 text-xs font-mono font-bold">`;
content = content.replace(targetFooter, replaceFooter);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx GameOver and Footer');
