import { PlayerCustomization, SubjectId } from '../types';

// Pixel Art Canvas Helper Utility

export function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// 8-bit Player Pixel Sprite Drawer matching the Indonesian SMA Student asset 100%
export function drawPlayerSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  customization: PlayerCustomization,
  dir: 'down' | 'up' | 'left' | 'right' = 'down',
  frame: number = 0,
  scale: number = 2.5
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  // Colors accurately sampled from the asset image
  let shirtColor = '#ffffff'; // Crisp white SMA shirt
  let shirtShadow = '#e2e8f0'; // Shirt fold shadow
  let pantsColor = '#536279'; // SMA slate grey pants
  let pantsShadow = '#3b4759'; // Pants shadow
  let tieColor = '#3a4759';   // SMA dark blue/grey tie

  if (customization.uniform === 'pramuka') {
    shirtColor = '#d97706';
    shirtShadow = '#b45309';
    pantsColor = '#78350f';
    pantsShadow = '#451a03';
    tieColor = '#dc2626';
  } else if (customization.uniform === 'batik') {
    shirtColor = '#ffffff';
    shirtShadow = '#e2e8f0';
    pantsColor = '#536279'; // Default SMA grey pants
    pantsShadow = '#3b4759';
    tieColor = '#dc2626';
  } else if (customization.uniform === 'olahraga') {
    shirtColor = '#27272a'; // Dark grey/black
    shirtShadow = '#18181b';
    pantsColor = '#27272a'; // Dark grey/black
    pantsShadow = '#18181b';
    tieColor = '#27272a';
  }

  const skin = customization.skinColor || '#ddb382'; // Natural SMA student skin tone
  const skinShadow = '#c79b6a';
  const hair = customization.hairColor || '#121212'; // Black hair
  const outline = '#000000'; // Pure black pixel outline
  const p = scale; // Pixel scale unit

  // Soft ground shadow under feet
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(8 * p, 22 * p, 6 * p, 2.5 * p, 0, 0, Math.PI * 2);
  ctx.fill();

  const isWalking = frame % 2 === 1;
  const walkAlt = Math.floor(frame / 2) % 2 === 1;

  if (dir === 'down') {
    // === FRONT VIEW (FACE & FRONT UNIFORM WITH TIE) ===
    
    // Hair Base & Volume
    drawPixelRect(ctx, 4 * p, 0 * p, 8 * p, 1 * p, outline); // Hair top outline
    drawPixelRect(ctx, 3 * p, 1 * p, 10 * p, 4 * p, hair);   // Hair main dome

    // Face Skin
    drawPixelRect(ctx, 4 * p, 5 * p, 8 * p, 4 * p, skin);
    // Ears
    drawPixelRect(ctx, 3 * p, 5 * p, 1 * p, 2 * p, skin);
    drawPixelRect(ctx, 12 * p, 5 * p, 1 * p, 2 * p, skin);

    // Front Hair Bangs (Messy black bang locks)
    drawPixelRect(ctx, 3 * p, 2 * p, 10 * p, 2 * p, hair);
    drawPixelRect(ctx, 4 * p, 4 * p, 3 * p, 1 * p, hair);
    drawPixelRect(ctx, 9 * p, 4 * p, 3 * p, 1 * p, hair);

    if (customization.gender === 'female') {
      // Long hair on the sides
      drawPixelRect(ctx, 2 * p, 4 * p, 2 * p, 7 * p, hair);
      drawPixelRect(ctx, 12 * p, 4 * p, 2 * p, 7 * p, hair);
    }
    // Eyes (2x2 solid black pixel eyes matching image)
    drawPixelRect(ctx, 5 * p, 5 * p, 2 * p, 2 * p, outline);
    drawPixelRect(ctx, 9 * p, 5 * p, 2 * p, 2 * p, outline);

    // Head Outline
    drawPixelRect(ctx, 3 * p, 1 * p, 1 * p, 5 * p, outline); // Left hair edge
    drawPixelRect(ctx, 12 * p, 1 * p, 1 * p, 5 * p, outline); // Right hair edge
    drawPixelRect(ctx, 4 * p, 9 * p, 8 * p, 1 * p, outline); // Chin outline

    // Neck & White Collar
    drawPixelRect(ctx, 6 * p, 9 * p, 4 * p, 1 * p, skin);
    drawPixelRect(ctx, 5 * p, 10 * p, 6 * p, 1 * p, shirtColor);

    // Shirt Body
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);
    if (customization.uniform === 'batik') {
       // Add batik dots pattern
       ctx.fillStyle = '#dc2626'; // Red dots
       ctx.fillRect(5 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(7 * p, 12 * p, 1 * p, 1 * p);
       ctx.fillRect(10 * p, 11 * p, 1 * p, 1 * p);
       
       ctx.fillStyle = '#94a3b8'; // Grey dots
       ctx.fillRect(5 * p, 13 * p, 1 * p, 1 * p);
       ctx.fillRect(9 * p, 13 * p, 1 * p, 1 * p);
    }

    // Dark Slate Blue Tie
    drawPixelRect(ctx, 7 * p, 10 * p, 2 * p, 4 * p, tieColor);
    drawPixelRect(ctx, 7.5 * p, 14 * p, 1 * p, 1 * p, tieColor);

    // Short Sleeves & Bare Arms
    drawPixelRect(ctx, 3 * p, 11 * p, 1 * p, 2 * p, shirtColor); // Left sleeve
    drawPixelRect(ctx, 12 * p, 11 * p, 1 * p, 2 * p, shirtColor); // Right sleeve
    
    const armY = isWalking ? (walkAlt ? -1 * p : 1 * p) : 0;
    drawPixelRect(ctx, 3 * p, 13 * p + armY, 1 * p, 3 * p, skin); // Left arm
    drawPixelRect(ctx, 12 * p, 13 * p - armY, 1 * p, 3 * p, skin); // Right arm

    // Shirt Outlines
    drawPixelRect(ctx, 3 * p, 11 * p, 1 * p, 4 * p, outline);
    drawPixelRect(ctx, 12 * p, 11 * p, 1 * p, 4 * p, outline);

    // Pants & Legs
    let leftLegX = 5 * p;
    let leftLegY = 15 * p;
    let rightLegX = 9 * p;
    let rightLegY = 15 * p;

    if (isWalking) {
      if (walkAlt) {
        leftLegY += 1 * p;
        rightLegY -= 1 * p;
      } else {
        leftLegY -= 1 * p;
        rightLegY += 1 * p;
      }
    }

    // Left Leg & Shoe
    drawPixelRect(ctx, leftLegX, leftLegY, 2 * p, 5 * p, pantsColor);
    drawPixelRect(ctx, leftLegX, leftLegY + 5 * p, 2 * p, 1 * p, skin); // Ankles
    drawPixelRect(ctx, leftLegX, leftLegY + 6 * p, 2 * p, 1 * p, outline); // Shoes

    // Right Leg & Shoe
    drawPixelRect(ctx, rightLegX, rightLegY, 2 * p, 5 * p, pantsColor);
    drawPixelRect(ctx, rightLegX, rightLegY + 5 * p, 2 * p, 1 * p, skin); // Ankles
    drawPixelRect(ctx, rightLegX, rightLegY + 6 * p, 2 * p, 1 * p, outline); // Shoes

    if (customization.uniform === 'olahraga') {
      // Red stripe on the sides of the training pants
      drawPixelRect(ctx, leftLegX, leftLegY, 1 * p, 5 * p, '#dc2626');
      drawPixelRect(ctx, rightLegX + 1 * p, rightLegY, 1 * p, 5 * p, '#dc2626');
    }

    if (customization.gender === 'female' && customization.uniform !== 'olahraga') {
      drawPixelRect(ctx, 4 * p, 15 * p, 8 * p, 4 * p, pantsColor); // Skirt
      drawPixelRect(ctx, 4 * p, 19 * p, 8 * p, 1 * p, pantsShadow); // Skirt shadow
    } else {
      // Pants Seam/Center Line
      drawPixelRect(ctx, 7 * p, 15 * p, 2 * p, 5 * p, pantsShadow);
    }

  } else if (dir === 'up') {
    // === BACK VIEW (FACING UP - EXACTLY MATCHING IMAGE ROW 1) ===

    // Full Back Hair Dome
    drawPixelRect(ctx, 4 * p, 0 * p, 8 * p, 1 * p, outline);
    drawPixelRect(ctx, 3 * p, 1 * p, 10 * p, 7 * p, hair);
    
    if (customization.gender === 'female') {
      drawPixelRect(ctx, 2 * p, 4 * p, 2 * p, 7 * p, hair);
      drawPixelRect(ctx, 12 * p, 4 * p, 2 * p, 7 * p, hair);
    }

    // Ears on sides
    drawPixelRect(ctx, 2 * p, 5 * p, 1 * p, 2 * p, skin);
    drawPixelRect(ctx, 13 * p, 5 * p, 1 * p, 2 * p, skin);

    // Back Neck
    drawPixelRect(ctx, 6 * p, 8 * p, 4 * p, 2 * p, skin);
    drawPixelRect(ctx, 5 * p, 10 * p, 6 * p, 1 * p, shirtColor); // Back collar fold

    // Back White Shirt
    drawPixelRect(ctx, 4 * p, 11 * p, 8 * p, 4 * p, shirtColor);
    drawPixelRect(ctx, 4 * p, 14 * p, 8 * p, 1 * p, shirtShadow);
    if (customization.uniform === 'batik') {
       ctx.fillStyle = '#dc2626'; // Red dots
       ctx.fillRect(5 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(8 * p, 11 * p, 1 * p, 1 * p);
       ctx.fillRect(10 * p, 12 * p, 1 * p, 1 * p);
       
       ctx.fillStyle = '#94a3b8'; // Grey dots
       ctx.fillRect(6 * p, 13 * p, 1 * p, 1 * p);
       ctx.fillRect(9 * p, 13 * p, 1 * p, 1 * p);
    }

    // Back Sleeves & Arms
    drawPixelRect(ctx, 3 * p, 11 * p, 1 * p, 2 * p, shirtColor);
    drawPixelRect(ctx, 12 * p, 11 * p, 1 * p, 2 * p, shirtColor);

    const armY = isWalking ? (walkAlt ? -1 * p : 1 * p) : 0;
    drawPixelRect(ctx, 3 * p, 13 * p + armY, 1 * p, 3 * p, skin);
    drawPixelRect(ctx, 12 * p, 13 * p - armY, 1 * p, 3 * p, skin);

    // Shirt Outlines
    drawPixelRect(ctx, 3 * p, 11 * p, 1 * p, 4 * p, outline);
    drawPixelRect(ctx, 12 * p, 11 * p, 1 * p, 4 * p, outline);

    // Back Pants & Legs
    let leftLegY = 15 * p;
    let rightLegY = 15 * p;

    if (isWalking) {
      if (walkAlt) {
        leftLegY += 1 * p;
        rightLegY -= 1 * p;
      } else {
        leftLegY -= 1 * p;
        rightLegY += 1 * p;
      }
    }

    drawPixelRect(ctx, 5 * p, leftLegY, 2 * p, 5 * p, pantsColor);
    drawPixelRect(ctx, 5 * p, leftLegY + 5 * p, 2 * p, 1 * p, skin);
    drawPixelRect(ctx, 5 * p, leftLegY + 6 * p, 2 * p, 1 * p, outline);

    drawPixelRect(ctx, 9 * p, rightLegY, 2 * p, 5 * p, pantsColor);
    drawPixelRect(ctx, 9 * p, rightLegY + 5 * p, 2 * p, 1 * p, skin);
    drawPixelRect(ctx, 9 * p, rightLegY + 6 * p, 2 * p, 1 * p, outline);

    if (customization.uniform === 'olahraga') {
      // Red stripe on the sides of the training pants
      drawPixelRect(ctx, 5 * p, leftLegY, 1 * p, 5 * p, '#dc2626');
      drawPixelRect(ctx, 10 * p, rightLegY, 1 * p, 5 * p, '#dc2626');
    }

    if (customization.gender === 'female' && customization.uniform !== 'olahraga') {
      drawPixelRect(ctx, 4 * p, 15 * p, 8 * p, 4 * p, pantsColor); // Skirt
      drawPixelRect(ctx, 4 * p, 19 * p, 8 * p, 1 * p, pantsShadow); // Skirt shadow
    } else {
      // Pants Seam
      drawPixelRect(ctx, 7 * p, 15 * p, 2 * p, 5 * p, pantsShadow);
    }

  } else {
    // === SIDE VIEW (LEFT OR RIGHT) ===
    const isRight = dir === 'right';

    ctx.save();
    if (!isRight) {
      ctx.translate(16 * p, 0);
      ctx.scale(-1, 1);
    }

    // Side Hair & Head
    drawPixelRect(ctx, 5 * p, 1 * p, 7 * p, 2 * p, hair);
    drawPixelRect(ctx, 4 * p, 2 * p, 8 * p, 5 * p, hair);
    drawPixelRect(ctx, 6 * p, 5 * p, 5 * p, 4 * p, skin); // Side face
    drawPixelRect(ctx, 5 * p, 5 * p, 1 * p, 2 * p, skin); // Side ear
    drawPixelRect(ctx, 7 * p, 3 * p, 5 * p, 2 * p, hair); // Side bang

    if (customization.gender === 'female') {
      drawPixelRect(ctx, 4 * p, 5 * p, 3 * p, 6 * p, hair);
    }

    // Side Eye (1x2 pixel black eye)
    drawPixelRect(ctx, 9 * p, 5 * p, 1 * p, 2 * p, outline);

    // Side Shirt & Tie
    drawPixelRect(ctx, 5 * p, 10 * p, 6 * p, 5 * p, shirtColor);
    
    if (customization.uniform === 'batik') {
      ctx.fillStyle = '#dc2626'; // Red dots
      ctx.fillRect(6 * p, 11 * p, 1 * p, 1 * p);
      ctx.fillRect(8 * p, 12 * p, 1 * p, 1 * p);
      
      ctx.fillStyle = '#94a3b8'; // Grey dots
      ctx.fillRect(7 * p, 13 * p, 1 * p, 1 * p);
      ctx.fillRect(9 * p, 11 * p, 1 * p, 1 * p);
    }
    
    drawPixelRect(ctx, 9 * p, 10 * p, 1 * p, 3 * p, tieColor); // Tie side profile

    // Side Arm
    const armSwing = isWalking ? (walkAlt ? -1 * p : 1 * p) : 0;
    drawPixelRect(ctx, 6 * p + armSwing, 11 * p, 2 * p, 2 * p, shirtColor);
    drawPixelRect(ctx, 6 * p + armSwing, 13 * p, 2 * p, 3 * p, skin);

    // Side Pants & Scissor Legs
    let leg1X = 5 * p;
    let leg2X = 8 * p;
    if (isWalking) {
      if (walkAlt) {
        leg1X -= 1 * p;
        leg2X += 1 * p;
      } else {
        leg1X += 1 * p;
        leg2X -= 1 * p;
      }
    }

    drawPixelRect(ctx, leg1X, 15 * p, 2.5 * p, 5 * p, pantsColor);
    if (customization.uniform === 'olahraga') {
      drawPixelRect(ctx, leg1X + 1 * p, 15 * p, 1 * p, 5 * p, '#dc2626');
    }
    drawPixelRect(ctx, leg1X, 20 * p, 2.5 * p, 1 * p, skin);
    drawPixelRect(ctx, leg1X, 21 * p, 2.5 * p, 1 * p, outline);

    drawPixelRect(ctx, leg2X, 15 * p, 2.5 * p, 5 * p, pantsColor);
    if (customization.uniform === 'olahraga') {
      drawPixelRect(ctx, leg2X + 1 * p, 15 * p, 1 * p, 5 * p, '#dc2626');
    }
    drawPixelRect(ctx, leg2X, 20 * p, 2.5 * p, 1 * p, skin);
    drawPixelRect(ctx, leg2X, 21 * p, 2.5 * p, 1 * p, outline);

    if (customization.gender === 'female' && customization.uniform !== 'olahraga') {
       drawPixelRect(ctx, 4.5 * p, 15 * p, 7 * p, 4 * p, pantsColor); // Skirt
       drawPixelRect(ctx, 4.5 * p, 19 * p, 7 * p, 1 * p, pantsShadow); // Skirt shadow
    }

    ctx.restore();
  }

  ctx.restore();
}

