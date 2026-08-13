const fs = require('fs');

function replaceAll(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Backgrounds & Borders
  content = content.replace(/bg-sky-50/g, 'bg-zinc-950');
  content = content.replace(/bg-sky-100/g, 'bg-zinc-900');
  content = content.replace(/bg-sky-200/g, 'bg-zinc-800');
  content = content.replace(/bg-sky-300/g, 'bg-zinc-700');
  content = content.replace(/bg-sky-400/g, 'bg-zinc-600');
  content = content.replace(/bg-sky-500/g, 'bg-yellow-500'); // main buttons
  content = content.replace(/bg-sky-600/g, 'bg-yellow-600'); 
  
  content = content.replace(/border-sky-100/g, 'border-zinc-800');
  content = content.replace(/border-sky-200/g, 'border-zinc-700');
  content = content.replace(/border-sky-300/g, 'border-white'); // main highlights
  content = content.replace(/border-sky-400/g, 'border-white');
  content = content.replace(/border-sky-500/g, 'border-yellow-400');
  content = content.replace(/border-sky-700/g, 'border-yellow-700');

  content = content.replace(/text-sky-500/g, 'text-yellow-500');
  content = content.replace(/text-sky-600/g, 'text-yellow-400');
  content = content.replace(/text-sky-700/g, 'text-yellow-400');
  content = content.replace(/text-sky-800/g, 'text-yellow-500');
  content = content.replace(/text-sky-900/g, 'text-yellow-500');

  // Slate
  content = content.replace(/bg-slate-50/g, 'bg-zinc-900');
  content = content.replace(/bg-slate-100/g, 'bg-zinc-900');
  content = content.replace(/bg-slate-200/g, 'bg-zinc-800');
  content = content.replace(/bg-slate-300/g, 'bg-zinc-700');

  content = content.replace(/border-slate-200/g, 'border-zinc-700');
  content = content.replace(/border-slate-300/g, 'border-zinc-600');
  content = content.replace(/border-slate-400/g, 'border-zinc-500');

  content = content.replace(/text-slate-400/g, 'text-zinc-400');
  content = content.replace(/text-slate-500/g, 'text-zinc-400');
  content = content.replace(/text-slate-600/g, 'text-zinc-300');
  content = content.replace(/text-slate-700/g, 'text-zinc-300');
  content = content.replace(/text-slate-800/g, 'text-white');
  content = content.replace(/text-slate-900/g, 'text-white');

  // White backgrounds that should be dark
  content = content.replace(/bg-white border-4/g, 'bg-zinc-950 border-4');
  content = content.replace(/bg-white border-b-4/g, 'bg-zinc-950 border-b-4');
  content = content.replace(/bg-white border-x-4/g, 'bg-zinc-950 border-x-4');
  content = content.replace(/bg-white border-2/g, 'bg-zinc-950 border-2');
  
  // Specific tweaks
  content = content.replace(/rounded-xl/g, 'rounded');
  content = content.replace(/rounded-lg/g, 'rounded');
  
  // App.tsx body
  content = content.replace(/className="min-h-screen[^"]*"/g, 'className="min-h-screen bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black"');
  
  fs.writeFileSync(file, content);
}

['src/App.tsx', 'src/components/HeaderHUD.tsx', 'src/components/Overworld.tsx', 'src/components/CustomizerModal.tsx', 'src/components/StudyNotesModal.tsx'].forEach(replaceAll);

