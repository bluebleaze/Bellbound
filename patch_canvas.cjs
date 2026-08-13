const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

// Scale up the canvas visually so everything looks more pixelated/retro
const targetCanvasFrame = `{/* Arena Canvas Frame */}
        <div
          className={\`border-4 \${
            isHitFlashing ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'border-white'
          } relative shadow-inner\`}
        >
          <canvas
            ref={arenaCanvasRef}
            width={240}
            height={120}
            className="block pixelated bg-black"
          />
        </div>`;

const replacementCanvasFrame = `{/* Arena Canvas Frame */}
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
        
content = content.replace(targetCanvasFrame, replacementCanvasFrame);
fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log("Patched canvas size");
