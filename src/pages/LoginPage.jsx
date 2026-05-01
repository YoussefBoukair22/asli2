import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((err) => ({ ...err, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (tab === 'register' && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    alert(tab === 'login' ? 'Welcome back!' : `Account created! Welcome, ${form.name}.`)
    navigate('/')
  }

  const fields =
    tab === 'register'
      ? [
          { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        ]
      : [
          { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        ]

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6 py-16">
      {/* Background texture */}
      <div className="fixed inset-0 hero-grid opacity-30 pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div
          className="font-head text-5xl tracking-widest text-theme mb-10 cursor-pointer"
          onClick={() => navigate('/')}
        >
          ASLY
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#222] mb-8">
          {[['login', 'Sign In'], ['register', 'Register']].map(([t, l]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setErrors({}) }}
              className={`flex-1 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200 border-b-2 ${
                tab === t
                  ? 'text-white border-white'
                  : 'text-[#888] border-transparent hover:text-white'
              }`}
              style={{ marginBottom: '-1px' }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#888] mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  className={`w-full bg-transparent border-b py-3 text-sm text-theme placeholder-[#444] outline-none transition-colors ${
                    errors[key] ? 'border-red-500' : 'border-[#222] focus:border-white'
                  }`}
                />
                {errors[key] && (
                  <p className="text-[10px] text-red-400 mt-1 tracking-wider">{errors[key]}</p>
                )}
              </div>
            ))}

            {tab === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-[10px] tracking-widest uppercase text-[#888] hover:text-white transition-colors border-b border-[#333] pb-0.5"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" fullWidth className="justify-center mt-2">
              {tab === 'login' ? 'Sign In →' : 'Create Account →'}
            </Button>

            <p className="text-center text-[11px] text-[#888]">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrors({}) }}
                className="text-white hover:opacity-70 transition-opacity underline"
              >
                {tab === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 border-t border-[#1a1a1a]" />
          <span className="text-[9px] tracking-widest uppercase text-[#444]">or</span>
          <div className="flex-1 border-t border-[#1a1a1a]" />
        </div>

        {/* Guest */}
        <button
          onClick={() => navigate('/shop')}
          className="w-full border border-[#1a1a1a] py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#555] hover:text-[#888] hover:border-[#333] transition-all"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  )
}
