const fs = require('fs');
let code = fs.readFileSync('src/components/HeaderHUD.tsx', 'utf8');

// Add onLogout prop
code = code.replace(
  'onResetGame: () => void;',
  'onResetGame: () => void;\n  onLogout: () => void;'
);
code = code.replace(
  'onResetGame,',
  'onResetGame,\n  onLogout,'
);

// Add Log Out button, remove schedule/calendar
code = code.replace(
  /\{onOpenSchedule && \([\s\S]*?\)\}/,
  ''
);
code = code.replace(
  /\{onOpenCalendar && \([\s\S]*?\)\}/,
  ''
);

// Import LogOut icon
code = code.replace(
  'RotateCcw, Calendar, Clock',
  'RotateCcw, LogOut'
);

// We need to inject the logout button on the far left.
// Right now it starts with:
// <header className="...">
//   {/* Player Stats */}
//   <div className="flex items-center gap-4 flex-wrap">
code = code.replace(
  '{/* Player Stats */}',
  `{/* Logout */}
      <button 
        onClick={onLogout}
        className="p-1.5 bg-red-950 border-2 border-red-500 hover:bg-red-900 text-red-400 font-bold rounded flex items-center gap-1"
      >
        <LogOut size={16} /> <span className="text-xs uppercase">Logout</span>
      </button>

      {/* Player Stats */}`
);

fs.writeFileSync('src/components/HeaderHUD.tsx', code);
console.log('Header patched');
