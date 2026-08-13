import React from 'react';
import { SubjectId, GAME_SCHEDULE } from '../types';

interface LevelPopupModalProps {
  level: number;
  onContinue: () => void;
}

export const LevelPopupModal: React.FC<LevelPopupModalProps> = ({ level, onContinue }) => {
  const currentClass = GAME_SCHEDULE[level] || GAME_SCHEDULE[GAME_SCHEDULE.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-950 border-4 border-white max-w-md w-full p-8 text-center rounded shadow-2xl relative animate-in zoom-in duration-300">
        <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">SEKARANG KAMU BERADA DI</div>
        <h2 className="text-4xl font-black text-white mb-6">LEVEL {level + 1}</h2>
        
        <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded mb-8">
          <div className="text-zinc-400 text-xs font-bold mb-1">MATA PELAJARAN:</div>
          <div className="text-xl font-bold text-yellow-500">{currentClass.name}</div>
          <div className="text-sm text-zinc-300 mt-2">Jam: {currentClass.time}</div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black font-bold border-b-4 border-zinc-400 rounded text-lg transition-all active:translate-y-1 active:border-b-0"
        >
          MASUK KE SEKOLAH
        </button>
      </div>
    </div>
  );
};
