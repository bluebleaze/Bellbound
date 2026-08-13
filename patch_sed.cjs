const fs = require('fs');
let code = fs.readFileSync('src/components/Overworld.tsx', 'utf8');

code = code.replace(
  `{.* Action button .*\/}`,
  `{/* Action button */}`
);

fs.writeFileSync('src/components/Overworld.tsx', code);
