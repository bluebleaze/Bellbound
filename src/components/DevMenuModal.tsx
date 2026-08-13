import React, { useState } from 'react';
import { GameProgress, SubjectId } from '../types';

interface DevMenuModalProps {
  progress: GameProgress;
  setProgress: React.Dispatch<React.SetStateAction<GameProgress>>;
  onClose: () => void;
  onForceVictory: () => void;
  activeBattleSubject: SubjectId | null;
  gameState: string;
}

export const DevMenuModal: React.FC<DevMenuModalProps> = ({ progress, setProgress, onClose, onForceVictory, activeBattleSubject, gameState }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border-4 border-purple-500 rounded p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-purple-400 border-b-2 border-purple-800 pb-2">🛠️ DEV MENU</h2>
        
        <div className="space-y-2">
          {gameState === 'battle' && activeBattleSubject && (
            <button
              onClick={() => {
                onForceVictory();
                onClose();
              }}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
            >
              Skip Battle (Insta-Win)
            </button>
          )}

          <button
            onClick={() => {
              setProgress(p => ({ ...p, hp: 999, maxHp: 999 }));
            }}
            className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded"
          >
            God Mode (999 HP)
          </button>
          
          <button
            onClick={() => {
              setProgress(p => ({ ...p, completedSubjects: ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'] }));
            }}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded"
          >
            Unlock All Subjects
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded mt-4"
        >
          Close Dev Menu
        </button>
      </div>
    </div>
  );
};
