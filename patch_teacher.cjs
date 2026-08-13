const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const regex = /\/\/ Classroom Furniture \([\s\S]*?\/\/ Draw Player Sprite/m;
const newCode = `// Classroom Furniture (Desks: 3 columns x 4 rows)
      const startX = 165;
      const startY = 150;
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 4; row++) { 
          const dx = startX + (col * 120); 
          const dy = startY + (row * 45);
          drawDeskSprite(ctx, dx, dy, 70, 32);
        }
      }

      // Exit door
      drawDoorSprite(ctx, 20, 60, 'HALL SEKOLAH', completedSubjects.includes(currentRoom));

      // Draw Teacher Sprite (moved to right side so it doesn't overlap desks)
      drawTeacherSprite(ctx, 520, 95, currentRoom, 3);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(foe.label, 540, 85);

      // Teacher's Desk (drawn after teacher so it overlaps their legs)
      drawDeskSprite(ctx, 500, 120, 90, 35);
    }

    // Draw Player Sprite`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Teacher patched');
