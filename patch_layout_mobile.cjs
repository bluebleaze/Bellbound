const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<main className="w-full max-w-\[1280px\] aspect-\[16\/9\] bg-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-\[0_0_50px_rgba\(0,0,0,0\.8\)\] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto overflow-x-hidden">/m;
const replacement = `<main className="w-full max-w-[1280px] h-full sm:h-auto sm:aspect-[16/9] bg-black sm:border-4 sm:border-zinc-800 sm:rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-0 sm:p-6 overflow-y-auto overflow-x-hidden">`;

if(code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Layout patched');
} else {
  console.log('Regex not matched');
}
