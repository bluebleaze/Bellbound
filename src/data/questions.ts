import { SubjectId, TeacherFoe } from '../types';

export interface Question {
  id: string;
  q: string;
  a: string[];
  ok: number;
  explanation: string;
}

// Generate PKN
const pkn = [];
for (let i = 1; i <= 10; i++) {
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
  }
}

const pknExtra = [
  { q: 'BPUPKI dibentuk pada tanggal?', a: ['1 Maret 1945', '1 Juni 1945', '17 Agustus 1945', '18 Agustus 1945'], ok: 0, expl: 'BPUPKI diumumkan pembentukannya pada 1 Maret 1945.' },
  { q: 'Siapa ketua BPUPKI?', a: ['Dr. Radjiman Wedyodiningrat', 'Ir. Soekarno', 'Moh. Hatta', 'Soepomo'], ok: 0, expl: 'Dr. K.R.T. Radjiman Wedyodiningrat adalah ketua BPUPKI.' },
  { q: 'Siapa ketua PPKI?', a: ['Ir. Soekarno', 'Moh. Hatta', 'Dr. Radjiman', 'Ahmad Subardjo'], ok: 0, expl: 'Ir. Soekarno mengetuai Panitia Persiapan Kemerdekaan Indonesia.' },
  { q: 'Pancasila disahkan sebagai dasar negara pada tanggal?', a: ['18 Agustus 1945', '17 Agustus 1945', '1 Juni 1945', '22 Juni 1945'], ok: 0, expl: 'Pancasila disahkan bersamaan dengan UUD 1945 pada sidang PPKI 18 Agustus 1945.' },
  { q: 'Naskah proklamasi yang otentik diketik oleh?', a: ['Sayuti Melik', 'Sukarni', 'BM Diah', 'Latief Hendraningrat'], ok: 0, expl: 'Sayuti Melik adalah tokoh yang mengetik naskah proklamasi kemerdekaan.' },
  { q: 'Lagu kebangsaan Indonesia Raya diciptakan oleh?', a: ['W.R. Supratman', 'Ismail Marzuki', 'Ibu Sud', 'Kusbini'], ok: 0, expl: 'W.R. Supratman menciptakan lagu Indonesia Raya.' },
  { q: 'Semboyan Bhinneka Tunggal Ika diambil dari kitab?', a: ['Sutasoma', 'Negarakertagama', 'Pararaton', 'Ramayana'], ok: 0, expl: 'Semboyan ini berasal dari Kakawin Sutasoma.' },
  { q: 'Kitab Sutasoma dikarang oleh?', a: ['Mpu Tantular', 'Mpu Prapanca', 'Mpu Sedah', 'Mpu Panuluh'], ok: 0, expl: 'Mpu Tantular adalah pengarang Kakawin Sutasoma di era Majapahit.' },
  { q: 'Berapa jumlah bulu pada leher burung Garuda?', a: ['45', '17', '8', '19'], ok: 0, expl: 'Melambangkan tahun 1945.' },
  { q: 'Berapa jumlah bulu pada masing-masing sayap burung Garuda?', a: ['17', '8', '19', '45'], ok: 0, expl: 'Melambangkan tanggal 17.' },
  { q: 'Berapa jumlah bulu pada ekor burung Garuda?', a: ['8', '17', '19', '45'], ok: 0, expl: 'Melambangkan bulan ke-8 (Agustus).' },
  { q: 'Berapa jumlah bulu di bawah perisai/pangkal ekor Garuda?', a: ['19', '8', '17', '45'], ok: 0, expl: 'Melambangkan tahun 1945 (dua digit pertama).' },
  { q: 'UUD 1945 terdiri atas Pembukaan dan?', a: ['Batang Tubuh', 'Penjelasan', 'Pasal Tambahan', 'Aturan Peralihan'], ok: 0, expl: 'Setelah amandemen, UUD 1945 terdiri atas Pembukaan dan Pasal-pasal (Batang Tubuh).' },
  { q: 'Lembaga yang berwenang menguji undang-undang terhadap UUD adalah?', a: ['Mahkamah Konstitusi', 'Mahkamah Agung', 'Komisi Yudisial', 'DPR'], ok: 0, expl: 'MK berwenang melakukan uji materi (judicial review) UU terhadap UUD.' },
  { q: 'Kekuasaan legislatif di tingkat nasional dipegang oleh?', a: ['DPR', 'Presiden', 'MA', 'BPK'], ok: 0, expl: 'DPR memegang kekuasaan membentuk undang-undang.' },
  { q: 'Pemilu pertama di Indonesia diselenggarakan pada tahun?', a: ['1955', '1971', '1999', '1945'], ok: 0, expl: 'Pemilu 1955 merupakan pemilu pertama di Indonesia.' },
  { q: 'Bapak Proklamator Indonesia adalah?', a: ['Soekarno dan Hatta', 'Soekarno dan Soepomo', 'Hatta dan Sjahrir', 'Soekarno dan Sjahrir'], ok: 0, expl: 'Ir. Soekarno dan Drs. Moh. Hatta adalah dwitunggal Proklamator RI.' },
  { q: 'Siapa penjahit bendera Pusaka Merah Putih?', a: ['Ibu Fatmawati', 'Ibu Inggit', 'Ibu Kartini', 'Ibu Dewi Sartika'], ok: 0, expl: 'Ibu Fatmawati menjahit bendera merah putih yang dikibarkan saat proklamasi.' },
  { q: 'Hari Lahir Pancasila diperingati setiap tanggal?', a: ['1 Juni', '1 Oktober', '18 Agustus', '22 Juni'], ok: 0, expl: '1 Juni 1945 adalah hari ketika pidato Soekarno tentang dasar negara disampaikan.' },
  { q: 'Hari Kesaktian Pancasila diperingati setiap tanggal?', a: ['1 Oktober', '1 Juni', '10 November', '17 Agustus'], ok: 0, expl: 'Peringatan ini dilakukan pasca peristiwa G30S/PKI.' }
];

