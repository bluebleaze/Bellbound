const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-2 gap-4">',
  '<div className="flex flex-col gap-4">'
);
code = code.replace(
  '<div className="col-span-2 grid grid-cols-2 gap-4">',
  '<div className="flex flex-col sm:flex-row gap-4 w-full">'
);
code = code.replace(
  '<div className="text-xl font-bold text-yellow-400 mb-2 border-b-2 border-zinc-800 pb-2 w-full text-center">ID CARD</div>',
  '<div className="text-xl font-bold text-yellow-400 mb-2 border-b-2 border-zinc-800 pb-2 w-full text-center">ID CARD (v2)</div>'
);

// We also need to fix the inner divs in the sm:flex-row to be flex-1
code = code.replace(
  '<div>\n              <label className="block text-zinc-400 text-xs font-bold mb-1">GENDER</label>',
  '<div className="flex-1">\n              <label className="block text-zinc-400 text-xs font-bold mb-1">GENDER</label>'
);
code = code.replace(
  '<div>\n              <label className="block text-zinc-400 text-xs font-bold mb-1">TINGKAT KESULITAN</label>',
  '<div className="flex-1">\n              <label className="block text-zinc-400 text-xs font-bold mb-1">TINGKAT KESULITAN</label>'
);

fs.writeFileSync('src/components/LoginScreen.tsx', code);
console.log('Layout patched');
