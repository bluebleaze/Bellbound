const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('scores: Record<SubjectId, { correct: number; total: number }>;')) {
  code = code.replace('completedSubjects: SubjectId[];', 'completedSubjects: SubjectId[];\n  scores: Record<SubjectId, { correct: number; total: number }>;');
}

fs.writeFileSync('src/types.ts', code);
console.log('types.ts patched');
