const fs = require('fs');
let code = fs.readFileSync('src/components/CustomizerModal.tsx', 'utf8');

code = code.replace(
  `    drawPlayerSprite(ctx, 48, 24, form, 'down', 0, 4);`,
  `    drawPlayerSprite(ctx, 48, 32, form, 'down', 0, 4);`
);

fs.writeFileSync('src/components/CustomizerModal.tsx', code);
console.log('CustomizerModal patched');
