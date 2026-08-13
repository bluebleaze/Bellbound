const fs = require('fs');
let content = fs.readFileSync('src/components/StudyNotesModal.tsx', 'utf-8');

content = content.replace(
  `className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono"`,
  `className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-mono"`
);
content = content.replace(
  `className="bg-zinc-950 border-4 border-white max-w-lg w-full p-6 text-white shadow-2xl relative"`,
  `className="bg-white border-4 border-sky-400 max-w-lg w-full p-6 text-slate-800 rounded-xl shadow-2xl relative"`
);
content = content.replace(
  `className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"`,
  `className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 bg-slate-100 hover:bg-slate-200 rounded"`
);
content = content.replace(
  `className="text-xl font-bold text-yellow-400 mb-4 border-b-2 border-zinc-700 pb-2 flex items-center gap-2"`,
  `className="text-xl font-bold text-sky-800 mb-4 border-b-2 border-sky-100 pb-2 flex items-center gap-2"`
);
content = content.replace(
  `className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded text-center"`,
  `className="bg-sky-50 border-2 border-sky-200 p-4 rounded-lg text-center shadow-inner"`
);
content = content.replace(
  `className="text-zinc-400 text-sm"`,
  `className="text-slate-500 text-sm font-semibold"`
);
content = content.replaceAll(
  `className="bg-zinc-900 border-2 border-zinc-700 p-3 rounded"`,
  `className="bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm"`
);
content = content.replaceAll(
  `className="text-yellow-400 font-bold mb-1"`,
  `className="text-sky-700 font-bold mb-1"`
);
content = content.replaceAll(
  `className="text-xs text-zinc-300"`,
  `className="text-xs text-slate-600 font-medium"`
);

fs.writeFileSync('src/components/StudyNotesModal.tsx', content);
console.log('Patched StudyNotesModal.tsx');
