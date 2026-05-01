import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'
import Footer from '../components/Footer'

// ── CONFIG — replace this with your real backend URL ──
const BACKEND_URL = 'https://your-backend-url.com/api/orders'

const MOROCCAN_CITIES = [
  'Casablanca','Rabat','Salé','Fès','Marrakech','Agadir',
  'Tanger','Meknès','Oujda','Kenitra','Tétouan','Safi',
  'El Jadida','Khouribga','Beni Mellal','Nador','Settat',
  'Berrechid','Kénitra','Larache','Ksar El Kebir','Guelmim',
  'Errachidia','Ouarzazate','Laâyoune','Dakhla'
]

const PHONE_RE = /^(06|07)[0-9]{8}$/

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const { addOrder } = useAdmin()

  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [apiError, setApiError] = useState('')

  const shipping = total >= 300 ? 0 : 30
  const grandTotal = total + shipping

  if (cart.length === 0 && status !== 'success') {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-theme-muted text-sm tracking-widest uppercase">Your cart is empty</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-black text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          Go Shopping
        </button>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!PHONE_RE.test(form.phone)) e.phone = 'Enter a valid Moroccan number (06 or 07, 10 digits)'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city) e.city = 'Please select a city'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    setApiError('')

    const orderPayload = {
      name:    form.name.trim(),
      phone:   form.phone.trim(),
      address: form.address.trim(),
      city:    form.city,
      notes:   form.notes.trim(),
      items:   cart.map(item => ({
        product:  item.name,
        size:     item.size,
        quantity: item.qty,
        price:    item.price,
      })),
      subtotal: total,
      shipping,
      total:    grandTotal,
    }

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Server error ${res.status}: ${body}`)
      }

      // Save order locally so admin can see it instantly
      addOrder({
        customer: form.name,
        phone:    form.phone,
        address:  form.address,
        city:     form.city,
        notes:    form.notes,
        items:    orderPayload.items,
        total:    grandTotal,
      })

      clearCart()
      setStatus('success')
    } catch (err) {
      // If backend not configured yet → still save locally
      if (BACKEND_URL.includes('your-backend-url')) {
        addOrder({
          customer: form.name,
          phone:    form.phone,
          address:  form.address,
          city:     form.city,
          notes:    form.notes,
          items:    orderPayload.items,
          total:    grandTotal,
        })
        clearCart()
        setStatus('success')
      } else {
        setApiError(err.message || 'Failed to send order. Please try again.')
        setStatus('error')
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={64} className="text-green-500 mx-auto" />
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}>
          <h1 className="font-head text-5xl tracking-widest text-theme mb-3">ORDER PLACED!</h1>
          <p className="text-theme-muted text-sm mb-2">
            Thank you, <strong className="text-theme">{form.name}</strong>!
          </p>
          <p className="text-theme-muted text-sm mb-8">
            We'll contact you at <strong className="text-theme">{form.phone}</strong> to confirm your delivery.
          </p>
          <div className="bg-theme-card border border-theme p-5 text-left max-w-sm mx-auto mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-theme-muted mb-3">Order Summary</p>
            {cart.length === 0 && <p className="text-xs text-theme-muted">Items cleared ✓</p>}
            <div className="flex justify-between text-sm font-bold text-theme pt-2">
              <span>Total Paid</span>
              <span>{grandTotal.toFixed(2)} MAD</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="border border-black text-black px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <div className="border-b border-theme px-6 py-12 max-w-6xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] uppercase text-theme-muted block mb-2">
          Step 2 of 2
        </span>
        <h1 className="font-head text-[clamp(3rem,8vw,6rem)] leading-none tracking-wide text-theme">
          CHECKOUT
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-theme-card border border-theme p-8">
            <h2 className="font-head text-2xl tracking-widest text-theme mb-8">DELIVERY INFO</h2>

            {/* Name */}
            <div className="mb-7">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-theme-muted mb-2">
                Full Name *
              </label>
              <input
                className={`form-field ${errors.name ? 'border-b-red-500' : ''}`}
                placeholder="Youssef Alami"
                value={form.name}
                onChange={e => { setForm(f=>({...f,name:e.target.value})); setErrors(er=>({...er,name:''})) }}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="mb-7">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-theme-muted mb-2">
                Phone Number * <span className="normal-case text-[9px]">(06XXXXXXXX or 07XXXXXXXX)</span>
              </label>
              <input
                className={`form-field ${errors.phone ? 'border-b-red-500' : ''}`}
                placeholder="0612345678"
                value={form.phone}
                maxLength={10}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g,'')
                  setForm(f=>({...f,phone:v}))
                  setErrors(er=>({...er,phone:''}))
                }}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
              {form.phone.length > 0 && !errors.phone && (
                <p className={`text-[10px] mt-1 ${PHONE_RE.test(form.phone) ? 'text-green-500' : 'text-orange-400'}`}>
                  {PHONE_RE.test(form.phone) ? '✓ Valid number' : `${form.phone.length}/10 digits`}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-7">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-theme-muted mb-2">
                Full Address *
              </label>
              <input
                className={`form-field ${errors.address ? 'border-b-red-500' : ''}`}
                placeholder="123 Rue Mohammed V, Quartier Mers Sultan"
                value={form.address}
                onChange={e => { setForm(f=>({...f,address:e.target.value})); setErrors(er=>({...er,address:''})) }}
              />
              {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div className="mb-7">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-theme-muted mb-2">
                City *
              </label>
              <select
                className={`form-field ${errors.city ? 'border-b-red-500' : ''}`}
                value={form.city}
                onChange={e => { setForm(f=>({...f,city:e.target.value})); setErrors(er=>({...er,city:''})) }}
              >
                <option value="">Select your city...</option>
                {MOROCCAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-theme-muted mb-2">
                Delivery Notes <span className="normal-case">(optional)</span>
              </label>
              <textarea
                className="form-field resize-none"
                placeholder="Apartment number, landmark, specific instructions..."
                rows={3}
                value={form.notes}
                onChange={e => setForm(f=>({...f,notes:e.target.value}))}
              />
            </div>

            {/* API Error */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 mb-6"
                >
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs leading-relaxed">{apiError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity disabled:opacity-40 flex items-center justify-center gap-3"
            >
              {status === 'loading' ? (
                <><Loader size={14} className="animate-spin" /> Placing Order...</>
              ) : (
                `Place Order — ${grandTotal.toFixed(2)} MAD`
              )}
            </button>

            <p className="text-[10px] text-theme-muted text-center mt-4 tracking-wide">
              Cash on delivery · Free returns · Secure checkout
            </p>
          </div>
        </form>

        {/* ── ORDER SUMMARY ── */}
        <div className="sticky top-24">
          <div className="bg-theme-card border border-theme p-6 mb-4">
            <h2 className="font-head text-xl tracking-widest text-theme mb-5">ORDER SUMMARY</h2>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map(item => (
                <div key={item.key} className="flex items-start gap-3">
                  <div
                    className="w-12 h-14 shrink-0"
                    style={{ background: item.bgColor || '#f0f0f0' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-theme truncate">{item.name}</p>
                    <p className="text-[10px] text-theme-muted">Size: {item.size} · ×{item.qty}</p>
                  </div>
                  <span className="text-xs font-semibold text-theme shrink-0">
                    {(item.price * item.qty).toFixed(2)} MAD
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-theme pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-theme-muted">
                <span>Subtotal</span><span>{total.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-xs text-theme-muted">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} MAD`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-orange-500">
                  Add {(300 - total).toFixed(2)} MAD more for free shipping
                </p>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-theme mt-1">
                <span className="text-[10px] tracking-widest uppercase text-theme-muted">Total</span>
                <span className="font-head text-3xl tracking-wide text-theme">
                  {grandTotal.toFixed(2)} MAD
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/cart')}
            className="w-full border border-theme text-theme-muted py-3 text-[10px] font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all"
          >
            ← Edit Cart
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
