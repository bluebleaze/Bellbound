const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const oldDPad = `      {/* Mobile Touch Controller (D-Pad & Action Button) */}
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
              <p>1. Gunakan D-Pad untuk bergerak.</p>
              <p>2. Dekati Ruang Kelas untuk mulai.</p>
            </div>
          )}
        </div>
      </div>`;

const newDPad = `      {/* Mobile Touch Controller (D-Pad & Action Button) */}
      <div className="w-full bg-zinc-900 border-4 border-t-0 border-white p-4 flex items-center justify-between gap-2 touch-none select-none">
        
        {/* Left Side: Vertical (Up/Down) */}
        <div className="flex flex-col gap-3 w-20 shrink-0">
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowUp', true); }}
            onPointerUp={() => pressDirection('ArrowUp', false)}
            onPointerLeave={() => pressDirection('ArrowUp', false)}
            onPointerCancel={() => pressDirection('ArrowUp', false)}
            className="h-16 bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowUp size={32} strokeWidth={3} />
          </button>
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowDown', true); }}
            onPointerUp={() => pressDirection('ArrowDown', false)}
            onPointerLeave={() => pressDirection('ArrowDown', false)}
            onPointerCancel={() => pressDirection('ArrowDown', false)}
            className="h-16 bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowDown size={32} strokeWidth={3} />
          </button>
        </div>

        {/* Center: Action button */}
        <div className="flex flex-col items-center flex-1 mx-2">
          {nearTeacher ? (
            <button
              onClick={() => handleInteractTeacher(nearTeacher)}
              className="w-full max-w-[140px] py-5 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 active:scale-95 transition-transform text-black font-extrabold border-4 border-yellow-200 rounded-xl text-sm sm:text-base animate-pulse shadow-lg touch-manipulation text-center leading-tight"
            >
              MASUK<br/>KELAS
            </button>
          ) : (
            <div className="text-[11px] text-zinc-400 max-w-[140px] text-center leading-tight space-y-1">
              <p className="font-bold text-white">KONTROL SENTUH</p>
              <p>Kiri: Atas/Bawah</p>
              <p>Kanan: Kiri/Kanan</p>
            </div>
          )}
        </div>

        {/* Right Side: Horizontal (Left/Right) */}
        <div className="flex gap-3 w-40 shrink-0">
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowLeft', true); }}
            onPointerUp={() => pressDirection('ArrowLeft', false)}
            onPointerLeave={() => pressDirection('ArrowLeft', false)}
            onPointerCancel={() => pressDirection('ArrowLeft', false)}
            className="flex-1 h-16 bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowLeft size={32} strokeWidth={3} />
          </button>
          <button
            onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowRight', true); }}
            onPointerUp={() => pressDirection('ArrowRight', false)}
            onPointerLeave={() => pressDirection('ArrowRight', false)}
            onPointerCancel={() => pressDirection('ArrowRight', false)}
            className="flex-1 h-16 bg-zinc-800 active:bg-yellow-500 border-2 border-zinc-500 rounded-lg flex items-center justify-center text-zinc-300 active:text-black active:scale-95 transition-transform"
          >
            <ArrowRight size={32} strokeWidth={3} />
          </button>
        </div>
      </div>`;

if (code.includes('grid grid-cols-3 gap-2 w-44 h-44 shrink-0')) {
  code = code.replace(oldDPad, newDPad);
  fs.writeFileSync('src/components/Overworld.tsx', code);
  console.log('Overworld D-Pad patched!');
} else {
  console.log('Overworld D-Pad block not found!');
}
