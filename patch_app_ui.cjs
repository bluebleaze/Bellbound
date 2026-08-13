const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add GAME_SCHEDULE import
if(!content.includes('GAME_SCHEDULE')) {
  content = content.replace("SubjectId, GameProgress, ActiveBullet,", "SubjectId, GameProgress, ActiveBullet, GAME_SCHEDULE,");
}

// 2. Main Wrapper Theme
content = content.replace(
  '<div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black">',
  '<div className="min-h-screen bg-sky-50 text-slate-900 font-mono flex flex-col justify-between selection:bg-sky-200 selection:text-black">'
);

// 3. New handlers
const startHandlerTarget = `  // Start / Continue Game
  const handleStartGame = () => {
    audioEngine.playSelect();
    setProgress((prev) => {
      const validMax = 20;
      const validHp = prev.hp && prev.hp > 0 ? prev.hp : validMax;
      return {
        ...prev,
        hp: validHp,
        maxHp: validMax,
      };
    });
    setGameState('walk');
  };`;

const startHandlerReplace = `  // Start / Continue Game
  const handleContinueGame = () => {
    audioEngine.playSelect();
    setProgress((prev) => {
      const validMax = 20;
      const validHp = prev.hp && prev.hp > 0 ? prev.hp : validMax;
      return { ...prev, hp: validHp, maxHp: validMax };
    });
    setGameState('walk');
  };

  const handleNewSession = () => {
    audioEngine.playSelect();
    setProgress({
      ...INITIAL_PROGRESS,
      customization: progress.customization, // keep customization
    });
    setGameState('intro');
  };`;

if(content.includes('const handleStartGame')) {
  content = content.replace(startHandlerTarget, startHandlerReplace);
}

// 4. Update Title Screen UI
const titleScreenTarget = `{/* TITLE SCREEN */}
        {gameState === 'title' && (
          <div className="max-w-xl w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl text-center space-y-6 relative overflow-hidden my-auto">
            <div className="space-y-2">
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest border border-yellow-500/50 px-3 py-1 rounded">
                INDONESIAN RETRO SCHOOL RPG
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                BELLBOUND
              </h1>
              <p className="text-xs text-zinc-400">
                Jelajahi kelas, pelajari pola serangan peluru 8-bit, dan jawab pertanyaan ujian dari para guru!
              </p>
            </div>

            {/* Pixel Graphic Banner */}
            <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-yellow-300 font-bold">
                <Sparkles size={16} />
                <span>MATA PELAJARAN SEKOLAH:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-zinc-300">
                <span>• Pak Arif (GURU PKN)</span>
                <span>• Bu Rani (GURU RPL)</span>
                <span>• Pak Bima (B. INDO)</span>
                <span>• Ms. Maya (B. INGGRIS)</span>
                <span>• Bu Sari (BIOLOGI)</span>
                <span>• Geometry Keeper (MATH)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-black font-bold border-4 border-yellow-200 rounded text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg animate-pulse"
              >
                <Play size={22} fill="black" />
                <span>MULAI PETUALANGAN (START)</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-600 text-xs font-bold text-zinc-200 rounded"
                >
                  🎨 KUSTOMISASI KARAKTER
                </button>
                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-600 text-xs font-bold text-zinc-200 rounded flex items-center justify-center gap-1"
                >
                  <BookOpen size={14} />
                  <span>CATATAN ({progress.completedSubjects.length}/6)</span>
                </button>
              </div>
            </div>
          </div>
        )}`;

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
                <Sparkles size={16} />
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
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold border-4 border-sky-300 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Play size={20} fill="currentColor" />
                  <span>LANJUTKAN GAME ({progress.completedSubjects.length}/6)</span>
                </button>
              )}
              
              <button
                onClick={handleNewSession}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-bold border-4 border-yellow-200 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>✨ BUAT SESI BARU (MULAI)</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-xs font-bold text-slate-700 rounded-lg"
                >
                  🎨 KUSTOM KARAKTER
                </button>
              </div>
            </div>
          </div>
        )}`;

content = content.replace(titleScreenTarget, titleScreenReplace);

// 5. Add Intro Screen
const walkScreenTarget = `{/* OVERWORLD EXPLORATION SCREEN */}`;
const introScreenReplace = `{/* STORY INTRO SCREEN */}
        {gameState === 'intro' && (
          <div className="max-w-2xl w-full bg-white border-4 border-sky-300 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center space-y-6 my-auto animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-sky-100 rounded-full border-4 border-sky-300 flex items-center justify-center overflow-hidden shadow-inner mb-2">
               {/* Quick Canvas Render for Intro */}
               <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=school&backgroundColor=e0f2fe" alt="School" className="w-full h-full object-cover opacity-70" />
            </div>
            
            <div className="space-y-4 text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
              <p>
                Angin pagi berhembus lembut. Kamu berdiri di depan gerbang Sekolah Menengah Atas favoritmu.
              </p>
              <p className="text-sky-800 font-bold text-lg bg-sky-50 px-4 py-2 rounded-lg border border-sky-200 inline-block">
                TENG! TENG! TENG!
              </p>
              <p>
                Bel masuk berbunyi. Jam menunjukkan pukul 06:45 WIB.<br/>
                Ini adalah <span className="font-bold text-sky-700">Minggu Ke-1, Hari Senin</span>.<br/>
                Perjalananmu menuju ujian akhir dimulai sekarang.
              </p>
              <p className="text-xs text-slate-500">
                Pelajaran pertamamu hari ini adalah Pendidikan Kewarganegaraan (07:00 - 08:30).
              </p>
            </div>

            <button
              onClick={() => setGameState('walk')}
              className="mt-6 px-8 py-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold border-b-4 border-sky-700 rounded-lg shadow-md transition-all active:border-b-0 active:translate-y-1"
            >
              MASUK KE DALAM SEKOLAH
            </button>
          </div>
        )}

        {/* OVERWORLD EXPLORATION SCREEN */}`;

content = content.replace(walkScreenTarget, introScreenReplace);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched for UI and Intro');
