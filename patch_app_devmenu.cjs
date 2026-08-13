const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('DevMenuModal')) {
  // Add import
  code = code.replace(
    "import { HeaderHUD } from './components/HeaderHUD';",
    "import { HeaderHUD } from './components/HeaderHUD';\nimport { DevMenuModal } from './components/DevMenuModal';"
  );
  
  // Add state
  code = code.replace(
    "const [activeBattleSubject, setActiveBattleSubject] = useState<SubjectId | null>(null);",
    "const [activeBattleSubject, setActiveBattleSubject] = useState<SubjectId | null>(null);\n  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);"
  );
  
  // Add DevMenuModal component and hidden trigger
  const modalCode = `
      {isDevMenuOpen && (
        <DevMenuModal
          progress={progress}
          setProgress={setProgress}
          onClose={() => setIsDevMenuOpen(false)}
          onForceVictory={() => {
             if (activeBattleSubject) {
                handleBattleVictory(activeBattleSubject, { correct: 10, total: 10 });
             }
          }}
          activeBattleSubject={activeBattleSubject}
          gameState={gameState}
        />
      )}
      
      {/* Hidden Dev Trigger */}
      <div 
        className="fixed top-0 left-0 w-16 h-16 z-[9999] opacity-0 cursor-default"
        onClick={() => {
           const pwd = window.prompt("Dev Access Password:");
           if (pwd === "devmode") setIsDevMenuOpen(true);
        }}
      />
      
      </main>
      </div>`;
      
  code = code.replace("</main>\n      </div>", modalCode);
  
  fs.writeFileSync('src/App.tsx', code);
  console.log('App patched with DevMenu!');
} else {
  console.log('DevMenu already in App.tsx');
}
