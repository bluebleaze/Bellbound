const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

code = code.replace(
  `            if (Math.abs(newX - 480) < 50 && Math.abs(newY - 130) < 45) {`,
  `            if (Math.abs(newX - 520) < 60 && Math.abs(newY - 130) < 50) {`
);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Teacher collision patched');
