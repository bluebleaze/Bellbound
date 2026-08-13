const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const regex = /\/\/ Tiled wall([\s\S]*?)\/\/ Title Banner on Wall/m;
const newCode = `// Gradient Wall (Cool Grey)
      const hallGrad = ctx.createLinearGradient(0, 0, 0, 140);
      hallGrad.addColorStop(0, '#e2e8f0'); 
      hallGrad.addColorStop(1, '#94a3b8'); 
      ctx.fillStyle = hallGrad;
      ctx.fillRect(0, 0, canvas.width, 140);

      // School Posters / Lockers
      // Lockers on the left
      for (let i = 0; i < 4; i++) {
        const lx = 20 + i * 25;
        drawPixelRect(ctx, lx, 60, 24, 75, '#64748b'); // Locker body
        drawPixelRect(ctx, lx + 2, 62, 20, 71, '#475569'); // Locker door
        drawPixelRect(ctx, lx + 16, 90, 4, 10, '#1e293b'); // Handle
      }
      
      // Posters
      drawPixelRect(ctx, 400, 30, 40, 50, '#fef08a'); // Yellow poster
      drawPixelRect(ctx, 450, 40, 35, 40, '#bae6fd'); // Blue poster
      drawPixelRect(ctx, 510, 20, 60, 30, '#fca5a5'); // Red banner
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(404, 34, 32, 5);
      ctx.fillRect(404, 44, 24, 5);
      ctx.fillRect(454, 44, 26, 4);

      drawPixelRect(ctx, 0, 135, canvas.width, 15, '#334155'); // Baseboard

      // Floor tiles (Shiny Hallway)
      drawPixelRect(ctx, 0, 150, canvas.width, 210, '#cbd5e1'); 
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x - 30, canvas.height); ctx.stroke();
      }
      for (let y = 150; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Title Banner on Wall`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Hall patched');
