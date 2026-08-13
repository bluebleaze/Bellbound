import React from 'react';
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
                className={`flex items-center gap-3 p-3 border-2 rounded ${
                  isCompleted ? 'bg-zinc-900/50 border-zinc-800 opacity-60' :
                  isCurrent ? 'bg-zinc-900 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]' :
                  'bg-zinc-950 border-dashed border-zinc-700 opacity-70'
                }`}
              >
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded font-bold text-xs border ${
                  isCompleted ? 'bg-zinc-800 border-zinc-700 text-zinc-500' :
                  isCurrent ? 'bg-yellow-500 border-yellow-400 text-black' :
                  'bg-zinc-900 border-zinc-800 text-zinc-600'
                }`}>
                  <span>W${s.week}</span>
                  <span>${s.dayName.substring(0,3)}</span>
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${isCurrent ? 'text-yellow-400' : 'text-zinc-300'}`}>
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
