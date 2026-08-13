const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

// Replace Hallway drawing
const hallRegex = /\/\/ LORONG BACKGROUND[\s\S]*?\} else \{/m;
const newHall = `// LORONG BACKGROUND
      // Floors
      ctx.fillStyle = '#1c1917'; // dark stone floor
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#292524';
      for(let i=0; i<canvas.width; i+=40) {
        for(let j=0; j<canvas.height; j+=40) {
          if((i+j)%80 === 0) ctx.fillRect(i, j, 40, 40);
        }
      }

      // Walls
      ctx.fillStyle = '#e7e5e4';
      ctx.fillRect(0, 0, canvas.width, 100);
      
      // Baseboard
      ctx.fillStyle = '#78716c';
      ctx.fillRect(0, 100, canvas.width, 10);

      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LORONG SEKOLAH MENENGAH', 320, 20);

      const doorsList: { id: import('../types').SubjectId; x: number; label: string }[] = [
        { id: 'pkn', x: 20, label: 'KELAS PKN' },
        { id: 'rpl', x: 130, label: 'LAB RPL' },
        { id: 'indo', x: 240, label: 'PERPUS' },
        { id: 'inggris', x: 350, label: 'ENG LAB' },
        { id: 'bio', x: 460, label: 'LAB BIO' },
        { id: 'math', x: 570, label: 'UJIAN' },
      ];

      // Draw Windows & Lockers between doors
      for(let x = 80; x < 600; x += 110) {
        // Locker
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, 40, 30, 60);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x+2, 42, 26, 56);
        // Window
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 40, 30, 40, 40);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(x + 42, 32, 17, 36);
        ctx.fillRect(x + 61, 32, 17, 36);
      }

      // Draw Plants
      ctx.fillStyle = '#166534';
      ctx.fillRect(10, 80, 15, 20);
      ctx.fillStyle = '#15803d';
      ctx.beginPath(); ctx.arc(17, 75, 12, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = '#166534';
      ctx.fillRect(615, 80, 15, 20);
      ctx.fillStyle = '#15803d';
      ctx.beginPath(); ctx.arc(622, 75, 12, 0, Math.PI*2); ctx.fill();

      // Draw doors
      const currentLevel = completedSubjects.length;
      const SCHEDULE = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
      const currentSubject = SCHEDULE[Math.min(currentLevel, 5)];

      doorsList.forEach((d) => {
        const isDone = completedSubjects.includes(d.id);
        const isCurrent = d.id === currentSubject;
        let label = d.label;
        if (isDone) label += ' ✓';
        if (!isDone && !isCurrent) label = 'TERKUNCI';
        
        drawDoorSprite(ctx, d.x, 80, label, isDone || (!isDone && !isCurrent));
        
        if (isCurrent && !isDone) {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText('↓', d.x + 25, 60);
        }
      });

      // If 5 subjects cleared, Geometry Keeper appears in front of Math door
      if (currentLevel === 5) {
        drawTeacherSprite(ctx, 580, 130, 'math', 3);
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GEOMETRY KEEPER', 595, 115);
      }
    } else {`;

code = code.replace(hallRegex, newHall);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Hallway visuals patched');
