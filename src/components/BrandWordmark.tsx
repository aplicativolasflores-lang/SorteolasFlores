import floresLogo from '../public/flores (1).png';

export default function BrandWordmark({ compact = false }: {
  compact?: boolean;
}) {
  return (
    <img
      src={floresLogo}
      alt="Logotipo Las Flores"
      className={compact ? 'h-11 w-auto object-contain' : 'h-14 w-auto object-contain'}
      draggable={false}
    />
  );
}