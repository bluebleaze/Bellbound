import re

with open('/home/flores/Documents/bellbound/src/components/Overworld.tsx', 'r') as f:
    content = f.read()

# Let's cleanly replace the entire D-Pad block in Overworld.tsx.
# The block starts right after {/* Touch D-Pad Controls for Overworld on Mobile */}
# and ends before {/* Action button */}

replacement = """        {/* Touch D-Pad Controls for Overworld on Mobile */}
        <div className="flex justify-between items-center touch-none select-none w-full max-w-[280px]" onContextMenu={(e) => e.preventDefault()}>
          {/* Left Side: Up/Down */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowUp', true); }}
              onPointerUp={() => pressDirection('ArrowUp', false)}
              onPointerLeave={() => pressDirection('ArrowUp', false)}
              onPointerCancel={() => pressDirection('ArrowUp', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none"
            >
              <ArrowUp size={24} />
            </button>
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowDown', true); }}
              onPointerUp={() => pressDirection('ArrowDown', false)}
              onPointerLeave={() => pressDirection('ArrowDown', false)}
              onPointerCancel={() => pressDirection('ArrowDown', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none"
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
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); pressDirection('ArrowRight', true); }}
              onPointerUp={() => pressDirection('ArrowRight', false)}
              onPointerLeave={() => pressDirection('ArrowRight', false)}
              onPointerCancel={() => pressDirection('ArrowRight', false)}
              className="w-16 h-12 bg-zinc-800 active:bg-yellow-500 border border-zinc-500 rounded flex items-center justify-center text-zinc-300 active:text-black transition-colors touch-none"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>"""

content = re.sub(r'\{\/\* Touch D-Pad Controls for Overworld on Mobile \*\/\}.*?\{\/\* Action button \*\/\}', replacement + "\n\n        {/* Action button */}", content, flags=re.DOTALL)

with open('/home/flores/Documents/bellbound/src/components/Overworld.tsx', 'w') as f:
    f.write(content)

print("Overworld fixed")
