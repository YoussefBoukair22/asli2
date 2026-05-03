import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import ProductImageGallery from '../components/ProductImageGallery'
import Footer from '../components/Footer'
import QuickView from '../components/QuickView'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useAdmin()
  const { addToCart } = useCart()
  const [size, setSize] = useState('M')
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const product = products.find(p => p.id === parseInt(id) || String(p.id) === id)
  const related = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : []

  useEffect(() => {
    setLoading(true)
    setSize('M')
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [id])

  if (!loading && !product) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col items-center justify-center gap-5">
        <div className="font-head text-8xl text-gray-100">404</div>
        <p className="text-gray-400 text-sm">Product not found.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-black text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="pt-16 bg-white min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="skeleton aspect-[3/4] md:aspect-auto min-h-[400px]" />
        <div className="p-10 flex flex-col gap-5">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-12 w-3/4 rounded" />
          <div className="skeleton h-8 w-28 rounded" />
          <div className="skeleton h-20 w-full rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 bg-white min-h-screen">
      <div className="px-6 py-3 border-b border-gray-100 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
        {/* Image gallery */}
        <div className="px-6 py-6">
          <ProductImageGallery
            images={product.images || (product.imageUrl ? [product.imageUrl] : [])}
            productName={product.name}
            bgColor={product.bgColor || '#f5f5f5'}
          />
        </div>

        {/* Details */}
        <div className="p-8 md:p-12 border-l border-gray-100 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 block mb-3">
              {product.category}
            </span>
            <h1 className="font-head text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-wide text-black mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-gray-400 mb-7">
              {product.price?.toFixed(2)} MAD
            </p>
            <p className="text-sm text-gray-500 leading-[1.9] mb-7 max-w-md">
              {product.description}
            </p>

            {product.details && product.details.length > 0 && (
              <ul className="mb-7 flex flex-col gap-2">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" /> {d}
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-7">
              <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">
                Size — <span className="text-black font-semibold">{size}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-11 h-11 text-xs font-semibold border transition-all ${
                      size === s
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap mb-7">
              <button
                onClick={() => addToCart(product, size)}
                className="flex-1 min-w-[180px] bg-black text-white py-4 text-xs font-bold tracking-[0.15em] uppercase hover:opacity-70 transition-opacity"
              >
                Add to Cart — {product.price?.toFixed(2)} MAD
              </button>
              <button
                onClick={() => {
                  addToCart(product, size)
                  navigate('/checkout')
                }}
                className="border border-gray-200 text-gray-500 px-6 py-4 text-xs font-bold tracking-widest uppercase hover:border-black hover:text-black transition-all flex items-center gap-2"
              >
                Buy Now <ArrowRight size={13} />
              </button>
            </div>

            <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
              {[
                'Free shipping on orders over 300 MAD',
                'Free returns within 30 days',
                'Premium materials, ethically sourced'
              ].map(p => (
                <div key={p} className="flex items-center gap-3">
                  <span className="text-gray-300 text-xs">✓</span>
                  <span className="text-xs text-gray-400 tracking-wide">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 py-16 px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block mb-2">
              You Might Also Like
            </span>
            <h2 className="font-head text-4xl tracking-wide text-black">RELATED PIECES</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-gray-100">
            {related.map(p => (
              <div
                key={p.id}
                className="border-r border-b border-gray-100 cursor-pointer group"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="aspect-[3/4] overflow-hidden" style={{ background: p.bgColor || '#f5f5f5' }}>
                  <div className="product-img-inner w-full h-full flex items-center justify-center">
                    {p.images && p.images[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      : p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="font-head text-4xl tracking-widest" style={{ color: 'rgba(0,0,0,0.06)' }}>
                          ASLI
                        </span>
                    }
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-black truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{p.price?.toFixed(2)} MAD</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
      {quickViewProduct && <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  )
}
