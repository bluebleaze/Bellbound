const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const targetScale = `          const pxSize = 1; // 1 pixel scale (makes it 16x13)`;
const replaceScale = `          const pxSize = 1.5; // 1.5 pixel scale (makes it 24x19.5)`;

content = content.replace(targetScale, replaceScale);

const targetRender = `                ctx.fillRect(px + col * pxSize, py + row * pxSize, pxSize, pxSize);`;
const replaceRender = `                ctx.fillRect(Math.floor(px + col * pxSize), Math.floor(py + row * pxSize), Math.ceil(pxSize), Math.ceil(pxSize));`;

content = content.replace(targetRender, replaceRender);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log("Patched pxSize");
