const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLayout = `<div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 lg:p-8">
      <div className="w-full max-w-[1280px] aspect-[16/9] bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">`;

const newLayout = `<div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between selection:bg-yellow-400 selection:text-black">`;

code = code.replace(oldLayout, newLayout);

const mainOld = `<main className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden">`;
const mainNew = `<div className="flex-1 flex items-center justify-center p-0 sm:p-4 lg:p-8 bg-zinc-950">
        <main className="w-full max-w-[1280px] aspect-[16/9] bg-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">`;

code = code.replace(mainOld, mainNew);

// Now fix the end tags
code = code.replace(/      <\/footer>\n      <\/div>\n    <\/div>\n  \);\n}/, `      </footer>\n    </div>\n  );\n}`);

// Wait, the main tag needs to close inside the new div wrapper instead of being parallel.
const mainEndOld = `        />\n      )}\n\n      {/* Footer */}`;
const mainEndNew = `        />\n      )}\n      </main>\n      </div>\n\n      {/* Footer */}`;

code = code.replace(mainEndOld, mainEndNew);

fs.writeFileSync('src/App.tsx', code);
