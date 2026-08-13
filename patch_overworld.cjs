const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

// 1. Add lastWalkFrameTime ref
code = code.replace(
  `  const keysPressed = useRef<Record<string, boolean>>({});`,
  `  const keysPressed = useRef<Record<string, boolean>>({});
  const lastWalkTime = useRef(Date.now());`
);

// 2. Change how setWalkFrame is called to enforce 2 FPS (500ms per frame)
code = code.replace(
  `      if (dx !== 0 || dy !== 0) {
        audioEngine.playStep();
        setWalkFrame((f) => f + 1);

        setPlayerPos((prev) => {`,
  `      if (dx !== 0 || dy !== 0) {
        const now = Date.now();
        if (now - lastWalkTime.current > 500) {
           audioEngine.playStep();
           setWalkFrame((f) => f + 1);
           lastWalkTime.current = now;
        }

        setPlayerPos((prev) => {`
);

// 3. Improve Classroom UI (3 rows x 5 columns desks, modern colors)
const oldClassroomRender = `      drawPixelRect(ctx, 0, 0, canvas.width, 130, '#132e22'); // Green wall
      drawPixelRect(ctx, 0, 130, canvas.width, 10, '#3a210e'); // Wooden floor trim
      drawPixelRect(ctx, 0, 140, canvas.width, 220, '#53341c'); // Wooden floor

      // Floor plank lines
      for (let y = 140; y < canvas.height; y += 25) {
        ctx.strokeStyle = '#3e2411';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Large Chalkboard in center wall
      drawPixelRect(ctx, 160, 20, 320, 90, '#143b2d'); // Board
      ctx.strokeStyle = '#80552e';
      ctx.lineWidth = 6;
      ctx.strokeRect(160, 20, 320, 90);

      // Chalkboard text
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(\`[ \${foe.roomName} - \${foe.name} ]\`, 320, 48);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(foe.q, 320, 75);

      // Classroom Furniture (Desks)
      drawDeskSprite(ctx, 60, 180, 90, 40);
      drawDeskSprite(ctx, 270, 240, 100, 40);
      drawDeskSprite(ctx, 480, 190, 90, 40);`;

const newClassroomRender = `      // Modernized Classroom Rendering
      // Sleek Grey/Blue Wall
      drawPixelRect(ctx, 0, 0, canvas.width, 120, '#1e293b'); 
      drawPixelRect(ctx, 0, 120, canvas.width, 10, '#0f172a'); // Baseboard trim
      
      // Modern Tiled Floor
      drawPixelRect(ctx, 0, 130, canvas.width, 230, '#e2e8f0'); 
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 130; y < canvas.height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Smart/Glass Board in center wall
      drawPixelRect(ctx, 140, 15, 360, 95, '#0f172a'); // Dark glass board
      ctx.strokeStyle = '#38bdf8'; // Glowing neon blue border
      ctx.lineWidth = 3;
      ctx.strokeRect(140, 15, 360, 95);

      // Board text
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(\`[ \${foe.roomName} - \${foe.name} ]\`, 320, 45);
      
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px monospace';
      ctx.fillText(foe.q, 320, 75);

      // Classroom Furniture (Desks: 3 columns x 5 rows)
      // Wait, 3 row depan dan 5 row kebelakang means 3 columns (horizontal) and 5 rows (vertical)
      // or 3 horizontal lines and 5 depth lines. 
      const startX = 140;
      const startY = 140;
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 5; row++) {
          const dx = startX + (col * 140); // Spacing horizontally
          const dy = startY + (row * 40);  // Spacing vertically
          drawDeskSprite(ctx, dx, dy, 70, 32);
        }
      }`;

code = code.replace(oldClassroomRender, newClassroomRender);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Overworld patched');
