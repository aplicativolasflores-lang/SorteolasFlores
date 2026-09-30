export default function BrandWordmark({ compact = false }: {
  compact?: boolean;
}) {
  return (
    <img
      src="/flores.png"
      alt="Logotipo Las Flores"
      className={compact ? 'h-11 w-auto object-contain' : 'h-14 w-auto object-contain'}
      draggable={false}
    />
  );
}