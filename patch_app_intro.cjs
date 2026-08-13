const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Modify handleEnterBattle
const targetEnterBattle = `  // On Battle Start
  const handleEnterBattle = (subject: SubjectId) => {
    audioEngine.playHit();
    setActiveBattleSubject(subject);
    setGameState('battle_intro');
    
    // Transition to battle screen after animation
    setTimeout(() => {
      audioEngine.playBgm('battle');
      setGameState('battle');
    }, 1200);
  };`;

const replaceEnterBattle = `  // On Battle Start
  const handleEnterBattle = (subject: SubjectId) => {
    audioEngine.playSelect();
    setActiveBattleSubject(subject);
    setGameState('class_intro');
  };

  const startActualBattle = () => {
    audioEngine.playHit();
    setGameState('battle_intro');
    
    setTimeout(() => {
      audioEngine.playBgm('battle');
      setGameState('battle');
    }, 1200);
  };`;
content = content.replace(targetEnterBattle, replaceEnterBattle);

// 2. Render class_intro
const targetWalkRender = `{/* BATTLE INTRO ANIMATION */}`;
const replaceClassIntro = `{/* CLASS INTRO POPUP */}
        {gameState === 'class_intro' && activeBattleSubject && (
          <div className="max-w-md w-full bg-white border-4 border-sky-400 p-8 rounded-xl shadow-2xl text-center space-y-6 my-auto animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-sky-900 border-b-2 border-sky-100 pb-2">MEMASUKI KELAS</h2>
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-2">
               <div className="text-xl font-bold text-slate-800">{FOES[activeBattleSubject].name}</div>
               <div className="text-sm font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded inline-block">
                 {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.name || 'Pelajaran'}
               </div>
               <div className="text-xs text-slate-500 mt-2">
                 Jam: {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.time || '07:00'}
               </div>
            </div>
            <p className="text-sm text-slate-600">
              Guru sudah menunggu di dalam. Siapkan dirimu!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setGameState('walk')}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-b-4 border-slate-300 rounded-lg transition-all active:translate-y-1 active:border-b-0"
              >
                KEMBALI
              </button>
              <button
                onClick={startActualBattle}
                className="flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold border-b-4 border-sky-700 rounded-lg transition-all active:translate-y-1 active:border-b-0 shadow-md"
              >
                MULAI KELAS
              </button>
            </div>
          </div>
        )}

        {/* BATTLE INTRO ANIMATION */}`;
content = content.replace(targetWalkRender, replaceClassIntro);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched for class_intro');
