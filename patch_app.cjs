const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('scores: {}')) {
  code = code.replace('completedSubjects: [],', 'completedSubjects: [],\n  scores: {},');
}

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
