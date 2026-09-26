import { useState } from 'react';
import { SORTEOS, PARTICIPANTES, PREMIOS } from '../../data/mockData';

type DrawState = 'idle' | 'spinning' | 'done';

export default function AdminRealizarSorteo() {
  const [selectedSorteo, setSelectedSorteo] = useState(SORTEOS[0]?.id ?? '');
  const [drawState, setDrawState] = useState<DrawState>('idle');
  const [winners, setWinners] = useState<{ nombre: string; prize: string; num: string }[]>([]);
  const [spinIndex, setSpinIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);

  const sorteo = SORTEOS.find((s) => s.id === selectedSorteo);
  const participants = PARTICIPANTES.filter((p) => p.sorteoId === selectedSorteo);
  const prizes = PREMIOS.filter((p) => p.sorteoId === selectedSorteo && !p.ganadorId);

  async function handleDraw() {
    if (participants.length === 0 || prizes.length === 0) return;
    setDrawState('spinning');
    setWinners([]);

    const pool = [...participants];
    const collectedWinners: { nombre: string; prize: string; num: string }[] = [];
    const segmentAngle = 360 / participants.length;

    for (const prize of prizes.slice(0, participants.length)) {
      const winnerPoolIndex = Math.floor(Math.random() * pool.length);
      const winner = pool.splice(winnerPoolIndex, 1)[0];
      const winnerIndex = participants.findIndex((participant) => participant.id === winner.id);
      const targetRotation = 1800 + (90 - (winnerIndex + 0.5) * segmentAngle);

      setSpinIndex(winnerIndex);
      setWheelRotation((rotation) => rotation + targetRotation);
      await new Promise((resolve) => setTimeout(resolve, 3400));

      collectedWinners.push({
        nombre: `${winner.nombres} ${winner.apellidos}`,
        prize: prize.nombre,
        num: `#${Math.floor(Math.random() * 9000 + 1000)}`,
      });
      setWinners([...collectedWinners]);
    }

    setDrawState('done');
  }

  const currentSpin = participants[spinIndex];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Sorteo selection */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-admin-muted)' }}>Seleccionar sorteo</label>
        <select
          value={selectedSorteo}
          onChange={(e) => { setSelectedSorteo(e.target.value); setDrawState('idle'); setWinners([]); }}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-border)', color: 'var(--color-admin-text)', fontFamily: 'var(--font-body)' }}
        >
          {SORTEOS.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>

        {sorteo && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: 'Participantes', val: participants.length, icon: '' },
              { label: 'Premios disponibles', val: prizes.length, icon: '' },
              { label: 'Estado', val: sorteo.estado, icon: '' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--color-admin-bg)' }}>
                <p className="text-lg">{stat.icon}</p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-admin-text)' }}>{stat.val}</p>
                <p className="text-xs" style={{ color: 'var(--color-admin-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roulette */}
      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        {drawState === 'idle' && (
          <div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-admin-text)' }}>Listo para sortear</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-admin-muted)' }}>
              Gira la ruleta con los {participants.length} nombres y selecciona {prizes.length} ganador{prizes.length !== 1 ? 'es' : ''}.
            </p>
            <Roulette participants={participants} rotation={wheelRotation} />
            <button
              onClick={handleDraw}
              disabled={participants.length === 0 || prizes.length === 0}
              className="px-8 py-3.5 rounded-2xl font-bold text-base transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-brand-gold)', color: 'var(--color-brand-bg)' }}
            >
              ¡Realizar Sorteo!
            </button>
            {(participants.length === 0 || prizes.length === 0) && (
              <p className="text-xs mt-3" style={{ color: 'var(--color-brand-error)' }}>
                {participants.length === 0 ? 'No hay participantes en este sorteo.' : 'No hay premios disponibles.'}
              </p>
            )}
          </div>
        )}

        {drawState === 'spinning' && currentSpin && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: 'var(--color-admin-muted)' }}>La ruleta está girando...</p>
            <Roulette participants={participants} rotation={wheelRotation} />
            <p className="font-display text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-gold-dim)' }}>
              {currentSpin.nombres} {currentSpin.apellidos}
            </p>
            <p className="text-sm mt-1 font-mono" style={{ color: 'var(--color-admin-muted)' }}>{currentSpin.dni}</p>
          </div>
        )}

        {drawState === 'done' && (
          <div>
            <h3 className="font-display text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-gold-dim)' }}>¡Tenemos ganadores!</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-admin-muted)' }}>Sorteo realizado exitosamente</p>

            <div className="space-y-3 text-left">
              {winners.map((w, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-border)' }}>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-admin-text)' }}>{w.nombre}</p>
                    <p className="text-xs" style={{ color: 'var(--color-admin-muted)' }}>Premio: {w.prize}</p>
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-brand-gold-dim)' }}>{w.num}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setDrawState('idle'); setWinners([]); }}
              className="mt-6 px-6 py-2 rounded-xl text-sm font-medium transition hover:opacity-80"
              style={{ border: '1px solid var(--color-admin-border)', color: 'var(--color-admin-text)' }}
            >
              Nuevo sorteo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Roulette({ participants, rotation }: {
  participants: typeof PARTICIPANTES;
  rotation: number;
}) {
  const segmentAngle = participants.length > 0 ? 360 / participants.length : 360;
  const colors = ['#e8c547', '#b88b5a', '#d9a441', '#8f674d', '#f0d77a', '#a97949', '#c79b65', '#73513d'];
  const wheelBackground = participants.length > 0
    ? `conic-gradient(${participants.map((_, index) => {
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      return `${colors[index % colors.length]} ${start}deg ${end - 1}deg, var(--color-admin-card) ${end - 1}deg ${end}deg`;
    }).join(', ')})`
    : 'var(--color-admin-bg)';

  return (
    <div className="relative mx-auto mb-7 h-[min(82vw,30rem)] w-[min(82vw,30rem)] max-w-full">
      <div
        className="relative h-full w-full overflow-hidden rounded-full border-8 shadow-lg"
        style={{
          background: wheelBackground,
          borderColor: 'var(--color-admin-card)',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 3s cubic-bezier(0.12, 0.8, 0.18, 1)',
        }}
      >
        {participants.map((participant, index) => {
          const angle = index * segmentAngle + segmentAngle / 2;
          return (
            <span
              key={participant.id}
              className="absolute left-1/2 top-1/2 w-[min(27%,7rem)] -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(0.55rem,1.6vw,0.78rem)] font-bold leading-tight"
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(min(41vw, 13.25rem) * -1)) rotate(${-angle}deg)`, color: index % 3 === 0 ? 'var(--color-brand-bg)' : '#fffaf0' }}
            >
              {participant.nombres} {participant.apellidos}
            </span>
          );
        })}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-8" style={{ background: '#fffaf0', borderColor: 'var(--color-admin-card)' }}>
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'var(--color-brand-gold)' }} />
        </div>
      </div>
      <div className="absolute -right-5 top-1/2 z-20 -translate-y-1/2" style={{
        width: 0,
        height: 0,
        borderTop: '15px solid transparent',
        borderBottom: '15px solid transparent',
        borderRight: '38px solid #111',
      }} />
      <div className="absolute -right-7 top-1/2 z-20 h-7 w-7 -translate-y-1/2 rounded-full border-4 border-white bg-black" />
    </div>
  );
}