pknExtra.forEach((item, idx) => {
  pkn.push({
    id: 'pkn_ext_' + idx,
    q: item.q,
    a: item.a,
    ok: item.ok,
    explanation: item.expl
  });
});

// Generate RPL
const rpl: Question[] = [
  { id: 'rpl_1', q: 'Singkatan dari HTML adalah?', a: ['HyperText Markup Language', 'HyperText Machine Language', 'Hyper Tool Markup', 'Hyperlink Text Markup'], ok: 0, explanation: 'HTML adalah kependekan dari HyperText Markup Language.' },
  { id: 'rpl_2', q: 'Tag HTML untuk membuat paragraf adalah?', a: ['<p>', '<div>', '<h1>', '<span>'], ok: 0, explanation: 'Tag <p> digunakan untuk mendefinisikan sebuah paragraf.' },
  { id: 'rpl_3', q: 'Tag HTML <a> biasanya digunakan untuk membuat?', a: ['Tautan (Hyperlink)', 'Tabel', 'Gambar', 'Daftar'], ok: 0, explanation: 'Tag <a> digunakan untuk membuat tautan atau hyperlink ke halaman lain.' },
  { id: 'rpl_4', q: 'Manakah yang BUKAN bahasa pemrograman web utama?', a: ['Photoshop', 'JavaScript', 'PHP', 'Python'], ok: 0, explanation: 'Photoshop adalah aplikasi desain grafis, bukan bahasa pemrograman.' },
  { id: 'rpl_5', q: 'Tag HTML <img> digunakan untuk?', a: ['Menampilkan gambar', 'Membuat tabel', 'Membuat form', 'Menambahkan audio'], ok: 0, explanation: 'Tag <img> digunakan untuk menyisipkan gambar pada halaman web.' },
  { id: 'rpl_6', q: 'CSS merupakan singkatan dari?', a: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], ok: 0, explanation: 'CSS singkatan dari Cascading Style Sheets yang digunakan untuk mengatur tampilan web.' },
  { id: 'rpl_7', q: 'Tag HTML <ul> digunakan untuk membuat?', a: ['Daftar tidak berurutan', 'Daftar berurutan', 'Tabel data', 'Form input'], ok: 0, explanation: 'Tag <ul> digunakan untuk membuat daftar yang tidak berurutan (unordered list).' },
  { id: 'rpl_8', q: 'Tag HTML <li> digunakan sebagai?', a: ['Item dalam daftar', 'Judul halaman', 'Garis bawah teks', 'Tautan gambar'], ok: 0, explanation: 'Tag <li> (List Item) digunakan di dalam tag <ul> atau <ol> untuk mendefinisikan item daftar.' },
  { id: 'rpl_9', q: 'Untuk membuat judul utama dengan ukuran paling besar, kita menggunakan tag?', a: ['<h1>', '<title>', '<header>', '<h6>'], ok: 0, explanation: 'Tag <h1> adalah tag heading dengan ukuran paling besar di HTML.' },
  { id: 'rpl_10', q: 'Sintaks untuk menampilkan teks tebal (bold) pada HTML adalah?', a: ['<b> atau <strong>', '<i> atau <em>', '<br>', '<hr>'], ok: 0, explanation: 'Tag <b> atau <strong> digunakan untuk menebalkan teks.' }
];

