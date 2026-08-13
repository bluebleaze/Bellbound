import React, { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'SELAMAT DATANG DI BELLBOUND!',
      content: 'Di game ini, kamu harus bertahan dari Ujian Nasional dengan cara menghindari serangan "peluru" pelajaran dari guru-guru dan menjawab soal dengan tepat.',
      icon: '🏫'
    },
    {
      title: 'EKSPLORASI (OVERWORLD)',
      content: 'Gunakan tombol W, A, S, D atau Panah (Arrow Keys) untuk menggerakan karaktermu. Kamu juga bisa menggunakan tombol sentuh (D-Pad) di layar jika main di HP. Untuk menantang guru, hampiri mereka atau masuk ke kelas dan tekan SPASI/ENTER.',
      icon: '🚶'
    },
    {
      title: 'PERTARUNGAN (BATTLE)',
      content: 'Terdapat 2 fase: Fase Menjawab dan Fase Menghindar. Di fase menjawab, pilihlah aksi [FIGHT] untuk menjawab soal, [CEK] untuk melihat kelemahan, [ITEM] untuk heal, atau [MERCY] untuk obrolan santai.',
      icon: '⚔️'
    },
    {
      title: 'ARENA JIWA (MENGHINDAR)',
      content: 'Setelah menjawab (atau jika kamu salah jawab), guru akan menyerang! Kamu mengendalikan Hati (Soul). Gunakan WASD/Panah untuk menggerakan Hati dan hindari semua proyektil selama waktu belum habis!',
      icon: '♥️'
    },
    {
      title: 'TIPS PENTING!',
      content: 'Kamu bisa menggunakan shortcut angka [1], [2], [3], [4] di keyboard untuk memilih aksi atau jawaban lebih cepat. Jangan lupa perhatikan nyawamu (HP). Selamat berjuang meraih nilai kelulusan!',
      icon: '💡'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none">
      <div className="bg-zinc-900 border-4 border-yellow-500 rounded-xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
            TUTORIAL {step + 1}/{steps.length}
          </h2>
          <span className="text-4xl">{steps[step].icon}</span>
        </div>

        <h3 className="text-lg font-bold mb-3 border-b-2 border-zinc-700 pb-2 text-zinc-200">
          {steps[step].title}
        </h3>
        
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed min-h-[100px] mb-8">
          {steps[step].content}
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 bg-zinc-700 disabled:opacity-30 hover:bg-zinc-600 font-bold rounded transition-colors"
          >
            SEBELUMNYA
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded transition-colors"
          >
            {step === steps.length - 1 ? 'MULAI MAIN!' : 'LANJUT'}
          </button>
        </div>
      </div>
    </div>
  );
};
