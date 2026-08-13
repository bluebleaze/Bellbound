const fs = require('fs');
let content = fs.readFileSync('src/utils/AudioEngine.ts', 'utf-8');

const target = `  public playShatter() {
    if (!this.enabled) return;
    this.playTone(150, 'sawtooth', 0.1);
    setTimeout(() => this.playTone(100, 'square', 0.2), 100);
    setTimeout(() => this.playNoise(0.3), 200);
  }`;

const replacement = target + `

  public playEncounter() {
    if (!this.enabled) return;
    // Undertale-like battle encounter flash sound (Bweep! Bweep! Bweep!)
    this.playTone(880, 'square', 0.1);
    setTimeout(() => this.playTone(880, 'square', 0.1), 150);
    setTimeout(() => this.playTone(880, 'square', 0.1), 300);
    setTimeout(() => this.playTone(440, 'square', 0.3), 600);
  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/utils/AudioEngine.ts', content);
console.log('Patched AudioEngine');
