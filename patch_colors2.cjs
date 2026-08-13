const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

code = code.replace(
  /w-full bg-black border-x-4 border-t-4 border-white/g,
  'w-full bg-slate-100 border-x-8 border-t-8 border-amber-900'
);

code = code.replace(
  /flex-1 bg-zinc-900 border-2 border-zinc-700/g,
  'flex-1 bg-emerald-900 border-4 border-amber-900'
);

code = code.replace(
  /text-xs uppercase text-zinc-400 font-bold block mb-1/g,
  'text-xs uppercase text-emerald-300 font-bold block mb-1'
);

code = code.replace(
  /text-lg sm:text-xl font-bold text-yellow-300/g,
  'text-lg sm:text-xl font-bold text-white'
);

code = code.replace(
  /text-xs font-bold text-white mt-1 bg-black px-2 py-0.5 border border-zinc-600 rounded/g,
  'text-xs font-bold text-amber-950 mt-1 bg-amber-100 px-2 py-0.5 border-2 border-amber-900 rounded'
);

code = code.replace(
  /w-full bg-black border-x-4 border-white p-4 flex flex-col/g,
  'w-full bg-black border-x-8 border-amber-900 p-4 flex flex-col'
);

code = code.replace(
  /w-full bg-zinc-950 border-x-4 border-white p-4 min-h-\[110px\]/g,
  'w-full bg-zinc-900 border-x-8 border-t-4 border-amber-900 p-4 min-h-[110px]'
);

code = code.replace(
  /w-full bg-zinc-950 border-x-4 border-white p-3 flex justify-center/g,
  'w-full bg-zinc-900 border-x-8 border-amber-900 p-3 flex justify-center'
);

code = code.replace(
  /w-full bg-black border-x-4 border-b-4 border-white p-3 grid/g,
  'w-full bg-zinc-900 border-x-8 border-b-8 border-amber-900 p-3 grid'
);

// Make inner buttons in action bar zinc-800 instead of 900 since container is 900
code = code.replace(
  /py-3 px-2 bg-zinc-900 border-2 border-zinc-600/g,
  'py-3 px-2 bg-zinc-800 border-2 border-zinc-600'
);

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Colors patched 2');
