import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-white text-black hover:bg-[#888] hover:text-white px-8 py-[14px]',
    outline:
      'bg-transparent text-white border border-white hover:bg-white hover:text-black px-8 py-[14px]',
    'outline-dark':
      'bg-transparent text-black border border-black hover:bg-black hover:text-white px-8 py-[14px]',
    ghost:
      'bg-transparent border border-[#222] text-[#888] hover:border-white hover:text-white px-6 py-[10px]',
    dark: 'bg-transparent border border-[#222] text-white hover:border-white px-8 py-[14px]',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  )
}
