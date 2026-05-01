import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="group relative cursor-pointer bg-theme-card border-b border-r border-theme"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div
        className="aspect-[3/4] overflow-hidden relative"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="product-img-inner w-full h-full">
          <ProductImage product={product} className="w-full h-full" />
        </div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="bg-white text-black text-[10px] font-bold tracking-[0.15em] uppercase px-6 py-3 hover:bg-[#888] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onQuickView && onQuickView(product)
            }}
          >
            Quick View
          </button>
        </motion.div>

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1">
            New
          </span>
        )}
      </div>

      {/* Info */}
      <div
        className="p-4 border-t border-theme"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <p className="text-[10px] tracking-[0.15em] uppercase text-theme-muted mb-1">
          {product.category}
        </p>
        <div className="flex items-end justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight text-theme">{product.name}</h3>
          <span className="text-sm text-theme-muted whitespace-nowrap shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <button
          className="mt-3 w-full border border-theme text-theme-muted text-[10px] font-semibold tracking-[0.15em] uppercase py-2 hover:border-white hover:text-white transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation()
            addToCart(product, 'M')
          }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
