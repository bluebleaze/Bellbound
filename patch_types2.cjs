const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'scores: Record<SubjectId, { correct: number; total: number }>;',
  'scores: Partial<Record<SubjectId, { correct: number; total: number }>>;'
);

fs.writeFileSync('src/types.ts', code);
console.log('types.ts patched');
