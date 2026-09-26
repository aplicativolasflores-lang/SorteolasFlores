import { useState } from 'react';
import ParticipationPage from './pages/customer/ParticipationPage';
import AdminLayout from './pages/admin/AdminLayout';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import { supabase } from './lib/supabase';

type View = 'customer' | 'admin' | 'terms' | 'privacy';

export default function App() {
  const [view, setView] = useState<View>('customer');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  async function handleAdminLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      if (adminPassword === 'Sorteo2026') {
        setShowAdminLogin(false);
        setAdminPassword('');
        setAdminLoginError('');
        setView('admin');
      } else {
        setAdminLoginError('Contraseña incorrecta.');
      }
      return;
    }

    setAdminLoginLoading(true);
    setAdminLoginError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: adminPassword });

    if (!error && data.user.app_metadata.role === 'admin') {
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      setView('admin');
      setAdminLoginLoading(false);
      return;
    }

    if (!error) await supabase.auth.signOut();
    setAdminLoginError(error ? 'Correo o contraseña incorrectos.' : 'Esta cuenta no tiene permisos de administrador.');
    setAdminLoginLoading(false);
  }

  return (
    <>
      {view === 'customer' && (
        <div className="relative">
          <ParticipationPage onOpenLegal={(type) => setView(type)} />
          <button
            onClick={() => { setShowAdminLogin(true); setAdminLoginError(''); }}
            aria-label="Abrir panel de administración"
            title="Panel de administración"
            className="fixed bottom-3 right-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 hover:opacity-90 md:flex"
            style={{ background: 'rgba(26,16,13,0.9)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
          {showAdminLogin && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" role="presentation" onClick={() => setShowAdminLogin(false)}>
              <form
                onSubmit={handleAdminLogin}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
                style={{ background: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)' }}
              >
                <h2 className="font-display mb-2 text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-cream)' }}>Acceso administrativo</h2>
                <p className="mb-4 text-sm" style={{ color: 'var(--color-brand-muted)' }}>{supabase ? 'Ingresa tus credenciales de administrador.' : 'Modo local: los registros se guardan solo en este navegador.'}</p>
                {supabase && <input
                  autoComplete="username"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => { setAdminEmail(e.target.value); setAdminLoginError(''); }}
                  placeholder="Correo electrónico"
                  required
                  className="mb-2 w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-brand-bg)', border: `1px solid ${adminLoginError ? 'var(--color-brand-error)' : 'var(--color-brand-border)'}`, color: 'var(--color-brand-cream)' }}
                />}
                <input
                  autoFocus
                  autoComplete="current-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                  placeholder="Contraseña"
                  required
                  className="mb-2 w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-brand-bg)', border: `1px solid ${adminLoginError ? 'var(--color-brand-error)' : 'var(--color-brand-border)'}`, color: 'var(--color-brand-cream)' }}
                />
                {adminLoginError && <p className="mb-3 text-xs" style={{ color: 'var(--color-brand-error)' }}>{adminLoginError}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 rounded-xl px-4 py-3 text-sm" style={{ border: '1px solid var(--color-brand-border)', color: 'var(--color-brand-muted)' }}>Cancelar</button>
                  <button type="submit" disabled={adminLoginLoading} className="flex-1 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-60" style={{ background: 'var(--color-brand-gold)', color: 'var(--color-brand-button-text)' }}>{adminLoginLoading ? 'Ingresando...' : 'Ingresar'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      {view === 'admin' && (
        <AdminLayout onExit={() => { void supabase?.auth.signOut(); setView('customer'); }} />
      )}
      {view === 'terms' && (
        <TermsPage onBack={() => setView('customer')} />
      )}
      {view === 'privacy' && (
        <PrivacyPage onBack={() => setView('customer')} />
      )}
    </>
  );
}
