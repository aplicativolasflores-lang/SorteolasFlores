import { SORTEOS, PARTICIPANTES, PREMIOS, GANADORES } from '../../data/mockData';

function StatCard({ label, value, icon, sub, accent }: { label: string; value: string | number; icon: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--color-admin-muted)' }}>{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="font-display text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: accent ? 'var(--color-brand-gold-dim)' : 'var(--color-admin-text)' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'var(--color-admin-muted)' }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayCount = PARTICIPANTES.filter((p) => p.fecha === today).length;
  const activeSorteo = SORTEOS.find((s) => s.estado === 'activo');

  const last7: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    last7[key] = PARTICIPANTES.filter((p) => p.fecha === key).length;
  }
  const maxBar = Math.max(...Object.values(last7), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Participantes hoy" value={todayCount} icon="" sub="Registrados en el día" />
        <StatCard label="Sorteo activo" value={activeSorteo?.nombre ?? '—'} icon="" sub={activeSorteo ? `${activeSorteo.participantes} participantes` : 'Sin sorteo'} />
        <StatCard label="Total participantes" value={PARTICIPANTES.length} icon="" sub="Todos los sorteos" />
        <StatCard label="Ganadores" value={GANADORES.length} icon="" sub="Histórico" accent />
      </div>

      {/* Activity bar chart */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        <h3 className="font-display font-semibold text-base mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-admin-text)' }}>Participaciones — últimos 7 días</h3>
        <div className="flex items-end gap-2 h-32">
          {Object.entries(last7).map(([date, count]) => {
            const isToday = date === today;
            const height = count === 0 ? 4 : Math.max((count / maxBar) * 100, 8);
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium" style={{ color: isToday ? 'var(--color-brand-gold-dim)' : 'var(--color-admin-muted)' }}>{count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${height}%`,
                    background: isToday ? 'var(--color-brand-gold-dim)' : 'var(--color-admin-border)',
                    minHeight: '4px',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--color-admin-muted)' }}>
                  {new Date(date + 'T12:00:00').toLocaleDateString('es', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent participants */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-admin-card)', border: '1px solid var(--color-admin-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-admin-border)' }}>
          <h3 className="font-display font-semibold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-admin-text)' }}>Últimas participaciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-admin-bg)' }}>
                {['Nombre', 'DNI', 'Teléfono', 'Fecha', 'Estado'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-admin-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PARTICIPANTES.slice(0, 6).map((p, i) => (
                <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid var(--color-admin-border)' : undefined }}>
                  <td className="px-6 py-3 font-medium" style={{ color: 'var(--color-admin-text)' }}>{p.nombres} {p.apellidos}</td>
                  <td className="px-6 py-3" style={{ color: 'var(--color-admin-muted)' }}>{p.dni}</td>
                  <td className="px-6 py-3" style={{ color: 'var(--color-admin-muted)' }}>{p.telefono}</td>
                  <td className="px-6 py-3 text-xs" style={{ color: 'var(--color-admin-muted)' }}>{p.fecha} {p.hora}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                      background: p.estado === 'ganador' ? 'rgba(232,197,71,0.15)' : 'rgba(71,232,130,0.12)',
                      color: p.estado === 'ganador' ? 'var(--color-brand-gold-dim)' : '#2db86e',
                    }}>
                      {p.estado === 'ganador' ? 'Ganador' : 'Activo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
