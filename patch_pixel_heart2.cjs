const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const target = `          // DRAW SOUL HEART
          ctx.save();
          const isFlashing = Date.now() < hitFlashUntilRef.current;
          ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('♥', soulPosRef.current.x, soulPosRef.current.y);
          ctx.restore();`;

const replacement = `          // DRAW PIXEL SOUL HEART
          ctx.save();
          const isFlashing = Date.now() < hitFlashUntilRef.current;
          ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
          
          const size = 1.5; // pixel scale
          const px = soulPosRef.current.x - (8 * size) / 2;
          const py = soulPosRef.current.y - (8 * size) / 2;
          
          const heartMap = [
            [0,1,1,0,0,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,0,0,0,0,0]
          ];
          
          for (let row = 0; row < heartMap.length; row++) {
            for (let col = 0; col < heartMap[row].length; col++) {
              if (heartMap[row][col] === 1) {
                ctx.fillRect(px + col * size, py + row * size, size, size);
              }
            }
          }
          ctx.restore();`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched canvas heart to pixel heart');
