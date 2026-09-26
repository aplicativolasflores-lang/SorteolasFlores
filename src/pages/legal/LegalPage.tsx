import floresLogo from '../../public/flores (1).png';

type LegalPageProps = {
  type: 'terms' | 'privacy';
  onBack: () => void;
};

export default function LegalPage({ type, onBack }: LegalPageProps) {
  const isTerms = type === 'terms';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-brand-bg)', color: 'var(--color-brand-cream)', fontFamily: 'var(--font-body)' }}>
      <header className="border-b px-4 py-4" style={{ borderColor: 'var(--color-brand-border)', background: '#f8f5f2' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-4 py-2 text-xs font-medium transition hover:opacity-80"
            style={{ background: 'rgba(18,14,12,0.06)', color: '#1d1d1d', border: '1px solid rgba(18,14,12,0.12)' }}
          >
            ← Volver
          </button>
          <div className="text-center">
            <img src={floresLogo} alt="Las Flores" className="mx-auto h-14 w-auto object-contain md:h-16" draggable={false} />
          </div>
          <div style={{ width: 88 }} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="rounded-3xl p-6 md:p-8" style={{ background: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--color-brand-gold)' }}>
            {isTerms ? 'Términos y condiciones' : 'Política de privacidad'}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-cream)' }}>
            {isTerms ? 'Bases del sorteo' : 'Protección de datos personales'}
          </h1>

          {isTerms ? (
            <div className="space-y-5 text-sm leading-7" style={{ color: 'var(--color-brand-muted)' }}>
              <p>
                El presente sorteo es organizado por La Parrilla del Chef, con domicilio en Av. Larco 1234, Miraflores, Lima, Perú.
                La participación es válida únicamente para personas mayores de edad que completen el formulario de inscripción de manera veraz y completa.
              </p>
              <p>
                Cada participante podrá registrarse una sola vez por día. El restaurante se reserva el derecho de verificar la identidad, los datos aportados y la elegibilidad del participante antes de validar su inscripción.
              </p>
              <p>
                Al participar, el usuario acepta que la información entregada será utilizada exclusivamente para la administración del sorteo, la comunicación del resultado y la coordinación de entrega de premios o notificaciones relacionadas.
              </p>
              <p>
                La organización se reserva el derecho de cancelar, modificar, prorrogar o suspender el sorteo en caso de fuerza mayor, error técnico, fraude, manipulación de datos o cualquier circunstancia que afecte la seguridad o la transparencia del proceso.
              </p>
              <p>
                Los premios no son transferibles, canjeables por dinero en efectivo ni negociables, salvo que el restaurante disponga lo contrario por escrito. El ganador será notificado mediante los datos de contacto registrados en el formulario.
              </p>
              <p>
                El sorteo se regirá por la normativa aplicable en el Perú y por las decisiones definitivas del restaurante, que tendrán carácter vinculante para todos los participantes.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-sm leading-7" style={{ color: 'var(--color-brand-muted)' }}>
              <p>
                La Parrilla del Chef recopila y trata datos personales con la finalidad de gestionar la inscripción, validar la identidad del participante, comunicar resultados del sorteo y coordinar la entrega de premios.
              </p>
              <p>
                Los datos recolectados pueden incluir nombres, apellidos, DNI, teléfono, correo electrónico, ciudad y fecha de nacimiento. Estos datos se utilizarán únicamente para los fines descritos anteriormente y para cumplir con obligaciones legales y operativas del evento.
              </p>
              <p>
                La información será almacenada en medios seguros y accesibles únicamente por personal autorizado. No se compartirá con terceros, salvo cuando ello sea necesario para la ejecución del sorteo, el cumplimiento de obligaciones legales o la prestación de servicios de soporte técnico.
              </p>
              <p>
                El participante podrá ejercer sus derechos de acceso, rectificación, cancelación y oposición al tratamiento de sus datos personales, contactando al restaurante a través del canal de atención indicado durante el proceso del sorteo.
              </p>
              <p>
                La organización adoptará medidas razonables para proteger la información frente a pérdida, uso indebido, acceso no autorizado o alteración. Sin embargo, ningún sistema digital es completamente invulnerable; por ello, se recomienda a los usuarios mantener sus datos de contacto actualizados.
              </p>
              <p>
                La participación en el sorteo implica la aceptación de esta política de privacidad y del tratamiento de la información necesaria para la gestión del evento.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
