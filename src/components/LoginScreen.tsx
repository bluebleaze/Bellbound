import React, { useRef, useEffect } from 'react';
import { PlayerCustomization } from '../types';
import { drawPlayerSprite } from './PixelSprites';
import { ArrowRight, User } from 'lucide-react';

interface LoginScreenProps {
  customization: PlayerCustomization;
  onSave: (updated: PlayerCustomization) => void;
  onStart: (form: PlayerCustomization, diff: "normal" | "hard" | "extreme") => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ customization, onSave, onStart }) => {
  // Clear out default names to force user to type
  const initialName = (customization.name === 'KAMU' || customization.name === 'Siswa') ? '' : customization.name;
  const [form, setForm] = React.useState<PlayerCustomization>({ ...customization, name: initialName || '' });
  const [difficulty, setDifficulty] = React.useState<"normal" | "hard" | "extreme">("normal");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw preview sprite (shifted left slightly)
      drawPlayerSprite(ctx, 16, 12, form, 'down', 0, 4);

      // Draw Soul preview (pulsing heart) next to character
      const time = Date.now() / 300;
      const pulse = Math.sin(time) * 1.5;
      
      ctx.save();
      ctx.translate(72, 48); // Position inside 96x120 canvas
      ctx.scale(2 + pulse * 0.1, 2 + pulse * 0.1);
      
      ctx.fillStyle = form.soulColor || '#ef4444';
      
      // Draw 8-bit heart shape (simplified)
      ctx.beginPath();
      // left bump
      ctx.fillRect(-3, -3, 2, 2);
      ctx.fillRect(-4, -1, 4, 3);
      // right bump
      ctx.fillRect(1, -3, 2, 2);
      ctx.fillRect(0, -1, 4, 3);
      // bottom points
      ctx.fillRect(-3, 2, 6, 1);
      ctx.fillRect(-2, 3, 4, 1);
      ctx.fillRect(-1, 4, 2, 1);
      
      ctx.restore();
      
      // Add text label below soul
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SOUL', 72, 85);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [form]);



  const hairColors = [
    { name: 'Hitam', value: '#18181b' },
    { name: 'Cokelat', value: '#451a03' },
    { name: 'Merah Tua', value: '#9a3412' },
    { name: 'Pirang', value: '#ca8a04' },
  ];

  const skinColors = [
    { name: 'Pucat', value: '#fcdbb3' },
    { name: 'Cerah', value: '#f0c29a' },
    { name: 'Kuning Langsat', value: '#e0ac69' },
    { name: 'Sawo Matang', value: '#c68642' },
    { name: 'Gelap', value: '#8d5524' },
    { name: 'Hitam Gelap', value: '#3d2314' },
  ];

  const soulColors = [
    { name: 'Merah (Determination)', value: '#ef4444' },
    { name: 'Cyan (Patience)', value: '#06b6d4' },
    { name: 'Orange (Bravery)', value: '#f97316' },
    { name: 'Biru (Integrity)', value: '#3b82f6' },
    { name: 'Ungu (Perseverance)', value: '#a855f7' },
    { name: 'Hijau (Kindness)', value: '#22c55e' },
    { name: 'Kuning (Justice)', value: '#eab308' },
  ];

  return (
    <div className="max-w-3xl w-full bg-zinc-950/90 backdrop-blur-md border-4 border-white p-8 rounded shadow-2xl flex flex-col md:flex-row gap-8 relative overflow-hidden my-auto animate-in zoom-in duration-300">
      
      {/* Left side - Avatar preview */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-4 md:w-1/3 border-r-2 border-zinc-800 pr-8">
        <div className="text-xl font-bold text-yellow-400 mb-2 border-b-2 border-zinc-800 pb-2 w-full text-center">ID CARD (v2)</div>
        <div className="w-40 h-40 bg-black rounded-lg border-4 border-white flex items-center justify-center overflow-hidden shadow-inner">
          <canvas ref={canvasRef} width={96} height={120} className="scale-125" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-white">{form.name}</div>
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{form.uniform}</div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-grow space-y-5">
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-1">NAMA SISWA</label>
          <div className="flex bg-black border-2 border-zinc-700 rounded focus-within:border-white transition-colors">
            <div className="px-3 py-2 text-zinc-500 flex items-center justify-center">
              <User size={16} />
            </div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.substring(0, 12) })}
              className="bg-transparent w-full text-white font-bold px-2 py-2 outline-none"
              placeholder="Masukkan nama..."
              autoFocus
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1">
              <label className="block text-zinc-400 text-xs font-bold mb-1">GENDER</label>
              <div className="flex bg-black border-2 border-zinc-700 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: 'male' })}
                  className={`flex-1 py-1 text-xs font-bold transition-colors ${form.gender === 'male' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                >LAKI-LAKI</button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: 'female' })}
                  className={`flex-1 py-1 text-xs font-bold transition-colors ${form.gender === 'female' ? 'bg-pink-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                >PEREMPUAN</button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-zinc-400 text-xs font-bold mb-1">TINGKAT KESULITAN</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-black border-2 border-zinc-700 text-white font-bold p-1.5 rounded outline-none focus:border-white text-xs"
              >
                <option value="normal">NORMAL (10 Soal)</option>
                <option value="hard">HARD (20 Soal + Esai + 20s)</option>
                <option value="extreme">EXTREME (30 Soal + Esai + 15s)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1">SERAGAM</label>
            <select
              value={form.uniform}
              onChange={(e) => setForm({ ...form, uniform: e.target.value as any })}
              className="w-full bg-black border-2 border-zinc-700 text-white font-bold p-2 rounded outline-none focus:border-white"
            >
              <option value="smk">Putih Abu-abu (SMK)</option>
              <option value="pramuka">Pramuka</option>
              <option value="batik">Batik Sekolah</option>
              <option value="olahraga">Baju Olahraga</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1">WARNA KULIT</label>
            <div className="flex flex-wrap gap-1">
              {skinColors.map((sc) => (
                <button
                  key={sc.value}
                  type="button"
                  onClick={() => setForm({ ...form, skinColor: sc.value })}
                  className={`w-6 h-6 rounded border-2 ${
                    form.skinColor === sc.value ? 'border-white scale-110' : 'border-zinc-700'
                  }`}
                  style={{ backgroundColor: sc.value }}
                  title={sc.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1">WARNA RAMBUT</label>
            <div className="flex flex-wrap gap-1">
              {hairColors.map((hc) => (
                <button
                  key={hc.value}
                  type="button"
                  onClick={() => setForm({ ...form, hairColor: hc.value })}
                  className={`w-6 h-6 rounded border-2 ${
                    form.hairColor === hc.value ? 'border-white scale-110' : 'border-zinc-700'
                  }`}
                  style={{ backgroundColor: hc.value }}
                  title={hc.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1 flex items-center gap-1">WARNA SOUL <span className="text-red-500">♥</span></label>
            <div className="flex flex-wrap gap-1">
              {soulColors.map((sc) => (
                <button
                  key={sc.value}
                  type="button"
                  onClick={() => setForm({ ...form, soulColor: sc.value })}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    form.soulColor === sc.value ? 'border-white scale-110' : 'border-zinc-700'
                  }`}
                  style={{ backgroundColor: sc.value }}
                  title={sc.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={() => { onSave(form); onStart(form, difficulty); }}
            disabled={!form.name.trim()}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-900 text-black font-extrabold border-b-4 border-yellow-700 rounded text-xl flex items-center justify-center gap-2 transition-all shadow-md active:border-b-0 active:translate-y-1"
          >
            <span>MULAI PERJALANAN</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
