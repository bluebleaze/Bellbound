const fs = require('fs');

// 1. HeaderHUD.tsx
const headerPath = 'src/components/HeaderHUD.tsx';
let headerCode = fs.readFileSync(headerPath, 'utf8');
headerCode = headerCode.replace(/bg-white border-b-4 border-sky-300/g, 'bg-zinc-950 border-b-4 border-white');
headerCode = headerCode.replace(/text-slate-800/g, 'text-white');
headerCode = headerCode.replace(/shadow-sm/g, '');
headerCode = headerCode.replace(/text-sky-600/g, 'text-yellow-400');
headerCode = headerCode.replace(/text-slate-700/g, 'text-zinc-300');
headerCode = headerCode.replace(/text-slate-500/g, 'text-zinc-400');
headerCode = headerCode.replace(/bg-slate-200 border-2 border-slate-400/g, 'bg-zinc-900 border-2 border-white');
headerCode = headerCode.replace(/bg-sky-50 px-3 py-1 border-2 border-sky-400 rounded-lg shadow-sm/g, 'bg-zinc-900 px-3 py-1 border-2 border-yellow-400 rounded');
headerCode = headerCode.replace(/text-sky-900/g, 'text-yellow-300');
headerCode = headerCode.replace(/bg-slate-200 border border-sky-300 relative overflow-hidden rounded-full/g, 'bg-zinc-950 border border-white relative overflow-hidden');
headerCode = headerCode.replace(/text-sky-700/g, 'text-yellow-300');
headerCode = headerCode.replace(/bg-sky-100 border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-200 text-sky-700 transition-colors rounded-lg text-xs flex items-center gap-1 font-bold/g, 'p-1.5 bg-zinc-900 border-2 border-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1');
headerCode = headerCode.replace(/p-1.5 bg-slate-100 border-2 border-slate-300 hover:border-sky-400 hover:text-sky-600 transition-colors rounded-lg text-xs flex items-center gap-1 text-slate-600 font-bold/g, 'p-1.5 bg-zinc-900 border-2 border-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1');
headerCode = headerCode.replace(/p-1.5 bg-slate-100 border-2 border-slate-300 hover:border-sky-400 hover:text-sky-600 transition-colors rounded-lg text-xs flex items-center gap-1 text-slate-600/g, 'p-1.5 bg-zinc-900 border-2 border-zinc-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors rounded text-xs flex items-center gap-1');
headerCode = headerCode.replace(/p-1.5 bg-slate-100 border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 transition-colors rounded-lg text-xs flex items-center gap-1 text-slate-600/g, 'p-1.5 bg-zinc-900 border-2 border-zinc-500 hover:border-red-500 hover:text-red-400 transition-colors rounded text-xs flex items-center gap-1');
fs.writeFileSync(headerPath, headerCode);

// 2. Overworld.tsx
const overworldPath = 'src/components/Overworld.tsx';
let overworldCode = fs.readFileSync(overworldPath, 'utf8');
overworldCode = overworldCode.replace(/bg-white border-x-4 border-b-4 border-sky-300 shadow-md/g, 'bg-zinc-950 border-x-4 border-b-4 border-white');
overworldCode = overworldCode.replace(/text-slate-700 font-medium/g, 'text-zinc-200');
overworldCode = overworldCode.replace(/bg-slate-50 border-4 border-t-0 border-sky-300/g, 'bg-zinc-900 border-4 border-t-0 border-white');
overworldCode = overworldCode.replace(/text-slate-500/g, 'text-zinc-400');
overworldCode = overworldCode.replace(/text-slate-800/g, 'text-white');
overworldCode = overworldCode.replace(/bg-sky-500 text-white px-2 py-1 text-xs border border-sky-300 hover:bg-sky-600 ml-2 rounded/g, 'bg-black text-white px-2 py-1 text-xs border border-white hover:bg-zinc-800 ml-2');
overworldCode = overworldCode.replace(/bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold border-b-4 border-sky-700 rounded-lg text-sm sm:text-base shadow-lg transition-all active:translate-y-1 active:border-b-0/g, 'px-6 py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-black font-bold border-4 border-yellow-200 rounded text-sm sm:text-base animate-pulse shadow-lg');
fs.writeFileSync(overworldPath, overworldCode);

