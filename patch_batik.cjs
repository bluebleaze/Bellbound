const fs = require('fs');
let code = fs.readFileSync('src/components/PixelSprites.ts', 'utf8');

// I need to find the place where the shirt body is drawn and inject a pattern if uniform is 'batik'.
// In drawPlayerSprite, there are 4 directions. Let's look for:
// `// Shirt Body`

code = code.replace(
  `    // Shirt Body
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);`,
  `    // Shirt Body
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);
    if (customization.uniform === 'batik') {
       // Add batik dots pattern
       ctx.fillStyle = '#fcdbb3'; // Goldish/light dots
       ctx.fillRect(5 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(7 * p, 12 * p, 1 * p, 1 * p);
       ctx.fillRect(10 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(5 * p, 13 * p, 1 * p, 1 * p);
       ctx.fillRect(9 * p, 13 * p, 1 * p, 1 * p);
    }`
);

code = code.replace(
  `    // Back White Shirt
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);`,
  `    // Back White Shirt
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);
    if (customization.uniform === 'batik') {
       ctx.fillStyle = '#fcdbb3';
       ctx.fillRect(5 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(8 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(10 * p, 12 * p, 1 * p, 1 * p);
       ctx.fillRect(6 * p, 13 * p, 1 * p, 1 * p);
       ctx.fillRect(9 * p, 13 * p, 1 * p, 1 * p);
    }`
);

code = code.replace(
  `    // Side White Shirt
    drawPixelRect(ctx, 5 * p, 11 * p, 6 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 5 * p, 14 * p, 6 * p, 1 * p, shirtShadow);`,
  `    // Side White Shirt
    drawPixelRect(ctx, 5 * p, 11 * p, 6 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 5 * p, 14 * p, 6 * p, 1 * p, shirtShadow);
    if (customization.uniform === 'batik') {
       ctx.fillStyle = '#fcdbb3';
       ctx.fillRect(6 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(8 * p, 12 * p, 1 * p, 1 * p);
       ctx.fillRect(6 * p, 13 * p, 1 * p, 1 * p);
       ctx.fillRect(9 * p, 11 * p, 1 * p, 1 * p);
    }`
);

fs.writeFileSync('src/components/PixelSprites.ts', code);
console.log('Batik patched');
