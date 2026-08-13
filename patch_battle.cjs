const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

// Add score callback to props
code = code.replace(
  'onVictory: (subject: SubjectId) => void;',
  'onVictory: (subject: SubjectId, score: { correct: number, total: number }) => void;'
);

// Add state for score tracking
code = code.replace(
  /const \[qIndex, setQIndex\] = useState\(0\);/,
  `const [qIndex, setQIndex] = useState(0);\n  const [correctAnswers, setCorrectAnswers] = useState(0);\n  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);`
);

// Change initial dialogue
code = code.replace(
  /const \[dialogue, setDialogue\] = useState\(\`\$\{foe.name\} menghadangmu! \$\{foe.attack\}\`\);/,
  `const [dialogue, setDialogue] = useState(\`Selamat datang di \${foe.name}. Saatnya kerjakan ujian berikut!\`);`
);

// Update handleAnswer to track score
const handleAnswerRegex = /const handleAnswer = \(answerIdx: number\) => \{[\s\S]*?\} else \{/m;
const newHandleAnswer = `const handleAnswer = (answerIdx: number) => {
    setShowQuestions(false);
    const currentQ = questions[qIndex % questions.length];
    
    setTotalQuestionsAnswered(prev => prev + 1);

    if (answerIdx === currentQ.ok) {
      // Correct!
      setCorrectAnswers(prev => prev + 1);
      audioEngine.playCorrect();
      const nextFoeHp = foeHp - 1;
      setFoeHp(nextFoeHp);

      if (nextFoeHp <= 0) {
        audioEngine.playVictory();
        setDialogue(\`LULUS! \${foe.label} tersenyum bangga dan memberikan sertifikat kelulusan pelajaran!\`);
        setTimeout(() => onVictory(subject, { correct: correctAnswers + 1, total: totalQuestionsAnswered + 1 }), 1200);
      } else {
        setQIndex((prev) => prev + 1);
        setDialogue(\`BENAR! \${currentQ.explanation || 'Jawabanmu tepat!'}\`);
      }
    } else {`;
code = code.replace(handleAnswerRegex, newHandleAnswer);

// Add POV Hands in the Arena when Answering Questions
// The user wants it during "pengerjaan soal" (showQuestions == true)
// Wait, the prompt says "ketika pengerjaan soal, buatkan ilustrasi buku dan tangan yang memegang pensil, seolah pov dari user ingame karakter"
// We can add an absolute positioned div at the bottom of the dodge arena.
const arenaCanvasFrameRegex = /\{\/\* Arena Canvas Frame \*\/\}/;
const newArenaCanvasFrame = `{/* POV Book and Pencil (only visible during showQuestions or dodge) */}
        {showQuestions && (
          <div className="absolute bottom-0 right-4 md:right-12 z-20 pointer-events-none opacity-90 transition-opacity">
            {/* Simple CSS Illustration of a hand holding a pencil over a notebook */}
            <div className="relative w-48 h-32">
              <div className="absolute bottom-[-20px] left-[-20px] w-56 h-40 bg-zinc-200 border-2 border-zinc-400 rounded-sm transform rotate-[-5deg] shadow-lg">
                <div className="w-full h-full border-l-4 border-red-400 pl-4 space-y-3 pt-4">
                  <div className="w-3/4 h-0.5 bg-blue-300"></div>
                  <div className="w-5/6 h-0.5 bg-blue-300"></div>
                  <div className="w-4/5 h-0.5 bg-blue-300"></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-40 bg-[#e0ac69] rounded-full transform rotate-[-30deg] origin-bottom shadow-[inset_-4px_0_0_rgba(0,0,0,0.1)]"></div>
              <div className="absolute bottom-16 right-8 w-4 h-24 bg-yellow-400 rounded-sm transform rotate-[60deg] border-2 border-yellow-600">
                <div className="absolute top-[-8px] left-[-2px] w-4 h-3 bg-zinc-300 border-2 border-zinc-500 rounded-t-sm"></div>
                <div className="absolute bottom-[-10px] left-0 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#d4a373]"></div>
                <div className="absolute bottom-[-14px] left-[2px] w-1 h-2 bg-zinc-800"></div>
              </div>
            </div>
          </div>
        )}

        {/* Arena Canvas Frame */}`;
code = code.replace(arenaCanvasFrameRegex, newArenaCanvasFrame);

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Battle patched');
