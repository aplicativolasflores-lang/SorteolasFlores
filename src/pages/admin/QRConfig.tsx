import { useState, useEffect, useRef } from 'react';
import { RESTAURANT, SORTEOS } from '../../data/mockData';

function drawQR(canvas: HTMLCanvasElement, size: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;
  const cell = size / 25;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Pseudo-random but deterministic pattern
  const seed = 'laparrilla2026';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  ctx.fillStyle = '#1a100d';

  // Finder squares (corners)
  function finder(ox: number, oy: number) {
    ctx!.fillStyle = '#1a100d';
    ctx!.fillRect(ox * cell, oy * cell, 7 * cell, 7 * cell);
    ctx!.fillStyle = '#ffffff';
    ctx!.fillRect((ox + 1) * cell, (oy + 1) * cell, 5 * cell, 5 * cell);
    ctx!.fillStyle = '#1a100d';
    ctx!.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
  }
  finder(0, 0); finder(18, 0); finder(0, 18);

  // Data cells
  function rand() { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 0xffffffff; }
  for (let r = 0; r < 25; r++) {
    for (let c = 0; c < 25; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= 17) || (r >= 17 && c < 8);
      if (!inFinder && rand() > 0.5) {
        ctx.fillStyle = '#1a100d';
        ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
      }
    }
  }

  // Gold accent border
  ctx.strokeStyle = '#e8c547';
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
}

export default function AdminQR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSorteo, setSelectedSorteo] = useState(SORTEOS[0]?.id ?? '');
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) drawQR(canvasRef.current, 280);
  }, [selectedSorteo]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-sorteo-${selectedSorteo}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }

  const baseUrl = `${window.location.origin}?sorteo=${selectedSorteo}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <p className="text-sm" style={{ color: 'var(--color-admin-muted)' }}>
        Genera e imprime el código QR para que tus clientes lo escaneen desde el restaurante y participen en el sorteo.
      </p>

      {/* Sorteo selector */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-admin-muted)' }}>Sorteo para el QR</label>
        <select
          value={selectedSorteo}
          onChange={(e) => setSelectedSorteo(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-border)', color: 'var(--color-admin-text)', fontFamily: 'var(--font-body)' }}
        >
          {SORTEOS.map((s) => <option key={s.id} value={s.id}>{s.nombre} ({s.estado})</option>)}
        </select>
      </div>

      {/* QR preview */}
      <div className="rounded-2xl p-8 flex flex-col items-center gap-6" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        <div className="text-center mb-2">
          <p className="text-lg font-display font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-admin-text)' }}>{RESTAURANT.name}</p>
          <p className="text-sm" style={{ color: 'var(--color-admin-muted)' }}>Escanea para participar en el sorteo</p>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: '#fff' }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>

        <div className="text-center">
          <p className="text-xs font-mono" style={{ color: 'var(--color-admin-muted)', wordBreak: 'break-all' }}>{baseUrl}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
            style={{ background: 'var(--color-brand-gold)', color: 'var(--color-brand-bg)' }}
          >
            {downloaded ? 'Descargado' : 'Descargar PNG'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-80"
            style={{ border: '1px solid var(--color-admin-border)', color: 'var(--color-admin-text)' }}
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-admin-text)' }}>Instrucciones de uso</h3>
        {[
          'Imprime el QR y colócalo en mesas, barra o entrada del restaurante.',
          'El cliente lo escanea con su celular y es redirigido al formulario.',
          'El sistema valida automáticamente que el cliente esté dentro del restaurante.',
          'Cada persona solo puede participar una vez por día.',
        ].map((txt, i) => (
          <p key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-admin-muted)' }}>
            <span className="font-bold mt-0.5" style={{ color: 'var(--color-brand-gold-dim)' }}>{i + 1}.</span>
            {txt}
          </p>
        ))}
      </div>
    </div>
  );
}
