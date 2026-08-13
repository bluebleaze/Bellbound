const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('touch-callout')) {
  code += `
@layer utilities {
  /* Prevent default touch behaviors that disrupt gaming */
  body {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
`;
  fs.writeFileSync('src/index.css', code);
  console.log('CSS patched');
}
