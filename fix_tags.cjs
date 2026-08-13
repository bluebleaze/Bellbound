const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the `</main>` at around line 393 (the one before {/* MODALS */})
code = code.replace(/        \)\}\n      <\/main>\n\n      \{\/\* MODALS \*\/\}/, '        )}\n\n      {/* MODALS */}');

fs.writeFileSync('src/App.tsx', code);
