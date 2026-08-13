import React, { useRef, useEffect, useState } from 'react';
import { PlayerCustomization, SubjectId, GAME_SCHEDULE } from '../types';
import { FOES } from '../data/questions';
import { drawPlayerSprite, drawTeacherSprite, drawDeskSprite, drawDoorSprite, drawPixelRect } from './PixelSprites';
import { audioEngine } from '../utils/AudioEngine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

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

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        
        if (unlocked && !isDone) {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText('↓', d.x + 25, 60);
        }
      });

      // If 5 subjects cleared, Geometry Keeper appears in front of Math door
      if (currentLevel === 5) {
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

      // Draw Teacher Sprite (standing behind the desk)
      drawTeacherSprite(ctx, 520, 80, currentRoom, 3);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(foe.label, 540, 70);

      // Teacher's Desk (drawn after teacher to cover their legs properly)
      drawDeskSprite(ctx, 500, 130, 90, 35);
    }

    // Draw Player Sprite
    drawPlayerSprite(ctx, playerPos.x, playerPos.y, customization, direction, walkFrame, 2.5);
  }, [currentRoom, playerPos, direction, walkFrame, customization, completedSubjects]);

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
          const newX = Math.max(10, Math.min(590, prev.x + dx));
          const newY = Math.max(110, Math.min(290, prev.y + dy));

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
              if (Math.abs(newX - d.x) < 30 && newY < 170) {
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
            if (Math.abs(newX - 20) < 35 && newY < 160) {
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

      // Space / Enter to talk to near teacher
      if ((e.key === ' ' || e.key === 'Enter') && nearTeacher) {
        onEnterBattle(nearTeacher);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [nearTeacher, onEnterBattle]);

  // Virtual D-Pad Helper for Mobile / Mouse
  const pressDirection = (dirKey: string, active: boolean) => {
    keysPressed.current[dirKey] = active;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto font-mono text-white select-none">
      {/* Main Pixel Canvas Scene */}
      <div className="relative border-4 border-white bg-black shadow-2xl rounded-t overflow-hidden w-full aspect-[16/9]">
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

        {/* Interact Prompt Overlay */}
        {nearTeacher && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 border-2 border-black font-bold text-xs sm:text-sm animate-bounce flex items-center gap-2 shadow-lg">
            <Sparkles size={16} />
            <span>TEKAN SPASI / KLIK DISINI UNTUK UJIAN DENGAN {FOES[nearTeacher].label}!</span>
            <button
              onClick={() => handleInteractTeacher(nearTeacher)}
              className="bg-black text-white px-2 py-1 text-xs border border-white hover:bg-zinc-800 ml-2"
            >
              MASUK
            </button>
          </div>
        )}
      </div>

      {/* Dialogue Text Box */}
      <div className="w-full bg-zinc-950 border-x-4 border-b-4 border-white p-4 min-h-[80px] text-sm leading-relaxed text-zinc-200">
        <p className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">💬</span>
          <span>{dialogueText}</span>
        </p>
      </div>

      {/* Mobile Touch Controller (D-Pad & Action Button) */}
      <div className="w-full bg-zinc-900 border-4 border-t-0 border-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-6 touch-none select-none">
        
        {/* Directional Pad */}
        <div className="grid grid-cols-3 gap-2 w-44 h-44 shrink-0">
          <div />
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowUp', true); }}
            onPointerUp={() => pressDirection('ArrowUp', false)}
            onPointerLeave={() => pressDirection('ArrowUp', false)}
            onPointerCancel={() => pressDirection('ArrowUp', false)}
            className="bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowUp size={28} strokeWidth={3} />
          </button>
          <div />
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowLeft', true); }}
            onPointerUp={() => pressDirection('ArrowLeft', false)}
            onPointerLeave={() => pressDirection('ArrowLeft', false)}
            onPointerCancel={() => pressDirection('ArrowLeft', false)}
            className="bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowLeft size={28} strokeWidth={3} />
          </button>
          <div className="bg-zinc-950/50 rounded-lg border-2 border-zinc-800 flex items-center justify-center">
             <div className="w-3 h-3 bg-zinc-700 rounded-full" />
          </div>
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowRight', true); }}
            onPointerUp={() => pressDirection('ArrowRight', false)}
            onPointerLeave={() => pressDirection('ArrowRight', false)}
            onPointerCancel={() => pressDirection('ArrowRight', false)}
            className="bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowRight size={28} strokeWidth={3} />
          </button>
          <div />
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowDown', true); }}
            onPointerUp={() => pressDirection('ArrowDown', false)}
            onPointerLeave={() => pressDirection('ArrowDown', false)}
            onPointerCancel={() => pressDirection('ArrowDown', false)}
            className="bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowDown size={28} strokeWidth={3} />
          </button>
          <div />
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-2">
          {nearTeacher ? (
            <button
              onClick={() => handleInteractTeacher(nearTeacher)}
              className="px-8 py-6 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 active:scale-95 transition-transform text-black font-extrabold border-4 border-yellow-200 rounded-xl text-lg sm:text-xl animate-pulse shadow-lg touch-manipulation"
            >
              [ MASUK KELAS ]
            </button>
          ) : (
            <div className="text-xs text-zinc-400 max-w-xs space-y-1">
              <p>🎮 <span className="text-white font-bold">KONTROL:</span> Gunakan WASD / Panah / Touch D-Pad untuk berjalan.</p>
              <p>🏫 Dekati Guru atau Pintu untuk berpindah ruangan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
