const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

// 1. Revert pxSize and rendering
const targetScale = `          const pxSize = 1.5; // 1.5 pixel scale (makes it 24x19.5)`;
const replaceScale = `          const pxSize = 1; // 1 pixel scale (makes it 16x13)`;
content = content.replace(targetScale, replaceScale);

const targetRender = `                ctx.fillRect(Math.floor(px + col * pxSize), Math.floor(py + row * pxSize), Math.ceil(pxSize), Math.ceil(pxSize));`;
const replaceRender = `                ctx.fillRect(px + col * pxSize, py + row * pxSize, pxSize, pxSize);`;
content = content.replace(targetRender, replaceRender);

// 2. Revert Canvas size
const targetCanvasFrame = `{/* Arena Canvas Frame */}
        <div
          className={\`border-4 \${
            isHitFlashing ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'border-white'
          } relative shadow-inner w-full max-w-[480px] mx-auto\`}
        >
          <canvas
            ref={arenaCanvasRef}
            width={240}
            height={120}
            className="block w-full h-auto bg-black"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>`;

const replaceCanvasFrame = `{/* Arena Canvas Frame */}
        <div
          className={\`border-4 \${
            isHitFlashing ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'border-white'
          } relative shadow-inner\`}
        >
          <canvas
            ref={arenaCanvasRef}
            width={240}
            height={120}
            className="block bg-black"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>`;
content = content.replace(targetCanvasFrame, replaceCanvasFrame);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Reverted to original sizes');
