const fs = require('fs');
let content = fs.readFileSync('src/components/Overworld.tsx', 'utf-8');

const targetOverworld = `<canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="block bg-black border-4 border-white pixelated mx-auto shadow-2xl"
      />`;

const replaceOverworld = `<canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="block bg-black border-4 border-white mx-auto shadow-2xl w-full max-w-[640px] h-auto"
        style={{ imageRendering: 'pixelated' }}
      />`;

if(content.includes('pixelated mx-auto')) {
  content = content.replace(targetOverworld, replaceOverworld);
  fs.writeFileSync('src/components/Overworld.tsx', content);
  console.log("Patched overworld canvas");
} else {
  console.log("Overworld canvas not found or already patched");
}
