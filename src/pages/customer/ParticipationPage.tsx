import { useState, useEffect } from 'react';
import { RESTAURANT, SORTEOS, hasParticipatedToday, markParticipatedToday, saveLocalParticipant } from '../../data/mockData';
import { supabase } from '../../lib/supabase';
import BrandWordmark from '../../components/BrandWordmark';

type Step = 'alreadyparticipated' | 'form' | 'success';

type FormData = {
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  fechaNacimiento: string;
  acepta: boolean;
};

const ERRORS: Record<string, string> = {};

function validateForm(f: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.nombres.trim() || f.nombres.trim().length < 2) e.nombres = 'Ingresa tu nombre completo';
  if (!f.apellidos.trim() || f.apellidos.trim().length < 2) e.apellidos = 'Ingresa tus apellidos';
  if (!/^\d{9}$/.test(f.telefono)) e.telefono = 'El teléfono debe tener 9 dígitos';
  if (!f.ciudad.trim() || f.ciudad.trim().length < 2) e.ciudad = 'Ingresa tu ciudad';
  if (!f.fechaNacimiento) e.fechaNacimiento = 'Selecciona tu fecha de nacimiento';
  if (!f.acepta) e.acepta = 'Debes aceptar los términos para participar';
  return e;
}

export default function ParticipationPage({ onOpenLegal }: { onOpenLegal: (type: 'terms' | 'privacy') => void }) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>({ nombres: '', apellidos: '', telefono: '', ciudad: 'Ayacucho', fechaNacimiento: '', acepta: false });
  const [errors, setErrors] = useState<Record<string, string>>(ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [sorteoId, setSorteoId] = useState(() => supabase ? '' : SORTEOS.find((sorteo) => sorteo.estado === 'activo')?.id ?? SORTEOS[0]?.id ?? '');
  const [sorteoLoading, setSorteoLoading] = useState(Boolean(supabase));

  useEffect(() => {
    async function loadActiveSorteo() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('sorteos')
        .select('id')
        .eq('estado', 'activo')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setSorteoId(error ? '' : data?.id ?? '');
      setSorteoLoading(false);
    }

    void loadActiveSorteo();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'date' && value && value.split('-')[0].length > 4) {
      setForm((prev) => ({ ...prev, [name]: '' }));
      return;
    }
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmissionError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!sorteoId) {
      setSubmissionError('No hay un sorteo activo configurado. Inténtalo más tarde.');
      return;
    }

    if (!supabase && hasParticipatedToday(form.telefono)) {
      setStep('alreadyparticipated');
      return;
    }

    setSubmitting(true);
    setSubmissionError('');

    if (supabase) {
      const { error } = await supabase.from('participantes').insert({
        sorteo_id: sorteoId,
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono,
        ciudad: form.ciudad,
        fecha_nacimiento: form.fechaNacimiento,
        acepta_terminos: form.acepta,
      });

      if (error) {
        setSubmitting(false);
        if (error.code === '23505') {
          setStep('alreadyparticipated');
        } else if (error.code === '23503') {
          setSubmissionError('El sorteo activo ya no está disponible. Inténtalo más tarde.');
        } else {
          setSubmissionError('No se pudo registrar tu participación. Inténtalo nuevamente.');
        }
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 1400));
      saveLocalParticipant({
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono,
        ciudad: form.ciudad,
        participacion_fecha: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        sorteo_id: sorteoId,
        estado: 'activo',
      });
    }

    markParticipatedToday(form.telefono);
    const num = `#${Math.floor(Math.random() * 9000 + 1000)}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    setTicketNumber(num);
    setSubmitting(false);
    setStep('success');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-brand-bg)', color: 'var(--color-brand-cream)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header className="w-full border-b px-4 py-4" style={{ background: 'var(--color-brand-bg)', borderColor: 'var(--color-brand-border)' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <BrandWordmark />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {step === 'alreadyparticipated' && <AlreadyParticipatedView />}
        {step === 'form' && (
          <FormView
            form={form}
            errors={errors}
            submitting={submitting}
            submissionError={submissionError}
            sorteoLoading={sorteoLoading}
            sorteoAvailable={Boolean(sorteoId)}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onOpenLegal={onOpenLegal}
          />
        )}
        {step === 'success' && <SuccessView name={form.nombres} ticket={ticketNumber} />}
      </main>

      <footer className="text-center py-4 text-xs" style={{ color: 'var(--color-brand-muted)', borderTop: '1px solid var(--color-brand-border)' }}>
        © {new Date().getFullYear()} {RESTAURANT.name} · Sorteos exclusivos para clientes presentes
      </footer>
    </div>
  );
}

function AlreadyParticipatedView() {
  return (
    <div className="text-center max-w-sm animate-fade-in">
      <h2 className="font-display text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-gold)' }}>Ya participaste hoy</h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-brand-muted)' }}>
        Tu participación para el día de hoy ya fue registrada. ¡Suerte en el sorteo! Puedes volver a participar mañana.
      </p>
      <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--color-brand-cream)' }}>Vuelve mañana</p>
        <p style={{ color: 'var(--color-brand-muted)' }}>Cada día tienes una nueva oportunidad de ganar</p>
      </div>
    </div>
  );
}

function FormView({ form, errors, submitting, submissionError, sorteoLoading, sorteoAvailable, onChange, onSubmit, onOpenLegal }: {
  form: FormData;
  errors: Record<string, string>;
  submitting: boolean;
  submissionError: string;
  sorteoLoading: boolean;
  sorteoAvailable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}) {
  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-cream)' }}>
          ¡Participa <em>ahora!</em>
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-brand-muted)' }}>Completa el formulario para entrar al sorteo de hoy</p>
      </div>

      {/* Sorteo card */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)' }}>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-brand-cream)' }}>Gran Sorteo de Aniversario</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-brand-gold)' }}>Cena para 2 · Parrillada familiar · Vale S/100</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombres" name="nombres" value={form.nombres} error={errors.nombres} onChange={onChange} placeholder="Carlos Alberto" />
          <Field label="Apellidos" name="apellidos" value={form.apellidos} error={errors.apellidos} onChange={onChange} placeholder="Mendoza Ríos" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CityField value={form.ciudad} error={errors.ciudad} onChange={onChange} />
        </div>
        <Field label="Teléfono" name="telefono" value={form.telefono} error={errors.telefono} onChange={onChange} placeholder="987654321" maxLength={9} inputMode="numeric" />
        <Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} error={errors.fechaNacimiento} onChange={onChange} />

        <div className="flex items-start gap-3 pt-1">
          <input
            id="acepta-terminos"
            type="checkbox"
            name="acepta"
            checked={form.acepta}
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 w-4 h-4 rounded-sm border-0 bg-[#0f0d0d] accent-black flex-shrink-0"
          />
          <div className="text-xs leading-relaxed" style={{ color: errors.acepta ? 'var(--color-brand-error)' : 'var(--color-brand-muted)' }}>
            <span>He leído y acepto los </span>
            <button type="button" onClick={() => onOpenLegal('terms')} className="underline underline-offset-2 text-left" style={{ color: 'var(--color-brand-gold)' }}>
              términos y condiciones
            </button>
            <span> y la </span>
            <button type="button" onClick={() => onOpenLegal('privacy')} className="underline underline-offset-2 text-left" style={{ color: 'var(--color-brand-gold)' }}>
              política de privacidad
            </button>
            <span> para el tratamiento de mis datos personales.</span>
            {errors.acepta && <strong>{errors.acepta}</strong>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || sorteoLoading || !sorteoAvailable}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: 'var(--color-brand-gold)', color: 'var(--color-brand-button-text)', fontFamily: 'var(--font-body)' }}
        >
          {sorteoLoading ? 'Verificando sorteo...' : !sorteoAvailable ? 'Sorteo no disponible' : submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin-slow inline-block" style={{ borderColor: 'var(--color-brand-bg)', borderTopColor: 'transparent' }} />
              Registrando...
            </span>
          ) : (
            '¡Quiero participar!'
          )}
        </button>

        <p className="text-center text-xs" style={{ color: 'var(--color-brand-muted)' }}>
          Solo 1 participación por persona por día
        </p>
        {!sorteoLoading && !sorteoAvailable && <p className="text-center text-xs" style={{ color: 'var(--color-brand-error)' }}>No hay un sorteo activo configurado.</p>}
        {submissionError && <p className="text-center text-xs" style={{ color: 'var(--color-brand-error)' }}>{submissionError}</p>}
      </form>
    </div>
  );
}

function CityField({ value, error, onChange }: {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const cities = ['Ayacucho', 'Lima', 'Arequipa', 'Cusco', 'Huancayo', 'Ica', 'Trujillo', 'Piura', 'Chiclayo', 'Tacna'];

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-brand-muted)' }}>Ciudad</label>
      <select
        name="ciudad"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'var(--color-brand-card)',
          border: `1px solid ${error ? 'var(--color-brand-error)' : 'var(--color-brand-border)'}`,
          color: 'var(--color-brand-cream)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
      </select>
      {error && <p className="text-xs mt-1" style={{ color: 'var(--color-brand-error)' }}>{error}</p>}
    </div>
  );
}

function Field({ label, name, value, error, onChange, placeholder, type = 'text', maxLength, inputMode }: {
  label: string; name: string; value: string; error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; maxLength?: number; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-brand-muted)' }}>{label}</label>
      <input
        type={type}
        max={type === 'date' ? '9999-12-31' : undefined}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'var(--color-brand-card)',
          border: `1px solid ${error ? 'var(--color-brand-error)' : 'var(--color-brand-border)'}`,
          color: 'var(--color-brand-cream)',
          fontFamily: 'var(--font-body)',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-gold)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--color-brand-error)' : 'var(--color-brand-border)'; }}
      />
      {error && <p className="text-xs mt-1" style={{ color: 'var(--color-brand-error)' }}>{error}</p>}
    </div>
  );
}

function SuccessView({ name, ticket }: { name: string; ticket: string }) {
  return (
    <div className="text-center max-w-sm animate-fade-in">
      <h2 className="font-display text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-gold)' }}>¡Estás dentro!</h2>
      <p className="text-lg mb-6" style={{ color: 'var(--color-brand-cream)' }}>Gracias, <strong>{name}</strong></p>

      <div className="space-y-2 text-sm" style={{ color: 'var(--color-brand-muted)' }}>
        <p>Te notificaremos si eres el ganador</p>
        <p>El sorteo se realiza al cierre del mes</p>
      </div>
    </div>
  );
}
