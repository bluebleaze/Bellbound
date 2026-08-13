const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

const canvasRegex = /<canvas\n          ref=\{canvasRef\}\n          width=\{640\}\n          height=\{360\}\n          className="w-full h-full object-contain" style=\{\{ imageRendering: 'pixelated' \}\}\n        \/>/m;

const replacement = `<canvas
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
        )}`;

code = code.replace(canvasRegex, replacement);
fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Overworld logo added');
