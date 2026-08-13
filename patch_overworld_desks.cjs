const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

// The student desks start at Y=150. Move them down to 160.
// Also move teacher and teacher desk down.
code = code.replace(
  `      const startY = 150;`,
  `      const startY = 165;`
);

// Exit door
code = code.replace(
  `drawDoorSprite(ctx, 20, 60, 'HALL SEKOLAH', completedSubjects.includes(currentRoom));`,
  `drawDoorSprite(ctx, 20, 50, 'HALL SEKOLAH', completedSubjects.includes(currentRoom));`
);

// Teacher and Teacher Desk:
// Teacher Y was 95 (bottom 167). Desk Y was 120 (bottom 155). 
// Let's place the Teacher BEHIND the desk properly.
// Desk at Y=130 (bottom 165). Teacher at Y=80 (bottom 152).
// Draw Teacher first, then Desk.

const oldTeacherCode = `      // Draw Teacher Sprite (moved to right side so it doesn't overlap desks)
      drawTeacherSprite(ctx, 520, 95, currentRoom, 3);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(foe.label, 540, 85);

      // Teacher's Desk (drawn after teacher so it overlaps their legs)
      drawDeskSprite(ctx, 500, 120, 90, 35);`;

const newTeacherCode = `      // Draw Teacher Sprite (standing behind the desk)
      drawTeacherSprite(ctx, 520, 80, currentRoom, 3);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(foe.label, 540, 70);

      // Teacher's Desk (drawn after teacher to cover their legs properly)
      drawDeskSprite(ctx, 500, 130, 90, 35);`;

code = code.replace(oldTeacherCode, newTeacherCode);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Overworld desks patched');
