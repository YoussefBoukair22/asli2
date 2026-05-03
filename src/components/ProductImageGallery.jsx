import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ProductImageGallery({ images = [], productName = 'Product', bgColor = '#f5f5f5' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full aspect-[3/4] flex items-center justify-center border border-gray-200"
        style={{ background: bgColor }}
      >
        <span className="font-head text-5xl tracking-widest" style={{ color: 'rgba(0,0,0,0.06)' }}>
          ASLI
        </span>
      </div>
    )
  }

  const currentImage = images[selectedIndex]

  return (
    <>
      {/* Main image viewer */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <motion.div
          className="aspect-[3/4] relative overflow-hidden cursor-pointer"
          style={{ background: bgColor }}
          onClick={() => setShowLightbox(true)}
          key={selectedIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={currentImage}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4 bg-black/0 hover:bg-black/10 transition-colors opacity-0 hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(Math.max(0, selectedIndex - 1))
                }}
                disabled={selectedIndex === 0}
                className="w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(Math.min(images.length - 1, selectedIndex + 1))
                }}
                disabled={selectedIndex === images.length - 1}
                className="w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="border-t border-gray-200 p-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`shrink-0 w-14 h-14 border-2 transition-all overflow-hidden ${
                  selectedIndex === i ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                style={{ background: bgColor }}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 text-center text-[10px] text-gray-400 tracking-widest uppercase">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLightbox(false)}
          >
            <div className="relative w-full max-w-4xl">
              <motion.img
                src={currentImage}
                alt={productName}
                className="w-full h-auto max-h-[85vh] object-contain"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              />

              {/* Close button */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <X size={24} />
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIndex(Math.max(0, selectedIndex - 1))
                    }}
                    disabled={selectedIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIndex(Math.min(images.length - 1, selectedIndex + 1))
                    }}
                    disabled={selectedIndex === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={28} />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 text-sm tracking-widest">
                    {selectedIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
