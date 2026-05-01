import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('asly_cart') || '[]') } catch { return [] }
  })
  const [toasts, setToasts] = useState([])

  useEffect(() => { localStorage.setItem('asly_cart', JSON.stringify(cart)) }, [cart])

  const addToast = useCallback((msg) => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }, [])

  const addToCart = useCallback((product, size = 'M') => {
    const key = `${product.id}_${size}`
    setCart(prev => {
      const ex = prev.find(i => i.key === key)
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, size, qty: 1, key }]
    })
    addToast(`${product.name} added to cart`)
  }, [addToast])

  const removeFromCart = useCallback((key) => setCart(p => p.filter(i => i.key !== key)), [])
  const updateQty = useCallback((key, delta) => setCart(p => p.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            style={{ animation: 'slideToast 0.3s ease' }}
            className="bg-black text-white px-5 py-3 text-xs font-semibold tracking-wider min-w-[220px] shadow-xl"
          >
            ✓ {t.msg}
          </div>
        ))}
      </div>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
