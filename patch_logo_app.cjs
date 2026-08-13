const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const titleScreenRegex = /<div className="space-y-4">\n              <h1 className="text-5xl sm:text-7xl/;

code = code.replace(titleScreenRegex, `<div className="space-y-4">
              <img src="/logo.png" alt="Logo Sekolah" className="w-24 h-24 mx-auto object-contain drop-shadow-[0_4px_4px_rgba(250,204,21,0.5)]" onError={(e) => e.currentTarget.style.display = 'none'} />
              <h1 className="text-5xl sm:text-7xl`);

fs.writeFileSync('src/App.tsx', code);
console.log('App logo added');
