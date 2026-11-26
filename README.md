<div align="center">

<img src="public/logo.png" alt="Bellbound Logo" width="80" /> <img src="public/bellboundlogo.png" alt="Bellbound Logo" width="400" />

# Bellbound

**Bellbound** adalah game RPG edukasi bergaya *8-bit pixel art* yang digabungkan dengan mekanik *bullet-hell* (seperti Undertale). Di dalam game ini, pemain berperan sebagai seorang siswa/siswi SMK yang harus berpetualang dan menghadapi berbagai "Ujian" dari guru-guru mata pelajaran di sekolah.

> **Didedikasikan untuk SMK Telkom Banjarbaru** bagi para siswa dan guru yang menjadikan sekolah sebagai ruang belajar, berkarya, dan berpetualang.

</div>

Tantang refleksmu dalam menghindari serangan proyektil (peluru) unik dari setiap guru dan asah otakmu dengan menjawab pertanyaan-pertanyaan pelajaran untuk memenangkan pertarungan!

## Fitur Utama

- **Kustomisasi Karakter Lengkap**: Sesuaikan nama, gender, jenis seragam (SMK, Pramuka, Batik, Olahraga), warna rambut, warna kulit, dan warna *Soul* kamu. Sprite karakter 8-bit akan secara dinamis berubah sesuai pilihanmu.
- **Eksplorasi Overworld SMK**: Jelajahi area sekolah, lorong, dan kelas; dekati meja guru untuk memulai ujian.
- **Sistem Pertarungan Unik (Bullet-Hell + Kuis)**:
  - **Fase Bertahan (Dodge Phase)**: Hindari serangan khusus dari masing-masing guru (misal: Geometri dari Guru Matematika, Sel & DNA dari Guru Biologi, Kosakata & Buku dari Guru Bahasa Inggris).
  - **Fase Menjawab (Answer Phase)**: Jawab soal edukasi sesuai mata pelajaran untuk mengurangi HP Guru.
- **Mata Pelajaran yang Bervariasi**: PKN (Pak Arif), RPL (Bu Rani), Bahasa Indonesia (Pak Bima), Bahasa Inggris (Ms. Maya), Biologi (Bu Sari), Matematika (Geometry Keeper).
- **Sistem Musik MP3 Kustom**:
  - 10 track asli di `public/music/` (menu, lorong/kelas, masing-masing guru, game over, ending).
  - Semua lagu **looping otomatis** tanpa berhenti.
  - **Crossfade halus 1.2 detik** saat transisi antar lagu (smoothstep easing).
  - Pemetaan otomatis: menu → `mainmenu.mp3`, lorong/kelas → `lorongdankelas.mp3`, battle per guru → lagu mapel guru, game over → `gameover.mp3`, ending final → `ending.mp3`.
  - Volume mengikuti pengaturan `bgmVolume` dan tombol mute; lazy-load + preload otomatis.
- **Pengunci Input Jawaban A/D**: Saat battle baru dimulai (2 detik) dan sesaat setelah fase dodge (1.2 detik), tombol A/D dikunci agar tidak ikut terbawa oleh key-hold gerakan WASD. Tombol A/D yang ditahan saat lock akan tetap diabaikan sampai dilepas (keyup).
- **Highlight Tombol Heal Otomatis**: Tombol “PULIHKAN DARAH (+3 HP)” berwarna kuning, glow, pulse, dan menampilkan badge “Darah Rendah!” saat HP ≤ 50%.
- **Ending Lengkap 3 Tahap**: Setelah mengalahkan Geometry Keeper (Matematika) dan menyelesaikan 6 mapel:
  1. **Laporan Rapot** — tabel nilai 6 mapel (benar/total, nilai, grade A–E, status LULUS/REMEDIAL), rata-rata, predikat, status kelulusan.
  2. **Informasi Karakter** — preview sprite, nama, gender, seragam, level, HP, kesulitan, warna rambut/kulit/soul + trait soul.
  3. **Kata Penutup** — epilog personal, nilai akhir, kutipan “Pelajari pola. Pelajari ilmu. Jangan paksa pintu.”, tombol Lihat Rapot Lagi & Reset Permainan.
- **Kunci Jawaban Disembunyikan**: Saat salah menjawab, jawaban benar **tidak ditampilkan** agar tantangan tetap menantang.
- **Logo Lonceng Diperbesar**: Ikon favicon pada huruf “O” judul BELLBOUND di main menu lebih besar & sejajar.
- **Dev Menu Tersembunyi**: Klik area transparan kanan bawah → password `devmode` → God Mode, Skip Battle, Unlock All, dll.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan:

