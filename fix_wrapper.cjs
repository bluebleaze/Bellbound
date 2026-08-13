const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/    <\/div>\n  \);\n}/g, '      </div>\n    </div>\n  );\n}');
fs.writeFileSync('src/App.tsx', code);
