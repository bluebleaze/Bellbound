const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

const oldDPad = `        {/* Touch D-Pad Controls for Soul Dodge on Mobile */}
        {isDodging && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-yellow-400 font-bold mr-1">KONTROL JIWA:</span>
            <button
              onClick={() => moveSoulBy(-10, 0)}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-yellow-500 border border-white text-xs font-bold rounded"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => moveSoulBy(0, -10)}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-yellow-500 border border-white text-xs font-bold rounded"
            >
              <ArrowUp size={16} />
            </button>
            <button
              onClick={() => moveSoulBy(0, 10)}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-yellow-500 border border-white text-xs font-bold rounded"
            >
              <ArrowDown size={16} />
            </button>
            <button
              onClick={() => moveSoulBy(10, 0)}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-yellow-500 border border-white text-xs font-bold rounded"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}`;

const newDPad = `        {/* Touch D-Pad Controls for Soul Dodge on Mobile */}
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
        )}`;

if (code.includes('Touch D-Pad Controls for Soul Dodge on Mobile')) {
  code = code.replace(oldDPad, newDPad);
  fs.writeFileSync('src/components/BattleArena.tsx', code);
  console.log('BattleArena D-Pad patched!');
} else {
  console.log('BattleArena D-Pad block not found!');
}