- [React (v19)](https://react.dev/) — Library UI modern.
- [Vite](https://vitejs.dev/) — Build tool & dev server yang sangat cepat.
- [Tailwind CSS (v4)](https://tailwindcss.com/) — Framework CSS berbasis utilitas.
- [Lucide React](https://lucide.dev/) — Ikon antarmuka.
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) — Render grafis piksel 8-bit (*PixelSprites.ts* dan *BattleArena*).
- **Web Audio API** (sintesis 8-bit SFX) + **HTMLAudioElement** (musik MP3).

## Panduan Instalasi & Menjalankan Lokal

Pastikan komputer kamu sudah terinstal **Node.js** (rekomendasi: v18 atau versi terbaru).

1. **Clone repositori ini** (atau ekstrak file proyek):
   ```bash
   git clone https://github.com/bluebleaze/Bellbound
   cd Bellbound
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```
   *(Atau gunakan `yarn install` / `pnpm install` sesuai preferensimu)*

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   Buka URL `http://localhost:3000` (atau URL yang ditampilkan di terminal) untuk mulai bermain.

## Cara Bermain

1. **Login & Kustomisasi**: Masukkan nama dan atur penampilan karaktermu di layar utama. Pilih tingkat kesulitan (Normal / Hard / Extreme).
2. **Navigasi**: Gunakan **W, A, S, D** atau **Tanda Panah** untuk bergerak di mode peta (Overworld). Di mobile gunakan D-Pad di layar.
3. **Interaksi**: Berjalanlah mendekati guru untuk memicu dialog dan pertarungan (klik/Spasi/Enter).
4. **Bertarung**:
   - **Fase Dodge**: Gerakkan Soul (hati merah) dengan **W, A, S, D / Panah** untuk menghindari peluru guru. Setiap guru punya pola unik.
   - **Fase Soal**: Jawab pertanyaan (klik opsi / tekan 1–4 / A–D). Jawab benar → HP guru turun. Jawab salah → fase dodge berikutnya.
   - **Aksi**: `PULIHKAN DARAH` (heal +3 HP, maks 3×), `PETUNJUK GURU` (clue), `INFO UJIAN` (kisi-kisi).
5. **Kelulusan**: Selesaikan 6 mapel. Nilai rata-rata ≥ 70 → Lulus & ending. < 70 → Remedial (reset dari awal).

## Menambah / Mengganti Musik

Semua file musik berada di `public/music/`. Format: **MP3**, nama file **huruf kecil tanpa spasi**.

| File | Diputar Saat |
|------|--------------|
| `mainmenu.mp3` | Title, login, level popup, intro |
| `lorongdankelas.mp3` | Lorong, masuk kelas, battle intro |
| `pkn.mp3` | Battle Pak Arif (PKN) |
| `rekayasaperangkatlunak.mp3` | Battle Bu Rani (RPL) |
| `bahasaindonesia.mp3` | Battle Pak Bima (B. Indonesia) |
| `bahasainggris.mp3` | Battle Ms. Maya (B. Inggris) |
| `biologi.mp3` | Battle Bu Sari (Biologi) |
| `matematika.mp3` | Battle Geometry Keeper (Matematika) |
| `gameover.mp3` | HP habis |
| `ending.mp3` | Final victory (6 mapel selesai) |

Untuk mengganti lagu:
1. Ganti file `.mp3` di `public/music/` dengan nama **sama persis**.
2. Atau ganti nama file + edit pemetaan di `src/utils/MusicEngine.ts`:
   - `MusicTrack` union type
   - `SUBJECT_MUSIC` record

Detail lengkap: baca `MUSIC_INSTRUCTIONS.md`.

## Berkontribusi

Jika ingin mengembangkan game ini lebih lanjut:

- `src/components/PixelSprites.ts` — sprite karakter, guru, properti, animasi.
- `src/components/BattleArena.tsx` — logika bullet-hell, pola proyektil, sistem jawaban, highlight heal, input lock A/D.
- `src/components/EndingModal.tsx` — alur ending 3 tahap (rapot, karakter, kata penutup).
- `src/data/questions.ts` — bank soal kuis per mata pelajaran.
- `src/utils/MusicEngine.ts` — engine musik MP3, crossfade, loop, preload, autoplay unlock.
- `src/utils/AudioEngine.ts` — SFX 8-bit sintetis (step, select, hit, graze, correct, wrong, dsb).
- `src/App.tsx` — manajemen state utama (HP, level, progress, state game, sinkron musik).

## Lisensi

Proyek ini dilisensikan di bawah **GPL v3.0** — lihat file `LICENSE` (atau tambahkan file lisensi GPLv3 ke repo) untuk detailnya.

---

