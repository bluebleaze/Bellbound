import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { GameProgress, GAME_SCHEDULE } from '../types';

interface SidebarProps {
  progress: GameProgress;
}

export const GameSidebar: React.FC<SidebarProps> = ({ progress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'watch' | 'schedule' | 'rapot'>('watch');

  const currentLevel = progress.completedSubjects.length;
  const currentSchedule = GAME_SCHEDULE[Math.min(currentLevel, GAME_SCHEDULE.length - 1)];

  return (
    <div className={`absolute top-0 right-0 h-full bg-zinc-950 border-l-4 border-amber-900 transition-transform duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '320px' }}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-16 -left-12 bg-amber-900 text-white p-2 border-y-4 border-l-4 border-amber-700 rounded-l cursor-pointer"
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Tabs */}
      <div className="flex border-b-4 border-amber-900">
        <button onClick={() => setActiveTab('watch')} className={`flex-1 py-3 text-xs font-bold font-mono border-b-4 ${activeTab === 'watch' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-zinc-500'}`}>
          <Clock size={16} className="mx-auto mb-1" /> JAM
        </button>
        <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-3 text-xs font-bold font-mono border-b-4 ${activeTab === 'schedule' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-zinc-500'}`}>
          <Calendar size={16} className="mx-auto mb-1" /> JADWAL
        </button>
        <button onClick={() => setActiveTab('rapot')} className={`flex-1 py-3 text-xs font-bold font-mono border-b-4 ${activeTab === 'rapot' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-zinc-500'}`}>
          <BookOpen size={16} className="mx-auto mb-1" /> RAPOT
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 font-mono text-white overflow-y-auto">
        {activeTab === 'watch' && (
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-yellow-400 mb-4">JAM TANGAN</h3>
            {/* Watch Illustration */}
            <div className="relative w-48 h-48 mb-6">
              {/* Hand/Arm */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 bg-[#e0ac69] rounded-t-lg" />
              {/* Watch Strap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-zinc-800 rounded shadow-lg" />
              {/* Watch Face */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border-4 border-zinc-400 rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-yellow-400 text-xs font-bold">{currentSchedule.time.split(' - ')[0]}</span>
                <span className="text-[8px] text-zinc-400">{currentSchedule.dayName}</span>
              </div>
            </div>
            
            <div className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded">
              <span className="text-xs text-zinc-400 block mb-1">JADWAL SEKARANG:</span>
              <span className="text-sm text-yellow-300 font-bold block">{currentSchedule.name}</span>
              <span className="text-xs text-zinc-300">Waktu: {currentSchedule.time}</span>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-yellow-400 mb-4 text-center">JADWAL PELAJARAN</h3>
            <div className="space-y-2">
              {GAME_SCHEDULE.map((s, idx) => {
                const isPast = idx < currentLevel;
                const isCurrent = idx === currentLevel;
                return (
                  <div key={idx} className={`p-2 border-2 rounded ${isCurrent ? 'bg-yellow-950 border-yellow-500' : isPast ? 'bg-zinc-900 border-zinc-700 opacity-60' : 'bg-black border-zinc-800'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-yellow-400' : 'text-zinc-400'}`}>Minggu {s.week} - {s.dayName}</span>
                      {isPast && <span className="text-[10px] text-green-400">SELESAI ✓</span>}
                    </div>
                    <span className="text-sm block">{s.name}</span>
                    <span className="text-[10px] text-zinc-500">{s.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'rapot' && (
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-yellow-400 mb-4 text-center">RAPOT SISWA</h3>
            <div className="space-y-3">
              {GAME_SCHEDULE.map((s, idx) => {
                const isPast = idx < currentLevel;
                const scoreData = progress.scores?.[s.subjectId];
                const totalScore = scoreData ? Math.round((scoreData.correct / scoreData.total) * 100) : 0;
                
                return (
                  <div key={idx} className={`p-2 border-b-2 border-zinc-800 ${!isPast && 'opacity-50'}`}>
                    <span className="text-xs text-zinc-400 block">{s.name}</span>
                    {isPast ? (
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-[10px] text-zinc-500">Benar: {scoreData?.correct}/{scoreData?.total}</span>
                        <span className={`text-lg font-bold ${totalScore < 70 ? 'text-red-400' : 'text-green-400'}`}>{totalScore}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600 italic">Belum diujikan</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