// Generate Indo
const indo: Question[] = [
  { id: 'indo_1', q: 'Manakah penulisan kata baku yang benar?', a: ['Aktivitas', 'Aktifitas', 'Aktipitas', 'Aktivitasn'], ok: 0, explanation: 'Kata baku yang tepat menurut KBBI adalah "aktivitas".' },
  { id: 'indo_2', q: 'Manakah penulisan kata baku yang benar?', a: ['Apotek', 'Apotik', 'Apoteek', 'Apoteker'], ok: 0, explanation: 'Kata baku yang tepat adalah "apotek", bukan apotik.' },
  { id: 'indo_3', q: 'Manakah penulisan kata baku yang benar?', a: ['Risiko', 'Resiko', 'Risko', 'Riziko'], ok: 0, explanation: 'Kata baku yang tepat menurut KBBI adalah "risiko".' },
  { id: 'indo_4', q: 'Manakah penulisan kata baku yang benar?', a: ['Antre', 'Antri', 'Antrian', 'Antrean'], ok: 0, explanation: 'Kata baku yang tepat adalah "antre", bukan antri.' },
  { id: 'indo_5', q: 'Kalimat efektif harus memiliki setidaknya unsur?', a: ['Subjek dan Predikat', 'Objek dan Keterangan', 'Subjek dan Keterangan', 'Predikat dan Objek'], ok: 0, explanation: 'Kalimat yang utuh dan efektif setidaknya harus memiliki unsur Subjek (S) dan Predikat (P).' },
  { id: 'indo_6', q: 'Lawan kata (antonim) dari kata "fiktif" adalah?', a: ['Fakta', 'Imajinasi', 'Khayalan', 'Palsu'], ok: 0, explanation: 'Fiktif berarti tidak nyata atau khayalan, sehingga antonimnya adalah fakta (nyata).' },
  { id: 'indo_7', q: 'Persamaan kata (sinonim) dari kata "evakuasi" adalah?', a: ['Pengungsian', 'Pemberontakan', 'Penjagaan', 'Perlindungan'], ok: 0, explanation: 'Evakuasi memiliki arti pemindahan atau pengungsian ke tempat yang lebih aman.' },
  { id: 'indo_8', q: 'Kalimat yang subjeknya dikenai pekerjaan disebut?', a: ['Kalimat pasif', 'Kalimat aktif', 'Kalimat majemuk', 'Kalimat tunggal'], ok: 0, explanation: 'Dalam kalimat pasif, subjek dikenai pekerjaan atau tindakan oleh objek.' },
  { id: 'indo_9', q: 'Manakah penulisan kata baku yang benar?', a: ['Nasihat', 'Nasehat', 'Nasiat', 'Naséhat'], ok: 0, explanation: 'Kata baku yang tepat menurut KBBI adalah "nasihat".' },
  { id: 'indo_10', q: 'Penggunaan tanda koma (,) yang tepat terdapat pada kalimat?', a: ['Saya membeli buku, pensil, dan penghapus.', 'Saya membeli, buku, pensil dan penghapus.', 'Saya membeli buku, pensil dan, penghapus.', 'Saya, membeli buku pensil, dan penghapus.'], ok: 0, explanation: 'Tanda koma digunakan di antara unsur-unsur dalam suatu pemerincian.' }
];

