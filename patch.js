const fs = require('fs');
const content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const startStr = "// Spawn Bullets (Nerfed: Further reduced by 1/3)";
const endStr = "// Move Bullets & Check Collision";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const prefix = content.slice(0, startIndex);
  const suffix = content.slice(endIndex);
  
  const replacement = `// Spawn Bullets (Patterned deterministic attacks)
            spawnCounter++;
            if (spawnCounter % 38 === 0 && bulletsRef.current.length < 8){
              const color = bulletColors[subject];
              const pIdx = Math.floor(spawnCounter / 38);
              const mode = pIdx % 3; // 3 alternating attack styles per subject

              if (subject === 'pkn') {
                if (mode === 0) {
                  // Red-and-White Flag Rectangles from sides (Ladder pattern)
                  const fromLeft = pIdx % 2 === 0;
                  const hRatio = ((pIdx % 4) + 1) / 5;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -15 : canvas.width + 15,
                    y: hRatio * canvas.height,
                    vx: fromLeft ? 1.4 : -1.4,
                    vy: Math.sin(pIdx) * 0.3,
                    color,
                    subject,
                    shape: 'rect',
                    size: 16,
                  });
                } else if (mode === 1) {
                  // Rain of NKRI / Garuda Flags from top (Sweeping wave)
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
                  });
                } else {
                  // Diagonal Cross Flags from top corners
                  const fromRightCorner = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromRightCorner ? canvas.width + 10 : -10,
                    y: -10,
                    vx: fromRightCorner ? -1.2 : 1.2,
                    vy: 1.2,
                    color,
                    subject,
                    shape: 'rect',
                    size: 16,
                  });
                }
              } else if (subject === 'rpl') {
                const tags = ['<div/>', '<code/>', '{...}', '</HTML>', 'fn()', 'SQL', 'npm', 'git'];
                if (mode === 0) {
                  // Rain of Code Tags
                  const xRatio = ((pIdx % 5) + 1) / 6;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xRatio * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx) * 0.4,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[pIdx % tags.length],
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Sine Wave Code Stream
                  const fromLeft = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -20 : canvas.width + 20,
                    y: canvas.height / 2 + Math.cos(pIdx) * 30,
                    vx: fromLeft ? 1.5 : -1.5,
                    vy: Math.sin(spawnCounter * 0.1) * 1.0,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[(pIdx + 1) % tags.length],
                    size: 14,
                  });
                } else {
                  // Corner Burst
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2,
                    y: -10,
                    vx: ((pIdx % 5) - 2) * 0.7,
                    vy: 1.3,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[(pIdx + 2) % tags.length],
                    size: 14,
                  });
                }
              } else if (subject === 'indo') {
                if (mode === 0) {
                  // Rain of SPOK Letters (V-shape)
                  const chars = ['S', 'P', 'O', 'K', 'A', 'B', 'C'];
                  const posSeq = [0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: posSeq[pIdx % posSeq.length] * canvas.width,
                    y: -15,
                    vx: 0,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: chars[pIdx % chars.length],
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Punctuation Marks
                  const marks = ['❓', '❗', '💬', '📖', '✍️'];
                  const fromLeft = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -15 : canvas.width + 15,
                    y: ((pIdx % 5) + 1) / 6 * canvas.height,
                    vx: fromLeft ? 1.3 : -1.3,
                    vy: Math.cos(pIdx) * 0.4,
                    color,
                    subject,
                    shape: 'text',
                    label: marks[pIdx % marks.length],
                    size: 14,
                  });
                } else {
                  // Literary Words
                  const words = ['PUISI', 'CERPEN', 'KATA', 'BAHASA'];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 3) + 1) / 4 * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx * 2) * 0.5,
                    vy: 1.3,
                    color,
                    subject,
                    shape: 'text',
                    label: words[pIdx % words.length],
                    size: 14,
                  });
                }
              } else if (subject === 'inggris') {
                const verbs = ['Verb', 'Study', 'Read', 'Speak', 'Grammar', 'Listen'];
                if (mode === 0) {
                  // Arrow Verbs Horizontal
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: -30,
                    y: ((pIdx % 4) + 1) / 5 * canvas.height,
                    vx: 1.5,
                    vy: Math.sin(pIdx) * 0.2,
                    color,
                    subject,
                    shape: 'text',
                    label: \`➜ \${verbs[pIdx % verbs.length]}\`,
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Reverse Arrow Verbs
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width + 30,
                    y: ((pIdx % 4) + 1) / 5 * canvas.height,
                    vx: -1.5,
                    vy: Math.cos(pIdx) * 0.2,
                    color,
                    subject,
                    shape: 'text',
                    label: \`\${verbs[(pIdx + 1) % verbs.length]} ↵\`,
                    size: 14,
                  });
                } else {
                  // Vocab Falling Drop
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 5) + 1) / 6 * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx) * 0.5,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: 'ABC',
                    size: 14,
                  });
                }
              } else if (subject === 'bio') {
                if (mode === 0) {
                  // Bouncing Green Cell Spheres (Zig zag)
                  const xPos = ((pIdx % 5) + 1) / 6 * canvas.width;
                  const fromTop = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xPos,
                    y: fromTop ? -10 : canvas.height + 10,
                    vx: Math.sin(pIdx * 1.5) * 1.2,
                    vy: fromTop ? 1.2 : -1.2,
                    color,
                    subject,
                    shape: 'circle',
                    size: 12,
                  });
                } else if (mode === 1) {
                  // DNA Dual Strand Wave
                  const angle = spawnCounter * 0.15;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2 + Math.sin(angle) * 60,
                    y: -10,
                    vx: 0,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'circle',
                    size: 10,
                  });
                } else {
                  // Cell Spores From Center Side
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: -10,
                    y: canvas.height / 2 + Math.sin(pIdx * 2) * 30,
                    vx: 1.4,
                    vy: Math.cos(pIdx * 2) * 0.8,
                    color,
                    subject,
                    shape: 'circle',
                    size: 12,
                  });
                }
              } else {
                // Math Subject
                if (mode === 0) {
                  // Targeted Triangles toward Soul position (Aimed)
                  const dx = soulPosRef.current.x - canvas.width / 2;
                  const dy = soulPosRef.current.y - canvas.height / 2;
                  const angle = Math.atan2(dy, dx) + Math.sin(pIdx) * 0.2; // slight waver
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2 + Math.cos(angle) * 130,
                    y: canvas.height / 2 + Math.sin(angle) * 70,
                    vx: -Math.cos(angle) * 1.3,
                    vy: -Math.sin(angle) * 1.3,
                    color,
                    subject,
                    shape: 'triangle',
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Operators Rain (+, -, ×, ÷)
                  const ops = ['+', '−', '×', '÷', 'π', '√'];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 6) + 1) / 7 * canvas.width,
                    y: -15,
                    vx: Math.cos(pIdx) * 0.4,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: ops[pIdx % ops.length],
                    size: 15,
                  });
                } else {
                  // Inward Ring Inflow (Pattern sequence angles)
                  const angle = (pIdx % 8) * (Math.PI / 4); // 45 degree steps
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: soulPosRef.current.x + Math.cos(angle) * 110,
                    y: soulPosRef.current.y + Math.sin(angle) * 110,
                    vx: -Math.cos(angle) * 1.2,
                    vy: -Math.sin(angle) * 1.2,
                    color,
                    subject,
                    shape: 'triangle',
                    size: 12,
                  });
                }
              }
            }

            `;
  
  fs.writeFileSync('src/components/BattleArena.tsx', prefix + replacement + suffix);
  console.log('Patched successfully');
} else {
  console.log('Failed to find markers');
}
