import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function QuickView({ product, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [size, setSize] = useState('M')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/30 z-[2000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Image */}
          <div className="aspect-[3/4] md:aspect-auto min-h-[220px] flex items-center justify-center" style={{ background: product.bgColor || '#f5f5f5' }}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              : <span className="font-head text-5xl tracking-widest" style={{ color: 'rgba(0,0,0,0.06)' }}>ASLY</span>
            }
          </div>
          {/* Info */}
          <div className="p-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 block mb-2">{product.category}</span>
              <h2 className="font-head text-3xl tracking-wide leading-none text-black mb-3">{product.name}</h2>
              <p className="text-xl font-light text-gray-400 mb-5">{product.price?.toFixed(2)} MAD</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{product.description}</p>
              <div className="mb-6">
                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Size — <span className="text-black font-semibold">{size}</span></p>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ['XS','S','M','L','XL','XXL']).map(s => (
                    <button
                      key={s} onClick={() => setSize(s)}
                      className={`w-10 h-10 text-xs font-semibold border transition-all ${
                        size === s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { addToCart(product, size); onClose() }}
                className="w-full bg-black text-white py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
              >
                Add to Cart
              </button>
              <button
                onClick={() => { navigate(`/product/${product.id}`); onClose() }}
                className="w-full border border-gray-200 text-gray-500 py-3 text-xs font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all"
              >
                View Full Details
              </button>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
