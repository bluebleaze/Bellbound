import React from 'react';
import { GameProgress, TeacherFoe } from '../types';
import { Volume2, VolumeX, BookOpen, Palette, RotateCcw, LogOut } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';

interface HeaderHUDProps {
  progress: GameProgress;
  activeFoe: TeacherFoe | null;
  foeHp: number;
  maxFoeHp: number;
  onToggleSound: () => void;
  onOpenNotes: () => void;
  onOpenCustomizer: () => void;
  onResetGame: () => void;
  onLogout: () => void;
  onOpenSchedule?: () => void;
  onOpenCalendar?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  progress,
  activeFoe,
  foeHp,
  maxFoeHp,
  onToggleSound,
  onOpenNotes,
  onOpenCustomizer,
  onResetGame,
  onLogout,
  onOpenSchedule,
  onOpenCalendar,
}) => {
  const maxHp = progress.maxHp && progress.maxHp > 0 ? progress.maxHp : 20;
  const currentHp = typeof progress.hp === 'number' && progress.hp >= 0 ? progress.hp : maxHp;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  const foeHpPercent = activeFoe && maxFoeHp > 0 ? Math.max(0, Math.min(100, (foeHp / maxFoeHp) * 100)) : 0;

  return (
    <header className="bg-zinc-950 border-b-4 border-white p-3 text-white font-mono flex flex-wrap items-center justify-between gap-3 select-none ">
      {/* Reset */}
      <button 
        onClick={onLogout}
        className="p-1.5 bg-red-950 border-2 border-red-500 hover:bg-red-900 text-red-400 font-bold rounded flex items-center gap-1"
      >
        <RotateCcw size={16} /> <span className="text-xs uppercase">Reset</span>
      </button>

      {/* Player Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold tracking-wider">LV {progress.lv || 1}</span>
          <span className="text-zinc-300 font-bold max-w-[120px] truncate">
            <span style={{ color: progress.customization?.soulColor || '#ef4444' }}>♥</span> {progress.customization?.name || 'KAMU'}
          </span>
        </div>

        {/* HP Bar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-300 font-bold">HP</span>
          <div className="w-32 sm:w-40 h-5 sm:h-6 bg-zinc-900 border-2 border-white relative overflow-hidden rounded shadow-inner">
            <div
              className="h-full transition-all duration-200"
              style={{ 
                width: `${hpPercent}%`,
                backgroundColor: progress.customization?.soulColor || '#ef4444'
              }}
            />
          </div>
          <span className="text-sm sm:text-base font-bold text-white min-w-[60px] drop-shadow-md">
            {currentHp} / {maxHp}
          </span>
        </div>
      </div>

      {/* Enemy Stats (In Battle) */}
      {activeFoe && (
        <div className="flex items-center gap-3 bg-zinc-900 px-4 py-1.5 border-2 border-yellow-400 rounded-lg shadow-lg">
          <span className="text-yellow-400 font-bold text-sm sm:text-base">{activeFoe.name}</span>
          <div className="w-24 sm:w-32 h-4 sm:h-5 bg-yellow-900/50 border-2 border-white relative overflow-hidden rounded-sm">
            <div
              className="h-full bg-yellow-400 transition-all duration-200"
              style={{ width: `${foeHpPercent}%` }}
            />
          </div>
          <span className="text-sm sm:text-base font-bold text-white min-w-[50px] drop-shadow-md">
            {foeHp} / {maxFoeHp}
          </span>
        </div>
      )}

      {/* Header Action Buttons */}
      <div className="flex items-center gap-2">
        
        
        <button
          onClick={onToggleSound}
          className="p-1.5 bg-zinc-900 border-2 border-zinc-600 hover:border-white hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1 text-zinc-300"
          title="Toggle Sound"
        >
          {progress.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
        </button>

        <button
          onClick={onOpenNotes}
          className="p-1.5 bg-zinc-900 border-2 border-zinc-600 hover:border-white hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1 text-zinc-300 font-bold"
          title="Catatan Pelajaran Unlocked"
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">Catatan</span>
        </button>

        <button
          onClick={onOpenCustomizer}
          className="p-1.5 bg-zinc-900 border-2 border-zinc-600 hover:border-white hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1 text-zinc-300 font-bold"
          title="Kustomisasi Karakter"
        >
          <Palette size={16} />
          <span className="hidden sm:inline">Karakter</span>
        </button>

      </div>
    </header>
  );
};