// Generate Inggris
const inggris: Question[] = [
  { id: 'ing_1', q: 'Apa bentuk V2 (Past Tense) dari verb "eat"?', a: ['ate', 'eaten', 'eats', 'eating'], ok: 0, explanation: 'Bentuk kedua (past tense) dari "eat" adalah "ate".' },
  { id: 'ing_2', q: 'Apa bentuk V2 (Past Tense) dari verb "sleep"?', a: ['slept', 'sleeps', 'sleeping', 'sleeped'], ok: 0, explanation: 'Bentuk kedua (past tense) dari "sleep" adalah "slept".' },
  { id: 'ing_3', q: 'Apa bentuk V2 (Past Tense) dari verb "play"?', a: ['played', 'plays', 'playing', 'play'], ok: 0, explanation: '"Play" adalah regular verb, bentuk keduanya ditambahkan "-ed" menjadi "played".' },
  { id: 'ing_4', q: 'Apa bentuk V2 (Past Tense) dari verb "write"?', a: ['wrote', 'written', 'writes', 'writing'], ok: 0, explanation: 'Bentuk kedua (past tense) dari "write" adalah "wrote".' },
  { id: 'ing_5', q: '"I ... a book right now." Kata kerja yang tepat adalah?', a: ['am reading', 'read', 'reading', 'reads'], ok: 0, explanation: 'Keterangan waktu "right now" menunjukkan Present Continuous Tense (am/is/are + V-ing).' },
  { id: 'ing_6', q: '"She ... to the market yesterday." Kata kerja yang tepat adalah?', a: ['went', 'go', 'goes', 'gone'], ok: 0, explanation: 'Keterangan waktu "yesterday" menunjukkan Past Tense. V2 dari "go" adalah "went".' },
  { id: 'ing_7', q: 'Lawan kata dari "beautiful" adalah?', a: ['ugly', 'pretty', 'handsome', 'cute'], ok: 0, explanation: 'Antonim dari "beautiful" (cantik) adalah "ugly" (jelek).' },
  { id: 'ing_8', q: '"The cat is sleeping ... the table." Preposisi yang tepat adalah?', a: ['under', 'above', 'between', 'into'], ok: 0, explanation: 'Preposisi "under" (di bawah) adalah yang paling masuk akal untuk kucing yang sedang tidur di meja.' },
  { id: 'ing_9', q: 'Apa bentuk V2 (Past Tense) dari verb "go"?', a: ['went', 'goes', 'gone', 'going'], ok: 0, explanation: 'Bentuk kedua (past tense) dari "go" adalah "went".' },
  { id: 'ing_10', q: '"They ... playing football." Kata kerja bantu (to be) yang tepat adalah?', a: ['are', 'is', 'am', 'was'], ok: 0, explanation: 'Subjek "They" pada bentuk Present Continuous menggunakan to be "are".' }
];

