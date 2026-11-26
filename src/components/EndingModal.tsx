import React, { useEffect, useRef, useState } from 'react';
import { GameProgress, SubjectId, GAME_SCHEDULE } from '../types';
import { FOES } from '../data/questions';
import { drawPlayerSprite } from './PixelSprites';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Heart,
  RotateCcw,
  ScrollText,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';

type EndingStep = 'report' | 'character' | 'words';

interface EndingModalProps {
  progress: GameProgress;
  onReset: () => void;
}

const SUBJECT_ORDER: SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];

const UNIFORM_LABELS: Record<string, string> = {
  smk: 'Seragam SMK',
  pramuka: 'Pramuka',
  batik: 'Batik Sekolah',
  olahraga: 'Olahraga',
};

const GENDER_LABELS: Record<string, string> = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  normal: 'Normal',
  hard: 'Hard',
  extreme: 'Extreme',
};

const SOUL_TRAITS: Record<string, string> = {
  '#ef4444': 'Determinasi',
  '#06b6d4': 'Kesabaran',
  '#f97316': 'Keberanian',
  '#3b82f6': 'Integritas',
  '#a855f7': 'Kegigihan',
  '#22c55e': 'Kebaikan',
  '#eab308': 'Keadilan',
  '#ec4899': 'Cinta',
};

const getGrade = (score: number) => {
  if (score >= 90) {
    return { grade: 'A', predicate: 'Sangat Baik', color: 'text-emerald-300', border: 'border-emerald-500', bg: 'bg-emerald-950/60' };
  }
  if (score >= 80) {
    return { grade: 'B', predicate: 'Baik', color: 'text-lime-300', border: 'border-lime-500', bg: 'bg-lime-950/60' };
  }
  if (score >= 70) {
    return { grade: 'C', predicate: 'Cukup', color: 'text-yellow-300', border: 'border-yellow-500', bg: 'bg-yellow-950/60' };
  }
  if (score >= 60) {
    return { grade: 'D', predicate: 'Kurang', color: 'text-orange-300', border: 'border-orange-500', bg: 'bg-orange-950/60' };
  }
  return { grade: 'E', predicate: 'Perlu Remedial', color: 'text-red-300', border: 'border-red-500', bg: 'bg-red-950/60' };
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2">
    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</div>
    <div className="text-sm font-bold text-white mt-0.5">{value}</div>
  </div>
);

const ColorRow: React.FC<{ label: string; color: string; extra?: string }> = ({ label, color, extra }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="text-zinc-400 font-bold">{label}</span>
    <span className="flex items-center gap-2 font-mono text-zinc-200">
      {extra && <span className="text-yellow-300 font-bold">{extra}</span>}
      <span className="w-4 h-4 rounded border border-white/40 inline-block" style={{ backgroundColor: color }} />
      <span>{color}</span>
    </span>
  </div>
);

