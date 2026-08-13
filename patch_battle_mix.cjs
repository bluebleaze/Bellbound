const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

// 1. In the `questions` generation state, we need to add `qType` ('pg' or 'essay')
const genQuestionsRegex = /const \[questions\] = useState\(\(\) => \{[\s\S]*?return arr;\n  \}\);/m;

const newGenQuestions = `const [questions] = useState(() => {
    let base = [...QUESTION_BANKS[subject]];
    let required = progress.difficulty === 'extreme' ? 30 : progress.difficulty === 'hard' ? 20 : 10;
    
    // Shuffle base
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    
    let arr = base.slice(0, required);
    
    // Assign types
    let numEssay = 0;
    if (progress.difficulty === 'extreme') numEssay = Math.floor(required * 0.5); // 50%
    if (progress.difficulty === 'hard') numEssay = Math.floor(required * 0.3); // 30%
    
    arr = arr.map((q, idx) => ({
      ...q,
      qType: idx >= required - numEssay ? 'essay' : 'pg'
    }));
    
    // Shuffle again so essay and pg are mixed
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
  });`;

code = code.replace(genQuestionsRegex, newGenQuestions);

// 2. In the UI, use `currentQ.qType === 'essay'` instead of `progress.difficulty !== 'normal'`
code = code.replace(
  /\{progress\.difficulty !== 'normal' \? \(/,
  `{currentQ.qType === 'essay' ? (`
);

// 3. Add question counter `Soal x / total`
// Let's find where the question text is rendered.
/*
            <span className="text-zinc-300 font-bold text-sm mb-4 leading-relaxed pr-10">
              {currentQ.q}
            </span>
*/
const qTextRegex = /<span className="text-zinc-300 font-bold text-sm mb-4 leading-relaxed pr-10">/;
const qTextReplace = `<span className="text-yellow-400 font-bold text-xs mb-1">SOAL {qIndex % questions.length + 1} / {questions.length} - {currentQ.qType === 'essay' ? 'ESAI' : 'PILIHAN GANDA'}</span>
            <span className="text-zinc-300 font-bold text-sm mb-4 leading-relaxed pr-10">`;

code = code.replace(qTextRegex, qTextReplace);

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Battle mix patched');
