import React, { useState, useEffect } from 'react';
import { GameProgress, GameStateMode, SubjectId, PlayerCustomization, GAME_SCHEDULE } from './types';
import { FOES } from './data/questions';
import { HeaderHUD } from './components/HeaderHUD';
import { DevMenuModal } from './components/DevMenuModal';
import { Overworld } from './components/Overworld';
import { BattleArena } from './components/BattleArena';
import { CustomizerModal } from './components/CustomizerModal';
import { LoginScreen } from './components/LoginScreen';
import { LevelPopupModal } from './components/LevelPopupModal';
import { StudyNotesModal } from './components/StudyNotesModal';
import { VictoryModal } from './components/VictoryModal';
import { ScheduleModal, CalendarModal } from './components/ScheduleModal';
import { GameSidebar } from './components/GameSidebar';
import { TutorialModal } from './components/TutorialModal';
import { audioEngine } from './utils/AudioEngine';
import { Play, Sparkles, BookOpen, RotateCcw } from 'lucide-react';

const INITIAL_PROGRESS: GameProgress = {
  hp: 20,
  maxHp: 20,
  lv: 1,
  exp: 0,
  completedSubjects: [],
  scores: {},
  difficulty: 'normal',
  customization: {
    name: '',
    uniform: 'smk',
    hairColor: '#451a03',
    skinColor: '#e0ac69',
    gender: 'male',
    soulColor: '#ef4444',
  },
  actUsesRemaining: 3,
  soundEnabled: true,
  bgmVolume: 0.5,
};

