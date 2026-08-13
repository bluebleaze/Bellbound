const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const regex = /\/\/ Classroom Floor([\s\S]*?)\/\/ Door to Exit back to Hall/m;
const newCode = `// Classroom Floor
      // Gradient Wall (Cream/Warm White)
      const wallGrad = ctx.createLinearGradient(0, 0, 0, 130);
      wallGrad.addColorStop(0, '#f8fafc'); // top light
      wallGrad.addColorStop(1, '#cbd5e1'); // bottom shadow
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, canvas.width, 130);
      
      // Wall details (windows)
      ctx.fillStyle = '#bae6fd'; // sky blue glass
      ctx.fillRect(20, 20, 100, 60);
      ctx.fillRect(520, 20, 100, 60);
      ctx.strokeStyle = '#94a3b8'; // window frame
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 100, 60);
      ctx.strokeRect(520, 20, 100, 60);
      // Window panes
      ctx.beginPath(); ctx.moveTo(70, 20); ctx.lineTo(70, 80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(120, 50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(570, 20); ctx.lineTo(570, 80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(520, 50); ctx.lineTo(620, 50); ctx.stroke();

      // Baseboard trim
      drawPixelRect(ctx, 0, 125, canvas.width, 15, '#475569'); 
      drawPixelRect(ctx, 0, 125, canvas.width, 2, '#334155'); 

      // Modern Tiled Floor
      drawPixelRect(ctx, 0, 140, canvas.width, 220, '#f1f5f9'); 
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x - 40, canvas.height); ctx.stroke();
      }
      for (let y = 140; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Large Chalkboard in center wall
      const boardW = 340;
      const boardH = 90;
      const boardX = 150;
      const boardY = 15;
      
      // Wooden Frame
      drawPixelRect(ctx, boardX - 8, boardY - 8, boardW + 16, boardH + 16, '#78350f'); // Outer frame
      drawPixelRect(ctx, boardX - 4, boardY - 4, boardW + 8, boardH + 8, '#451a03'); // Inner shadow
      
      // Green Board Surface
      drawPixelRect(ctx, boardX, boardY, boardW, boardH, '#14532d'); 
      // Chalk dust smudges
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(boardX + 20, boardY + 20, 100, 30);
      ctx.fillRect(boardX + 200, boardY + 40, 80, 40);

      // Chalkboard text
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      // Small shadow for chalk text
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(\`[ \${foe.roomName} - \${foe.name} ]\`, 321, 46);
      ctx.fillStyle = '#fef08a';
      ctx.fillText(\`[ \${foe.roomName} - \${foe.name} ]\`, 320, 45);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(foe.q, 320, 75);

      // Chalk Tray
      drawPixelRect(ctx, boardX, boardY + boardH, boardW, 6, '#b45309');
      // Eraser & Chalk
      drawPixelRect(ctx, boardX + 40, boardY + boardH - 4, 12, 4, '#1e293b'); // eraser
      drawPixelRect(ctx, boardX + 60, boardY + boardH - 2, 4, 2, '#ffffff'); // chalk

      // Classroom Furniture (Desks: 3 columns x 5 rows)
      const startX = 140;
      const startY = 150;
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 4; row++) { // 4 rows fits better visually
          const dx = startX + (col * 130); 
          const dy = startY + (row * 45);
          drawDeskSprite(ctx, dx, dy, 70, 32);
        }
      }

      // `;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Classroom patched');
