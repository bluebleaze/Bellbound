const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add GAME_SCHEDULE to imports if missing
if(!content.includes('GAME_SCHEDULE')) {
  content = content.replace("SubjectId, PlayerCustomization", "SubjectId, PlayerCustomization, GAME_SCHEDULE");
}

// 2. Add startActualBattle if missing
if(!content.includes('const startActualBattle = () => {')) {
  const replaceEnter = `
  const startActualBattle = () => {
    audioEngine.playHit();
    setGameState('battle_intro');
    
    setTimeout(() => {
      audioEngine.playBgm('battle');
      setGameState('battle');
    }, 1200);
  };
  
  // On Battle Start
  const handleEnterBattle = (subject: SubjectId) => {`;
  content = content.replace("  // On Battle Start\n  const handleEnterBattle = (subject: SubjectId) => {", replaceEnter);
}

// 3. Add states
if(!content.includes('const [isScheduleOpen, setIsScheduleOpen]')) {
  const stateReplace = `  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);`;
  content = content.replace("  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);\n  const [isNotesOpen, setIsNotesOpen] = useState(false);", stateReplace);
}

// 4. Import modals if missing
if(!content.includes('ScheduleModal')) {
  const importTarget = `import { VictoryModal } from './components/VictoryModal';`;
  const importReplace = `import { VictoryModal } from './components/VictoryModal';\nimport { ScheduleModal, CalendarModal } from './components/ScheduleModal';`;
  content = content.replace(importTarget, importReplace);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed App.tsx states');