export default function App() {
  const [gameState, setGameState] = useState<GameStateMode>('title');
  const [currentRoom, setCurrentRoom] = useState<'hall' | SubjectId>('pkn');
  const [activeBattleSubject, setActiveBattleSubject] = useState<SubjectId | null>(null);
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);

  // Load progress from localStorage if available
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem('last_classroom_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        const maxHp = 20;
        const hp = typeof parsed.hp === 'number' && parsed.hp > 0 ? parsed.hp : maxHp;
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          hp,
          maxHp,
          customization: {
            ...INITIAL_PROGRESS.customization,
            ...(parsed.customization || {}),
            uniform: parsed.customization?.uniform === 'sma' ? 'smk' : (parsed.customization?.uniform || 'smk'),
          },
        };
      }
    } catch {}
    return INITIAL_PROGRESS;
  });

  // Modal triggers
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [victorySubject, setVictorySubject] = useState<SubjectId | null>(null);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('last_classroom_progress', JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Audio Engine Sync
  useEffect(() => {
    audioEngine.enabled = progress.soundEnabled;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (e.target === document.body || (e.target as HTMLElement).tagName === 'DIV') {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress.soundEnabled]);

  useEffect(() => {
    // keeping the old effect's logic just in case
    if (gameState === 'walk') {
      audioEngine.start8BitBgm('overworld');
    } else if (gameState === 'battle') {
      audioEngine.start8BitBgm('battle');
    } else {
      audioEngine.stopBgm();
    }
  }, [gameState, progress.soundEnabled]);

  // Start / Continue Game
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
    setGameState('login');
  };

  const handleLoginStart = (finalForm?: any, diff: "normal" | "hard" | "extreme" = "normal") => {
    audioEngine.playSelect();
    setProgress(prev => ({
      ...INITIAL_PROGRESS,
      customization: finalForm || prev.customization,
      difficulty: diff,
    }));
    setGameState('level_popup');
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !progress.soundEnabled;
    setProgress((prev) => ({ ...prev, soundEnabled: next }));
    audioEngine.enabled = next;
    if (!next) audioEngine.stopBgm();
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('Apakah kamu yakin ingin mengulang permainan dari awal?')) {
      audioEngine.playSelect();
      setProgress(INITIAL_PROGRESS);
      setGameState('title');
      setCurrentRoom('pkn');
      setActiveBattleSubject(null);
      localStorage.removeItem('last_classroom_progress');
    }
  };

  // Enter Battle
  const startActualBattle = () => {
    audioEngine.playHit();
    setGameState("battle_intro");
    setTimeout(() => {
      audioEngine.start8BitBgm('battle');
      setGameState("battle");
    }, 1200);
  };
  const handleEnterBattle = (subject: SubjectId) => {
    if (audioEngine.playEncounter) {
      audioEngine.playEncounter();
    } else {
      audioEngine.playSelect();
    }
    
    setActiveBattleSubject(subject);
    setGameState('battle_intro');
    
    setTimeout(() => {
      setProgress((prev) => {
        const validMax = 20;
        const validHp = prev.hp && prev.hp > 0 ? prev.hp : validMax;
        return {
          ...prev,
          hp: validHp,
          maxHp: validMax,
        };
      });
      setGameState('battle');
    }, 1200);
  };

  // On Victory in Battle
  const handleBattleVictory = (subject: SubjectId, score: { correct: number, total: number }) => {
    const newCompleted = Array.from(new Set([...progress.completedSubjects, subject])) as SubjectId[];
    const newLv = 1 + newCompleted.length;
    const newMaxHp = 20;

    setProgress((prev) => ({
      ...prev,
      hp: newMaxHp,
      maxHp: newMaxHp,
      lv: newLv,
      completedSubjects: newCompleted,
      actUsesRemaining: 3,
      scores: { ...prev.scores, [subject]: score }
    }));

    setVictorySubject(subject);
    setGameState('victory');
  };

  // On Game Over (HP 0)
  const handleGameOver = () => {
    setGameState('game_over');
  };

  // Retry after Game Over
  const handleRetry = () => {
    audioEngine.playSelect();
    setProgress((prev) => {
      const validMax = 20;
      return {
        ...prev,
        hp: validMax,
        maxHp: validMax,
        actUsesRemaining: 3,
      };
    });
    setGameState('walk');
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
      {/* Header HUD Bar */}
      <HeaderHUD
          onLogout={handleResetGame}
        progress={progress}
        activeFoe={activeBattleSubject && gameState === 'battle' ? FOES[activeBattleSubject] : null}
        foeHp={6}
        maxFoeHp={6}
        onToggleSound={handleToggleSound}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onResetGame={handleResetGame}
        
        
      />

      {/* Main View Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 lg:p-8 bg-zinc-950">
        <main className="w-full max-w-[1280px] h-full sm:h-auto sm:aspect-[16/9] bg-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-0 sm:p-6 overflow-y-auto overflow-x-hidden">
        {(gameState === 'walk' || gameState === 'battle') && <GameSidebar progress={progress} />}


        {/* LOGIN SCREEN */}
        {gameState === 'login' && (
          <LoginScreen 
            customization={progress.customization}
            onSave={(c) => setProgress(p => ({ ...p, customization: c }))}
            onStart={(form, diff) => handleLoginStart(form, diff)}
          />
        )}
        
        {/* LEVEL POPUP SCREEN */}
        {gameState === 'level_popup' && (
          <LevelPopupModal 
            level={progress.completedSubjects.length}
            onContinue={() => {
              audioEngine.playSelect();
              setGameState('walk');
            }}
          />
        )}

        {/* TITLE SCREEN */}
        {gameState === 'title' && (
          <div className="max-w-xl w-full bg-zinc-950/80 backdrop-blur-sm border-4 border-white p-8 rounded shadow-2xl text-center flex flex-col justify-center space-y-8 relative overflow-hidden my-auto h-full sm:h-auto">
            <div className="space-y-4">
              <img src="/logo.png" alt="Logo Sekolah" className="w-24 h-24 mx-auto object-contain drop-shadow-[0_4px_4px_rgba(250,204,21,0.5)]" onError={(e) => e.currentTarget.style.display = 'none'} />
              <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-widest drop-shadow-[0_4px_4px_rgba(250,204,21,0.5)]">
                BELLBOUND
              </h1>
              <span className="inline-block text-xs text-yellow-400 font-bold uppercase tracking-widest border border-yellow-500/50 bg-yellow-400/10 px-3 py-1 rounded">
                INDONESIAN RETRO SCHOOL RPG
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <button
                onClick={handleNewSession}
                className="w-full sm:w-3/4 py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-extrabold border-b-4 border-yellow-700 rounded text-xl sm:text-2xl flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
              >
                <span>✨ MULAI SESI BARU</span>
              </button>

              <button
                onClick={handleContinueGame}
                disabled={progress.completedSubjects.length === 0}
                className={`w-full sm:w-1/2 py-2 font-bold border-2 rounded text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm ${
                  progress.completedSubjects.length > 0
                    ? 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 border-zinc-700 active:translate-y-px'
                    : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                }`}
              >
                <span>
                  Lanjutkan Sesi Sebelumnya 
                  {progress.completedSubjects.length > 0 && ` (Level ${progress.completedSubjects.length})`}
                </span>
              </button>

              <div className="mt-4 pt-4 border-t border-zinc-800 w-full sm:w-1/2">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-400 rounded transition-colors"
                >
                  🎨 KUSTOM KARAKTER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STORY INTRO SCREEN */}
        {gameState === 'intro' && (
          <div className="max-w-2xl w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl flex flex-col items-center text-center space-y-6 my-auto animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-zinc-900 rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-inner mb-2">
               {/* Quick Canvas Render for Intro */}
               <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=school&backgroundColor=e0f2fe" alt="School" className="w-full h-full object-cover opacity-70" />
            </div>
            
            <div className="space-y-4 text-zinc-300 text-sm sm:text-base font-semibold leading-relaxed">
              <p>
                Angin pagi berhembus lembut. Kamu berdiri di depan gerbang Sekolah Menengah Atas favoritmu.
              </p>
              <p className="text-yellow-500 font-bold text-lg bg-zinc-950 px-4 py-2 rounded border border-zinc-700 inline-block">
                TENG! TENG! TENG!
              </p>
              <p>
                Bel masuk berbunyi. Jam menunjukkan pukul 06:45 WIB.<br/>
                Ini adalah <span className="font-bold text-yellow-400">Minggu Ke-1, Hari Senin</span>.<br/>
                Perjalananmu menuju ujian akhir dimulai sekarang.
              </p>
              <p className="text-xs text-zinc-400">
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

        {/* OVERWORLD EXPLORATION SCREEN */}
        {gameState === 'walk' && (
          <Overworld
            currentRoom={currentRoom}
            customization={progress.customization}
            completedSubjects={progress.completedSubjects}
            onEnterBattle={handleEnterBattle}
            onChangeRoom={(room) => {
              audioEngine.playStep();
              setCurrentRoom(room);
            }}
          />
        )}

        {/* CLASS INTRO POPUP */}
        {gameState === 'class_intro' && activeBattleSubject && (
          <div className="max-w-md w-full bg-zinc-950 border-4 border-white p-8 rounded shadow-2xl text-center space-y-6 my-auto animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-yellow-500 border-b-2 border-zinc-800 pb-2">MEMASUKI KELAS</h2>
            <div className="bg-zinc-950 border border-zinc-700 rounded p-4 space-y-2">
               <div className="text-xl font-bold text-white">{FOES[activeBattleSubject].name}</div>
               <div className="text-sm font-semibold text-yellow-400 bg-zinc-900 px-3 py-1 rounded inline-block">
                 {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.name || 'Pelajaran'}
               </div>
               <div className="text-xs text-zinc-400 mt-2">
                 Jam: {GAME_SCHEDULE.find(s => s.subjectId === activeBattleSubject)?.time || '07:00'}
               </div>
            </div>
            <p className="text-sm text-zinc-300">
              Guru sudah menunggu di dalam. Siapkan dirimu!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setGameState('walk')}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border-b-4 border-zinc-600 rounded transition-all active:translate-y-1 active:border-b-0"
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

        {/* BATTLE INTRO ANIMATION */}
        {gameState === 'battle_intro' && activeBattleSubject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-[flash_0.2s_ease-in-out_3]">
            <style>
              {`
                @keyframes flash {
                  0%, 100% { background-color: black; }
                  50% { background-color: white; }
                }
              `}
            </style>
            <div className="animate-ping flex items-center justify-center absolute">
              <svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: progress.customization.soulColor || '#ef4444' }}>
                <path d="M2 0h4v1H2zm8 0h4v1h-4zM1 1h6v1H1zm8 0h6v1H9zM0 2h16v4H0zM1 6h14v1H1zM2 7h12v1H2zM3 8h10v1H3zM4 9h8v1H4zM5 10h6v1H5zM6 11h4v1H6zM7 12h2v1H7z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center justify-center absolute">
              <svg width="64" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: progress.customization.soulColor || '#ef4444' }}>
                <path d="M2 0h4v1H2zm8 0h4v1h-4zM1 1h6v1H1zm8 0h6v1H9zM0 2h16v4H0zM1 6h14v1H1zM2 7h12v1H2zM3 8h10v1H3zM4 9h8v1H4zM5 10h6v1H5zM6 11h4v1H6zM7 12h2v1H7z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        )}

        {/* RPG BULLET-DODGE QUIZ BATTLE SCREEN */}
        {gameState === 'battle' && activeBattleSubject && (
          <BattleArena
            subject={activeBattleSubject}
            progress={progress}
            onUpdateHp={(newHp) => setProgress((p) => ({ ...p, hp: newHp }))}
            onVictory={handleBattleVictory}
            onGameOver={handleGameOver}
          />
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'game_over' && (
          <div className="max-w-md w-full bg-zinc-950 border-4 border-red-500 p-8 rounded shadow-2xl text-center space-y-6 my-auto">
            <div className="text-red-600 font-black text-4xl animate-pulse drop-shadow-sm">
              GAME OVER
            </div>
            <p className="text-sm text-zinc-300 font-semibold leading-relaxed">
              Jiwamu pecah menjadi serpihan cahaya. Jangan menyerah! Pelajari pola peluru guru dan buka catatan pelajaran untuk belajar lebih giat.
            </p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold border-b-4 border-red-700 rounded text-sm flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-1 active:border-b-0"
            >
              <RotateCcw size={18} />
              <span>COBA LAGI (RETRY)</span>
            </button>
          </div>
        )}

      {/* MODALS */}
      {gameState === 'walk' && progress.completedSubjects.length === 0 && !progress.hasSeenTutorial && (
        <TutorialModal 
          onClose={() => setProgress(p => ({ ...p, hasSeenTutorial: true }))} 
        />
      )}

      {isCustomizerOpen && (
        <CustomizerModal
          customization={progress.customization}
          onSave={(updated) => setProgress((p) => ({ ...p, customization: updated }))}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {isNotesOpen && (
        <StudyNotesModal
          completedSubjects={progress.completedSubjects}
          onClose={() => setIsNotesOpen(false)}
        />
      )}
      {isScheduleOpen && (
        <ScheduleModal
          currentLevel={progress.completedSubjects.length}
          onClose={() => setIsScheduleOpen(false)}
        />
      )}
      {isCalendarOpen && (
        <CalendarModal
          currentLevel={progress.completedSubjects.length}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}

      {gameState === 'victory' && victorySubject && (
        <VictoryModal
          progress={progress}
          completedSubject={victorySubject}
          totalCompleted={progress.completedSubjects.length}
          onContinue={() => {
            const isFinalGameVictory = progress.completedSubjects.length >= 6;
            let totalAvg = 0;
            if (isFinalGameVictory) {
              let sum = 0;
              for (const sub of Object.values(progress.scores || {}) as {correct: number, total: number}[]) {
                sum += (sub.correct / sub.total) * 100;
              }
              totalAvg = Math.round(sum / 6);
            }

            if (isFinalGameVictory && totalAvg < 70) {
              // Remedial (restart)
              handleResetGame();
            } else {
              setGameState('walk');
              setCurrentRoom('hall');
            }
          }}
        />
      )}
      
      {isDevMenuOpen && (
        <DevMenuModal
          progress={progress}
          setProgress={setProgress}
          onClose={() => setIsDevMenuOpen(false)}
          onForceVictory={(subj) => {
             const targetSubject = subj || activeBattleSubject;
             if (targetSubject) {
                handleBattleVictory(targetSubject, { correct: 10, total: 10 });
             }
          }}
          activeBattleSubject={activeBattleSubject}
          gameState={gameState}
        />
      )}
      
      {/* Hidden Dev Trigger */}
      <div 
        className="fixed bottom-0 right-0 w-16 h-16 z-[9999] opacity-0 cursor-default"
        onClick={() => {
           const pwd = window.prompt("Dev Access Password:");
           if (pwd === "devmode") setIsDevMenuOpen(true);
        }}
      />
      
      </main>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t-2 border-zinc-700 p-3 flex flex-col items-center gap-2 text-center text-yellow-500 text-xs font-mono font-bold z-10 relative">
        <span>BELLBOUND · Pelajari pola. Pelajari ilmu. Jangan paksa pintu.</span>
        <span className="text-zinc-400 text-xs font-sans font-medium tracking-wide opacity-80 uppercase">
          © 2026 Nabil Abhitah Abyasha XIC & Hilyatul Aulia XIC ANGKATAN 27
        </span>
      </footer>
    </div>
  );
}
