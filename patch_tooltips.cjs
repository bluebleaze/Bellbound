const fs = require('fs');
let content = fs.readFileSync('src/components/BattleArena.tsx', 'utf-8');

const targetButtons = `{/* Battle Command Action Bar */}
      <div className="w-full bg-zinc-900 border-x-4 border-b-4 border-white p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-b">
        <button
          onClick={handleObserve}
          disabled={isDodging}
          className="py-3 px-2 bg-zinc-950 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-1.5 rounded transition-colors"
        >
          <Eye size={16} />
          <span>OBSERVE</span>
        </button>

        <button
          onClick={handleThink}
          disabled={isDodging}
          className="py-3 px-2 bg-zinc-950 border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-500 hover:text-black disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-1.5 rounded transition-colors"
        >
          <Brain size={16} />
          <span>THINK (JAWAB)</span>
        </button>

        <button
          onClick={handleTalk}
          disabled={isDodging}
          className="py-3 px-2 bg-zinc-950 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-1.5 rounded transition-colors"
        >
          <MessageSquare size={16} />
          <span>TALK</span>
        </button>

        <button
          onClick={handleAct}
          disabled={isDodging}
          className="py-3 px-2 bg-zinc-950 border-2 border-zinc-600 hover:border-green-400 hover:text-green-300 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-1.5 rounded transition-colors"
        >
          <Heart size={16} />
          <span>ACT (+HEAL)</span>
        </button>
      </div>`;

const replacementButtons = `{/* Battle Command Action Bar */}
      <div className="w-full bg-zinc-900 border-x-4 border-b-4 border-white p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-b">
        <button
          onClick={handleObserve}
          disabled={isDodging}
          className="relative group py-2 px-1 bg-zinc-950 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
        >
          <div className="flex items-center gap-1"><Eye size={14} /> <span>CEK</span></div>
          <span className="text-[9px] font-normal text-zinc-400 group-hover:text-yellow-200">(Lihat status)</span>
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-32 p-1.5 bg-black border border-white text-[10px] text-white rounded z-10 shadow-xl pointer-events-none">
            Lihat info lawan tanpa membuang giliran.
          </div>
        </button>

        <button
          onClick={handleThink}
          disabled={isDodging}
          className="relative group py-2 px-1 bg-zinc-950 border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-500 hover:text-black disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
        >
          <div className="flex items-center gap-1"><Brain size={14} /> <span>FIGHT</span></div>
          <span className="text-[9px] font-normal opacity-80">(Jawab soal)</span>
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-36 p-1.5 bg-black border border-white text-[10px] text-white rounded z-10 shadow-xl pointer-events-none">
            Serang guru dengan cara menjawab soal kuis dengan benar!
          </div>
        </button>

        <button
          onClick={handleTalk}
          disabled={isDodging}
          className="relative group py-2 px-1 bg-zinc-950 border-2 border-zinc-600 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
        >
          <div className="flex items-center gap-1"><MessageSquare size={14} /> <span>MERCY</span></div>
          <span className="text-[9px] font-normal text-zinc-400 group-hover:text-yellow-200">(Diskusi)</span>
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-36 p-1.5 bg-black border border-white text-[10px] text-white rounded z-10 shadow-xl pointer-events-none">
            Persingkat waktu serangan peluru guru & pulihkan 2 HP.
          </div>
        </button>

        <button
          onClick={handleAct}
          disabled={isDodging}
          className="relative group py-2 px-1 bg-zinc-950 border-2 border-zinc-600 hover:border-green-400 hover:text-green-300 disabled:opacity-40 font-bold text-xs flex flex-col items-center justify-center gap-1 rounded transition-colors"
        >
          <div className="flex items-center gap-1"><Heart size={14} /> <span>ITEM</span></div>
          <span className="text-[9px] font-normal text-zinc-400 group-hover:text-green-200">(Catatan)</span>
          <div className="absolute bottom-full mb-1 right-0 sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:block w-36 p-1.5 bg-black border border-white text-[10px] text-white rounded z-10 shadow-xl pointer-events-none text-center">
            Pakai buku catatan untuk sembuhkan 10 HP. (Sisa: {actUsesLeft}x)
          </div>
        </button>
      </div>`;

content = content.replace(targetButtons, replacementButtons);

// Make dodge instruction clearer
const targetDodgeText = `          <span className="text-zinc-400 font-bold">
            {isDodging ? '⚠️ SERANGAN PELURU AKTIF!' : 'ARENA JIWA ♥'}
          </span>`;

const replacementDodgeText = `          <span className="text-zinc-400 font-bold flex flex-col">
            <span>{isDodging ? '⚠️ SERANGAN PELURU AKTIF!' : 'ARENA JIWA ♥'}</span>
            {isDodging && <span className="text-[10px] text-yellow-400 font-normal">Gunakan Panah / WASD untuk menghindari!</span>}
          </span>`;

content = content.replace(targetDodgeText, replacementDodgeText);

fs.writeFileSync('src/components/BattleArena.tsx', content);
console.log('Patched BattleArena with tooltips and instructions');
