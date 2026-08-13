const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Import Modals
const importTarget = `import { CustomizerModal } from './components/CustomizerModal';
import { StudyNotesModal } from './components/StudyNotesModal';
import { VictoryModal } from './components/VictoryModal';`;
const importReplace = `import { CustomizerModal } from './components/CustomizerModal';
import { StudyNotesModal } from './components/StudyNotesModal';
import { VictoryModal } from './components/VictoryModal';
import { ScheduleModal, CalendarModal } from './components/ScheduleModal';`;
content = content.replace(importTarget, importReplace);

// 2. Add State
const stateTarget = `  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);`;
const stateReplace = `  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);`;
content = content.replace(stateTarget, stateReplace);

// 3. Pass props to HeaderHUD
const headerTarget = `        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onResetGame={handleResetGame}
      />`;
const headerReplace = `        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onResetGame={handleResetGame}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
      />`;
content = content.replace(headerTarget, headerReplace);

// 4. Render Modals
const renderTarget = `      {isNotesOpen && (
        <StudyNotesModal
          completedSubjects={progress.completedSubjects}
          onClose={() => setIsNotesOpen(false)}
        />
      )}`;
const renderReplace = `      {isNotesOpen && (
        <StudyNotesModal
          completedSubjects={progress.completedSubjects}
          onClose={() => setIsNotesOpen(false)}
        />
      )}
      {isScheduleOpen && (
        <ScheduleModal
          currentLevel={progress.completedSubjects.length}
          onClose={() => setIsScheduleOpen(false)}
        />
      )}
      {isCalendarOpen && (
        <CalendarModal
          currentLevel={progress.completedSubjects.length}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}`;
content = content.replace(renderTarget, renderReplace);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx modals wired');
