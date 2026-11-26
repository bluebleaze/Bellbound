import { SubjectId } from '../types';

// Semua file musik berada di public/music/ dan dipanggil lewat /music/<nama>.mp3
export type MusicTrack =
  | 'mainmenu'
  | 'lorongdankelas'
  | 'pkn'
  | 'rekayasaperangkatlunak'
  | 'bahasaindonesia'
  | 'bahasainggris'
  | 'biologi'
  | 'matematika'
  | 'gameover'
  | 'ending';

// Nama lagu battle disesuaikan dengan mapel + guru masing-masing.
export const SUBJECT_MUSIC: Record<SubjectId, MusicTrack> = {
  pkn: 'pkn',                              // Pak Arif
  rpl: 'rekayasaperangkatlunak',           // Bu Rani
  indo: 'bahasaindonesia',                 // Pak Bima
  inggris: 'bahasainggris',                // Ms. Maya
  bio: 'biologi',                          // Bu Sari
  math: 'matematika',                      // Geometry Keeper / Guru Matematika
};

const MUSIC_DIR = '/music';
const DEFAULT_FADE_MS = 1200;
const FADE_STEP_MS = 40;

const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

class MusicEngine {
  private tracks = new Map<MusicTrack, HTMLAudioElement>();
  private current: MusicTrack | null = null;
  private desired: MusicTrack | null = null;
  private fadeTimer: number | null = null;
  private volume = 0.5;
  private enabled = true;
  private unlocked = false;
  private unlockHandler: (() => void) | null = null;

  constructor() {
    this.bindUnlock();
  }

  private getTrack(track: MusicTrack): HTMLAudioElement {
    let audio = this.tracks.get(track);
    if (!audio) {
      audio = new Audio(`${MUSIC_DIR}/${track}.mp3`);
      audio.loop = true; // Semua lagu diputar berulang supaya tidak habis.
      audio.preload = 'auto';
      audio.volume = 0;
      this.tracks.set(track, audio);
    }
    return audio;
  }

  private getTargetVolume(): number {
    return clampVolume(this.volume);
  }

  // Browser memblokir autoplay sebelum ada interaksi. Musik pertama akan
  // dimulai begitu pemain mengklik / menekan tombol pertama kali.
  private bindUnlock() {
    if (typeof window === 'undefined' || this.unlockHandler) return;

    this.unlockHandler = () => {
      this.unlocked = true;
      const track = this.desired;
      if (this.enabled && track) {
        this.startTrack(track, DEFAULT_FADE_MS, this.current !== track);
      }
      this.removeUnlockListeners();
    };

    window.addEventListener('pointerdown', this.unlockHandler, { passive: true });
    window.addEventListener('keydown', this.unlockHandler);
    window.addEventListener('touchstart', this.unlockHandler, { passive: true });
  }

  private removeUnlockListeners() {
    if (typeof window === 'undefined' || !this.unlockHandler) return;

    window.removeEventListener('pointerdown', this.unlockHandler);
    window.removeEventListener('keydown', this.unlockHandler);
    window.removeEventListener('touchstart', this.unlockHandler);
    this.unlockHandler = null;
  }

  private cancelFade() {
    if (this.fadeTimer !== null) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  private runFade(
    steps: Array<{ audio: HTMLAudioElement; from: number; to: number }>,
    fadeMs: number,
    onDone?: () => void,
  ) {
    this.cancelFade();

    if (fadeMs <= 0) {
      steps.forEach(({ audio, to }) => {
        audio.volume = clampVolume(to);
      });
      onDone?.();
      return;
    }

    const startedAt = performance.now();

    this.fadeTimer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / fadeMs);
      // Smoothstep supaya perubahan volume terasa halus, bukan linear kaku.
      const eased = progress * progress * (3 - 2 * progress);

      steps.forEach(({ audio, from, to }) => {
        audio.volume = clampVolume(from + (to - from) * eased);
      });

      if (progress >= 1) {
        this.cancelFade();
        steps.forEach(({ audio, to }) => {
          audio.volume = clampVolume(to);
        });
        onDone?.();
      }
    }, FADE_STEP_MS);
  }

  private startTrack(track: MusicTrack, fadeMs: number, resetPosition: boolean) {
    if (!this.enabled) return;

    const next = this.getTrack(track);
    const sameTrack = this.current === track;

    this.current = track;
    this.desired = track;

    if (resetPosition && !sameTrack) {
      next.currentTime = 0;
    }

    if (next.paused) {
      try {
        const playPromise = next.play();
        if (playPromise) {
          playPromise.catch(() => {
            this.unlocked = false;
            this.bindUnlock();
          });
        }
      } catch {
        this.unlocked = false;
        this.bindUnlock();
      }
    }

    const target = this.getTargetVolume();
    const steps: Array<{ audio: HTMLAudioElement; from: number; to: number }> = [
      { audio: next, from: next.volume, to: target },
    ];
    const outgoing: HTMLAudioElement[] = [];

    this.tracks.forEach((audio, id) => {
      if (id !== track && !audio.paused) {
        outgoing.push(audio);
        steps.push({ audio, from: audio.volume, to: 0 });
      }
    });

    this.runFade(steps, fadeMs, () => {
      outgoing.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      });
    });
  }

  public play(track: MusicTrack, fadeMs = DEFAULT_FADE_MS) {
    this.desired = track;

    if (!this.enabled) return;

    if (this.current === track) {
      const audio = this.getTrack(track);
      if (!audio.paused) {
        // Jangan ganggu crossfade yang sedang berjalan.
        if (this.fadeTimer === null) {
          audio.volume = this.getTargetVolume();
        }
        return;
      }
      // Resume tanpa mengulang dari awal (misalnya setelah sound di-toggle).
      this.startTrack(track, fadeMs, false);
      return;
    }

    this.startTrack(track, fadeMs, true);
  }

  // Panggil lebih awal supaya lagu berikutnya sudah siap saat crossfade.
  public preload(track: MusicTrack) {
    this.getTrack(track);
  }

  public setEnabled(enabled: boolean) {
    if (this.enabled === enabled) return;
    this.enabled = enabled;

    if (!enabled) {
      const playing = Array.from(this.tracks.values()).filter((audio) => !audio.paused);
      this.runFade(
        playing.map((audio) => ({ audio, from: audio.volume, to: 0 })),
        400,
        () => {
          playing.forEach((audio) => {
            audio.pause();
            audio.volume = 0;
          });
        },
      );
      return;
    }

    // Sound dinyalakan lagi: batalkan fade-out dan lanjutkan lagu saat ini.
    this.cancelFade();
    if (this.current) {
      this.play(this.current);
    }
  }

  public setVolume(volume: number) {
    this.volume = clampVolume(volume);

    if (!this.enabled || this.fadeTimer !== null || !this.current) return;

    const audio = this.getTrack(this.current);
    if (!audio.paused) {
      audio.volume = this.getTargetVolume();
    }
  }

  public stop(fadeMs = DEFAULT_FADE_MS) {
    this.desired = null;
    this.current = null;

    const playing = Array.from(this.tracks.values()).filter((audio) => !audio.paused);
    this.runFade(
      playing.map((audio) => ({ audio, from: audio.volume, to: 0 })),
      fadeMs,
      () => {
        playing.forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0;
        });
      },
    );
  }

  public getCurrentTrack(): MusicTrack | null {
    return this.current;
  }
}

export const musicEngine = new MusicEngine();
