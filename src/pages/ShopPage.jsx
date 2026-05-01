import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import QuickView from '../components/QuickView'
import Footer from '../components/Footer'

const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Pants', 'Jackets']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
]

function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  return (
    <div className="bg-white border-r border-b border-gray-100 group">
      <div
        className="aspect-[3/4] overflow-hidden relative cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div
          className="product-img-inner w-full h-full flex items-center justify-center"
          style={{ background: product.bgColor || '#f5f5f5' }}
        >
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            : <span className="font-head text-5xl tracking-widest" style={{ color: 'rgba(0,0,0,0.06)' }}>ASLY</span>
          }
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={e => { e.stopPropagation(); onQuickView(product) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-black hover:text-white"
          >
            Quick View
          </button>
        </div>
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">New</span>
        )}
      </div>
      <div className="p-4 border-t border-gray-100">
        <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{product.category}</p>
        <p
          className="text-sm font-medium text-black mb-2 truncate cursor-pointer hover:opacity-60 transition-opacity"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">{product.price?.toFixed(2)} MAD</span>
          <button
            onClick={() => addToCart(product, 'M')}
            className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border-r border-b border-gray-100">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-4 border-t border-gray-100">
        <div className="skeleton h-3 w-20 mb-2 rounded" />
        <div className="skeleton h-4 w-3/4 mb-2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { products } = useAdmin()
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [category, sort])

  let filtered = products.filter(p => category === 'All' || p.category === category)
  if (sort === 'price-asc')  filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'newest')     filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))

  return (
    <div className="pt-16 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-14 max-w-7xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 block mb-2">All Products</span>
        <h1 className="font-head text-[clamp(3rem,9vw,7rem)] leading-none tracking-wide text-black">SHOP</h1>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-100 px-6 py-4 max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setCategory(cat)}
              className={`text-[10px] font-semibold tracking-widest uppercase px-4 py-2 border transition-all ${
                category === cat ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sort} onChange={e => setSort(e.target.value)}
          className="border border-gray-200 text-gray-500 text-[10px] font-semibold tracking-widest uppercase px-4 py-2 outline-none cursor-pointer hover:border-black transition-colors bg-white"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="px-0 py-0 border-b border-gray-100 max-w-7xl mx-auto">
        <p className="text-[11px] text-gray-400 tracking-wider px-6 py-2">{loading ? '—' : filtered.length} products</p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto border-l border-t border-gray-100">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="font-head text-5xl text-gray-100 mb-3">NO RESULTS</div>
            <p className="text-gray-400 text-sm">Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      {quickViewProduct && <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  )
}
