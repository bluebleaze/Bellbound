export type SubjectId = 'pkn' | 'rpl' | 'indo' | 'inggris' | 'bio' | 'math';

export interface Question {
  id: string;
  q: string;
  a: string[];
  ok: number; // 0-based index of correct answer
  explanation?: string;
}

export interface TeacherFoe {
  id: SubjectId;
  name: string;
  title: string;
  label: string;
  roomName: string;
  q: string; // Default preview question
  a: string[];
  ok: number;
  clue: string;
  attack: string;
  color: string;
  accentColor: string;
  bgTheme: 'classroom' | 'lab' | 'library' | 'math_hall';
  spriteColor: {
    hair: string;
    shirt: string;
    pants: string;
    skin: string;
  };
}

export interface PlayerCustomization {
  name: string;
  uniform: 'sma' | 'pramuka' | 'batik' | 'olahraga';
  hairColor: string;
  skinColor: string;
  gender: 'male' | 'female';
  soulColor: string;
}

export type GameStateMode = 'title' | 'login' | 'level_popup' | 'intro' | 'walk' | 'class_intro' | 'battle_intro' | 'battle' | 'customizer' | 'study_notes' | 'game_over' | 'victory';

export interface ActiveBullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  subject: SubjectId;
  shape: 'rect' | 'circle' | 'text' | 'star' | 'triangle';
  label?: string;
  size: number;
  grazed?: boolean;
}

export interface GameProgress {
  hp: number;
  maxHp: number;
  lv: number;
  exp: number;
  completedSubjects: SubjectId[];
  scores: Partial<Record<SubjectId, { correct: number; total: number }>>;
  customization: PlayerCustomization;
  actUsesRemaining: number;
  soundEnabled: boolean;
  bgmVolume: number;
  difficulty: 'normal' | 'hard' | 'extreme';
}

export interface ScheduleItem {
  subjectId: SubjectId;
  week: number;
  day: number;
  dayName: string;
  time: string;
  name: string;
}

export const GAME_SCHEDULE: ScheduleItem[] = [
  { subjectId: 'pkn', week: 1, day: 1, dayName: 'Senin', time: '07:00 - 08:30', name: 'Pendidikan Kewarganegaraan' },
  { subjectId: 'rpl', week: 1, day: 4, dayName: 'Kamis', time: '10:00 - 11:30', name: 'Rekayasa Perangkat Lunak' },
  { subjectId: 'indo', week: 2, day: 2, dayName: 'Selasa', time: '08:30 - 10:00', name: 'Bahasa Indonesia' },
  { subjectId: 'inggris', week: 3, day: 1, dayName: 'Senin', time: '07:00 - 08:30', name: 'Bahasa Inggris' },
  { subjectId: 'bio', week: 4, day: 3, dayName: 'Rabu', time: '13:00 - 14:30', name: 'Biologi' },
  { subjectId: 'math', week: 5, day: 5, dayName: 'Jumat', time: '14:30 - 16:00', name: 'Ujian Akhir: Matematika' },
];