// 3. CustomizerModal.tsx
const customizerPath = 'src/components/CustomizerModal.tsx';
let customizerCode = fs.readFileSync(customizerPath, 'utf8');
customizerCode = customizerCode.replace(/bg-slate-900\/60/g, 'bg-black/80');
customizerCode = customizerCode.replace(/bg-white border-4 border-sky-400 max-w-lg w-full p-6 text-slate-800 rounded-xl/g, 'bg-zinc-950 border-4 border-white max-w-lg w-full p-6 text-white rounded');
customizerCode = customizerCode.replace(/text-slate-400 hover:text-slate-700 p-1 bg-slate-100 hover:bg-slate-200 rounded/g, 'text-zinc-400 hover:text-white p-1');
customizerCode = customizerCode.replace(/text-sky-800 mb-4 border-b-2 border-sky-100/g, 'text-yellow-400 mb-4 border-b-2 border-zinc-700');
customizerCode = customizerCode.replace(/bg-sky-50 border-2 border-sky-200 p-4 flex flex-col items-center justify-center rounded-lg/g, 'bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-col items-center justify-center rounded');
customizerCode = customizerCode.replace(/text-sky-700 mb-2 font-bold/g, 'text-zinc-400 mb-2 font-bold');
customizerCode = customizerCode.replace(/text-sky-700 mt-2 font-bold uppercase/g, 'text-yellow-400 mt-2 font-bold uppercase');
customizerCode = customizerCode.replace(/bg-white border-2 border-slate-300 focus:border-sky-500 px-3 py-1.5 text-slate-800 font-mono rounded outline-none shadow-sm/g, 'bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 px-3 py-1.5 text-white font-mono rounded outline-none');
customizerCode = customizerCode.replace(/bg-white border-2 border-slate-300 focus:border-sky-500 px-3 py-1.5 text-slate-800 font-mono rounded outline-none mb-3 shadow-sm/g, 'w-full bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 px-3 py-1.5 text-white font-mono rounded outline-none mb-3');
customizerCode = customizerCode.replace(/block text-slate-700 text-xs font-bold mb-1/g, 'block text-zinc-300 text-xs font-bold mb-1');
customizerCode = customizerCode.replace(/border-sky-500 scale-110 shadow-md/g, 'border-yellow-400 scale-110');
customizerCode = customizerCode.replace(/border-slate-300/g, 'border-zinc-700');
customizerCode = customizerCode.replace(/bg-slate-200 hover:bg-slate-300 border-2 border-slate-300 text-slate-700/g, 'bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 text-white');
customizerCode = customizerCode.replace(/bg-sky-500 hover:bg-sky-400 text-white font-bold border-2 border-sky-600/g, 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-2 border-yellow-300');
customizerCode = customizerCode.replace(/border-sky-100/g, 'border-zinc-800');
fs.writeFileSync(customizerPath, customizerCode);

// 4. StudyNotesModal.tsx
const notesPath = 'src/components/StudyNotesModal.tsx';
let notesCode = fs.readFileSync(notesPath, 'utf8');
notesCode = notesCode.replace(/bg-slate-900\/60/g, 'bg-black/80');
notesCode = notesCode.replace(/bg-white border-4 border-sky-400 max-w-lg w-full p-6 text-slate-800 rounded-xl/g, 'bg-zinc-950 border-4 border-white max-w-lg w-full p-6 text-white rounded');
notesCode = notesCode.replace(/text-slate-400 hover:text-slate-700 p-1 bg-slate-100 hover:bg-slate-200 rounded/g, 'text-zinc-400 hover:text-white p-1');
notesCode = notesCode.replace(/text-sky-800 mb-4 border-b-2 border-sky-100/g, 'text-yellow-400 mb-4 border-b-2 border-zinc-700');
notesCode = notesCode.replace(/bg-sky-50 border-2 border-sky-200 p-4 rounded-lg text-center shadow-inner/g, 'bg-zinc-900 border-2 border-zinc-700 p-4 rounded text-center');
notesCode = notesCode.replace(/text-slate-500 text-sm font-semibold/g, 'text-zinc-400 text-sm');
notesCode = notesCode.replace(/bg-white border-2 border-slate-200 p-3 rounded-lg shadow-sm/g, 'bg-zinc-900 border-2 border-zinc-700 p-3 rounded');
notesCode = notesCode.replace(/text-sky-700 font-bold mb-1/g, 'text-yellow-400 font-bold mb-1');
notesCode = notesCode.replace(/text-xs text-slate-600 font-medium/g, 'text-xs text-zinc-300');
fs.writeFileSync(notesPath, notesCode);

// 5. VictoryModal.tsx
const victoryPath = 'src/components/VictoryModal.tsx';
let victoryCode = fs.readFileSync(victoryPath, 'utf8');
victoryCode = victoryCode.replace(/bg-slate-900\/60/g, 'bg-black/80');
victoryCode = victoryCode.replace(/bg-white border-4 border-yellow-400 max-w-sm w-full p-6 text-center shadow-\[0_0_30px_rgba\(250,204,21,0\.5\)\] rounded-xl/g, 'bg-zinc-950 border-4 border-white max-w-sm w-full p-6 text-center shadow-[0_0_30px_rgba(250,204,21,0.2)] rounded');
victoryCode = victoryCode.replace(/text-yellow-500 mb-2 drop-shadow-md/g, 'text-yellow-400 mb-2 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]');
victoryCode = victoryCode.replace(/text-slate-600 font-semibold/g, 'text-zinc-300');
victoryCode = victoryCode.replace(/text-slate-800/g, 'text-white');
victoryCode = victoryCode.replace(/bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-slate-900 font-bold border-b-4 border-yellow-600 rounded-lg text-sm transition-all active:translate-y-1 active:border-b-0 shadow-md/g, 'w-full mt-6 py-3 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-black font-bold border-2 border-yellow-200 rounded text-sm transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)]');
fs.writeFileSync(victoryPath, victoryCode);