// 8-bit Teacher Pixel Sprites
export function drawTeacherSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  subject: SubjectId,
  scale: number = 3,
  isBattle: boolean = false
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const p = scale;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(10 * p, 21 * p, 8 * p, 3 * p, 0, 0, Math.PI * 2);
  ctx.fill();

  if (subject === 'pkn') {
    // PAK ARIF (PKN) - Batik / Red Shirt, Mustache, Glasses, Red-White Flag Emblem
    // Hair
    drawPixelRect(ctx, 5 * p, 1 * p, 10 * p, 4 * p, '#3f2c1d');
    // Face
    drawPixelRect(ctx, 6 * p, 4 * p, 8 * p, 6 * p, '#fde047');
    // Eyes & Glasses
    drawPixelRect(ctx, 6 * p, 5 * p, 3 * p, 2 * p, '#000000');
    drawPixelRect(ctx, 11 * p, 5 * p, 3 * p, 2 * p, '#000000');
    drawPixelRect(ctx, 7 * p, 6 * p, 1 * p, 1 * p, '#60a5fa');
    drawPixelRect(ctx, 12 * p, 6 * p, 1 * p, 1 * p, '#60a5fa');
    // Mustache
    drawPixelRect(ctx, 8 * p, 8 * p, 4 * p, 1 * p, '#18181b');

    // Body (Red Batik)
    drawPixelRect(ctx, 4 * p, 10 * p, 12 * p, 7 * p, '#dc2626');
    drawPixelRect(ctx, 6 * p, 11 * p, 8 * p, 5 * p, '#b91c1c'); // Batik accent
    // Indonesian Flag Badge
    drawPixelRect(ctx, 5 * p, 11 * p, 3 * p, 1 * p, '#ef4444');
    drawPixelRect(ctx, 5 * p, 12 * p, 3 * p, 1 * p, '#ffffff');

    // Pants
    drawPixelRect(ctx, 5 * p, 17 * p, 10 * p, 4 * p, '#1e293b');
  } else if (subject === 'rpl') {
    // BU RANI (RPL) - Hijab / Tech Outfit, Glasses, Laptop
    // Hijab Green
    drawPixelRect(ctx, 4 * p, 1 * p, 12 * p, 10 * p, '#059669');
    // Face
    drawPixelRect(ctx, 7 * p, 4 * p, 6 * p, 5 * p, '#fed7aa');
    // Eyes
    drawPixelRect(ctx, 8 * p, 6 * p, 1 * p, 2 * p, '#18181b');
    drawPixelRect(ctx, 11 * p, 6 * p, 1 * p, 2 * p, '#18181b');

    // Shirt (Teal)
    drawPixelRect(ctx, 5 * p, 10 * p, 10 * p, 7 * p, '#047857');
    // Skirt
    drawPixelRect(ctx, 4 * p, 17 * p, 12 * p, 4 * p, '#065f46');

    // Laptop in hand
    drawPixelRect(ctx, 12 * p, 12 * p, 5 * p, 3 * p, '#e2e8f0');
    drawPixelRect(ctx, 13 * p, 13 * p, 3 * p, 1 * p, '#38bdf8'); // Glowing screen
  } else if (subject === 'indo') {
    // PAK BIMA (Indo) - Brown Blazer, Book in hand, Neat Hair
    // Hair
    drawPixelRect(ctx, 5 * p, 1 * p, 10 * p, 4 * p, '#451a03');
    // Face
    drawPixelRect(ctx, 6 * p, 4 * p, 8 * p, 6 * p, '#fed7aa');
    // Eyes & Smile
    drawPixelRect(ctx, 7 * p, 6 * p, 2 * p, 1 * p, '#18181b');
    drawPixelRect(ctx, 11 * p, 6 * p, 2 * p, 1 * p, '#18181b');
    drawPixelRect(ctx, 8 * p, 8 * p, 4 * p, 1 * p, '#b45309');

    // Brown Suit Blazer
    drawPixelRect(ctx, 4 * p, 10 * p, 12 * p, 8 * p, '#b45309');
    drawPixelRect(ctx, 8 * p, 10 * p, 4 * p, 8 * p, '#fef3c7'); // Inner shirt

    // Book
    drawPixelRect(ctx, 13 * p, 11 * p, 4 * p, 5 * p, '#dc2626');
    drawPixelRect(ctx, 14 * p, 12 * p, 2 * p, 3 * p, '#ffffff');

    // Pants
    drawPixelRect(ctx, 5 * p, 18 * p, 10 * p, 3 * p, '#27272a');
  } else if (subject === 'inggris') {
    // MS. MAYA (English) - Stylish Blue Outfit, Headset / Glasses
    // Hair (Auburn)
    drawPixelRect(ctx, 4 * p, 1 * p, 12 * p, 9 * p, '#9a3412');
    // Face
    drawPixelRect(ctx, 6 * p, 4 * p, 8 * p, 5 * p, '#fef3c7');
    // Eyes
    drawPixelRect(ctx, 7 * p, 6 * p, 2 * p, 2 * p, '#2563eb');
    drawPixelRect(ctx, 11 * p, 6 * p, 2 * p, 2 * p, '#2563eb');

    // Headset microphone
    drawPixelRect(ctx, 3 * p, 4 * p, 10 * p, 1 * p, '#475569');
    drawPixelRect(ctx, 12 * p, 7 * p, 2 * p, 2 * p, '#38bdf8');

    // Blue Jacket
    drawPixelRect(ctx, 4 * p, 9 * p, 12 * p, 8 * p, '#2563eb');
    drawPixelRect(ctx, 8 * p, 10 * p, 4 * p, 7 * p, '#eff6ff');

    // Pants
    drawPixelRect(ctx, 5 * p, 17 * p, 10 * p, 4 * p, '#1e1b4b');
  } else if (subject === 'bio') {
    // BU SARI (Bio) - White Lab Coat, Test Tube
    // Hair
    drawPixelRect(ctx, 5 * p, 1 * p, 10 * p, 8 * p, '#1e1b4b');
    // Face
    drawPixelRect(ctx, 6 * p, 4 * p, 8 * p, 5 * p, '#ffe4e6');
    // Glasses
    drawPixelRect(ctx, 6 * p, 5 * p, 3 * p, 2 * p, '#a855f7');
    drawPixelRect(ctx, 11 * p, 5 * p, 3 * p, 2 * p, '#a855f7');

    // White Lab Coat
    drawPixelRect(ctx, 4 * p, 9 * p, 12 * p, 9 * p, '#f8fafc');
    drawPixelRect(ctx, 8 * p, 10 * p, 4 * p, 8 * p, '#84cc16'); // Green inner shirt

    // Test Tube with green potion
    drawPixelRect(ctx, 13 * p, 12 * p, 2 * p, 5 * p, '#e2e8f0');
    drawPixelRect(ctx, 13 * p, 14 * p, 2 * p, 3 * p, '#84cc16');

    // Pants
    drawPixelRect(ctx, 6 * p, 18 * p, 8 * p, 3 * p, '#3f3f46');
  } else if (subject === 'math') {
    // GEOMETRY KEEPER (Math) - Mysterious Purple Robe, Triangle Staff
    // Glowing Crown / Horns
    drawPixelRect(ctx, 6 * p, 0 * p, 8 * p, 2 * p, '#c084fc');
    // Head / Mask
    drawPixelRect(ctx, 5 * p, 2 * p, 10 * p, 7 * p, '#18181b');
    // Glowing Eyes
    drawPixelRect(ctx, 7 * p, 5 * p, 2 * p, 2 * p, '#facc15');
    drawPixelRect(ctx, 11 * p, 5 * p, 2 * p, 2 * p, '#facc15');

    // Robe
    drawPixelRect(ctx, 3 * p, 9 * p, 14 * p, 11 * p, '#7e22ce');
    drawPixelRect(ctx, 7 * p, 10 * p, 6 * p, 10 * p, '#a855f7');

    // Triangle Staff
    drawPixelRect(ctx, 15 * p, 3 * p, 1 * p, 17 * p, '#e2e8f0');
    // Staff Crystal Triangle
    drawPixelRect(ctx, 14 * p, 1 * p, 3 * p, 3 * p, '#f43f5e');
  }

  // Aura effect if in battle mode
  if (isBattle) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-2, -2, 20 * p + 4, 22 * p + 4);
  }

  ctx.restore();
}

// 8-bit Classroom Desk & Chair
export function drawDeskSprite(ctx: CanvasRenderingContext2D, x: number, y: number, width: number = 80, height: number = 36) {
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

// 8-bit Door Sprite
export function drawDoorSprite(
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
