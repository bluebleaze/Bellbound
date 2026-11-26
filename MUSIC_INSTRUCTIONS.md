# Instruksi Musik Bellbound

Semua file musik berada di:

```text
public/music/
```

File dipanggil oleh game lewat URL:

```text
/music/<nama-file>.mp3
```

## Daftar File dan Waktu Pemutaran

| File | Kapan diputar |
| --- | --- |
| `mainmenu.mp3` | Layar utama / title, login, level popup, dan intro |
| `lorongdankelas.mp3` | Saat berjalan di lorong, masuk kelas, dan animasi sebelum battle |
| `pkn.mp3` | Battle dengan Pak Arif (PKN) |
| `rekayasaperangkatlunak.mp3` | Battle dengan Bu Rani (RPL) |
| `bahasaindonesia.mp3` | Battle dengan Pak Bima (Bahasa Indonesia) |
| `bahasainggris.mp3` | Battle dengan Ms. Maya (Bahasa Inggris) |
| `biologi.mp3` | Battle dengan Bu Sari (Biologi) |
| `matematika.mp3` | Battle dengan Geometry Keeper / Guru Matematika |
| `gameover.mp3` | Saat nyawa pemain habis |
| `ending.mp3` | Saat semua 6 mata pelajaran selesai dan layar final victory muncul |

## Aturan Transisi

- Semua lagu otomatis **looping** (`audio.loop = true`), jadi musik tidak akan habis.
- Saat lagu berganti, terjadi **crossfade halus selama 1.2 detik**:
  - Lagu lama perlahan mengecil.
  - Lagu baru perlahan membesar.
- Jika state berubah cepat (misalnya dari animasi masuk kelas langsung ke battle), crossfade tetap aman dan tidak menumpuk.
- Volume mengikuti nilai `bgmVolume` di progress pemain (default `0.5`).
- Tombol sound di header akan mem-fade-out musik saat dimatikan, dan melanjutkannya saat dinyalakan kembali.

## Autoplay Browser

Browser modern memblokir audio sebelum ada interaksi pengguna. Karena itu:

- Musik pertama akan mulai setelah pemain mengklik atau menekan tombol pertama kali.
- Setelah interaksi pertama, perpindahan lagu berjalan normal.

## Cara Mengganti atau Menambah Lagu

1. Taruh file MP3 baru di `public/music/`.
2. Gunakan nama file yang sama seperti yang ada di tabel di atas.
3. Jika nama file berbeda, sesuaikan pemetaan di:
   ```text
   src/utils/MusicEngine.ts
   ```
   - `MusicTrack` untuk daftar nama lagu.
   - `SUBJECT_MUSIC` untuk pasangan mapel/guru ke file lagu.
4. Tidak perlu mengubah `App.tsx` selama nama track dan pemetaannya sudah benar.

## Catatan Nama File

Nama file harus sama persis, termasuk huruf kecil semua dan tanpa spasi. Contoh:

- Benar: `bahasaindonesia.mp3`
- Salah: `Bahasa Indonesia.mp3`
- Benar: `rekayasaperangkatlunak.mp3`
- Salah: `rpl.mp3`

## File Kode Terkait

- `src/utils/MusicEngine.ts` — pemutar musik, loop, crossfade, dan pemetaan lagu.
- `src/App.tsx` — menentukan lagu berdasarkan state game.
- `src/utils/AudioEngine.ts` — efek suara (SFX) 8-bit, terpisah dari musik latar.
