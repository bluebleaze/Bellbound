const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const targetCanvasSoul = `          // DRAW SOUL HEART
          ctx.save();
          const isFlashing = Date.now() < hitFlashUntilRef.current;
          ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('♥', soulPosRef.current.x, soulPosRef.current.y);

          ctx.restore();`;

const replacementCanvasSoul = `          // DRAW SOUL HEART (PIXEL ART)
          ctx.save();
          const isFlashing = Date.now() < hitFlashUntilRef.current;
          ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
          
          const pxSize = 1; // 1 pixel scale (makes it 16x13)
          const heartW = 16 * pxSize;
          const heartH = 13 * pxSize;
          const px = soulPosRef.current.x - heartW / 2;
          const py = soulPosRef.current.y - heartH / 2;
          
          const heartMap = [
            [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
          ];
          
          for (let row = 0; row < heartMap.length; row++) {
            for (let col = 0; col < heartMap[row].length; col++) {
              if (heartMap[row][col] === 1) {
                ctx.fillRect(px + col * pxSize, py + row * pxSize, pxSize, pxSize);
              }
            }
          }

          ctx.restore();`;

content = content.replace(targetCanvasSoul, replacementCanvasSoul);
fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched canvas heart to accurate UT pixel heart');