export const EndingModal: React.FC<EndingModalProps> = ({ progress, onReset }) => {
  const [step, setStep] = useState<EndingStep>('report');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const customization = progress.customization;

  const difficultyMultiplier = progress.difficulty === 'extreme' ? 2.3 : progress.difficulty === 'hard' ? 1.5 : 1;

  const rows = SUBJECT_ORDER.map((subjectId) => {
    const score = progress.scores?.[subjectId];
    const total = score?.total ?? 0;
    const scaledCorrect = score?.correct ?? 0;
    const rawCorrect = total > 0 ? Math.min(total, Math.round(scaledCorrect / difficultyMultiplier)) : 0;
    const percentage = total > 0 ? Math.min(100, Math.round((scaledCorrect / total) * 100)) : 0;
    const grade = getGrade(percentage);

    return {
      subjectId,
      subject: GAME_SCHEDULE.find((item) => item.subjectId === subjectId),
      foe: FOES[subjectId],
      total,
      rawCorrect,
      percentage,
      grade,
    };
  });

  const average = Math.round(rows.reduce((sum, row) => sum + row.percentage, 0) / rows.length);
  const finalGrade = getGrade(average);
  const passed = average >= 70;
  const completedCount = progress.completedSubjects.length;
  const playerName = customization.name || 'SISWA BELLBOUND';
  const soulTrait = SOUL_TRAITS[customization.soulColor] || 'Determinasi';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    drawPlayerSprite(ctx, 48, 16, customization, 'down', 0, 4);
  }, [customization, step]);

  const stepLabel = step === 'report'
    ? 'LAPORAN HASIL BELAJAR'
    : step === 'character'
      ? 'INFORMASI KARAKTER'
      : 'KATA PENUTUP';

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-mono select-none">
      <div className="bg-zinc-950 border-4 border-yellow-400 max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-white shadow-2xl rounded">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-800 pb-3 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-bold">Bellbound · Ending</div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
              {step === 'report' ? <ScrollText size={22} className="text-yellow-400" /> : step === 'character' ? <User size={22} className="text-yellow-400" /> : <Sparkles size={22} className="text-yellow-400" />}
              {stepLabel}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {(['report', 'character', 'words'] as EndingStep[]).map((item, index) => (
              <div
                key={item}
                className={`h-2 rounded-full transition-all ${
                  step === item ? 'w-8 bg-yellow-400' : index < (['report', 'character', 'words'] as EndingStep[]).indexOf(step) ? 'w-2 bg-yellow-700' : 'w-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 'report' && (
          <div className="space-y-4">
            <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Nama Siswa</div>
                <div className="text-lg font-black text-yellow-300">{playerName}</div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-zinc-500">Level </span>
                  <span className="font-bold text-white">{progress.lv}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Mapel </span>
                  <span className="font-bold text-white">{completedCount} / 6</span>
                </div>
                <div>
                  <span className="text-zinc-500">Kesulitan </span>
                  <span className="font-bold text-white">{DIFFICULTY_LABELS[progress.difficulty] || progress.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border-2 border-zinc-700 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Guru</th>
                    <th className="p-3 text-center">Benar</th>
                    <th className="p-3 text-center">Nilai</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.subjectId} className="border-t border-zinc-800">
                      <td className="p-3">
                        <div className="font-bold text-white">{row.subject?.name || row.foe.name}</div>
                        <div className="text-[10px] text-zinc-500">{row.foe.roomName}</div>
                      </td>
                      <td className="p-3 text-zinc-300">{row.foe.label}</td>
                      <td className="p-3 text-center text-zinc-300">{row.rawCorrect} / {row.total}</td>
                      <td className={`p-3 text-center font-black ${row.grade.color}`}>{row.percentage}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded border font-black ${row.grade.color} ${row.grade.border} ${row.grade.bg}`}>
                          {row.grade.grade}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded border ${row.percentage >= 70 ? 'text-emerald-300 border-emerald-500 bg-emerald-950/60' : 'text-red-300 border-red-500 bg-red-950/60'}`}>
                          {row.percentage >= 70 ? 'LULUS' : 'REMEDIAL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Rata-rata</div>
                <div className={`text-3xl font-black ${finalGrade.color}`}>{average}</div>
              </div>
              <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Predikat</div>
                <div className={`text-lg font-black ${finalGrade.color}`}>{finalGrade.predicate}</div>
              </div>
              <div className={`border-2 rounded-xl p-4 text-center ${passed ? 'bg-emerald-950/60 border-emerald-500' : 'bg-red-950/60 border-red-500'}`}>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Status Kelulusan</div>
                <div className={`text-lg font-black ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
                  {passed ? 'LULUS' : 'BELUM LULUS'}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep('character')}
                className="w-full sm:w-auto px-5 py-3 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-black rounded-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <User size={18} />
                <span>LIHAT INFORMASI KARAKTER</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'character' && (
          <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center">
              <canvas ref={canvasRef} width={160} height={160} className="pixelated" style={{ imageRendering: 'pixelated' }} />
              <div className="text-sm text-yellow-300 font-black uppercase mt-2 text-center">{playerName}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase">{UNIFORM_LABELS[customization.uniform] || customization.uniform}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                <Heart size={12} className="fill-current" style={{ color: customization.soulColor }} />
                {soulTrait}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoRow label="Nama Lengkap" value={playerName} />
                <InfoRow label="Gender" value={GENDER_LABELS[customization.gender] || customization.gender} />
                <InfoRow label="Seragam" value={UNIFORM_LABELS[customization.uniform] || customization.uniform} />
                <InfoRow label="Level" value={`LV ${progress.lv}`} />
                <InfoRow label="HP" value={`${progress.hp} / ${progress.maxHp}`} />
                <InfoRow label="Kesulitan" value={DIFFICULTY_LABELS[progress.difficulty] || progress.difficulty} />
                <InfoRow label="Mapel Selesai" value={`${completedCount} / 6`} />
                <InfoRow label="Rata-rata Nilai" value={average} />
              </div>

              <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 space-y-2">
                <div className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                  <Award size={14} />
                  Identitas Visual
                </div>
                <ColorRow label="Warna Rambut" color={customization.hairColor} />
                <ColorRow label="Warna Kulit" color={customization.skinColor} />
                <ColorRow label="Warna Soul" color={customization.soulColor} extra={soulTrait} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-1">
                <button
                  onClick={() => setStep('report')}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 text-zinc-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>KEMBALI KE RAPOT</span>
                </button>
                <button
                  onClick={() => setStep('words')}
                  className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>LIHAT KATA PENUTUP</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'words' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${passed ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'}`}>
                <Trophy size={16} />
                {passed ? 'SELAMAT, KAMU LULUS!' : 'PERJALANAN BELUM SELESAI'}
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-widest">TAMAT</h3>
            </div>

            <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-xl p-5 space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              <p>
                Tirai kelas akhirnya tertutup. Papan tulis yang dulu penuh rumus dan catatan kini kosong,
                dan lorong sekolah tak lagi seramai saat kamu pertama kali melangkah masuk.
              </p>
              <p>
                <span className="text-yellow-300 font-black">{playerName}</span>, kamu telah menghadapi enam guru,
                enam ujian, dan enam versi dirimu yang terus belajar untuk bangkit. Setiap jawaban salah
                mengajarkanmu pola. Setiap peluru yang berhasil dihindari mengajarkanmu keberanian.
              </p>
              <p>
                Nilai rata-ratamu adalah <span className={`font-black ${finalGrade.color}`}>{average}</span> dengan
                predikat <span className={`font-black ${finalGrade.color}`}>{finalGrade.predicate}</span>.
                {passed
                  ? ' Kamu berhasil memenuhi standar kelulusan dan menutup perjalanan ini dengan gemilang.'
                  : ' Kamu belum memenuhi standar kelulusan. Masih ada kesempatan untuk mengulang dan belajar lebih giat.'}
              </p>
              <p className="text-zinc-400">
                Terima kasih sudah menemani perjalanan di Bellbound. Sampai jumpa di kelas berikutnya.
              </p>
            </div>

            <div className="bg-black border-l-4 border-yellow-400 p-4 text-yellow-200 italic font-bold text-sm">
              "Pelajari pola. Pelajari ilmu. Jangan paksa pintu."
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={() => setStep('report')}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 text-zinc-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen size={16} />
                <span>LIHAT RAPOT LAGI</span>
              </button>
              <button
                onClick={onReset}
                className="px-5 py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                <span>RESET PERMAINAN</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
