const fs = require('fs');
let code = fs.readFileSync('src/components/PixelSprites.ts', 'utf8');

// For player
code = code.replace(
  `  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));`,
  `  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(8 * scale, 22 * scale, 8 * scale, 3 * scale, 0, 0, Math.PI * 2);
  ctx.fill();`
);

// For teacher
code = code.replace(
  `export function drawTeacherSprite(ctx: CanvasRenderingContext2D, x: number, y: number, subject: string, scale: number = 3) {
  ctx.save();
  ctx.translate(x, y);`,
  `export function drawTeacherSprite(ctx: CanvasRenderingContext2D, x: number, y: number, subject: string, scale: number = 3) {
  ctx.save();
  ctx.translate(x, y);

  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(8 * scale, 23 * scale, 9 * scale, 3.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();`
);

fs.writeFileSync('src/components/PixelSprites.ts', code);
console.log('Shadows patched');
