const fs = require('fs');
let content = fs.readFileSync('src/utils/AudioEngine.ts', 'utf-8');

// Find the last closing brace
const lastBraceIndex = content.lastIndexOf('}');

if (lastBraceIndex !== -1) {
  const method = `
  public playEncounter() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    
    // Bweep! Bweep! Bweep! (Flash sound)
    try {
      [0, 0.15, 0.3].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + 0.1);
      });
      
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(440, this.ctx.currentTime + 0.6);
      gain2.gain.setValueAtTime(0.3, this.ctx.currentTime + 0.6);
      gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);
      
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(this.ctx.currentTime + 0.6);
      osc2.stop(this.ctx.currentTime + 0.9);
      
    } catch {}
  }
`;
  
  content = content.substring(0, lastBraceIndex) + method + content.substring(lastBraceIndex);
  fs.writeFileSync('src/utils/AudioEngine.ts', content);
  console.log('Patched AudioEngine successfully!');
}
