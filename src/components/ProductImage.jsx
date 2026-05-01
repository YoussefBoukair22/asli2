// Renders a styled product image placeholder.
// In production, swap `src` prop to a real <img> tag.
export default function ProductImage({ product, className = '', style = {} }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ background: product.bgColor || '#111', ...style }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
        }}
      />
      {/* Gradient shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      {/* Wordmark */}
      <span
        className="font-head text-6xl tracking-widest select-none z-10"
        style={{ color: 'rgba(255,255,255,0.07)' }}
      >
        ASLY
      </span>
      {/* Category label */}
      <span
        className="absolute bottom-4 left-4 text-[10px] tracking-[0.2em] uppercase font-semibold"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        {product.category}
      </span>
    </div>
  )
}
