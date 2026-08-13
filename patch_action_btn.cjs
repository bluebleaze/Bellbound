const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

code = code.replace(
  `className="px-6 py-4 px-6 py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-black font-bold border-4 border-yellow-200 rounded text-sm sm:text-base animate-pulse shadow-lg"`,
  `className="px-8 py-6 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 active:scale-95 transition-transform text-black font-extrabold border-4 border-yellow-200 rounded-xl text-lg sm:text-xl animate-pulse shadow-lg touch-manipulation"`
);

fs.writeFileSync('src/components/Overworld.tsx', code);
console.log('Action button patched');
