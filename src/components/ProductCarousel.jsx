import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'

export default function ProductCarousel({ title = 'FEATURED', label = 'New Arrivals' }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { products } = useAdmin()
  const [index, setIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const trackRef = useRef()
  const timerRef = useRef()

  // Responsive: cards visible based on container width
  const getVisible = () => {
    if (width < 640)  return 1
    if (width < 900)  return 2
    if (width < 1200) return 3
    return 4
  }
  const visible   = getVisible()
  const cardW     = width / visible
  const maxIndex  = Math.max(0, products.length - visible)

  // Measure container
  useEffect(() => {
    if (!trackRef.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(trackRef.current.parentElement)
    setWidth(trackRef.current.parentElement.offsetWidth)
    return () => ro.disconnect()
  }, [])

  // Auto-slide every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [maxIndex])

  const goTo = useCallback((dir) => {
    clearInterval(timerRef.current)
    setIndex(i => Math.min(maxIndex, Math.max(0, i + dir)))
  }, [maxIndex])

  return (
    <section className="py-20 border-b border-theme overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-theme-muted block mb-2">
              {label}
            </span>
            <h2 className="font-head text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-wide text-theme">
              {title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(-1)}
              disabled={index === 0}
              className="w-11 h-11 border border-theme flex items-center justify-center text-theme-muted hover:border-black hover:text-black disabled:opacity-20 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(1)}
              disabled={index >= maxIndex}
              className="w-11 h-11 border border-theme flex items-center justify-center text-theme-muted hover:border-black hover:text-black disabled:opacity-20 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Track */}
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <div
          ref={trackRef}
          className="carousel-track"
          style={{ transform: `translateX(-${index * (cardW + 1)}px)` }}
        >
          {products.map(product => (
            <div
              key={product.id}
              className="shrink-0 bg-theme-card border border-theme group cursor-pointer"
              style={{ width: `${cardW - 1}px` }}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio:'3/4' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div
                  className="product-img-inner w-full h-full flex items-center justify-center"
                  style={{ background: product.bgColor || '#f0f0f0' }}
                >
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    : <span className="font-head text-4xl tracking-widest" style={{color:'rgba(0,0,0,0.06)'}}>ASLY</span>
                  }
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1">
                    New
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 border-t border-theme">
                <p className="text-[10px] tracking-[0.12em] uppercase text-theme-muted mb-1">
                  {product.category}
                </p>
                <p
                  className="text-sm font-medium text-theme mb-1 truncate cursor-pointer hover:opacity-60 transition-opacity"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-theme">
                    {product.price?.toFixed(2)} MAD
                  </span>
                  <button
                    onClick={() => addToCart(product, 'M')}
                    className="text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 border border-theme hover:bg-black hover:text-white hover:border-black transition-all text-theme-muted"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { clearInterval(timerRef.current); setIndex(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-black w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
