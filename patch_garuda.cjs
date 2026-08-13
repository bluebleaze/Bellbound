const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

// Change mode 1 bullet shape for PKN
const oldMode1 = `                  // Rain of NKRI / Garuda Flags from top (Sweeping wave)
                  const xRatio = ((pIdx % 6) + 1) / 7;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xRatio * canvas.width,
                    y: -15,
                    vx: Math.cos(pIdx) * 0.5,
                    vy: 1.5,
                    color,
                    subject,
                    shape: 'rect',
                    size: 16,
                  });`;

const newMode1 = `                  // Rain of Garuda from top (Sweeping wave)
                  const xRatio = ((pIdx % 6) + 1) / 7;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xRatio * canvas.width,
                    y: -15,
                    vx: Math.cos(pIdx) * 0.5,
                    vy: 1.5,
                    color: '#fbbf24', // gold
                    subject,
                    shape: 'garuda',
                    size: 16,
                  });`;

code = code.replace(oldMode1, newMode1);

// Add drawing logic
const oldDraw = `              if (b.shape === 'rect') {
                // Indonesian Flag Bullet (Upper Red, Lower White)
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(b.x - 8, b.y - 5, 16, 5);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(b.x - 8, b.y, 16, 5);
                ctx.strokeStyle = '#7f1d1d';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x - 8, b.y - 5, 16, 10);
              } else if (b.shape === 'circle') {`;

const newDraw = `              if (b.shape === 'rect') {
                // Indonesian Flag Bullet (Upper Red, Lower White)
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(b.x - 8, b.y - 5, 16, 5);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(b.x - 8, b.y, 16, 5);
                ctx.strokeStyle = '#7f1d1d';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x - 8, b.y - 5, 16, 10);
              } else if (b.shape === 'garuda') {
                // Garuda Emoji Bullet
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🦅', b.x, b.y);
              } else if (b.shape === 'circle') {`;

code = code.replace(oldDraw, newDraw);

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Garuda patched');
