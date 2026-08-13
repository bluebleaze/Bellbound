const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const titleScreenReplace = `{/* TITLE SCREEN */}
        {gameState === 'title' && (
          <div className="max-w-xl w-full bg-white border-4 border-sky-400 p-8 rounded-xl shadow-2xl text-center space-y-6 relative overflow-hidden my-auto">
            <div className="space-y-2">
              <span className="text-xs text-sky-700 font-bold uppercase tracking-widest border border-sky-300 bg-sky-50 px-3 py-1 rounded-full">
                INDONESIAN RETRO SCHOOL RPG
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-wider">
                BELLBOUND
              </h1>
              <p className="text-sm text-slate-600 font-semibold">
                Jelajahi kelas, ikuti jadwal, dan taklukkan ujian guru!
              </p>
            </div>

            <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-lg text-xs text-left space-y-2 text-slate-700">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <span>JADWAL PERJALANANMU:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {GAME_SCHEDULE.map((s, i) => (
                  <div key={s.subjectId} className="flex flex-col border border-sky-200 bg-white p-2 rounded">
                    <span className="font-bold text-sky-800">Minggu {s.week}, {s.dayName}</span>
                    <span className="text-[10px] text-slate-500">{s.time} - {s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {progress.completedSubjects.length > 0 && (
                <button
                  onClick={handleContinueGame}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold border-b-4 border-sky-700 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
                >
                  <span>LANJUTKAN GAME ({progress.completedSubjects.length}/6)</span>
                </button>
              )}
              
              <button
                onClick={handleNewSession}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-bold border-b-4 border-yellow-600 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
              >
                <span>✨ BUAT SESI BARU (MULAI)</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-xs font-bold text-slate-700 rounded-lg transition-colors"
                >
                  🎨 KUSTOM KARAKTER
                </button>
              </div>
            </div>
          </div>
        )}`;

// Regex replacement for Title Screen
const titleRegex = /\{\/\*\s*TITLE SCREEN\s*\*\/\}.*?(?=\{\/\*\s*STORY INTRO SCREEN\s*\*\/\})/s;
content = content.replace(titleRegex, titleScreenReplace + '\n\n        ');

fs.writeFileSync('src/App.tsx', content);
console.log('Patched Title Screen');
