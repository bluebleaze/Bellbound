# Bellbound

**Bellbound** adalah game RPG edukasi bergaya *8-bit pixel art* yang digabungkan dengan mekanik *bullet-hell* (seperti Undertale). Di dalam game ini, pemain berperan sebagai seorang siswa/siswi SMK yang harus berpetualang dan menghadapi berbagai "Ujian" dari guru-guru mata pelajaran di sekolah.

Tantang refleksmu dalam menghindari serangan proyektil (peluru) unik dari setiap guru dan asah otakmu dengan menjawab pertanyaan-pertanyaan pelajaran untuk memenangkan pertarungan!

## Fitur Utama

- **Kustomisasi Karakter Lengkap**: Sesuaikan nama, gender, jenis seragam (OSIS, Pramuka, Batik, Olahraga), warna rambut, warna kulit, dan warna *Soul* kamu. Sprite karakter 8-bit akan secara dinamis berubah sesuai pilihanmu.
- **Eksplorasi Overworld SMK**: Jelajahi area sekolah, dekati meja guru, dan bersiaplah untuk ujian.
- **Sistem Pertarungan Unik (Bullet-Hell + Kuis)**: 
  - **Fase Bertahan (Dodge Phase)**: Hindari serangan khusus dari masing-masing guru (misal: bentuk Geometri dari Guru Matematika, Sel Virus & DNA dari Guru Biologi, Kosakata & Buku dari Guru Bahasa Inggris).
  - **Fase Menjawab (Answer Phase)**: Jawab soal edukasi sesuai mata pelajaran untuk mengurangi HP Guru.
- **Mata Pelajaran yang Bervariasi**: Hadapi tantangan dari mata pelajaran PKN, RPL, Bahasa Indonesia, Bahasa Inggris, Biologi, hingga Matematika.
- **Dev Menu**: Fitur khusus pengembang untuk menguji (God Mode, Skip Battle, Unlock All).

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan:
- [React (v19)](https://react.dev/) - Library UI modern.
- [Vite](https://vitejs.dev/) - Build tool & dev server yang sangat cepat.
- [Tailwind CSS (v4)](https://tailwindcss.com/) - Framework CSS berbasis utilitas.
- [Lucide React](https://lucide.dev/) - Ikon antarmuka.
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Digunakan untuk me-*render* grafis piksel 8-bit (*PixelSprites.ts* dan mekanik *BattleArena*).

## Panduan Instalasi & Menjalankan Lokal

Pastikan komputer kamu sudah terinstal **Node.js** (rekomendasi: v18 atau versi terbaru).

1. **Clone repositori ini** (atau ekstrak file proyek):
   ```bash
   git clone <url-repo-kamu>
   cd bellbound
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

1. **Login & Kustomisasi**: Masukkan nama dan atur penampilan karaktermu di layar utama. Pilih tingkat kesulitan yang sesuai.
2. **Navigasi**: Gunakan tombol **W, A, S, D** atau **Tanda Panah** untuk bergerak di mode peta (Overworld).
3. **Interaksi**: Berjalanlah mendekati guru untuk memicu dialog dan pertarungan.
4. **Bertarung**: 
   - Gunakan **W, A, S, D / Tanda Panah** untuk menggerakkan *Soul* (Hati) kamu guna menghindari peluru guru.
   - Perhatikan pola serangan setiap guru karena mereka memiliki gaya serangan yang unik!
   - Jawab pertanyaan dengan benar saat fase soal muncul untuk meraih kemenangan.

## Berkontribusi

Jika kamu ingin mengembangkan game ini lebih lanjut:
- `src/components/PixelSprites.ts`: Tempat mengedit atau menambah gambar piksel karakter, guru, properti, dan animasi.
- `src/components/BattleArena.tsx`: Pusat logika pertarungan *bullet-hell* dan pola proyektil serangan guru.
- `src/data/questions.ts`: Tempat kamu bisa menambah atau mengubah daftar bank soal kuis untuk setiap mata pelajaran.
- `src/App.tsx`: Manajemen *state* utama game (kesehatan/HP pemain, perkembangan level, urutan stage).

---

*Dibuat dengan semangat belajar.* Selamat bermain dan belajar di **Bellbound**!
