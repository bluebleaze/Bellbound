import React, { useState } from 'react';
import { SubjectId } from '../types';
import { STUDY_NOTES, FOES } from '../data/questions';
import { X, Lock, CheckCircle2, BookOpen } from 'lucide-react';

interface StudyNotesModalProps {
  completedSubjects: SubjectId[];
  onClose: () => void;
}

export const StudyNotesModal: React.FC<StudyNotesModalProps> = ({ completedSubjects, onClose }) => {
  const subjects: SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(
    completedSubjects.length > 0 ? completedSubjects[0] : 'pkn'
  );

  const isUnlocked = completedSubjects.includes(selectedSubject);
  const currentNote = STUDY_NOTES[selectedSubject];
  const currentFoe = FOES[selectedSubject];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-zinc-950 border-4 border-white max-w-2xl w-full p-6 text-white shadow-2xl relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-yellow-400 mb-4 border-b-2 border-zinc-700 pb-2 flex items-center gap-2">
          <BookOpen size={22} /> CATATAN PELAJARAN SEKOLAH
        </h2>

        {/* Subject Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {subjects.map((sub) => {
            const foe = FOES[sub];
            const unlocked = completedSubjects.includes(sub);
            const active = selectedSubject === sub;

            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 border-2 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  active
                    ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                    : unlocked
                    ? 'border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-zinc-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                }`}
              >
                {unlocked ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <Lock size={14} className="text-zinc-600" />
                )}
                <span>{foe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Note Content */}
        <div className="bg-zinc-900 border-2 border-zinc-700 p-5 rounded flex-1 overflow-y-auto space-y-4">
          {isUnlocked ? (
            <>
              <div className="border-b border-zinc-700 pb-3">
                <span className="text-xs uppercase text-zinc-400 font-bold">{currentFoe.title}</span>
                <h3 className="text-lg font-bold text-yellow-300 mt-1">{currentNote.title}</h3>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">POIN MATERI UTAMA:</h4>
                <ul className="space-y-2 text-sm text-zinc-200">
                  {currentNote.summary.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950 p-3 border border-yellow-500/30 rounded mt-4">
                <span className="text-xs font-bold text-yellow-400 block mb-1">💡 TIPS BELAJAR GURU:</span>
                <p className="text-xs text-zinc-300 italic">{currentNote.tips}</p>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Lock size={48} className="mx-auto text-zinc-600" />
              <h3 className="text-base font-bold text-zinc-400">CATATAN TERKUNCI</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Kalahkan <span className="text-yellow-400 font-bold">{currentFoe.label} ({currentFoe.name})</span> di ruang {currentFoe.roomName} untuk membuka kumpulan catatan dan rangkuman pelajaran ini!
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-xs text-zinc-400">
          <span>Terbuka: {completedSubjects.length} dari {subjects.length} Pelajaran</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 text-white font-bold rounded"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
