import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/',        label: 'Home'    },
  { to: '/shop',    label: 'Shop'    },
  { to: '/about',   label: 'About'   },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { count }      = useCart()
  const { pathname }   = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-6 transition-all duration-200 bg-white ${scrolled ? 'shadow-sm' : ''} border-b border-gray-100`}>
        <Link to="/" className="font-head text-3xl tracking-widest text-black hover:opacity-50 transition-opacity">
          ASLY
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to} to={to}
              className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                pathname === to ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/login" className="p-2 text-gray-400 hover:text-black transition-colors" aria-label="Account">
            <User size={18} />
          </Link>
          <Link to="/cart" className="p-2 text-gray-400 hover:text-black transition-colors relative" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </Link>
          <button className="md:hidden p-2 text-black ml-1" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-16 bg-white z-[99] flex flex-col p-6 gap-0"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {NAV_LINKS.map(({ to, label }, i) => (
              <motion.div key={to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={to} className="block font-head text-5xl tracking-wider text-black border-b border-gray-100 py-5 hover:opacity-50 transition-opacity">
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
              <Link to="/cart" className="block font-head text-5xl tracking-wider text-black border-b border-gray-100 py-5 hover:opacity-50 transition-opacity">
                Cart ({count})
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
