const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldButton = `{progress.completedSubjects.length > 0 && (
                <button
                  onClick={handleContinueGame}
                  className="w-full sm:w-1/2 py-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 font-bold border-2 border-zinc-700 rounded text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm active:translate-y-px"
                >
                  <span>Lanjutkan Game Sebelumnya (Level {progress.completedSubjects.length})</span>
                </button>
              )}`;

const newButton = `<button
                onClick={handleContinueGame}
                disabled={progress.completedSubjects.length === 0}
                className={\`w-full sm:w-1/2 py-2 font-bold border-2 rounded text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm \${
                  progress.completedSubjects.length > 0
                    ? 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 border-zinc-700 active:translate-y-px'
                    : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                }\`}
              >
                <span>
                  Lanjutkan Sesi Sebelumnya 
                  {progress.completedSubjects.length > 0 && \` (Level \${progress.completedSubjects.length})\`}
                </span>
              </button>`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('src/App.tsx', code);
console.log('Patched title screen buttons');
