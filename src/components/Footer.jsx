import { useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/',        label: 'Home'    },
  { to: '/shop',    label: 'Shop'    },
  { to: '/about',   label: 'About'   },
  { to: '/contact', label: 'Contact' },
  { to: '/login',   label: 'Login'   },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="bg-white border-t border-gray-100 mt-0">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="font-head text-5xl tracking-widest text-black mb-4">ASLY</div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[260px]">
              Minimalist streetwear. Built to last, made to be worn.
            </p>
            <div className="flex gap-5 mt-5">
              {['IG','TK','TW','YT'].map(s => (
                <a key={s} href="#" className="text-[10px] font-bold tracking-widest uppercase text-gray-300 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-5">Navigate</p>
            <ul className="flex flex-col gap-3">
              {LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-black transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-5">Newsletter</p>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">New drops and exclusive access. No spam.</p>
            {subscribed ? (
              <p className="text-sm text-black font-semibold">✓ You're on the list.</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (email) { setSubscribed(true); setEmail('') } }} className="flex border border-gray-200">
                <input
                  type="email" required placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-black placeholder-gray-300 outline-none"
                />
                <button type="submit" className="bg-black text-white px-4 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity">
                  →
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-gray-300 tracking-wider">© 2025 ASLY. All rights reserved.</span>
          <div className="flex gap-6">
            {['Privacy','Terms','Shipping'].map(l => (
              <a key={l} href="#" className="text-[11px] text-gray-300 hover:text-black transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
