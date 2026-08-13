const fs = require('fs');
let code = fs.readFileSync('src/components/VictoryModal.tsx', 'utf8');

// Add progress to props to calculate total score
code = code.replace(
  'totalCompleted: number;',
  'totalCompleted: number;\n  progress: import(\'../types\').GameProgress;'
);
code = code.replace(
  'totalCompleted,',
  'totalCompleted,\n  progress,'
);

// Calculate average
const importRegex = /const isFinalGameVictory = totalCompleted >= 6;/;
const newImport = `const isFinalGameVictory = totalCompleted >= 6;
  
  let totalAvg = 0;
  if (isFinalGameVictory) {
    let totalScoreSum = 0;
    let subjectsCount = 0;
    for (const sub of Object.values(progress.scores || {})) {
      totalScoreSum += (sub.correct / sub.total) * 100;
      subjectsCount++;
    }
    totalAvg = subjectsCount > 0 ? Math.round(totalScoreSum / subjectsCount) : 0;
  }`;

code = code.replace(importRegex, newImport);

const titleRegex = /\{isFinalGameVictory \? 'SELAMAT! KAMU JUARA SEKOLAH!' : \`LULUS PELAJARAN \$\{foe\.name\}\`\}/;
const newTitle = `{isFinalGameVictory ? (totalAvg >= 70 ? 'SELAMAT! KAMU LULUS SEKOLAH!' : 'TIDAK LULUS! NILAI DIBAWAH STANDAR') : \`LULUS PELAJARAN \${foe.name}\`}`;
code = code.replace(titleRegex, newTitle);

const descRegex = /\{isFinalGameVictory[\s\S]*?\`\$\{foe\.label\} tersenyum bangga: "Kamu telah menjawab seluruh pertanyaan dengan cerdas dan tangkas!"\`\}/;
const newDesc = `{isFinalGameVictory 
            ? (totalAvg >= 70 ? \`Kamu telah menguasai seluruh 6 mata pelajaran dengan nilai rata-rata \${totalAvg}. Kamu lulus dengan gemilang!\` : \`Nilai rata-rata rapot kamu hanya \${totalAvg} (Syarat kelulusan: 70). Kamu harus mengikuti program remedial dari awal!\`) 
            : \`\${foe.label} tersenyum bangga: "Kamu telah menyelesaikan pelajaran!"\`}`;
code = code.replace(descRegex, newDesc);

const btnRegex = /<span>\{isFinalGameVictory \? 'KEMBALI KE LORONG UTAMA' : 'LANJUTKAN KE LORONG SEKOLAH'\}<\/span>/;
const newBtn = `<span>{isFinalGameVictory ? (totalAvg >= 70 ? 'KEMBALI KE LORONG UTAMA' : 'MULAI REMEDIAL (RESTART)') : 'LANJUTKAN KE LORONG SEKOLAH'}</span>`;
code = code.replace(btnRegex, newBtn);

fs.writeFileSync('src/components/VictoryModal.tsx', code);
console.log('VictoryModal patched');