// Generate Bio
const bio: Question[] = [
  { id: 'bio_1', q: 'Pusat kendali seluruh aktivitas sel adalah?', a: ['Nukleus', 'Mitokondria', 'Ribosom', 'Lisosom'], ok: 0, explanation: 'Nukleus atau inti sel berfungsi mengatur seluruh aktivitas di dalam sel.' },
  { id: 'bio_2', q: 'Tempat terjadinya fotosintesis pada tumbuhan adalah?', a: ['Kloroplas', 'Vakuola', 'Dinding sel', 'Sitoplasma'], ok: 0, explanation: 'Fotosintesis terjadi di kloroplas yang mengandung klorofil.' },
  { id: 'bio_3', q: 'Organel sel yang berfungsi sebagai penghasil energi adalah?', a: ['Mitokondria', 'Badan Golgi', 'Ribosom', 'Nukleus'], ok: 0, explanation: 'Mitokondria sering disebut "powerhouse of the cell" karena menghasilkan energi (ATP).' },
  { id: 'bio_4', q: 'Hewan yang memiliki tulang belakang dikelompokkan dalam?', a: ['Vertebrata', 'Invertebrata', 'Mamalia', 'Aves'], ok: 0, explanation: 'Vertebrata adalah kelompok hewan yang memiliki tulang belakang.' },
  { id: 'bio_5', q: 'Bagian darah yang berfungsi mengangkut oksigen adalah?', a: ['Eritrosit', 'Leukosit', 'Trombosit', 'Plasma darah'], ok: 0, explanation: 'Eritrosit (sel darah merah) mengandung hemoglobin yang mengikat dan mengangkut oksigen.' },
  { id: 'bio_6', q: 'Proses pembuatan makanan oleh tumbuhan dengan bantuan cahaya matahari disebut?', a: ['Fotosintesis', 'Respirasi', 'Transpirasi', 'Gutasi'], ok: 0, explanation: 'Fotosintesis adalah cara tumbuhan membuat makanannya sendiri menggunakan cahaya matahari.' },
  { id: 'bio_7', q: 'Gas yang diserap tumbuhan untuk proses fotosintesis adalah?', a: ['Karbon dioksida', 'Oksigen', 'Nitrogen', 'Hidrogen'], ok: 0, explanation: 'Tumbuhan menyerap karbon dioksida (CO2) dari udara untuk fotosintesis.' },
  { id: 'bio_8', q: 'Hewan pemakan tumbuhan (rumput, daun) disebut?', a: ['Herbivora', 'Karnivora', 'Omnivora', 'Insektivora'], ok: 0, explanation: 'Herbivora adalah kelompok hewan yang hanya memakan tumbuhan.' },
  { id: 'bio_9', q: 'Hewan pemakan daging disebut?', a: ['Karnivora', 'Herbivora', 'Omnivora', 'Frugivora'], ok: 0, explanation: 'Karnivora adalah kelompok hewan pemangsa yang memakan daging.' },
  { id: 'bio_10', q: 'Pembuluh darah yang membawa darah keluar dari jantung adalah?', a: ['Arteri', 'Vena', 'Kapiler', 'Aorta'], ok: 0, explanation: 'Pembuluh nadi atau arteri bertugas membawa darah keluar meninggalkan jantung.' }
];

// Generate Math
const math: Question[] = [];
for (let i = 1; i <= 20; i++) {
  const x = Math.floor(Math.random() * 9) + 2;
  const y = Math.floor(Math.random() * 9) + 2;
  const ans = x * y;
  math.push({
    id: 'math_'+i,
    q: 'Hasil dari ' + x + ' × ' + y + ' adalah?',
    a: [ans.toString(), (ans + 1).toString(), (ans - 2).toString(), (ans + 3).toString()],
    ok: 0,
    explanation: x + ' dikalikan dengan ' + y + ' sama dengan ' + ans + '.'
  });
}

export const QUESTION_BANKS: Record<SubjectId, Question[]> = {
  pkn, rpl, indo, inggris, bio, math
};

