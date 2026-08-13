const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const unlockedFnStr = `const isDoorUnlocked = (id: string) => {
    if (completedSubjects.length === 0) return id === 'pkn';
    if (id === 'math') return completedSubjects.length === 5;
    return true;
  };\n  `;

code = code.replace(
  'const [dialogueText, setDialogueText] = useState(\'\');',
  'const [dialogueText, setDialogueText] = useState(\'\');\n  ' + unlockedFnStr
);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Fixed isDoorUnlocked');
