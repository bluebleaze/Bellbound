const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const regex = /\{\/\* Mobile Touch Controller[\s\S]*?\{\/\* Action button \*\//m;

const newCode = `{/* Mobile Touch Controller (D-Pad & Action Button) */}
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

        {/* Action button */}`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('D-Pad patched');
