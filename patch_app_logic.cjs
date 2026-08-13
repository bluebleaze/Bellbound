const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { ScheduleModal, CalendarModal } from './components/ScheduleModal';",
  "import { ScheduleModal, CalendarModal } from './components/ScheduleModal';\nimport { GameSidebar } from './components/GameSidebar';"
);

// handleBattleVictory
const victoryRegex = /const handleBattleVictory = \(subject: SubjectId\) => \{[\s\S]*?actUsesRemaining: 3,\n    \}\)\);/m;
const newVictory = `const handleBattleVictory = (subject: SubjectId, score: { correct: number, total: number }) => {
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
    }));`;
code = code.replace(victoryRegex, newVictory);

// Render components
// HeaderHUD
code = code.replace(
  '<HeaderHUD',
  '<HeaderHUD\n          onLogout={handleResetGame}'
);
code = code.replace(
  'onOpenSchedule={() => setIsScheduleOpen(true)}',
  ''
);
code = code.replace(
  'onOpenCalendar={() => setIsCalendarOpen(true)}',
  ''
);

// GameSidebar
code = code.replace(
  '<main className="flex-1 overflow-hidden relative bg-[#0a0a0a]">',
  '<main className="flex-1 overflow-hidden relative bg-[#0a0a0a]">\n      {(gameState === \'walk\' || gameState === \'battle\') && <GameSidebar progress={progress} />}'
);

// VictoryModal remedial check
const vmRegex = /<VictoryModal[\s\S]*?\/>/m;
const newVm = `<VictoryModal
          progress={progress}
          completedSubject={victorySubject}
          totalCompleted={progress.completedSubjects.length}
          onContinue={() => {
            const isFinalGameVictory = progress.completedSubjects.length >= 6;
            let totalAvg = 0;
            if (isFinalGameVictory) {
              let sum = 0;
              for (const sub of Object.values(progress.scores || {})) {
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
        />`;
code = code.replace(vmRegex, newVm);

fs.writeFileSync('src/App.tsx', code);
console.log('App logic patched');
