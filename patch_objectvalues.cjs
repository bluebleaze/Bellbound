const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    'for (const sub of Object.values(progress.scores || {})) {',
    'for (const sub of Object.values(progress.scores || {}) as {correct: number, total: number}[]) {'
  );
  fs.writeFileSync(file, code);
}

patchFile('src/App.tsx');
patchFile('src/components/VictoryModal.tsx');
console.log('Object.values patched');
