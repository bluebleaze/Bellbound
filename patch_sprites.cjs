const fs = require('fs');
let code = fs.readFileSync('src/components/PixelSprites.ts', 'utf8');

// Replace drawDeskSprite
const deskRegex = /export function drawDeskSprite\([\s\S]*?\}\n/m;
const newDesk = `export function drawDeskSprite(ctx: CanvasRenderingContext2D, x: number, y: number, width: number = 80, height: number = 36) {
  ctx.save();
  ctx.translate(x, y);

  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(width / 2, height, width / 2 + 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chair tucked behind desk (draw first so it's under the desk)
  const chairW = 24;
  const chairX = (width - chairW) / 2;
  // Chair backrest
  drawPixelRect(ctx, chairX, -10, chairW, 12, '#a16207'); 
  drawPixelRect(ctx, chairX + 2, -8, chairW - 4, 8, '#ca8a04'); // lighter wood
  // Chair seat
  drawPixelRect(ctx, chairX, 2, chairW, 4, '#854d0e');
  // Chair legs (metal)
  drawPixelRect(ctx, chairX + 2, 6, 2, 10, '#64748b');
  drawPixelRect(ctx, chairX + chairW - 4, 6, 2, 10, '#64748b');

  // Desk Front Panel (modesty panel)
  drawPixelRect(ctx, 4, 6, width - 8, 12, '#b45309');

  // Desk Legs (metal)
  drawPixelRect(ctx, 4, 12, 4, height - 12, '#475569'); // Left leg back
  drawPixelRect(ctx, width - 8, 12, 4, height - 12, '#475569'); // Right leg back
  drawPixelRect(ctx, 0, 16, 4, height - 16, '#94a3b8'); // Left leg front
  drawPixelRect(ctx, width - 4, 16, 4, height - 16, '#94a3b8'); // Right leg front

  // Desk Top (wood)
  drawPixelRect(ctx, -2, 0, width + 4, 10, '#854d0e'); // Dark rim
  drawPixelRect(ctx, 0, 0, width, 8, '#ca8a04'); // Top surface
  drawPixelRect(ctx, 0, 8, width, 2, '#a16207'); // Thickness

  // Books / Pencil case / Papers on desk
  drawPixelRect(ctx, 10, 2, 14, 6, '#2563eb'); // Blue book
  drawPixelRect(ctx, 12, 1, 10, 2, '#f8fafc'); // White pages
  drawPixelRect(ctx, 28, 4, 8, 3, '#dc2626'); // Red pencil case
  drawPixelRect(ctx, width - 20, 2, 12, 6, '#f1f5f9'); // White paper

  ctx.restore();
}
`;
code = code.replace(deskRegex, newDesk);

// Replace drawDoorSprite
const doorRegex = /export function drawDoorSprite\([\s\S]*?\}\n/m;
const newDoor = `export function drawDoorSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  isFinished: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(24, 74, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const doorColor = isFinished ? '#047857' : '#854d0e';
  const doorDark = isFinished ? '#064e3b' : '#451a03';
  const doorLight = isFinished ? '#10b981' : '#b45309';

  // Wooden Frame
  drawPixelRect(ctx, 0, 0, 48, 76, '#1e293b'); // Dark metal/wood outer frame
  drawPixelRect(ctx, 2, 2, 44, 74, doorDark);  // Inner frame shadow

  // Door Panel
  drawPixelRect(ctx, 4, 4, 40, 72, doorColor);

  // Door Details (Panels)
  // Top glass window
  drawPixelRect(ctx, 10, 10, 28, 24, '#0f172a'); // Frame
  drawPixelRect(ctx, 12, 12, 24, 20, isFinished ? '#6ee7b7' : '#bae6fd'); // Glass
  // Window reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(24, 12);
  ctx.lineTo(12, 24);
  ctx.fill();

  // Bottom wooden panel
  drawPixelRect(ctx, 10, 40, 28, 26, doorDark);
  drawPixelRect(ctx, 12, 42, 24, 22, doorLight);

  // Doorknob & Keyhole
  drawPixelRect(ctx, 36, 42, 6, 8, '#334155'); // Plate
  drawPixelRect(ctx, 38, 44, 4, 4, '#fbbf24'); // Gold knob

  // Label Header (Sign above door)
  ctx.fillStyle = '#0f172a'; // Black plate
  ctx.fillRect(-10, -24, 68, 20);
  ctx.strokeStyle = '#cbd5e1'; // Silver border
  ctx.lineWidth = 2;
  ctx.strokeRect(-10, -24, 68, 20);
  
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, 24, -10);

  ctx.restore();
}
`;
code = code.replace(doorRegex, newDoor);

fs.writeFileSync('src/components/PixelSprites.ts', code);
console.log('Sprites patched');
