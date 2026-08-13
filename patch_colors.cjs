const fs = require('fs');
let code = fs.readFileSync('src/components/BattleArena.tsx', 'utf8');

// Top Stage
code = code.replace(
  /w-full bg-slate-100 border-x-8 border-t-8 border-amber-900/g,
  'w-full bg-black border-x-4 border-t-4 border-white'
);

// Board
code = code.replace(
  /flex-1 bg-emerald-900 border-8 border-amber-800/g,
  'flex-1 bg-zinc-900 border-2 border-zinc-700'
);
code = code.replace(
  /text-xs uppercase text-amber-400/g,
  'text-xs uppercase text-zinc-400'
);

// Teacher Label
code = code.replace(
  /text-xs font-bold text-yellow-400 mt-1 bg-black px-2 py-0.5 border border-yellow-500/g,
  'text-xs font-bold text-white mt-1 bg-black px-2 py-0.5 border border-zinc-600'
);

// Soul Dodge Box
code = code.replace(
  /w-full bg-black border-x-8 border-amber-900/g,
  'w-full bg-black border-x-4 border-white'
);

// Dialogue Container and Fight Button Container
code = code.replace(
  /w-full bg-emerald-950 border-x-8 border-amber-900/g,
  'w-full bg-zinc-950 border-x-4 border-white'
);

// Action Bar
code = code.replace(
  /w-full bg-amber-950 border-x-8 border-b-8 border-amber-900/g,
  'w-full bg-black border-x-4 border-b-4 border-white'
);

// Ensure the dialogue container has a top border or let it merge? It currently merges because no border-t is specified. It's fine.

fs.writeFileSync('src/components/BattleArena.tsx', code);
console.log('Colors patched');
