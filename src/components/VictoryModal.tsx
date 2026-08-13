import React from 'react';
import { SubjectId, GameProgress } from '../types';
import { FOES } from '../data/questions';
import { Trophy, Award, ArrowRight, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  completedSubject: SubjectId;
  totalCompleted: number;
  progress: GameProgress;
  onContinue: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  completedSubject,
  totalCompleted,
  progress,
  onContinue,
}) => {
  const foe = FOES[completedSubject];
  const isFinalGameVictory = totalCompleted >= 6;
  
  let totalAvg = 0;
  if (isFinalGameVictory) {
    let totalScoreSum = 0;
    let subjectsCount = 0;
    for (const sub of Object.values(progress.scores || {}) as {correct: number, total: number}[]) {
      totalScoreSum += (sub.correct / sub.total) * 100;
      subjectsCount++;
    }
    totalAvg = subjectsCount > 0 ? Math.round(totalScoreSum / subjectsCount) : 0;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-zinc-950 border-4 border-yellow-400 max-w-lg w-full p-6 text-white shadow-2xl relative text-center space-y-4">
        {/* Banner Header */}
        <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 font-bold text-sm rounded-full">
          <Sparkles size={18} />
          <span>{isFinalGameVictory ? 'LULUS SELURUH UJIAN SEKOLAH!' : 'UJIAN DITERIMA & LULUS!'}</span>
        </div>

        {/* Big Icon */}
        <div className="py-2">
          {isFinalGameVictory ? (
            <Trophy size={64} className="mx-auto text-yellow-400 animate-bounce" />
          ) : (
            <Award size={56} className="mx-auto text-amber-400" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-yellow-300">
          {isFinalGameVictory ? (totalAvg >= 70 ? 'SELAMAT! KAMU LULUS SEKOLAH!' : 'TIDAK LULUS! NILAI DIBAWAH STANDAR') : `LULUS PELAJARAN ${foe.name}`}
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
          {isFinalGameVictory 
            ? (totalAvg >= 70 ? `Kamu telah menguasai seluruh 6 mata pelajaran dengan nilai rata-rata ${totalAvg}. Kamu lulus dengan gemilang!` : `Nilai rata-rata rapot kamu hanya ${totalAvg} (Syarat kelulusan: 70). Kamu harus mengikuti program remedial dari awal!`) 
            : `${foe.label} tersenyum bangga: "Kamu telah menyelesaikan pelajaran!"`}
        </p>

        {/* Progress Badge */}
        <div className="bg-zinc-900 border-2 border-zinc-700 p-3 rounded text-xs text-yellow-400 font-bold flex justify-around">
          <span>PROGRESS SEKOLAH: {totalCompleted} / 6 TERKUMPUL</span>
          <span>Sertifikat Catatan Opened ✓</span>
        </div>

        <div className="pt-2">
          <button
            onClick={onContinue}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-2 border-yellow-200 rounded text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>{isFinalGameVictory ? (totalAvg >= 70 ? 'KEMBALI KE LORONG UTAMA' : 'MULAI REMEDIAL (RESTART)') : 'LANJUTKAN KE LORONG SEKOLAH'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
