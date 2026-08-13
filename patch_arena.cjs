const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

// 1. Add callback refs
const refTarget = "const currentHpRef = useRef(progress.hp);";
const refReplacement = `const currentHpRef = useRef(progress.hp);
  const onUpdateHpRef = useRef(onUpdateHp);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onUpdateHpRef.current = onUpdateHp;
  }, [onUpdateHp]);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);`;
content = content.replace(refTarget, refReplacement);

// 2. Replace onUpdateHp(nextHp); with onUpdateHpRef.current(nextHp);
content = content.replace(/onUpdateHp\(nextHp\);/g, 'onUpdateHpRef.current(nextHp);');
content = content.replace(/onGameOver\(\)/g, 'onGameOverRef.current()');

// 3. Remove onUpdateHp, onGameOver from useEffect dependencies
content = content.replace(/\[subject, onUpdateHp, onGameOver\]/g, '[subject]');

// 4. Update Soul Color
// Replace ctx.fillStyle = isFlashing ? '#ffffff' : '#ef4444'; 
// with ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');
content = content.replace(
  "ctx.fillStyle = isFlashing ? '#ffffff' : '#ef4444';",
  "ctx.fillStyle = isFlashing ? '#ffffff' : (progress.customization.soulColor || '#ef4444');"
);

// 5. Update Soul Aura Color
content = content.replace(
  "ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';",
  "ctx.strokeStyle = progress.customization.soulColor ? progress.customization.soulColor + '66' : 'rgba(239, 68, 68, 0.4)';"
);

// 6. Update Shatter particles color
// We might have multiple '#ef4444' inside shatter
content = content.replace(
  "ctx.fillStyle = '#ef4444';",
  "ctx.fillStyle = progress.customization.soulColor || '#ef4444';"
);
content = content.replace(
  "ctx.fillStyle = '#ef4444';",
  "ctx.fillStyle = progress.customization.soulColor || '#ef4444';"
);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched BattleArena');
