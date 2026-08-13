import React, { useRef, useEffect } from 'react';
import { PlayerCustomization } from '../types';
import { drawPlayerSprite } from './PixelSprites';
import { X, Check } from 'lucide-react';

const soulColors = [
  { name: 'Merah (Determinasi)', value: '#ef4444' },
  { name: 'Cyan (Kesabaran)', value: '#06b6d4' },
  { name: 'Oranye (Keberanian)', value: '#f97316' },
  { name: 'Biru (Integritas)', value: '#3b82f6' },
  { name: 'Ungu (Kegigihan)', value: '#a855f7' },
  { name: 'Hijau (Kebaikan)', value: '#22c55e' },
  { name: 'Kuning (Keadilan)', value: '#eab308' },
  { name: 'Pink (Cinta)', value: '#ec4899' }
];

interface CustomizerModalProps {
  customization: PlayerCustomization;
  onSave: (updated: PlayerCustomization) => void;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({ customization, onSave, onClose }) => {
  const [form, setForm] = React.useState<PlayerCustomization>(customization);
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

      // Draw preview sprite (shifted left)
      drawPlayerSprite(ctx, 24, 32, form, 'down', 0, 4);

      // Draw Soul preview (pulsing heart) next to character
      const time = Date.now() / 300;
      const pulse = Math.sin(time) * 1.5;
      
      ctx.save();
      ctx.translate(120, 72);
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
      const currentSoul = soulColors.find(s => s.value === (form.soulColor || '#ef4444'));
      const match = currentSoul?.name.match(/\((.*?)\)/);
      const traitName = match ? match[1].toUpperCase() : 'SOUL';

      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(traitName, 120, 115);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-zinc-950 border-4 border-white max-w-lg w-full p-6 text-white rounded shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-yellow-400 mb-4 border-b-2 border-zinc-700 pb-2 flex items-center gap-2">
          <span>🎨</span> KUSTOMISASI KARAKTER SISWA
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Canvas Preview */}
          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-col items-center justify-center rounded">
            <span className="text-xs text-zinc-400 mb-2 font-bold">PREVIEW SPRITE</span>
            <canvas ref={canvasRef} width={160} height={160} className="pixelated" />
            <span className="text-xs text-yellow-400 mt-2 font-bold uppercase">{form.uniform} UNIFORM</span>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1">NAMA SISWA</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 px-3 py-1.5 text-white font-mono rounded outline-none"
                maxLength={12}
                placeholder="Nama kamu"
              />
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1">JENIS KELAMIN</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as PlayerCustomization['gender'] })}
                className="w-full w-full bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 px-3 py-1.5 text-white font-mono rounded outline-none mb-3"
              >
                <option value="male">Laki-Laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1">SERAGAM SEKOLAH</label>
              <select
                value={form.uniform}
                onChange={(e) => setForm({ ...form, uniform: e.target.value as PlayerCustomization['uniform'] })}
                className="w-full bg-zinc-900 border-2 border-zinc-600 focus:border-yellow-400 px-3 py-1.5 text-white font-mono rounded outline-none"
              >
                <option value="smk">Seragam SMK (Putih-Abu)</option>
                <option value="pramuka">Seragam Pramuka (Cokelat)</option>
                <option value="batik">Seragam Batik Sekolah</option>
                <option value="olahraga">Seragam Olahraga (Biru)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1">WARNA RAMBUT</label>
              <div className="flex gap-2">
                {hairColors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, hairColor: c.value })}
                    className={`w-7 h-7 rounded border-2 ${
                      form.hairColor === c.value ? 'border-yellow-400 scale-110' : 'border-zinc-700'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1">WARNA KULIT</label>
              <div className="flex gap-2">
                {skinColors.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm({ ...form, skinColor: s.value })}
                    className={`w-7 h-7 rounded border-2 ${
                      form.skinColor === s.value ? 'border-yellow-400 scale-110' : 'border-zinc-700'
                    }`}
                    style={{ backgroundColor: s.value }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1 flex items-center gap-1">
                WARNA SOUL <span className="text-red-500">♥</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {soulColors.map((sc) => (
                  <button
                    key={sc.value}
                    type="button"
                    onClick={() => setForm({ ...form, soulColor: sc.value })}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                      form.soulColor === sc.value ? 'border-white scale-110' : 'border-zinc-700'
                    }`}
                    style={{ backgroundColor: sc.value }}
                    title={sc.name}
                  >
                    {form.soulColor === sc.value && <span className="text-black text-[10px] drop-shadow-md">♥</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t-2 border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 text-zinc-300 font-bold rounded text-xs"
          >
            BATAL
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-2 border-yellow-300 rounded text-xs flex items-center gap-1 shadow-md"
          >
            <Check size={16} /> SIMPAN KARAKTER
          </button>
        </div>
      </div>
    </div>
  );
};
