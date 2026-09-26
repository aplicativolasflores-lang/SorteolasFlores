import floresLogo from '../../public/flores (1).png';

type TermsPageProps = {
  onBack: () => void;
};

export default function TermsPage({ onBack }: TermsPageProps) {
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
            Términos y condiciones
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-cream)' }}>
            Bases del sorteo
          </h1>

          <div className="space-y-5 text-sm leading-7" style={{ color: 'var(--color-brand-muted)' }}>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>1. Organizador</h2>
              <p>El presente sorteo es organizado por Restaurante Las Flores, como parte de su campaña especial por el Día de la Canción Criolla 2026.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>2. Premios</h2>
              <p>Se sortearán dos experiencias gastronómicas:</p>
              <p>Primer premio: “El Gran Banquete Criollo”, experiencia gastronómica para 8 personas.</p>
              <p>Segundo premio: “Orgullo y Sabor Peruano”, experiencia gastronómica para 6 personas.</p>
              <p>Los alimentos, bebidas, presentación y demás componentes incluidos en cada experiencia serán establecidos previamente por Restaurante Las Flores. Los premios son personales, no podrán ser canjeados por dinero en efectivo ni sustituidos por otros productos o servicios.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>3. ¿Cómo participar?</h2>
              <p>Para participar, el usuario deberá escanear el código QR oficial, ingresar al formulario habilitado por Restaurante Las Flores, registrar correctamente los datos solicitados, aceptar estos términos y enviar el formulario dentro del periodo de la campaña. La participación es gratuita.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>4. Datos del participante</h2>
              <p>Para validar la participación se podrán solicitar únicamente los datos necesarios para identificar y contactar al participante: nombres y apellidos, número de celular, fecha de nacimiento y lugar de residencia cuando corresponda. Cada participante deberá proporcionar información verdadera y actualizada.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>5. Participaciones</h2>
              <p>Cada persona podrá registrar una participación válida con sus datos personales y número de celular. Los registros duplicados no generarán oportunidades adicionales. Los formularios incompletos, datos falsos, números telefónicos inexistentes o registros que no permitan identificar al participante podrán ser invalidados.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>6. Requisito de edad</h2>
              <p>Podrán participar personas mayores de 18 años que cumplan correctamente con la mecánica establecida para el sorteo.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>7. Vigencia</h2>
              <p>El sorteo estará vigente desde la fecha oficial de lanzamiento de la campaña hasta el 30 de octubre de 2026, previo a la realización del sorteo. Los registros recibidos después del cierre no serán considerados.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>8. Fecha del sorteo</h2>
              <p>El sorteo se realizará el 30 de octubre de 2026. Se seleccionarán aleatoriamente dos ganadores: uno de “La Gran Jarana Criolla Las Flores” para 8 personas y uno de “Festín de Sabores Criollos Las Flores” para 6 personas.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>9. Comunicación con los ganadores</h2>
              <p>Los ganadores serán contactados utilizando el número telefónico registrado en el formulario, mediante llamada telefónica, WhatsApp y/o los canales oficiales de Restaurante Las Flores. El ganador deberá acreditar su identidad para validar que los datos coincidan con los registrados. Si no pudiera ser contactado luego de los intentos establecidos, Restaurante Las Flores podrá seleccionar un ganador suplente.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>10. Disfrute del premio</h2>
              <p>Los premios han sido creados especialmente en el marco de la celebración del Día de la Canción Criolla. El ganador deberá coordinar previamente con Restaurante Las Flores la utilización de su premio, respetando las condiciones, horario y disponibilidad establecidos por el restaurante. Los premios no podrán ser canjeados por dinero en efectivo.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>11. Protección de datos personales</h2>
              <p>Los datos proporcionados mediante el formulario serán utilizados para gestionar la participación, validar los registros, realizar el sorteo y contactar a los ganadores. Si Restaurante Las Flores desea utilizar los datos posteriormente para enviar promociones, novedades, beneficios o comunicaciones comerciales, solicitará la autorización correspondiente del participante.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>12. Autorización de imagen</h2>
              <p>En caso de realizar fotografías o material audiovisual durante la entrega y disfrute del premio, Restaurante Las Flores solicitará la autorización correspondiente antes de utilizar imágenes identificables de los ganadores con fines promocionales o de difusión.</p>
            </section>
            <section>
              <h2 className="font-semibold" style={{ color: 'var(--color-brand-cream)' }}>13. Aceptación</h2>
              <p>La participación en el sorteo implica que el participante declara haber leído y aceptado estos términos y condiciones. Cualquier situación no contemplada será evaluada por Restaurante Las Flores respetando las condiciones previamente comunicadas a los participantes.</p>
              <p>Restaurante Las Flores<br />Ayacucho - 2026</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