export const FOES: Record<SubjectId, TeacherFoe> = {
  pkn: {
    id: 'pkn',
    name: 'GURU PKN',
    title: 'Penjaga Pancasila & Kewarganegaraan',
    label: 'PAK ARIF',
    roomName: 'KELAS 3-B',
    q: 'Dasar negara Indonesia adalah?',
    a: ['Pancasila', 'UUD 1945', 'Bhinneka Tunggal Ika', 'NKRI'],
    ok: 0,
    clue: 'Lima sila abadi terukir di lambang Garuda.',
    attack: 'Pita merah-putih melintas dalam pola rapi!',
    color: '#ef4444',
    accentColor: '#f87171',
    bgTheme: 'classroom',
    spriteColor: {
      hair: '#451a03',
      shirt: '#dc2626',
      pants: '#1f2937',
      skin: '#fde047',
    },
  },
  rpl: {
    id: 'rpl',
    name: 'GURU RPL',
    title: 'Master Rekayasa Perangkat Lunak',
    label: 'BU RANI',
    roomName: 'LAB KOMPUTER',
    q: 'HTML terutama digunakan untuk?',
    a: ['Struktur web', 'Menghapus OS', 'Menggambar 3D', 'Mengirim listrik'],
    ok: 0,
    clue: 'Ia menunjuk tag pembuka <html> dan penutup </html>.',
    attack: 'Blok kode pixel <div/> melintasi arena!',
    color: '#10b981',
    accentColor: '#34d399',
    bgTheme: 'lab',
    spriteColor: {
      hair: '#111827',
      shirt: '#059669',
      pants: '#374151',
      skin: '#fed7aa',
    },
  },
  indo: {
    id: 'indo',
    name: 'GURU B. INDONESIA',
    title: 'Sastrawan Bahasa & Pujangga',
    label: 'PAK BIMA',
    roomName: 'PERPUSTAKAAN',
    q: 'Kalimat efektif harus memenuhi syarat?',
    a: ['Bertele-tele', 'Hemat, lugas, & jelas', 'Tanpa subjek', 'Selalu panjang'],
    ok: 1,
    clue: 'Pesan yang baik tidak memerlukan kata yang mubazir.',
    attack: 'Huruf-huruf melayang turun seperti hujan puisi!',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    bgTheme: 'library',
    spriteColor: {
      hair: '#3f2c1d',
      shirt: '#d97706',
      pants: '#1f2937',
      skin: '#fed7aa',
    },
  },
  inggris: {
    id: 'inggris',
    name: 'GURU B. INGGRIS',
    title: 'English Educator & Linguist',
    label: 'MS. MAYA',
    roomName: 'LANGUAGE LAB',
    q: 'Terjemahan tepat dari "Saya sedang belajar"?',
    a: ['I sleeps', 'I am studying', 'I studied yesterday', 'I am book'],
    ok: 1,
    clue: 'Subject I with present continuous verb+ing.',
    attack: 'Panah kata kerja verb-ing bergerak dari berbagai arah!',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    bgTheme: 'lab',
    spriteColor: {
      hair: '#9a3412',
      shirt: '#2563eb',
      pants: '#1e293b',
      skin: '#fef3c7',
    },
  },
  bio: {
    id: 'bio',
    name: 'GURU BIOLOGI',
    title: 'Peneliti Kehidupan & Sains',
    label: 'BU SARI',
    roomName: 'LAB BIOLOGI',
    q: 'Unit terkecil penyusun makhluk hidup?',
    a: ['Organ', 'Sel', 'Jaringan', 'Tulang'],
    ok: 1,
    clue: 'Ia melihat mikroorganisme bergerak di bawah mikroskop.',
    attack: 'Sel-sel organik membelah dan memantul di layar!',
    color: '#84cc16',
    accentColor: '#a3e635',
    bgTheme: 'lab',
    spriteColor: {
      hair: '#312e81',
      shirt: '#65a30d',
      pants: '#3f3f46',
      skin: '#ffe4e6',
    },
  },
  math: {
    id: 'math',
    name: 'GEOMETRY KEEPER',
    title: 'Penjaga Ruang Dimensi & Geometri',
    label: 'GURU MATEMATIKA',
    roomName: 'HALL AULA UTAMA',
    q: 'Segitiga alas 8cm, tinggi 5cm. Berapa luasnya?',
    a: ['13 cm²', '20 cm²', '40 cm²', '80 cm²'],
    ok: 1,
    clue: 'Rumus luas segitiga: ½ × alas × tinggi.',
    attack: 'Segitiga & pecahan rumus geometri memotong bidang arena!',
    color: '#a855f7',
    accentColor: '#c084fc',
    bgTheme: 'math_hall',
    spriteColor: {
      hair: '#18181b',
      shirt: '#9333ea',
      pants: '#18181b',
      skin: '#fde047',
    },
  },
};

