import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SubjectId, ActiveBullet, GameProgress } from '../types';
import { FOES, QUESTION_BANKS } from '../data/questions';
import { drawTeacherSprite } from './PixelSprites';
import { audioEngine } from '../utils/AudioEngine';
import { Eye, MessageSquare, Heart, Brain, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

interface BattleArenaProps {
  subject: SubjectId;
  progress: GameProgress;
  onUpdateHp: (newHp: number) => void;
  onUpdateFoeHp?: (hp: number, max: number) => void;
  onVictory: (subject: SubjectId, score: { correct: number, total: number }) => void;
  onGameOver: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  subject,
  progress,
  onUpdateHp,
  onUpdateFoeHp,
  onVictory,
  onGameOver,
}) => {
  const foe = FOES[subject];
  const maxFoeHp = progress.difficulty === "extreme" ? 30 : progress.difficulty === "hard" ? 20 : 10;
  const [questions] = useState(() => {
    let base = [...QUESTION_BANKS[subject]];
    let required = progress.difficulty === 'extreme' ? 30 : progress.difficulty === 'hard' ? 20 : 10;
    
    // Shuffle base
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    
    let arr = base.slice(0, required);
    
    // Assign types
    let numEssay = 0;
    if (progress.difficulty === 'extreme') numEssay = Math.floor(required * 0.5); // 50%
    if (progress.difficulty === 'hard') numEssay = Math.floor(required * 0.3); // 30%
    
    arr = arr.map((q, idx) => ({
      ...q,
      qType: idx >= required - numEssay ? 'essay' : 'pg'
    }));
    
    // Shuffle again so essay and pg are mixed
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
  });

  // Battle State
  const [qIndex, setQIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [foeHp, setFoeHp] = useState(maxFoeHp);
  const [isDodging, setIsDodging] = useState(false);
  const [dialogue, setDialogue] = useState(`Selamat datang di ${foe.name}. Saatnya kerjakan ujian berikut!`);
  const [showQuestions, setShowQuestions] = useState(false);
  const [hasUsedMercy, setHasUsedMercy] = useState(false);
  const [actUsesLeft, setActUsesLeft] = useState(progress.actUsesRemaining);
  const [questionTimer, setQuestionTimer] = useState(progress.difficulty === "extreme" ? 15 : progress.difficulty === "hard" ? 20 : 0);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [hintBonus, setHintBonus] = useState(false);
  const [mercyActive, setMercyActive] = useState(false);
  const [isHitFlashing, setIsHitFlashing] = useState(false);
  const [isMathCorrectDodge, setIsMathCorrectDodge] = useState(false);

  useEffect(() => {
    if (onUpdateFoeHp) {
      onUpdateFoeHp(foeHp, maxFoeHp);
    }
  }, [foeHp, maxFoeHp, onUpdateFoeHp]);

  // Canvas & Loop Refs for 100% bug-free 60FPS bullet dodge engine
  const arenaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitFlashUntilRef = useRef<number>(0);
  const grazeSparksRef = useRef<{x: number, y: number, life: number, vx: number, vy: number, type?: 'line'|'soul_outline', angle?: number, size?: number}[]>([]);
  const shatterRef = useRef<{active: boolean, timer: number, pieces: any[]}>({active: false, timer: 0, pieces: []});
  const soulPosRef = useRef({ x: 112, y: 52 }); // Center of 240x120 box
  const bulletsRef = useRef<ActiveBullet[]>([]);
  const isDodgingRef = useRef(false);
  const lastHitTimeRef = useRef(0);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const mercyActiveRef = useRef(false);
  const hintBonusRef = useRef(false);
  const tpRef = useRef(0);
  const isMathCorrectDodgeRef = useRef(false);
  const currentDurationRef = useRef(6500);
  const currentHpRef = useRef(progress.hp);
  const onUpdateHpRef = useRef(onUpdateHp);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onUpdateHpRef.current = onUpdateHp;
  }, [onUpdateHp]);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    if (showQuestions && progress.difficulty !== 'normal') {
      const timerId = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleAnswer(-1); // Time out = wrong
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [showQuestions, progress.difficulty, qIndex]);

  
  
  // Keep refs in sync with state
  useEffect(() => {
    isDodgingRef.current = isDodging;
    isMathCorrectDodgeRef.current = isMathCorrectDodge;
  }, [isDodging]);

  useEffect(() => {
    mercyActiveRef.current = mercyActive;
  }, [mercyActive]);

  useEffect(() => {
    hintBonusRef.current = hintBonus;
  }, [hintBonus]);

  useEffect(() => {
    currentHpRef.current = progress.hp;
  }, [progress.hp]);

  // Center Soul
  const centerSoul = useCallback(() => {
    soulPosRef.current = { x: 112, y: 52 };
  }, []);

  // Keyboard Movement Listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = true;
      keysPressedRef.current[e.key.toLowerCase()] = true;
      keysPressedRef.current[e.key.toUpperCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
      keysPressedRef.current[e.key.toLowerCase()] = false;
      keysPressedRef.current[e.key.toUpperCase()] = false;
    };
    const onBlur = () => {
      keysPressedRef.current = {};
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // Main 60FPS Bullet & Dodge Canvas Engine Loop
  useEffect(() => {
    let animationFrameId: number;
    let spawnCounter = 0;
    let dodgeStartTime = 0;
    let lastSoulTick = 0;

    const bulletColors: Record<SubjectId, string> = {
      pkn: '#ef4444',
      rpl: '#10b981',
      indo: '#f59e0b',
      inggris: '#3b82f6',
      bio: '#84cc16',
      math: '#a855f7',
    };

    const renderLoop = () => {
      const canvas = arenaCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;

          // Clear Arena
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid pattern background
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }

          // IF IN DODGE PHASE: Process Movement, Bullet Spawning, Collisions
          if (isDodgingRef.current) {
            if (dodgeStartTime === 0) {
              dodgeStartTime = Date.now();
              currentDurationRef.current = Math.floor(6500 + Math.random() * 8500);
            }

            const duration = currentDurationRef.current;
            const elapsed = Date.now() - dodgeStartTime;

            // Check if wave finished
            if (elapsed > duration && !shatterRef.current.active) {
              isDodgingRef.current = false;
              setIsDodging(false);
              bulletsRef.current = [];
              dodgeStartTime = 0;
              setDialogue('Gelombang serangan selesai! Silakan jawab pertanyaan berikutnya.');
            }

            if (shatterRef.current.active) {
              const timeShattering = Date.now() - shatterRef.current.timer;

              if (timeShattering < 500) {
                ctx.save();
                ctx.fillStyle = progress.customization.soulColor || '#ef4444';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💔', soulPosRef.current.x, soulPosRef.current.y);
                ctx.restore();
              } else {
                shatterRef.current.pieces.forEach((p) => {
                  p.x += p.vx;
                  p.y += p.vy;
                  p.vy += 0.2; // Gravity
                  p.rot += p.rSpd;

                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.fillStyle = progress.customization.soulColor || '#ef4444';
                  ctx.fillRect(-3, -3, 6, 6);
                  ctx.restore();
                });
              }
              animationFrameId = requestAnimationFrame(renderLoop);
              return;
            }

            // Move Soul (Faster & more responsive speed)
            const now = Date.now();
            if (now - lastSoulTick >= 16) { // ~60fps smooth tick
              lastSoulTick = now;

              let dx = 0;
              let dy = 0;
              const speed = 2.2; // Sprightly, responsive soul speed

              if (keysPressedRef.current['ArrowLeft'] || keysPressedRef.current['a'] || keysPressedRef.current['A']) dx -= speed;
              if (keysPressedRef.current['ArrowRight'] || keysPressedRef.current['d'] || keysPressedRef.current['D']) dx += speed;
              if (keysPressedRef.current['ArrowUp'] || keysPressedRef.current['w'] || keysPressedRef.current['W']) dy -= speed;
              if (keysPressedRef.current['ArrowDown'] || keysPressedRef.current['s'] || keysPressedRef.current['S']) dy += speed;

              if (dx !== 0 || dy !== 0) {
                audioEngine.playStep();
              }

              soulPosRef.current.x = Math.max(8, Math.min(canvas.width - 16, soulPosRef.current.x + dx));
              soulPosRef.current.y = Math.max(8, Math.min(canvas.height - 16, soulPosRef.current.y + dy));
            }

            // Spawn Bullets (Patterned deterministic attacks)
            spawnCounter++;
            if (spawnCounter % 38 === 0 && bulletsRef.current.length < 8){
              const color = bulletColors[subject];
              const pIdx = Math.floor(spawnCounter / 38);
              const mode = pIdx % 3; // 3 alternating attack styles per subject

              if (subject === 'pkn') {
                if (mode === 0) {
                  // Red-and-White Flag Rectangles from sides (Ladder pattern)
                  const fromLeft = pIdx % 2 === 0;
                  const hRatio = ((pIdx % 4) + 1) / 5;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -15 : canvas.width + 15,
                    y: hRatio * canvas.height,
                    vx: fromLeft ? 1.4 : -1.4,
                    vy: Math.sin(pIdx) * 0.3,
                    color,
                    subject,
                    shape: 'rect',
                    size: 16,
                  });
                } else if (mode === 1) {
                  // Rain of Garuda and Stars from top (Sweeping wave)
                  const xRatio = ((pIdx % 6) + 1) / 7;
                  const isStar = pIdx % 3 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xRatio * canvas.width,
                    y: -15,
                    vx: Math.cos(pIdx) * 0.5,
                    vy: 1.5,
                    color: '#fbbf24', // gold
                    subject,
                    shape: isStar ? 'emoji' : 'garuda',
                    label: isStar ? '⭐' : undefined,
                    size: 14,
                  });
                } else {
                  // Diagonal Scales of Justice and Shields from top corners
                  const fromRightCorner = pIdx % 2 === 0;
                  const isJustice = pIdx % 3 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromRightCorner ? canvas.width + 10 : -10,
                    y: -10,
                    vx: fromRightCorner ? -1.2 : 1.2,
                    vy: 1.2,
                    color,
                    subject,
                    shape: 'emoji',
                    label: isJustice ? '⚖️' : '🛡️',
                    size: 14,
                  });
                }
              } else if (subject === 'rpl') {
                const tags = ['<div/>', '<code/>', '{...}', '</HTML>', 'fn()', 'SQL', 'npm', 'git'];
                if (mode === 0) {
                  // Rain of Code Tags
                  const xRatio = ((pIdx % 5) + 1) / 6;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xRatio * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx) * 0.4,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[pIdx % tags.length],
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Sine Wave Code Stream
                  const fromLeft = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -20 : canvas.width + 20,
                    y: canvas.height / 2 + Math.cos(pIdx) * 30,
                    vx: fromLeft ? 1.5 : -1.5,
                    vy: Math.sin(spawnCounter * 0.1) * 1.0,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[(pIdx + 1) % tags.length],
                    size: 14,
                  });
                } else {
                  // Corner Burst
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2,
                    y: -10,
                    vx: ((pIdx % 5) - 2) * 0.7,
                    vy: 1.3,
                    color,
                    subject,
                    shape: 'text',
                    label: tags[(pIdx + 2) % tags.length],
                    size: 14,
                  });
                }
              } else if (subject === 'indo') {
                if (mode === 0) {
                  // Rain of SPOK Letters (V-shape)
                  const chars = ['S', 'P', 'O', 'K', 'A', 'B', 'C'];
                  const posSeq = [0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.5];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: posSeq[pIdx % posSeq.length] * canvas.width,
                    y: -15,
                    vx: 0,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: chars[pIdx % chars.length],
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Punctuation Marks
                  const marks = ['❓', '❗', '💬', '📖', '✍️'];
                  const fromLeft = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: fromLeft ? -15 : canvas.width + 15,
                    y: ((pIdx % 5) + 1) / 6 * canvas.height,
                    vx: fromLeft ? 1.3 : -1.3,
                    vy: Math.cos(pIdx) * 0.4,
                    color,
                    subject,
                    shape: 'text',
                    label: marks[pIdx % marks.length],
                    size: 14,
                  });
                } else {
                  // Literary Words
                  const words = ['PUISI', 'CERPEN', 'KATA', 'BAHASA'];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 3) + 1) / 4 * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx * 2) * 0.5,
                    vy: 1.3,
                    color,
                    subject,
                    shape: 'text',
                    label: words[pIdx % words.length],
                    size: 14,
                  });
                }
              } else if (subject === 'inggris') {
                const verbs = ['Verb', 'Study', 'Read', 'Speak', 'Grammar', 'Listen'];
                if (mode === 0) {
                  // Arrow Verbs Horizontal
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: -30,
                    y: ((pIdx % 4) + 1) / 5 * canvas.height,
                    vx: 1.5,
                    vy: Math.sin(pIdx) * 0.2,
                    color,
                    subject,
                    shape: 'book',
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Emoji Letters
                  const letters = ['🅰️', '🅱️', '🔤', '📖', '🇬🇧'];
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width + 30,
                    y: ((pIdx % 4) + 1) / 5 * canvas.height,
                    vx: -1.5,
                    vy: Math.cos(pIdx) * 0.2,
                    color,
                    subject,
                    shape: 'emoji',
                    label: letters[pIdx % letters.length],
                    size: 16,
                  });
                } else {
                  // Vocab Falling Drop
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 5) + 1) / 6 * canvas.width,
                    y: -15,
                    vx: Math.sin(pIdx) * 0.5,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'text',
                    label: verbs[pIdx % verbs.length],
                    size: 14,
                  });
                }
              } else if (subject === 'bio') {
                if (mode === 0) {
                  // Bouncing Green Cell Spheres (Zig zag)
                  const xPos = ((pIdx % 5) + 1) / 6 * canvas.width;
                  const fromTop = pIdx % 2 === 0;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: xPos,
                    y: fromTop ? -10 : canvas.height + 10,
                    vx: Math.sin(pIdx * 1.5) * 1.2,
                    vy: fromTop ? 1.2 : -1.2,
                    color,
                    subject,
                    shape: 'circle',
                    size: 12,
                  });
                } else if (mode === 1) {
                  // DNA & Microbes Emojis
                  const bioEmojis = ['🧬', '🦠', '🌿', '🍄', '🔬'];
                  const angle = spawnCounter * 0.15;
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2 + Math.sin(angle) * 60,
                    y: -10,
                    vx: 0,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'emoji',
                    label: bioEmojis[pIdx % bioEmojis.length],
                    size: 16,
                  });
                } else {
                  // Cell Spores From Center Side
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: -10,
                    y: canvas.height / 2 + Math.sin(pIdx * 2) * 30,
                    vx: 1.4,
                    vy: Math.cos(pIdx * 2) * 0.8,
                    color,
                    subject,
                    shape: 'virus',
                    size: 12,
                  });
                }
              } else {
                // Math Subject
                if (mode === 0) {
                  // Targeted Triangles toward Soul position (Aimed)
                  const dx = soulPosRef.current.x - canvas.width / 2;
                  const dy = soulPosRef.current.y - canvas.height / 2;
                  const angle = Math.atan2(dy, dx) + Math.sin(pIdx) * 0.2; // slight waver
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: canvas.width / 2 + Math.cos(angle) * 130,
                    y: canvas.height / 2 + Math.sin(angle) * 70,
                    vx: -Math.cos(angle) * 1.3,
                    vy: -Math.sin(angle) * 1.3,
                    color,
                    subject,
                    shape: 'triangle',
                    size: 14,
                  });
                } else if (mode === 1) {
                  // Square Geometry Rain
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: ((pIdx % 6) + 1) / 7 * canvas.width,
                    y: -15,
                    vx: Math.cos(pIdx) * 0.4,
                    vy: 1.4,
                    color,
                    subject,
                    shape: 'square',
                    size: 14,
                  });
                } else {
                  // Inward Ring Inflow Emojis
                  const mathEmojis = ['📐', '📏', '🔢', '➕', '➖'];
                  const angle = (pIdx % 8) * (Math.PI / 4); // 45 degree steps
                  bulletsRef.current.push({
                    id: spawnCounter.toString(),
                    x: soulPosRef.current.x + Math.cos(angle) * 110,
                    y: soulPosRef.current.y + Math.sin(angle) * 110,
                    vx: -Math.cos(angle) * 1.2,
                    vy: -Math.sin(angle) * 1.2,
                    color,
                    subject,
                    shape: 'emoji',
                    label: mathEmojis[pIdx % mathEmojis.length],
                    size: 16,
                  });
                }
              }
            }

            // Move Bullets & Check Collision
            const soulX = soulPosRef.current.x;
            const soulY = soulPosRef.current.y;
            const nextBullets: ActiveBullet[] = [];

            bulletsRef.current.forEach((b) => {
              const speedMod = isMathCorrectDodgeRef.current ? 0.35 : 0.7;
              b.x += b.vx * speedMod;
              b.y += b.vy * speedMod;

              // Collision distance check (Forgiving radius of 8px)
              const dist = Math.hypot(b.x - soulX, b.y - soulY);

              if (dist < 8) {
                // Hit detected!
                if (Date.now() - lastHitTimeRef.current > 500) {
                  lastHitTimeRef.current = Date.now();
                  audioEngine.playHit();

                  const damage = 4;
                  setHintBonus(false);

                  const nextHp = Math.max(0, currentHpRef.current - damage);
                  onUpdateHpRef.current(nextHp);

                  hitFlashUntilRef.current = Date.now() + 250;
                  setIsHitFlashing(true);
                  setTimeout(() => setIsHitFlashing(false), 250);

                  if (nextHp <= 0) {
                    audioEngine.playShatter();
                    shatterRef.current = {
                      active: true,
                      timer: Date.now(),
                      pieces: [
                        {x: soulX - 6, y: soulY - 4, vx: -2, vy: -3, rot: 0, rSpd: -0.1},
                        {x: soulX + 6, y: soulY - 4, vx: 2, vy: -2, rot: 0, rSpd: 0.1},
                        {x: soulX, y: soulY + 6, vx: 0, vy: -4, rot: 0, rSpd: 0.2},
                        {x: soulX - 4, y: soulY + 4, vx: -1.5, vy: -3.5, rot: 0, rSpd: -0.15},
                        {x: soulX + 4, y: soulY + 4, vx: 1.5, vy: -2.5, rot: 0, rSpd: 0.15},
                      ]
                    };
                    setTimeout(() => onGameOverRef.current(), 1500);
                  }
                }
              } else if (b.x >= -40 && b.x <= canvas.width + 40 && b.y >= -40 && b.y <= canvas.height + 40) {
                if (dist < 22 && !b.grazed) {
                  b.grazed = true;
                  audioEngine.playGraze(); // "Tik" sound like TP in Deltarune
                  
                  tpRef.current += 1;
                  if (tpRef.current >= 5) {
                    tpRef.current = 0;
                    setActUsesLeft(prev => prev + 1);
                    audioEngine.playSelect(); // Notify player they got a heal item back
                    
                    // Add a big flashy text spark for ITEM UP
                    grazeSparksRef.current.push({
                      type: 'line',
                      x: soulX,
                      y: soulY - 20,
                      vx: 0,
                      vy: -1,
                      life: 2.0,
                      angle: 0
                    });
                  }
                  
                  // Add Deltarune-style expanding white outline around soul
                  grazeSparksRef.current.push({
                    type: 'soul_outline',
                    x: soulX,
                    y: soulY,
                    vx: 0,
                    vy: 0,
                    life: 1.0,
                    size: 16
                  });

                  // Add small white lines shooting outwards
                  for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI) / 2 + (Math.random() * 0.5 - 0.25);
                    grazeSparksRef.current.push({
                      type: 'line',
                      x: soulX,
                      y: soulY,
                      vx: Math.cos(angle) * 3,
                      vy: Math.sin(angle) * 3,
                      life: 1.0,
                      angle: angle
                    });
                  }
                }
                nextBullets.push(b);
              }
            });

            bulletsRef.current = nextBullets;

            // DRAW DODGE TIMER BAR & TIMER TEXT
            const ratio = Math.max(0, 1 - elapsed / duration);
            const secLeft = Math.max(0, (duration - elapsed) / 1000).toFixed(1);

            ctx.save();
            // Background bar track
            ctx.fillStyle = '#27272a';
            ctx.fillRect(0, 0, canvas.width, 5);

            // Active remaining timer bar track
            ctx.fillStyle = ratio < 0.3 ? '#ef4444' : '#f59e0b';
            ctx.fillRect(0, 0, canvas.width * ratio, 5);

            // Timer text overlay
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText(`⏱️ ${secLeft}s`, canvas.width - 4, 7);
            ctx.restore();

            // DRAW TP (GRAZE) BAR
            ctx.save();
            ctx.fillStyle = tpRef.current >= 5 ? '#facc15' : '#22c55e';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`TP ${Math.min(5, tpRef.current)}/5`, 4, 7);
            
            ctx.fillStyle = '#27272a';
            ctx.fillRect(4, 18, 30, 4);
            ctx.fillStyle = tpRef.current >= 5 ? '#facc15' : '#22c55e';
            ctx.fillRect(4, 18, 30 * (Math.min(5, tpRef.current) / 5), 4);
            ctx.restore();

            // DRAW BULLETS ON CANVAS
            bulletsRef.current.forEach((b) => {
              ctx.save();
              if (b.shape === 'rect') {
                // Indonesian Flag Bullet (Upper Red, Lower White)
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(b.x - 8, b.y - 5, 16, 5);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(b.x - 8, b.y, 16, 5);
                ctx.strokeStyle = '#7f1d1d';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x - 8, b.y - 5, 16, 10);
              } else if (b.shape === 'garuda') {
                // Garuda Emoji Bullet
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🦅', b.x, b.y);
              } else if (b.shape === 'circle') {
                // Bio Cell
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
              } else if (b.shape === 'triangle') {
                // Math Triangle
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.moveTo(b.x, b.y - 7);
                ctx.lineTo(b.x - 7, b.y + 7);
                ctx.lineTo(b.x + 7, b.y + 7);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
              } else if (b.shape === 'square') {
                // Math Square
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x - 6, b.y - 6, 12, 12);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x - 6, b.y - 6, 12, 12);
              } else if (b.shape === 'virus') {
                // Bio Virus
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                  const angle = (Math.PI * 2 / 6) * i + (Date.now() / 300);
                  ctx.beginPath();
                  ctx.moveTo(b.x, b.y);
                  ctx.lineTo(b.x + Math.cos(angle) * (b.size/1.2), b.y + Math.sin(angle) * (b.size/1.2));
                  ctx.stroke();
                }
                ctx.fillStyle = '#111';
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.size / 4, 0, Math.PI * 2);
                ctx.fill();
              } else if (b.shape === 'book') {
                // English Book
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x - 7, b.y - 5, 14, 10);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(b.x - 5, b.y - 4, 4, 8);
                ctx.fillRect(b.x + 1, b.y - 4, 4, 8);
              } else if (b.shape === 'emoji') {
                // General Emojis
                ctx.font = `${b.size + 4}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(b.label || '❓', b.x, b.y);
              } else {
                // Text Bullets (RPL <div/>, Indo Letters, English Verbs)
                ctx.fillStyle = b.color;
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(b.label || '•', b.x, b.y);
              }
              ctx.restore();
            });

            // DRAW GRAZE SPARKS
            grazeSparksRef.current = grazeSparksRef.current.filter((s) => {
              s.x += s.vx;
              s.y += s.vy;
              s.life -= 0.05;
              if (s.life > 0) {
                ctx.save();
                ctx.globalAlpha = s.life;
                if (s.type === 'soul_outline') {
                  const expand = (1.0 - s.life) * 1.5; // Expands as life decreases
                  ctx.translate(s.x, s.y);
                  ctx.scale(1 + expand, 1 + expand);
                  
                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 1.5 / (1 + expand);
                  
                  ctx.beginPath();
                  ctx.moveTo(0, 4);
                  ctx.lineTo(-5, -1);
                  ctx.lineTo(-5, -5);
                  ctx.lineTo(-2, -5);
                  ctx.lineTo(0, -3);
                  ctx.lineTo(2, -5);
                  ctx.lineTo(5, -5);
                  ctx.lineTo(5, -1);
                  ctx.closePath();
                  ctx.stroke();
                } else if (s.type === 'line') {
                  ctx.translate(s.x, s.y);
                  ctx.rotate(s.angle || 0);
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, -1, 8 * s.life, 2); // Shrinks as it fades
                } else {
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(s.x, s.y, 3, 3);
                }
                ctx.restore();
                return true;
              }
              return false;
            });
          } else {
            dodgeStartTime = 0;
            bulletsRef.current = [];
          }

          // DRAW SOUL HEART (PIXEL ART)
          ctx.save();
          
          if (subject === 'math') {
            // Heartbeat effect for final boss (Math teacher)
            const time = Date.now() / 500; // 500ms cycle
            const pulse = Math.max(0, Math.sin(time * Math.PI * 2)) * 0.15; // Pulse up 15%, then rest
            ctx.translate(soulPosRef.current.x, soulPosRef.current.y);
            ctx.scale(1 + pulse, 1 + pulse);
            ctx.translate(-soulPosRef.current.x, -soulPosRef.current.y);
          }

          const isFlashing = Date.now() < hitFlashUntilRef.current;
          ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
          
          const pxSize = 1; // 1 pixel scale (makes it 16x13)
          const heartW = 16 * pxSize;
          const heartH = 13 * pxSize;
          const px = soulPosRef.current.x - heartW / 2;
          const py = soulPosRef.current.y - heartH / 2;
          
          const heartMap = [
            [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
          ];
          
          for (let row = 0; row < heartMap.length; row++) {
            for (let col = 0; col < heartMap[row].length; col++) {
              if (heartMap[row][col] === 1) {
                ctx.fillRect(px + col * pxSize, py + row * pxSize, pxSize, pxSize);
              }
            }
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [subject]);

  // Action Handlers
  const handleObserve = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    setDialogue(`OBSERVE: ATK dan DEF guru tidak diketahui. ${foe.clue}`);
  };

  const handleTalk = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    const hints = [
      "Guru terlihat tidak ingin membuang waktu.",
      "Mungkin jawabannya ada di pelajaran minggu lalu.",
      "Tetap fokus dan perhatikan pilihan gandanya!",
      "Jangan ragu-ragu dalam menjawab."
    ];
    const hint = hints[Math.floor(Math.random() * hints.length)];
    setDialogue(`MERCY: Kamu mencoba berdiskusi. ${foe.label} berkata: "${hint}"`);
  };

  const handleAct = () => {
    if (actUsesLeft <= 0) {
      setDialogue('Buku catatanmu sudah habis dipakai! Tidak dapat heal lagi di ujian ini.');
      return;
    }

    audioEngine.playHeal();
    setShowQuestions(false);
    setActUsesLeft((prev) => prev - 1);

    const healedHp = Math.min(progress.maxHp, progress.hp + 3);
    onUpdateHp(healedHp);

    setDialogue(`ACT: Kamu membuka catatan pelajaran. +3 HP! (Sisa ACT Heal: ${actUsesLeft - 1}/3)`);
  };

  const handleThink = () => {
    audioEngine.playSelect();
    setShowQuestions(true);
    setQuestionTimer(progress.difficulty === "extreme" ? 15 : progress.difficulty === "hard" ? 20 : 0);
    setEssayAnswer("");
    setDialogue('Pilihlah jawaban yang tepat dari opsi berikut:');
  };

  // Manual Trigger for Bullet Dodge Phase Practice
  const handleTriggerDodge = () => {
    audioEngine.playSelect();
    setShowQuestions(false);
    centerSoul();
    setIsDodging(true);
    setDialogue(`SERANGAN PELURU! ${foe.label} melancarkan ${foe.attack}. Gunakan WASD / Panah / Tombol untuk menghindar!`);
  };

  const handleAnswer = (answerIdx: number | string) => {
    setShowQuestions(false);
    const currentQ = questions[qIndex % questions.length];
    setTotalQuestionsAnswered(prev => prev + 1);

    let isCorrect = false;
    if (typeof answerIdx === 'number') {
      isCorrect = answerIdx === currentQ.ok;
    } else {
      // Essay check
      isCorrect = currentQ.a[currentQ.ok].toLowerCase().includes(answerIdx.toLowerCase().trim()) && answerIdx.trim().length > 0;
    }

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      audioEngine.playCorrect();
      
      if (subject === 'math') {
        const nextFoeHp = foeHp - 1;
        setFoeHp(nextFoeHp);
        if (nextFoeHp <= 0) {
          audioEngine.playVictory();
          setDialogue(`LULUS! ${foe.label} tersenyum bangga dan memberikan sertifikat kelulusan pelajaran!`);
          setTimeout(() => onVictory(subject, { 
    correct: (correctAnswers + 1) * (progress.difficulty === 'extreme' ? 2.3 : progress.difficulty === 'hard' ? 1.5 : 1), 
    total: totalQuestionsAnswered + 1 
  }), 1200);
        } else {
          setQIndex(prev => prev + 1);
          centerSoul();
          setIsMathCorrectDodge(true);
          setIsDodging(true);
          setDialogue(`BENAR! Tapi Geometri tidak semudah itu! Bertahanlah!`);
        }
      } else {
        const nextFoeHp = foeHp - 1;
        setFoeHp(nextFoeHp);
        if (nextFoeHp <= 0) {
          audioEngine.playVictory();
          setDialogue(`LULUS! ${foe.label} tersenyum bangga dan memberikan sertifikat kelulusan pelajaran!`);
          setTimeout(() => onVictory(subject, { 
    correct: (correctAnswers + 1) * (progress.difficulty === 'extreme' ? 2.3 : progress.difficulty === 'hard' ? 1.5 : 1), 
    total: totalQuestionsAnswered + 1 
  }), 1200);
        } else {
          setQIndex(prev => prev + 1);
          setDialogue(`BENAR! ${currentQ.explanation || 'Jawabanmu tepat!'}`);
        }
      }
    } else {
      audioEngine.playWrong();
      if (subject === 'math') {
        setFoeHp(prev => prev + 1);
      }
      centerSoul();
      setIsMathCorrectDodge(false);
      setIsDodging(true);
      setDialogue(`KURANG TEPAT! ${foe.label} melancarkan serangan peluru! Gunakan WASD / Panah / Touch untuk menghindar!`);
    }
  };

  // Render Teacher Sprite on Canvas
  const teacherCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = teacherCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTeacherSprite(ctx, 24, 10, subject, 4, true);
  }, [subject]);

  const moveSoulBy = (dx: number, dy: number) => {
    soulPosRef.current.x = Math.max(8, Math.min(232, soulPosRef.current.x + dx));
    soulPosRef.current.y = Math.max(8, Math.min(112, soulPosRef.current.y + dy));
  };

  const currentQ = questions[qIndex % questions.length];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isDodging) return; // Don't trigger actions if dodging

      if (showQuestions && currentQ.qType !== 'essay') {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleAnswer(0);
        if (e.key === '2' || e.key.toLowerCase() === 'b') handleAnswer(1);
        if (e.key === '3' || e.key.toLowerCase() === 'c') handleAnswer(2);
        if (e.key === '4' || e.key.toLowerCase() === 'd') handleAnswer(3);
      } else if (!showQuestions) {
        if (e.key === '1' || e.key.toLowerCase() === 'z') handleThink();
        if (e.key === '2' || e.key.toLowerCase() === 'x') handleObserve();
        if (e.key === '3' || e.key.toLowerCase() === 'c') handleAct();
        if (e.key === '4' || e.key.toLowerCase() === 'v') handleTalk();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDodging, showQuestions, currentQ]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto font-mono text-white select-none">
      {/* Top Battle Stage */}
      <div className="w-full bg-slate-100 border-x-8 border-t-8 border-amber-900 p-6 rounded-t flex flex-wrap items-center justify-between gap-6 relative overflow-hidden min-h-[260px]">
        {/* Background CRT scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Board / Question Display Header */}
        <div className="flex-1 bg-emerald-900 border-4 border-amber-900 p-4 rounded shadow-lg text-center">
          <span className="text-xs uppercase text-emerald-300 font-bold block mb-1">
            BOARD UJIAN {foe.roomName}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {showQuestions ? currentQ.q : foe.q}
          </h3>
        </div>

        {/* Teacher Sprite Preview */}
        <div className="flex flex-col items-center">
          <canvas ref={teacherCanvasRef} width={140} height={130} className="animate-pulse" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs font-bold text-amber-950 mt-1 bg-amber-100 px-2 py-0.5 border-2 border-amber-900 rounded">
            {foe.label}
          </span>
        </div>
      </div>

      {/* Soul Dodge Box (60FPS Canvas Undertale Arena) */}
      <div className="w-full bg-black border-x-8 border-amber-900 p-4 flex flex-col items-center justify-center relative">
        <div className="flex items-center justify-between w-full max-w-[240px] mb-1 text-xs">
          <span className="text-zinc-400 font-bold flex flex-col">
            <span>{isDodging ? '⚠️ SERANGAN PELURU AKTIF!' : 'ARENA JIWA ♥'}</span>
            {isDodging && <span className="text-[10px] text-yellow-400 font-normal">Gunakan WASD (Atas/Bawah/Kiri/Kanan) / Panah / D-Pad untuk menghindari!</span>}
          </span>
          
        </div>

        {/* POV Book and Pencil (only visible during showQuestions or dodge) */}
        {showQuestions && (
          <div className="absolute bottom-0 right-4 md:right-12 z-20 pointer-events-none opacity-90 transition-opacity">
            {/* Simple CSS Illustration of a hand holding a pencil over a notebook */}
            <div className="relative w-48 h-32">
              <div className="absolute bottom-[-20px] left-[-20px] w-56 h-40 bg-zinc-200 border-2 border-zinc-400 rounded-sm transform rotate-[-5deg] shadow-lg">
                <div className="w-full h-full border-l-4 border-red-400 pl-4 space-y-3 pt-4">
                  <div className="w-3/4 h-0.5 bg-blue-300"></div>
                  <div className="w-5/6 h-0.5 bg-blue-300"></div>
                  <div className="w-4/5 h-0.5 bg-blue-300"></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-40 bg-[#e0ac69] rounded-full transform rotate-[-30deg] origin-bottom shadow-[inset_-4px_0_0_rgba(0,0,0,0.1)]"></div>
              <div className="absolute bottom-16 right-8 w-4 h-24 bg-yellow-400 rounded-sm transform rotate-[60deg] border-2 border-yellow-600">
                <div className="absolute top-[-8px] left-[-2px] w-4 h-3 bg-zinc-300 border-2 border-zinc-500 rounded-t-sm"></div>
                <div className="absolute bottom-[-10px] left-0 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#d4a373]"></div>
                <div className="absolute bottom-[-14px] left-[2px] w-1 h-2 bg-zinc-800"></div>
              </div>
            </div>
          </div>
        )}

        {/* Arena Canvas Frame */}
        <div
          className={`border-4 ${
            isHitFlashing ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'border-white'
          } relative shadow-inner`}
        >
          <canvas
            ref={arenaCanvasRef}
            width={240}
            height={120}
            className="block bg-black"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Touch D-Pad Controls for Soul Dodge on Mobile */}
        {isDodging && (
          <div className="mt-2 flex justify-between items-center touch-none select-none w-full max-w-[280px] mx-auto">
            {/* Left Side: Up/Down */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); keysPressedRef.current['ArrowUp'] = true; }}
                onPointerUp={() => keysPressedRef.current['ArrowUp'] = false}
                onPointerLeave={() => keysPressedRef.current['ArrowUp'] = false}
                onPointerCancel={() => keysPressedRef.current['ArrowUp'] = false}
                className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors"
              >
                <ArrowUp size={24} />
              </button>
              <button
                onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); keysPressedRef.current['ArrowDown'] = true; }}
                onPointerUp={() => keysPressedRef.current['ArrowDown'] = false}
                onPointerLeave={() => keysPressedRef.current['ArrowDown'] = false}
                onPointerCancel={() => keysPressedRef.current['ArrowDown'] = false}
                className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors"
              >
                <ArrowDown size={24} />
              </button>
            </div>
            
            <div className="text-[10px] text-zinc-400 font-bold text-center leading-tight mx-2 opacity-50 flex-1">
               KONTROL JIWA
            </div>

            {/* Right Side: Left/Right */}
            <div className="flex gap-2 shrink-0">
              <button
                onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); keysPressedRef.current['ArrowLeft'] = true; }}
                onPointerUp={() => keysPressedRef.current['ArrowLeft'] = false}
                onPointerLeave={() => keysPressedRef.current['ArrowLeft'] = false}
                onPointerCancel={() => keysPressedRef.current['ArrowLeft'] = false}
                className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); keysPressedRef.current['ArrowRight'] = true; }}
                onPointerUp={() => keysPressedRef.current['ArrowRight'] = false}
                onPointerLeave={() => keysPressedRef.current['ArrowRight'] = false}
                onPointerCancel={() => keysPressedRef.current['ArrowRight'] = false}
                className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Container for Dialogue and Actions with transition animation */}
      <div key={isDodging ? 'dodge' : 'action'} className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Dialogue / Multiple Choice Answers Container */}
        <div className="w-full bg-zinc-900 border-x-8 border-t-4 border-amber-900 p-4 min-h-[110px]">
          {showQuestions ? (
            <div className="flex flex-col h-full overflow-y-auto pr-2 relative">
              {progress.difficulty !== 'normal' && (
                <div className="absolute top-0 right-0 text-red-500 font-bold text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] animate-pulse">
                  ⏳ {questionTimer}s
                </div>
              )}
              <span className="text-yellow-400 font-bold text-xs mb-1">SOAL {qIndex % questions.length + 1} / {questions.length} - {currentQ.qType === 'essay' ? 'ESAI' : 'PILIHAN GANDA'}</span>
              <span className="text-zinc-300 font-bold text-sm mb-4 leading-relaxed pr-10">
                {currentQ.q}
              </span>
              {currentQ.qType === 'essay' ? (
                <div className="flex flex-col gap-2 mt-auto">
                  <input 
                    type="text" 
                    value={essayAnswer}
                    onChange={(e) => setEssayAnswer(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAnswer(essayAnswer); }}
                    placeholder="Ketik jawaban (singkat)..."
                    className="p-3 bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 text-white font-bold rounded outline-none w-full"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleAnswer(essayAnswer)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold p-2 rounded"
                  >SUBMIT JAWABAN</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto">
                  {currentQ.a.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="p-2.5 bg-zinc-900 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-300 text-left font-bold text-xs rounded transition-colors"
                    >
                      <span className="text-yellow-400 mr-2">[{idx + 1} atau {String.fromCharCode(65 + idx)}]</span>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-zinc-200 flex items-start gap-2">
              <span className="text-yellow-400 font-bold">💬</span>
              <span>{dialogue}</span>
            </p>
          )}
        </div>

        {/* BIG FIGHT BUTTON (Separated) */}
        <div className="w-full bg-zinc-900 border-x-8 border-amber-900 p-3 flex justify-center">
          <button
            onClick={handleThink}
            disabled={isDodging}
            className="w-full sm:w-2/3 py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 disabled:opacity-40 text-black font-extrabold text-lg sm:text-xl rounded-xl border-4 border-yellow-200 shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Brain size={24} /> <span>JAWAB SOAL (FIGHT) [1]</span>
          </button>
        </div>

        {/* Other Command Action Bar */}
        <div className="w-full bg-zinc-900 border-x-8 border-b-8 border-amber-900 p-3 grid grid-cols-3 gap-2 rounded-b">
          <button
            onClick={handleObserve}
            disabled={isDodging}
            className="relative group py-3 px-2 bg-zinc-800 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
          >
            <div className="flex items-center gap-1"><Eye size={16} /> <span>CEK [2]</span></div>
            <span className="text-[10px] font-normal text-zinc-400 group-hover:text-yellow-200">(Info Lawan)</span>
          </button>
          <button
            onClick={handleAct}
            disabled={isDodging}
            className="relative group py-3 px-2 bg-zinc-800 border-2 border-zinc-600 hover:border-green-400 hover:text-green-300 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
          >
            <div className="flex items-center gap-1"><Heart size={16} /> <span>ITEM [3]</span></div>
            <span className="text-[10px] font-normal text-zinc-400 group-hover:text-green-200">({actUsesLeft}x Sisa)</span>
          </button>
          <button
            onClick={handleTalk}
            disabled={isDodging}
            className="relative group py-3 px-2 bg-zinc-800 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
          >
            <div className="flex items-center gap-1"><MessageSquare size={16} /> <span>MERCY [4]</span></div>
            <span className="text-[10px] font-normal text-zinc-400 group-hover:text-yellow-200">(Diskusi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
