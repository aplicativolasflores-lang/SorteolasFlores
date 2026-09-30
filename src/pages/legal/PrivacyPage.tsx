import BrandWordmark from '../../components/BrandWordmark';

type PrivacyPageProps = {
  onBack: () => void;
};

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
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
            <BrandWordmark />
          </div>
          <div style={{ width: 88 }} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="rounded-3xl p-6 md:p-8" style={{ background: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--color-brand-gold)' }}>
            Política de privacidad
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-cream)' }}>
            Protección de datos personales
          </h1>

          <div className="space-y-5 text-sm leading-7" style={{ color: 'var(--color-brand-muted)' }}>
            <p>Restaurante Las Flores tratará los datos proporcionados mediante el formulario para gestionar la participación, validar los registros, realizar el sorteo y contactar a los ganadores.</p>
            <p>Los datos solicitados serán únicamente los necesarios para identificar y contactar al participante, tales como nombres y apellidos, número de celular, fecha de nacimiento y lugar de residencia cuando corresponda. El participante deberá proporcionar información verdadera y actualizada.</p>
            <p>Los datos serán utilizados para los fines descritos en esta política y no para el envío de promociones, novedades, beneficios o comunicaciones comerciales, salvo que Restaurante Las Flores solicite y obtenga previamente la autorización correspondiente del participante.</p>
            <p>Restaurante Las Flores podrá comunicarse con los ganadores mediante llamada telefónica, WhatsApp y/o sus canales oficiales. Para validar la entrega del premio, el ganador podrá ser requerido a acreditar su identidad y la coincidencia de sus datos con los registrados.</p>
            <p>La información será tratada con medidas razonables de seguridad y únicamente durante el tiempo necesario para gestionar la campaña, atender obligaciones legales y resolver posibles incidencias relacionadas con el sorteo.</p>
            <p>El participante podrá solicitar información sobre el tratamiento de sus datos, así como ejercer los derechos que le correspondan conforme a la normativa aplicable, contactando a Restaurante Las Flores a través de sus canales oficiales.</p>
            <p>La participación en el sorteo implica la aceptación de esta política y del tratamiento de la información necesario para gestionar el evento. Cualquier autorización de uso de imagen para fotografías o material audiovisual de la entrega o disfrute del premio será solicitada por separado antes de utilizar imágenes identificables con fines promocionales o de difusión.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
