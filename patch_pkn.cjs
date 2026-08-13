const fs = require('fs');
let code = fs.readFileSync('src/data/questions.ts', 'utf8');

const regex = /\/\/ Generate PKN\nconst pkn = \[\];[\s\S]*?\/\/ Generate RPL/m;

const newPkn = `// Generate PKN
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

// Generate RPL`;

code = code.replace(regex, newPkn);
fs.writeFileSync('src/data/questions.ts', code);
console.log('PKN questions fixed');
