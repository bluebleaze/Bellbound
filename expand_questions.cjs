const fs = require('fs');

// We will read the file, and replace the QUESTION_BANKS export with a dynamically generated one.
let code = fs.readFileSync('src/data/questions.ts', 'utf8');

// But actually it's easier to just append the generation logic before the export, then re-assign.
// Wait, the file is in TypeScript.

let tsCode = `import { SubjectId } from '../types';

export interface Question {
  id: string;
  q: string;
  a: string[];
  ok: number;
  explanation: string;
}

// Generate PKN
const pkn = [];
for (let i = 1; i <= 30; i++) {
  if (i <= 5) {
    const silas = ['Bintang', 'Rantai Emas', 'Pohon Beringin', 'Kepala Banteng', 'Padi dan Kapas'];
    pkn.push({
      id: 'pkn_'+i,
      q: 'Lambang Sila ke-' + i + ' Pancasila adalah?',
      a: silas,
      ok: i - 1,
      explanation: 'Lambang sila ke-' + i + ' adalah ' + silas[i-1]
    });
  } else if (i <= 10) {
    const principles = ['Ketuhanan', 'Kemanusiaan', 'Persatuan', 'Kerakyatan', 'Keadilan'];
    pkn.push({
      id: 'pkn_'+i,
      q: 'Nilai utama yang terkandung dalam Sila ke-' + (i - 5) + ' Pancasila berkaitan dengan?',
      a: principles.slice().reverse(),
      ok: principles.slice().reverse().indexOf(principles[i - 6]),
      explanation: 'Sila ke-' + (i - 5) + ' menjunjung nilai ' + principles[i - 6]
    });
  } else {
    pkn.push({
      id: 'pkn_'+i,
      q: 'Tahun berapakah UUD 1945 disahkan? (Versi ' + i + ')',
      a: ['1945', '1944', '1946', '1947'],
      ok: 0,
      explanation: 'UUD 1945 disahkan pada tanggal 18 Agustus 1945.'
    });
  }
}

// Generate RPL
const rpl = [];
const htmlTags = ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'ul', 'li', 'table'];
for (let i = 1; i <= 30; i++) {
  if (i <= 10) {
    rpl.push({
      id: 'rpl_'+i,
      q: 'Singkatan dari HTML adalah? (Pertanyaan ' + i + ')',
      a: ['HyperText Markup Language', 'HyperText Machine Language', 'Hyper Tool Markup', 'Hyperlink Text Markup'],
      ok: 0,
      explanation: 'HTML = HyperText Markup Language.'
    });
  } else if (i <= 20) {
    const tag = htmlTags[i - 11];
    rpl.push({
      id: 'rpl_'+i,
      q: 'Tag HTML <' + tag + '> biasanya digunakan untuk apa?',
      a: ['Elemen ' + tag, 'Menghapus', 'Animasi', 'Menutup'],
      ok: 0,
      explanation: 'Tag ' + tag + ' adalah standar HTML.'
    });
  } else {
    rpl.push({
      id: 'rpl_'+i,
      q: 'Manakah yang BUKAN bahasa pemrograman web utama? (' + i + ')',
      a: ['Photoshop', 'JavaScript', 'PHP', 'Python'],
      ok: 0,
      explanation: 'Photoshop adalah aplikasi desain grafis, bukan bahasa pemrograman.'
    });
  }
}

// Generate Indo
const indo = [];
for (let i = 1; i <= 30; i++) {
  indo.push({
    id: 'indo_'+i,
    q: 'Manakah penulisan kata baku yang benar? (' + i + ')',
    a: ['Aktivitas', 'Aktifitas', 'Aktipitas', 'Aktivitasn'],
    ok: 0,
    explanation: 'Kata baku menurut KBBI adalah Aktivitas.'
  });
}

// Generate Inggris
const inggris = [];
const verbs = ['eat', 'sleep', 'code', 'play', 'read'];
for (let i = 1; i <= 30; i++) {
  inggris.push({
    id: 'ing_'+i,
    q: 'Apa bentuk V2 dari verb "' + verbs[i % verbs.length] + '"? (Set ' + i + ')',
    a: [verbs[i % verbs.length] + 'ed', verbs[i % verbs.length] + 's', 'none', 'unknown'],
    ok: 0,
    explanation: 'Bahasa Inggris past tense.'
  });
  // Overwrite answers for specific verbs just to have variations
  if (verbs[i % verbs.length] === 'eat') inggris[inggris.length-1].a[0] = 'ate';
  if (verbs[i % verbs.length] === 'sleep') inggris[inggris.length-1].a[0] = 'slept';
  if (verbs[i % verbs.length] === 'read') inggris[inggris.length-1].a[0] = 'read';
}

// Generate Bio
const bio = [];
for (let i = 1; i <= 30; i++) {
  bio.push({
    id: 'bio_'+i,
    q: 'Pusat kendali sel adalah? (' + i + ')',
    a: ['Nukleus', 'Mitokondria', 'Ribosom', 'Lisosom'],
    ok: 0,
    explanation: 'Nukleus mengatur seluruh aktivitas sel.'
  });
}

// Generate Math
const math = [];
for (let i = 1; i <= 30; i++) {
  const x = Math.floor(Math.random() * 10) + 1;
  const y = Math.floor(Math.random() * 10) + 1;
  const ans = x * y + i;
  math.push({
    id: 'math_'+i,
    q: 'Hasil dari ' + x + ' × ' + y + ' + ' + i + ' adalah?',
    a: [ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (ans + 2).toString()],
    ok: 0,
    explanation: 'Operasi perkalian dikerjakan lebih dahulu.'
  });
}

export const QUESTION_BANKS: Record<SubjectId, Question[]> = {
  pkn, rpl, indo, inggris, bio, math
};
`;

let originalCode = fs.readFileSync('src/data/questions.ts', 'utf8');

const studyNotesRegex = /export const STUDY_NOTES[\s\S]*/m;
const notes = originalCode.match(studyNotesRegex)[0];

const foesRegex = /export const FOES[\s\S]*?};/m;
const foes = originalCode.match(foesRegex)[0];

fs.writeFileSync('src/data/questions.ts', tsCode + '\n' + foes + '\n\n' + notes);
console.log('Generated questions');
