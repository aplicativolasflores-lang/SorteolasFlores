import { useState } from 'react';
import floresLogo from '../public/flores (1).png';

export default function BrandWordmark({ inverse = false, compact = false }: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const primary = inverse ? '#ffffff' : 'var(--color-brand-cream)';
  const secondary = inverse ? 'rgba(255,255,255,0.76)' : 'var(--color-brand-muted)';

  return (
    <div className="flex flex-col items-center justify-center leading-none">
      {imageFailed ? <span role="img" aria-label="Las Flores"
          className="font-semibold italic"
          style={{
            color: primary,
            fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
            fontSize: compact ? '25px' : '31px',
          }}
        >Las Flores</span> : <img
          src={floresLogo}
          alt="Las Flores"
          onError={() => setImageFailed(true)}
          className={compact ? 'h-11 w-auto object-contain' : 'h-14 w-auto object-contain'}
          draggable={false}
        />}
      <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.18em]" style={{ color: secondary }}>
        Restaurante | Ayacucho
      </span>
    </div>
  );
}