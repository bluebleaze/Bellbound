const fs = require('fs');

const appPath = 'src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Global Container
appCode = appCode.replace(/<div className="min-h-screen bg-sky-50 text-slate-900 font-mono flex flex-col justify-between selection:bg-sky-200">/, '<div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black">');
appCode = appCode.replace(/bg-white border-t border-sky-200 p-2 text-center text-slate-500 text-xs font-mono/, 'bg-zinc-950 border-t-2 border-zinc-800 p-2 text-center text-zinc-500 text-xs font-mono');

// Fix Title Screen
const titleRegex = /\{\/\*\s*TITLE SCREEN\s*\*\/\}.*?(?=\{\/\*\s*STORY INTRO SCREEN\s*\*\/\})/s;
const titleScreenReplace = `{/* TITLE SCREEN */}
        {gameState === 'title' && (
          <div className="max-w-xl w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl text-center space-y-6 relative overflow-hidden my-auto">
            <div className="space-y-2">
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest border border-yellow-500/50 bg-yellow-400/10 px-3 py-1 rounded">
                INDONESIAN RETRO SCHOOL RPG
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                BELLBOUND
              </h1>
              <p className="text-sm text-zinc-400 font-semibold">
                Jelajahi kelas, ikuti jadwal, dan taklukkan ujian guru!
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded text-xs text-left space-y-2 text-zinc-300">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                <span>JADWAL PERJALANANMU:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {GAME_SCHEDULE.map((s, i) => (
                  <div key={s.subjectId} className="flex flex-col border border-zinc-700 bg-zinc-950 p-2 rounded">
                    <span className="font-bold text-yellow-500">Minggu {s.week}, {s.dayName}</span>
                    <span className="text-[10px] text-zinc-400">{s.time} - {s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {progress.completedSubjects.length > 0 && (
                <button
                  onClick={handleContinueGame}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold border-b-4 border-yellow-700 rounded text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
                >
                  <span>LANJUTKAN GAME ({progress.completedSubjects.length}/6)</span>
                </button>
              )}
              
              <button
                onClick={handleNewSession}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white font-bold border-b-4 border-zinc-900 rounded text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
              >
                <span>✨ BUAT SESI BARU (MULAI)</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 text-xs font-bold text-zinc-300 rounded transition-colors"
                >
                  🎨 KUSTOM KARAKTER
                </button>
              </div>
            </div>
          </div>
        )}

        `;
appCode = appCode.replace(titleRegex, titleScreenReplace);

// Fix Story Intro Screen
const introRegex = /\{\/\*\s*STORY INTRO SCREEN\s*\*\/\}.*?(?=\{\/\*\s*CLASS INTRO SCREEN\s*\*\/\})/s;
const introReplace = `{/* STORY INTRO SCREEN */}
        {gameState === 'intro' && (
          <div className="max-w-2xl w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl flex flex-col items-center text-center space-y-6 my-auto animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-zinc-900 rounded-full border-4 border-zinc-700 flex items-center justify-center overflow-hidden shadow-inner mb-2">
               <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=school&backgroundColor=18181b" alt="School" className="w-full h-full object-cover opacity-80" />
            </div>
            
            <div className="space-y-4 text-zinc-300 text-sm sm:text-base font-semibold leading-relaxed">
              <p>
                Angin pagi berhembus lembut. Kamu berdiri di depan gerbang Sekolah Menengah Atas favoritmu.
              </p>
              <p className="text-yellow-400 font-bold text-lg bg-zinc-900 px-4 py-2 rounded border border-zinc-700 inline-block">
                TENG! TENG! TENG!
              </p>
              <p>
                Bel masuk berbunyi. Jam menunjukkan pukul 06:45 WIB.<br/>
                Ini adalah <span className="font-bold text-yellow-500">Minggu Ke-1, Hari Senin</span>.<br/>
                Perjalananmu menuju ujian akhir dimulai sekarang.
              </p>
              <p className="text-xs text-zinc-500">
                Pelajaran pertamamu hari ini adalah Pendidikan Kewarganegaraan (07:00 - 08:30).
              </p>
            </div>

            <button
              onClick={() => setGameState('walk')}
              className="mt-6 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold border-b-4 border-yellow-700 rounded shadow-md transition-all active:border-b-0 active:translate-y-1"
            >
              MASUK KE DALAM SEKOLAH
            </button>
          </div>
        )}

        `;
appCode = appCode.replace(introRegex, introReplace);

