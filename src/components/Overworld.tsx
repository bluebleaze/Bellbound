import React, { useRef, useEffect, useState } from 'react';
import { PlayerCustomization, SubjectId, GAME_SCHEDULE } from '../types';
import { FOES } from '../data/questions';
import { drawPlayerSprite, drawTeacherSprite, drawDeskSprite, drawDoorSprite, drawPixelRect } from './PixelSprites';
import { audioEngine } from '../utils/AudioEngine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface OverworldProps {
  currentRoom: 'hall' | SubjectId;
  customization: PlayerCustomization;
  completedSubjects: SubjectId[];
  onEnterBattle: (subject: SubjectId) => void;
  onChangeRoom: (room: 'hall' | SubjectId) => void;
}

export const Overworld: React.FC<OverworldProps> = ({
  currentRoom,
  customization,
  completedSubjects,
  onEnterBattle,
  onChangeRoom,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in 640x360 canvas space
  const [playerPos, setPlayerPos] = useState({ x: 60, y: 220 });
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [walkFrame, setWalkFrame] = useState(0);
  const [nearTeacher, setNearTeacher] = useState<SubjectId | null>(null);
  const [dialogueText, setDialogueText] = useState('');
  const isDoorUnlocked = (id: string) => {
    if (completedSubjects.length === 0) return id === 'pkn';
    if (id === 'math') return completedSubjects.length === 5;
    return true;
  };
  

  // Keyboard state
  const keysPressed = useRef<Record<string, boolean>>({});
  const lastWalkTime = useRef(Date.now());
  const playerPosRef = useRef(playerPos);
  const directionRef = useRef(direction);
  const walkFrameRef = useRef(walkFrame);
  const nearTeacherRef = useRef(nearTeacher);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  useEffect(() => {
    walkFrameRef.current = walkFrame;
  }, [walkFrame]);
  useEffect(() => {
    nearTeacherRef.current = nearTeacher;
  }, [nearTeacher]);

  const handleAutoWalkToTeacher = () => {
    if (currentRoom === 'hall') return;
    audioEngine.playSelect();
    setDialogueText(`Berjalan menghampiri ${FOES[currentRoom].label}...`);
    
    let stepIndex = 0;
    const walkRoute = [
      { x: 50, y: 135 },
      { x: 180, y: 135 },
      { x: 320, y: 135 },
      { x: 470, y: 135 },
    ];
    
    const stepInterval = setInterval(() => {
      if (stepIndex < walkRoute.length) {
        setPlayerPos(walkRoute[stepIndex]);
        setDirection('right');
        setWalkFrame(f => f + 1);
        audioEngine.playStep();
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        setNearTeacher(currentRoom);
        setDialogueText(`${FOES[currentRoom].label}: "Selamat datang! Tekan tombol Mulai Ujian di bawah untuk memulai!"`);
      }
    }, 120);
  };

  useEffect(() => {
    // Reset position on room change
    setPlayerPos({ x: 50, y: 210 });

    if (currentRoom === 'hall') {
      if (completedSubjects.length === 5) {
        setDialogueText('Semua 5 guru mata pelajaran telah selesai. Geometry Keeper menunggu di tengah hall!');
      } else {
        setDialogueText('Hall sekolah sunyi. Pilih pintu kelas pelajaran yang belum kamu selesaikan.');
      }
    } else {
      const foe = FOES[currentRoom];
      if (completedSubjects.includes(currentRoom)) {
        setDialogueText(`${foe.label} tersenyum: "Kamu sudah menguasai materi ${foe.name}. Kerja bagus!"`);
      } else {
        setDialogueText(`${foe.label} menunggu di dekat papan tulis. Dekati beliau untuk memulai ujian.`);
      }
    }
  }, [currentRoom, completedSubjects]);

  // Main 60FPS Render Loop with Continuous Animations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.imageSmoothingEnabled = false;

      // Clear background
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentRoom === 'hall') {
        // HALLWAY BACKGROUND
        // Floors
        ctx.fillStyle = '#e2e8f0'; // light slate floor
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#cbd5e1'; // darker tile checker
        for(let i=0; i<canvas.width; i+=40) {
          for(let j=0; j<canvas.height; j+=40) {
            if((i+j)%80 === 0) ctx.fillRect(i, j, 40, 40);
          }
        }

        // Walls
        ctx.fillStyle = '#e7e5e4';
        ctx.fillRect(0, 0, canvas.width, 100);
        
        // Baseboard
        ctx.fillStyle = '#78716c';
        ctx.fillRect(0, 100, canvas.width, 10);

        // Title Banner on Wall
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(180, 5, 280, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(180, 5, 280, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LORONG UTAMA SEKOLAH', 320, 22);

        const doorsList: { id: SubjectId; x: number; label: string }[] = [
          { id: 'pkn', x: 20, label: 'KELAS PKN' },
          { id: 'rpl', x: 130, label: 'LAB RPL' },
          { id: 'indo', x: 240, label: 'PERPUS' },
          { id: 'inggris', x: 350, label: 'ENG LAB' },
          { id: 'bio', x: 460, label: 'LAB BIO' },
          { id: 'math', x: 570, label: 'UJIAN' },
        ];

        // Draw Windows & Lockers between doors
        for(let x = 80; x < 600; x += 110) {
          // Locker
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x, 40, 30, 60);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x+2, 42, 26, 56);
          // Window
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x + 40, 30, 40, 40);
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(x + 42, 32, 17, 36);
          ctx.fillRect(x + 61, 32, 17, 36);
        }

        // Draw Plants
        ctx.fillStyle = '#166534';
        ctx.fillRect(10, 80, 15, 20);
        ctx.fillStyle = '#15803d';
        ctx.beginPath(); ctx.arc(17, 75, 12, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = '#166534';
        ctx.fillRect(615, 80, 15, 20);
        ctx.fillStyle = '#15803d';
        ctx.beginPath(); ctx.arc(622, 75, 12, 0, Math.PI*2); ctx.fill();

        // Draw doors
        const currentLevel = completedSubjects.length;
        const SCHEDULE: SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
        const currentSubject = SCHEDULE[Math.min(currentLevel, 5)];

        doorsList.forEach((d) => {
          const isDone = completedSubjects.includes(d.id);
          const isCurrent = d.id === currentSubject;
          let label = d.label;
          if (isDone) label += ' ✓';
          const unlocked = isDoorUnlocked(d.id);
          if (!isDone && !unlocked) label = 'TERKUNCI';
          
          drawDoorSprite(ctx, d.x, 80, label, isDone || (!isDone && !unlocked));
          
          // HIGHLIGHT ACTIVE UNLOCKED DOOR
          if (unlocked && !isDone) {
            const pulse = Math.sin(Date.now() / 200);
            const bounce = Math.sin(Date.now() / 150) * 4;

            ctx.strokeStyle = `rgba(250, 204, 21, ${0.7 + pulse * 0.3})`;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(d.x - 2, 78, 44, 64);

            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('↓', d.x + 20, 68 + bounce);
            
            ctx.font = 'bold 8px monospace';
            ctx.fillText('MASUK', d.x + 20, 52 + bounce);
          }
        });

        // If 5 subjects cleared, Geometry Keeper appears in front of Math door
        if (currentLevel === 5) {
          const pulse = Math.sin(Date.now() / 200);
          ctx.strokeStyle = `rgba(192, 132, 252, ${0.7 + pulse * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(595, 145, 24 + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();

          drawTeacherSprite(ctx, 580, 130, 'math', 3);
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('GEOMETRY KEEPER', 595, 115);
        }
      } else {
        // CLASSROOM BACKGROUND
        const foe = FOES[currentRoom];

        // Classroom Floor
        // Gradient Wall (Cream/Warm White)
        const wallGrad = ctx.createLinearGradient(0, 0, 0, 130);
        wallGrad.addColorStop(0, '#f8fafc'); // top light
        wallGrad.addColorStop(1, '#cbd5e1'); // bottom shadow
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, canvas.width, 130);
        
        // Wall details (windows)
        ctx.fillStyle = '#bae6fd'; // sky blue glass
        ctx.fillRect(20, 20, 100, 60);
        ctx.fillRect(520, 20, 100, 60);
        ctx.strokeStyle = '#94a3b8'; // window frame
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 100, 60);
        ctx.strokeRect(520, 20, 100, 60);
        // Window panes
        ctx.beginPath(); ctx.moveTo(70, 20); ctx.lineTo(70, 80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(120, 50); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(570, 20); ctx.lineTo(570, 80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(520, 50); ctx.lineTo(620, 50); ctx.stroke();

        // Baseboard trim
        drawPixelRect(ctx, 0, 125, canvas.width, 15, '#475569'); 
        drawPixelRect(ctx, 0, 125, canvas.width, 2, '#334155'); 

        // Modern Tiled Floor
        drawPixelRect(ctx, 0, 140, canvas.width, 220, '#f1f5f9'); 
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x - 40, canvas.height); ctx.stroke();
        }
        for (let y = 140; y < canvas.height; y += 20) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Large Chalkboard in center wall
        const boardW = 340;
        const boardH = 90;
        const boardX = 150;
        const boardY = 15;
        
        // Wooden Frame
        drawPixelRect(ctx, boardX - 8, boardY - 8, boardW + 16, boardH + 16, '#78350f'); // Outer frame
        drawPixelRect(ctx, boardX - 4, boardY - 4, boardW + 8, boardH + 8, '#451a03'); // Inner shadow
        
        // Green Board Surface
        drawPixelRect(ctx, boardX, boardY, boardW, boardH, '#14532d'); 
        // Chalk dust smudges
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(boardX + 20, boardY + 20, 100, 30);
        ctx.fillRect(boardX + 200, boardY + 40, 80, 40);

        // Chalkboard text
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        // Small shadow for chalk text
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(`[ ${foe.roomName} - ${foe.name} ]`, 321, 46);
        ctx.fillStyle = '#fef08a';
        ctx.fillText(`[ ${foe.roomName} - ${foe.name} ]`, 320, 45);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(foe.q, 320, 75);

        // Chalk Tray
        drawPixelRect(ctx, boardX, boardY + boardH, boardW, 6, '#b45309');
        // Eraser & Chalk
        drawPixelRect(ctx, boardX + 40, boardY + boardH - 4, 12, 4, '#1e293b'); // eraser
        drawPixelRect(ctx, boardX + 60, boardY + boardH - 2, 4, 2, '#ffffff'); // chalk

        // Classroom Furniture (Desks: 3 columns x 4 rows)
        const startX = 165;
        const startY = 165;
        for (let col = 0; col < 3; col++) {
          for (let row = 0; row < 4; row++) { 
            const dx = startX + (col * 120); 
            const dy = startY + (row * 45);
            drawDeskSprite(ctx, dx, dy, 70, 32);
          }
        }

        // Exit door
        drawDoorSprite(ctx, 20, 50, 'HALL SEKOLAH', completedSubjects.includes(currentRoom));

        // 🌟 TEACHER HIGHLIGHTING (Pulsing aura, floor trail, beacon, bouncing badge) 🌟
        const pulse = Math.sin(Date.now() / 200);

        // Radiant Glowing Aura & Spotlight behind/under Teacher
        const auraGrad = ctx.createRadialGradient(540, 105, 5, 540, 105, 48 + pulse * 6);
        auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.65)');
        auraGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.35)');
        auraGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(540, 105, 48 + pulse * 6, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing outer ring
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.7 + pulse * 0.3})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Sparkles around teacher
        for (let i = 0; i < 4; i++) {
          const angle = (Date.now() / 450) + (i * Math.PI / 2);
          const spX = 540 + Math.cos(angle) * (38 + pulse * 4);
          const spY = 95 + Math.sin(angle) * (20 + pulse * 4);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(spX - 2, spY - 2, 4, 4);
        }

        // Guiding Trail on the Floor if player is not near teacher
        if (!nearTeacherRef.current) {
          const trail = [
            { x: 60, y: 190 },
            { x: 60, y: 145 },
            { x: 60, y: 135 },
            { x: 120, y: 135 },
            { x: 180, y: 135 },
            { x: 240, y: 135 },
            { x: 300, y: 135 },
            { x: 360, y: 135 },
            { x: 420, y: 135 },
            { x: 470, y: 135 },
          ];
          const stepOffset = Math.floor((Date.now() / 250) % trail.length);
          trail.forEach((pt, idx) => {
            const isActive = idx === stepOffset || (idx + 1) % trail.length === stepOffset;
            ctx.fillStyle = isActive ? '#fde047' : 'rgba(250, 204, 21, 0.35)';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isActive ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fill();
            if (isActive) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          });
        }

        // Draw Teacher Sprite (standing behind the desk)
        drawTeacherSprite(ctx, 520, 80, currentRoom, 3);

        // Bouncing Floating Badge & Arrow Above Teacher
        const bounceY = Math.sin(Date.now() / 150) * 5;
        const arrowY = 46 + bounceY;

        const badgeText = `[ ${foe.label} - GURU ]`;
        ctx.font = 'bold 11px monospace';
        const tw = ctx.measureText(badgeText).width;

        ctx.fillStyle = '#facc15';
        ctx.fillRect(540 - tw/2 - 8, arrowY - 20, tw + 16, 18);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(540 - tw/2 - 8, arrowY - 20, tw + 16, 18);

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText, 540, arrowY - 6);

        // Bouncing yellow downward pointer arrow
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(540, arrowY + 2);
        ctx.lineTo(532, arrowY - 6);
        ctx.lineTo(548, arrowY - 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Teacher's Desk (drawn after teacher to cover their legs properly)
        drawDeskSprite(ctx, 500, 130, 90, 35);

        // Golden glowing trim on teacher desk
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.6 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(498, 128, 94, 39);
      }

      // Draw Player Sprite
      drawPlayerSprite(ctx, playerPosRef.current.x, playerPosRef.current.y, customization, directionRef.current, walkFrameRef.current, 2.5);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentRoom, customization, completedSubjects]);

  // Movement & Collision Check Loop
  useEffect(() => {
    const handleMove = () => {
      let dx = 0;
      let dy = 0;
      const speed = 4;

      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
        dx -= speed;
        setDirection('left');
      } else if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
        dx += speed;
        setDirection('right');
      }

      if (keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current['W']) {
        dy -= speed;
        setDirection('up');
      } else if (keysPressed.current['ArrowDown'] || keysPressed.current['s'] || keysPressed.current['S']) {
        dy += speed;
        setDirection('down');
      }

      if (dx !== 0 || dy !== 0) {
        const now = Date.now();
        if (now - lastWalkTime.current > 200) {
           audioEngine.playStep();
           setWalkFrame((f) => f + 1);
           lastWalkTime.current = now;
        }
        setPlayerPos((prev) => {
          let newX = Math.max(10, Math.min(590, prev.x + dx));
          let newY = Math.max(110, Math.min(290, prev.y + dy));

          if (currentRoom !== 'hall') {
            const checkCollision = (cx: number, cy: number) => {
              const px = cx + 20; // center of player
              const py = cy + 55; // feet of player
              // Check student desks
              for (let col = 0; col < 3; col++) {
                for (let row = 0; row < 4; row++) {
                  const dx = 165 + (col * 120);
                  const dy = 165 + (row * 45);
                  // Desk is 70x32. Tighten padding so player can weave between desks.
                  if (px > dx - 5 && px < dx + 75 && py > dy + 5 && py < dy + 32) return true;
                }
              }
              // Check teacher desk (90x35)
              if (px > 500 - 5 && px < 500 + 95 && py > 130 + 5 && py < 130 + 35) return true;
              return false;
            };

            if (checkCollision(newX, prev.y)) newX = prev.x;
            if (checkCollision(prev.x, newY)) newY = prev.y;
            if (checkCollision(newX, newY)) {
              newX = prev.x;
              newY = prev.y;
            }
          }

          // Check Proximity to Teachers / Doors
          if (currentRoom === 'hall') {
            // Check doors to classrooms
            const SCHEDULE: import('../types').SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
            const currentLevel = completedSubjects.length;
            const currentSubject = SCHEDULE[Math.min(currentLevel, 5)];

            const doorLocs: { id: import('../types').SubjectId; x: number }[] = [
              { id: 'pkn', x: 20 },
              { id: 'rpl', x: 130 },
              { id: 'indo', x: 240 },
              { id: 'inggris', x: 350 },
              { id: 'bio', x: 460 },
              { id: 'math', x: 570 },
            ];

            doorLocs.forEach((d) => {
              // Only allow entry if it's the current subject
              if (Math.abs(newX - d.x) < 30 && newY < 125) {
                if (isDoorUnlocked(d.id)) {
                  onChangeRoom(d.id);
                } else if (completedSubjects.includes(d.id)) {
                  setDialogueText('Kelas ini sudah selesai.');
                } else {
                  setDialogueText('Kelas ini terkunci. Cek jadwalmu!');
                }
              }
            });

            // Geometry Keeper check
            if (completedSubjects.length === 5 && Math.abs(newX - 580) < 40 && Math.abs(newY - 140) < 40) {
              setNearTeacher('math');
            } else {
              setNearTeacher(null);
            }
          } else {
            // Classroom: Exit door check
            if (Math.abs(newX - 20) < 35 && newY < 125) {
              if (currentRoom === 'pkn' && !completedSubjects.includes('pkn')) {
                setDialogueText('Pak Arif (GURU PKN) tersenyum: "Selesaikan ujian PKN terlebih dahulu sebelum pergi ke lorong!"');
              } else {
                onChangeRoom('hall');
              }
            }

            // Teacher check
            if (Math.abs(newX - 520) < 60 && Math.abs(newY - 130) < 50) {
              setNearTeacher(currentRoom);
            } else {
              setNearTeacher(null);
            }
          }

          return { x: newX, y: newY };
        });
      }
    };

    const interval = setInterval(handleMove, 35);
    return () => clearInterval(interval);
  }, [currentRoom, completedSubjects, onChangeRoom]);


  const handleInteractTeacher = (teacher: SubjectId) => {
    if (!isDoorUnlocked(teacher)) {
      setDialogueText(`${FOES[teacher].name}: "Maaf, kamu belum boleh mengambil kelas ini. Cek jadwalmu!"`);
    } else {
      onEnterBattle(teacher);
    }
  };

  // Key listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.key.toUpperCase()] = true;

      // Space / Enter to talk to near teacher
      if ((e.key === ' ' || e.key === 'Enter') && nearTeacher) {
        onEnterBattle(nearTeacher);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.key.toUpperCase()] = false;
    };

    const onBlur = () => {
      keysPressed.current = {};
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [nearTeacher, onEnterBattle]);

  // Virtual D-Pad Helper for Mobile / Mouse
  const pressDirection = (dirKey: string, active: boolean) => {
    keysPressed.current[dirKey] = active;
  };

  // Canvas Click / Tap Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentRoom !== 'hall') {
      if (nearTeacher) {
        handleInteractTeacher(nearTeacher);
      } else {
        handleAutoWalkToTeacher();
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto font-mono text-white select-none">
      {/* Gelar Karya Visitor Guidance Banner */}
      <div className="w-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black px-4 py-2.5 font-bold text-xs sm:text-sm border-x-4 border-t-4 border-white flex flex-wrap items-center justify-between gap-2 shadow-lg rounded-t">
        <div className="flex items-center gap-2">
          <span className="bg-black text-yellow-400 text-xs px-2 py-0.5 rounded font-black tracking-wider uppercase">INFO</span>
          <span className="font-extrabold">
            {currentRoom === 'hall'
              ? 'LORONG SEKOLAH: Pilih pintu kelas yang menyala untuk mulai ujian.'
              : `KELAS ${FOES[currentRoom].roomName.toUpperCase()}: Temui ${FOES[currentRoom].label} di meja depan.`}
          </span>
        </div>
        {currentRoom !== 'hall' && (
          <button
            onClick={handleAutoWalkToTeacher}
            className="bg-black text-yellow-300 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-black border-2 border-yellow-200 shadow flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>HAMPIRI GURU (OTOMATIS)</span>
          </button>
        )}
      </div>

      {/* Main Pixel Canvas Scene */}
      <div className="relative border-4 border-white border-t-0 bg-black shadow-2xl overflow-hidden w-full aspect-[16/9] cursor-pointer" onClick={handleCanvasClick}>
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }}
        />
        
        {/* LOGO SEKOLAH */}
        {currentRoom === 'hall' && (
          <img 
            src="/logo.png" 
            alt="Logo Sekolah" 
            className="absolute opacity-80 mix-blend-screen drop-shadow-md pointer-events-none"
            style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', width: '8%', imageRendering: 'pixelated' }} 
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        )}
        {currentRoom !== 'hall' && (
          <img 
            src="/logo.png" 
            alt="Logo Sekolah" 
            className="absolute opacity-30 pointer-events-none"
            style={{ top: '7%', left: '26%', width: '6%', filter: 'grayscale(100%) brightness(150%)', imageRendering: 'pixelated' }} 
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        )}

        {/* Floating Callout Over Teacher in Canvas (Click to Talk) */}
        {currentRoom !== 'hall' && !nearTeacher && (
          <button
            onClick={(e) => { e.stopPropagation(); handleAutoWalkToTeacher(); }}
            className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-300 text-black px-3.5 py-1.5 border-2 border-black rounded-xl font-black text-xs shadow-2xl animate-pulse flex items-center gap-1.5 cursor-pointer z-10"
          >
            <span>HAMPIRI GURU (KLIK)</span>
          </button>
        )}

        {/* Large Prominent Action Prompt when Near Teacher */}
        {nearTeacher && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-yellow-400 text-black p-3.5 border-4 border-black rounded-2xl font-bold text-center shadow-2xl animate-bounce z-20">
            <div className="text-xs uppercase tracking-wider text-black font-extrabold mb-1.5 flex items-center justify-center gap-1">
              <span>GURU TELAH MENUNGGU</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleInteractTeacher(nearTeacher); }}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 font-black text-base sm:text-lg border-2 border-yellow-300 rounded-xl shadow-lg active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>[ MULAI UJIAN BERSAMA {FOES[nearTeacher].label} (KLIK DISINI) ]</span>
            </button>
          </div>
        )}
      </div>

      {/* Dialogue Text Box */}
      <div className="w-full bg-zinc-950 border-x-4 border-b-4 border-white p-4 min-h-[80px] text-sm sm:text-base leading-relaxed text-zinc-200">
        <p className="flex items-start gap-2.5">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider bg-zinc-900 border border-zinc-700 px-2 py-1 rounded shrink-0">PESAN</span>
          <span className="font-semibold">{dialogueText}</span>
        </p>
      </div>

      {/* Mobile Touch Controller (D-Pad & Action Button) */}
      <div className="w-full bg-zinc-900 border-4 border-t-0 border-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-6 touch-none select-none rounded-b">
        
        {/* Touch D-Pad Controls for Overworld on Mobile */}
        <div className="flex justify-between items-center touch-none select-none w-full max-w-[280px]" onContextMenu={(e) => e.preventDefault()}>
          {/* Left Side: Up/Down */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowUp', true); }}
              onPointerUp={() => pressDirection('ArrowUp', false)}
              onPointerLeave={() => pressDirection('ArrowUp', false)}
              onPointerCancel={() => pressDirection('ArrowUp', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded-xl flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none font-bold"
            >
              <ArrowUp size={24} />
            </button>
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowDown', true); }}
              onPointerUp={() => pressDirection('ArrowDown', false)}
              onPointerLeave={() => pressDirection('ArrowDown', false)}
              onPointerCancel={() => pressDirection('ArrowDown', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded-xl flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none font-bold"
            >
              <ArrowDown size={24} />
            </button>
          </div>
          
          {/* Right Side: Left/Right */}
          <div className="flex gap-2 shrink-0">
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowLeft', true); }}
              onPointerUp={() => pressDirection('ArrowLeft', false)}
              onPointerLeave={() => pressDirection('ArrowLeft', false)}
              onPointerCancel={() => pressDirection('ArrowLeft', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded-xl flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none font-bold"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowRight', true); }}
              onPointerUp={() => pressDirection('ArrowRight', false)}
              onPointerLeave={() => pressDirection('ArrowRight', false)}
              onPointerCancel={() => pressDirection('ArrowRight', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded-xl flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none font-bold"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-2 flex-1 max-w-sm">
          {nearTeacher ? (
            <button
              onClick={() => handleInteractTeacher(nearTeacher)}
              className="w-full py-5 px-6 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 active:scale-95 transition-transform text-black font-black border-4 border-yellow-200 rounded-2xl text-base sm:text-lg animate-pulse shadow-xl touch-manipulation cursor-pointer flex items-center justify-center gap-2"
            >
              <span>[ MASUK KELAS / UJIAN ]</span>
            </button>
          ) : currentRoom !== 'hall' ? (
            <button
              onClick={handleAutoWalkToTeacher}
              className="w-full py-4 px-6 bg-yellow-500/90 hover:bg-yellow-400 active:bg-yellow-600 active:scale-95 transition-transform text-black font-extrabold border-2 border-yellow-200 rounded-2xl text-sm sm:text-base shadow-lg touch-manipulation cursor-pointer flex items-center justify-center gap-2"
            >
              <span>HAMPIRI GURU (OTOMATIS)</span>
            </button>
          ) : (
            <div className="text-xs sm:text-sm text-zinc-400 space-y-1">
              <p><span className="text-white font-bold">KONTROL:</span> Gunakan WASD, Tombol Panah, atau Sentuh layar untuk berjalan.</p>
              <p>Dekati Guru atau Pintu kelas untuk berinteraksi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
