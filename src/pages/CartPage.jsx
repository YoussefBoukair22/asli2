import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Footer from '../components/Footer'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart()

  const shipping = total >= 300 ? 0 : 30
  const grandTotal = total + shipping

  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
          <ShoppingBag size={48} className="text-gray-200" />
          <div>
            <h1 className="font-head text-6xl tracking-widest text-black mb-2">EMPTY CART</h1>
            <p className="text-gray-400 text-sm">You haven't added anything yet.</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            Start Shopping <ArrowRight size={14} />
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pt-16 bg-white min-h-screen">
      <div className="border-b border-gray-100 px-6 py-12 max-w-7xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block mb-2">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
        <h1 className="font-head text-[clamp(3rem,8vw,6rem)] leading-none tracking-wide text-black">YOUR CART</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">

          {/* Items */}
          <div>
            <AnimatePresence initial={false}>
              {cart.map(item => (
                <motion.div
                  key={item.key} layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-5 py-6 border-b border-gray-100"
                >
                  <div
                    className="w-24 shrink-0 aspect-[3/4] cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="w-full h-full flex items-center justify-center" style={{ background: item.bgColor || '#f5f5f5' }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : <span className="font-head text-sm tracking-widest" style={{ color: 'rgba(0,0,0,0.1)' }}>ASLY</span>
                      }
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{item.category}</p>
                    <h3
                      className="text-sm font-medium text-black mb-1 cursor-pointer hover:opacity-60 transition-opacity truncate"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Size: {item.size} · {item.price?.toFixed(2)} MAD each</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQty(item.key, -1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-black">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-black">{(item.price * item.qty).toFixed(2)} MAD</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.key)} className="text-gray-300 hover:text-red-400 transition-colors p-1 self-start">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              onClick={clearCart}
              className="mt-4 text-[10px] tracking-widest uppercase text-gray-300 hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-100 p-6 sticky top-24">
            <h2 className="font-head text-2xl tracking-widest text-black mb-6">ORDER SUMMARY</h2>
            <div className="flex flex-col gap-0 mb-4">
              {cart.map(item => (
                <div key={item.key} className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-500 truncate mr-2">{item.name} ×{item.qty}</span>
                  <span className="text-black shrink-0">{(item.price * item.qty).toFixed(2)} MAD</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between py-2 text-sm text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `${shipping} MAD`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[10px] text-orange-500 mb-2">Add {(300 - total).toFixed(0)} MAD more for free shipping</p>
            )}
            <div className="flex justify-between items-center pt-4 mb-6 border-t border-gray-100 mt-2">
              <span className="text-[10px] tracking-widest uppercase text-gray-400">Total</span>
              <span className="font-head text-3xl tracking-wide text-black">{grandTotal.toFixed(2)} MAD</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity mb-3 flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full border border-gray-200 text-gray-500 py-3 text-[10px] font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