// Fix Class Intro Screen
const classIntroRegex = /\{\/\*\s*CLASS INTRO SCREEN\s*\*\/\}.*?(?=\{\/\*\s*OVERWORLD SCREEN\s*\*\/\})/s;
const classIntroReplace = `{/* CLASS INTRO SCREEN */}
        {gameState === 'battle_intro' && activeBattleSubject && (
          <div className="max-w-md w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl text-center space-y-6 my-auto animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-yellow-400 border-b-2 border-zinc-800 pb-2">MEMASUKI KELAS</h2>
            <div className="bg-zinc-900 border border-zinc-700 rounded p-4 space-y-2">
               <div className="text-xl font-bold text-white">{FOES[activeBattleSubject].name}</div>
               <div className="text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded inline-block">
                 {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.name || 'Pelajaran'}
               </div>
               <div className="text-xs text-zinc-500 mt-2">
                 Jam: {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.time || '07:00'}
               </div>
            </div>
            <p className="text-sm text-zinc-400">
              Guru sudah menunggu di dalam. Siapkan dirimu!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setGameState('walk')}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold border-b-4 border-zinc-900 rounded transition-all active:translate-y-1 active:border-b-0"
              >
                KEMBALI
              </button>
              <button
                onClick={startActualBattle}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold border-b-4 border-red-800 rounded transition-all active:translate-y-1 active:border-b-0 shadow-md"
              >
                MULAI KELAS
              </button>
            </div>
          </div>
        )}

        `;
appCode = appCode.replace(classIntroRegex, classIntroReplace);

// Fix Game Over Screen
const gameOverRegex = /\{\/\*\s*GAME OVER SCREEN\s*\*\/\}.*?(?=\{\/\*\s*Modals\s*\*\/\})/s;
const gameOverReplace = `{/* GAME OVER SCREEN */}
        {gameState === 'gameover' && (
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
        )}

      </main>

      `;
appCode = appCode.replace(gameOverRegex, gameOverReplace);

fs.writeFileSync(appPath, appCode);

// 6. ScheduleModal.tsx complete rewrite
const schedulePath = 'src/components/ScheduleModal.tsx';
const scheduleCode = `import React from 'react';
import { GAME_SCHEDULE } from '../types';
import { X, Clock, CalendarDays } from 'lucide-react';

export const ScheduleModal: React.FC<{
  currentLevel: number;
  onClose: () => void;
}> = ({ currentLevel, onClose }) => {
  const currentIndex = Math.min(currentLevel, GAME_SCHEDULE.length - 1);
  const currentClass = GAME_SCHEDULE[currentIndex];

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-zinc-950 border-4 border-white max-w-md w-full p-6 text-white rounded shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2 border-b-2 border-zinc-700 pb-2 mb-4">
          <Clock size={24} />
          JADWAL HARI INI
        </h2>

        <div className="space-y-4">
          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded text-center">
            <span className="block text-xs font-bold text-zinc-400 mb-1">MINGGU {currentClass.week} - {currentClass.dayName.toUpperCase()}</span>
            <div className="text-2xl font-black text-white mb-1">{currentClass.time}</div>
            <div className="text-lg font-bold text-yellow-400">{currentClass.name}</div>
          </div>
          
          <p className="text-xs text-zinc-400 text-center">
            Segera temui guru yang bersangkutan untuk memulai pelajaran! Kamu tidak bisa melewati (skip) jadwal ini.
          </p>
        </div>
      </div>
    </div>
  );
};

export const CalendarModal: React.FC<{
  currentLevel: number;
  onClose: () => void;
}> = ({ currentLevel, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-zinc-950 border-4 border-white max-w-lg w-full p-6 text-white rounded shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2 border-b-2 border-zinc-700 pb-2 mb-4">
          <CalendarDays size={24} />
          KALENDER AKADEMIK
        </h2>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {GAME_SCHEDULE.map((s, i) => {
            const isCompleted = i < currentLevel;
            const isCurrent = i === currentLevel;
            const isLocked = i > currentLevel;

            return (
              <div 
                key={s.subjectId}
                className={\`flex items-center gap-3 p-3 border-2 rounded \${
                  isCompleted ? 'bg-zinc-900/50 border-zinc-800 opacity-60' :
                  isCurrent ? 'bg-zinc-900 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]' :
                  'bg-zinc-950 border-dashed border-zinc-700 opacity-70'
                }\`}
              >
                <div className={\`flex flex-col items-center justify-center w-12 h-12 rounded font-bold text-xs border \${
                  isCompleted ? 'bg-zinc-800 border-zinc-700 text-zinc-500' :
                  isCurrent ? 'bg-yellow-500 border-yellow-400 text-black' :
                  'bg-zinc-900 border-zinc-800 text-zinc-600'
                }\`}>
                  <span>W\${s.week}</span>
                  <span>\${s.dayName.substring(0,3)}</span>
                </div>
                <div className="flex-1">
                  <div className={\`font-bold \${isCurrent ? 'text-yellow-400' : 'text-zinc-300'}\`}>
                    {s.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Jam: {s.time}
                  </div>
                </div>
                <div>
                  {isCompleted && <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-1 rounded">SELESAI</span>}
                  {isCurrent && <span className="text-[10px] font-bold text-black bg-yellow-400 px-2 py-1 rounded animate-pulse">SEKARANG</span>}
                  {isLocked && <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded">TERKUNCI</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
`;
fs.writeFileSync(schedulePath, scheduleCode);