export const STUDY_NOTES: Record<SubjectId, { title: string; summary: string[]; tips: string }> = {
  pkn: {
    title: 'Rangkuman Pendidikan Pancasila',
    summary: [
      'Pancasila sebagai fondasi moral dan hukum tertinggi NKRI.',
      'Bhinneka Tunggal Ika memupuk toleransi keberagaman suku, budaya, dan agama.',
      'Sila 1 (Bintang), Sila 2 (Rantai), Sila 3 (Pohon Beringin), Sila 4 (Banteng), Sila 5 (Padi & Kapas).',
    ],
    tips: 'Pahami nilai-nilai gotong royong dan muatan konstitusi UUD 1945.',
  },
  rpl: {
    title: 'Rangkuman Rekayasa Perangkat Lunak',
    summary: [
      'HTML menyusun struktur dom, CSS menghias style, JS menangani logika interaktif.',
      'Git membantu pencatatan versi code (commit, push, branch, pull request).',
      'Pemrograman dasar membutuhkan pemahaman tipe data, struktur kondisi, dan perulangan.',
    ],
    tips: 'Selalu gunakan tag HTML semantik dan tulis kode bersih.',
  },
  indo: {
    title: 'Rangkuman Bahasa Indonesia',
    summary: [
      'Kalimat efektif: Hemat kata, logis, subjek-predikat jelas, dan bebas dari kata berulang.',
      'Gagasan utama: Inti pemikiran paragraf (deduktif di awal, induktif di akhir).',
      'Penggunaan EBI (Ejaan Bahasa Indonesia) dan kata baku yang terdaftar di KBBI.',
    ],
    tips: 'BACA teliti setiap soal dan identifikasi kata kunci utama!',
  },
  inggris: {
    title: 'English Grammar & Vocabulary Summary',
    summary: [
      'Simple Present: S + V1/V1(s/es) for habits & general truths.',
      'Present Continuous: S + am/is/are + V-ing for active right now.',
      'Nouns: Regular vs Irregular plurals (e.g. child -> children, book -> books).',
    ],
    tips: 'Practice reading daily to build passive and active vocabulary context.',
  },
  bio: {
    title: 'Rangkuman Biologi & Ilmu Hayati',
    summary: [
      'Sel adalah unit kehidupan terkecil (Nukleus mengontrol, Mitokondria menghasilkan energi).',
      'Fotosintesis: 6CO₂ + 6H₂O + Cahaya -> C₆H₁₂O₆ + 6O₂ di Kloroplas.',
      'Klasifikasi Organisme: Vertebrata (bertulang belakang) & Invertebrata.',
    ],
    tips: 'Gunakan diagram visual untuk mengingat alur pertukaran gas dan organ!',
  },
  math: {
    title: 'Rangkuman Matematika & Geometri',
    summary: [
      'Luas Segitiga = ½ × a × t; Luas Persegi = s²; Keliling = 4 × s.',
      'Total sudut segitiga = 180°; Sudut lurus = 180°; Sudut siku-siku = 90°.',
      'Prioritas operasi: Tanda kurung > Pangkat/Akar > Perkalian/Pembagian > Penjumlahan/Pengurangan.',
    ],
    tips: 'Hitung bertahap dari perkalian dahulu sebelum penjumlahan.',
  },
};
