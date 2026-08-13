const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

code = code.replace(
  `  onStart: () => void;`,
  `  onStart: (form: PlayerCustomization) => void;`
);

code = code.replace(
  `            onClick={() => { onSave(form); onStart(); }}`,
  `            onClick={() => { onSave(form); onStart(form); }}`
);

fs.writeFileSync('src/components/LoginScreen.tsx', code);
console.log('LoginScreen patched again');
