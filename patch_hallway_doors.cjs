const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const doorCheckRegex = /\/\/ Check doors to classrooms[\s\S]*?Geometry Keeper check/m;
const newDoorCheck = `// Check doors to classrooms
            const SCHEDULE: import('../types').SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
            const currentLevel = completedSubjects.length;
            const currentSubject = SCHEDULE[Math.min(currentLevel, 5)];

            const doorLocs: { id: import('../types').SubjectId; x: number }[] = [
              { id: 'pkn', x: 20 },
              { id: 'rpl', x: 130 },
              { id: 'indo', x: 240 },
              { id: 'inggris', x: 350 },
              { id: 'bio', x: 460 },
              { id: 'math', x: 570 },
            ];

            doorLocs.forEach((d) => {
              // Only allow entry if it's the current subject
              if (Math.abs(newX - d.x) < 30 && newY < 170) {
                if (d.id === currentSubject) {
                  onChangeRoom(d.id);
                } else if (completedSubjects.includes(d.id)) {
                  setDialogueText('Kelas ini sudah selesai.');
                } else {
                  setDialogueText('Kelas ini terkunci. Cek jadwalmu!');
                }
              }
            });

            // Geometry Keeper check`;

code = code.replace(doorCheckRegex, newDoorCheck);

// Also remove the old Geometry Keeper check in hallway and update it since math teacher is now at 580
const geomRegex = /\/\/ Geometry Keeper check[\s\S]*?\} else \{/m;
const newGeom = `// Geometry Keeper check
            if (completedSubjects.length === 5 && Math.abs(newX - 580) < 40 && Math.abs(newY - 140) < 40) {
              setNearTeacher('math');
            } else {
              setNearTeacher(null);
            }
          } else {`;
code = code.replace(geomRegex, newGeom);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Hallway doors patched');
