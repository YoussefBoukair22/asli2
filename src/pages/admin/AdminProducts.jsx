import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Upload, Search, Check } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Pants', 'Jackets']
const BG_COLORS = [
  { hex: '#f5f5f5', label: 'Light Grey' },
  { hex: '#e8e0d8', label: 'Cream' },
  { hex: '#1a1a1a', label: 'Black' },
  { hex: '#2d3a2d', label: 'Olive' },
  { hex: '#1a2035', label: 'Navy' },
  { hex: '#3a1a1a', label: 'Burgundy' },
  { hex: '#d4c5b0', label: 'Sand' },
  { hex: '#4a4a4a', label: 'Charcoal' },
]

const EMPTY_FORM = {
  name: '', price: '', category: 'T-Shirts', color: '',
  description: '', bgColor: '#f5f5f5', isNew: false,
  sizes: ['S', 'M', 'L', 'XL'],
  details: ['', '', '', ''],
  imageUrl: '',
}

function ProductForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const setDetail = (i, val) => setForm(f => {
    const d = [...f.details]; d[i] = val; return { ...f, details: d }
  })
  const toggleSize = (s) => setForm(f => ({
    ...f,
    sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
  }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Convert to base64 so it persists in localStorage
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setForm(f => ({ ...f, imageUrl: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.price || isNaN(parseFloat(form.price))) errs.price = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, price: parseFloat(form.price), details: form.details.filter(Boolean) })
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-head text-2xl tracking-widest text-black">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-black transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

          {/* Image upload */}
          <div>
            <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-3">Product Image</label>
            <div className="flex gap-4 items-start flex-wrap">
              <div
                className="w-24 h-32 shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden"
                style={{ background: form.bgColor }}
              >
                {imagePreview
                  ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  : <span className="font-head text-xs tracking-widest" style={{ color: 'rgba(0,0,0,0.15)' }}>ASLY</span>
                }
              </div>
              <div className="flex-1 min-w-[200px]">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <button
                  type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-gray-500 hover:border-black hover:text-black transition-colors"
                >
                  <Upload size={12} /> Upload Photo
                </button>
                <p className="text-[10px] text-gray-300 mt-2">JPG, PNG, WEBP — saved automatically</p>

                {/* Color picker */}
                <p className="text-[9px] tracking-widest uppercase text-gray-400 mt-3 mb-2">Background color</p>
                <div className="flex gap-2 flex-wrap">
                  {BG_COLORS.map(c => (
                    <button
                      key={c.hex} type="button"
                      onClick={() => setForm(f => ({ ...f, bgColor: c.hex }))}
                      title={c.label}
                      className="w-7 h-7 border-2 transition-all rounded-sm relative"
                      style={{
                        background: c.hex,
                        borderColor: form.bgColor === c.hex ? '#000' : '#ddd',
                      }}
                    >
                      {form.bgColor === c.hex && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check size={10} style={{ color: c.hex === '#f5f5f5' || c.hex === '#e8e0d8' || c.hex === '#d4c5b0' ? '#000' : '#fff' }} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Product Name *</label>
              <input
                value={form.name} onChange={set('name')} placeholder="e.g. ASLY Classic Tee"
                className={`w-full bg-transparent border-b py-3 text-sm text-black placeholder-gray-300 outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-black'}`}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Price (MAD) *</label>
              <input
                type="number" step="0.01" min="0"
                value={form.price} onChange={set('price')} placeholder="299"
                className={`w-full bg-transparent border-b py-3 text-sm text-black placeholder-gray-300 outline-none transition-colors ${errors.price ? 'border-red-400' : 'border-gray-200 focus:border-black'}`}
              />
              {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Color Name</label>
              <input
                value={form.color} onChange={set('color')} placeholder="e.g. Black"
                className="w-full bg-transparent border-b border-gray-200 focus:border-black py-3 text-sm text-black placeholder-gray-300 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-3">Category *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                  className={`px-4 py-2 text-[10px] font-semibold tracking-widest uppercase border transition-all ${
                    form.category === c ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-3">Available Sizes</label>
            <div className="flex gap-2 flex-wrap">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                <button
                  key={s} type="button" onClick={() => toggleSize(s)}
                  className={`w-11 h-11 text-xs font-semibold border transition-all ${
                    form.sizes.includes(s) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Description</label>
            <textarea
              value={form.description} onChange={set('description')} rows={3}
              placeholder="Premium streetwear piece..."
              className="w-full bg-transparent border border-gray-200 focus:border-black p-3 text-sm text-black placeholder-gray-300 outline-none transition-colors resize-none"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-3">Product Details (up to 4)</label>
            <div className="flex flex-col gap-3">
              {form.details.map((d, i) => (
                <input
                  key={i} value={d} onChange={e => setDetail(i, e.target.value)}
                  placeholder={`Detail ${i + 1} — e.g. 280gsm heavyweight cotton`}
                  className="w-full bg-transparent border-b border-gray-200 focus:border-black py-2 text-sm text-black placeholder-gray-300 outline-none transition-colors"
                />
              ))}
            </div>
          </div>

          {/* New toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isNew: !f.isNew }))}
              className={`w-10 h-6 border-2 transition-all flex items-center justify-center ${
                form.isNew ? 'bg-black border-black' : 'bg-white border-gray-300'
              }`}
            >
              {form.isNew && <Check size={12} className="text-white" />}
            </button>
            <span className="text-xs text-gray-500 tracking-wider">Mark as New Arrival</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 text-xs font-bold tracking-[0.15em] uppercase hover:opacity-70 transition-opacity"
            >
              {initial ? '✓ Save Changes' : '+ Add Product'}
            </button>
            <button
              type="button" onClick={onCancel}
              className="px-6 border border-gray-200 text-gray-500 text-xs font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = products
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()))

  const handleAdd  = (data) => { addProduct(data); setShowForm(false) }
  const handleEdit = (data) => { updateProduct(editProduct.id, data); setEditProduct(null) }
  const handleDelete = () => { deleteProduct(deleteId); setDeleteId(null) }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-head text-5xl tracking-widest text-black">PRODUCTS</h1>
          <p className="text-gray-400 text-xs tracking-widest mt-1 uppercase">{products.length} products in catalogue</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:opacity-70 transition-opacity"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-black placeholder-gray-300 outline-none flex-1"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(c => (
            <button
              key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-2 text-[10px] font-semibold tracking-widest uppercase border transition-all ${
                filterCat === c ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Product', 'Category', 'Price (MAD)', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.2em] uppercase text-gray-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-300 text-xs tracking-widest uppercase">
                  No products found
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-12 shrink-0 flex items-center justify-center overflow-hidden border border-gray-100"
                      style={{ background: p.bgColor || '#f5f5f5' }}
                    >
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="font-head text-[8px] tracking-widest" style={{ color: 'rgba(0,0,0,0.15)' }}>ASLY</span>
                      }
                    </div>
                    <div>
                      <p className="text-black font-medium text-xs">{p.name}</p>
                      <p className="text-gray-400 text-[10px]">{p.color || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">{p.category}</td>
                <td className="px-5 py-3 text-black font-semibold text-xs">{p.price?.toFixed(2)}</td>
                <td className="px-5 py-3">
                  {p.isNew
                    ? <span className="text-[9px] font-bold tracking-widest uppercase bg-black text-white px-2 py-0.5">New</span>
                    : <span className="text-[9px] text-gray-300 tracking-widest uppercase">—</span>
                  }
                </td>
                <td className="px-5 py-3">
                  {/* Always visible edit/delete — no hover required */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-all"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit form modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            title="ADD NEW PRODUCT"
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}
        {editProduct && (
          <ProductForm
            title="EDIT PRODUCT"
            initial={{
              ...editProduct,
              price: String(editProduct.price || ''),
              details: [
                ...(editProduct.details || []),
                '', '', '', ''
              ].slice(0, 4),
            }}
            onSave={handleEdit}
            onCancel={() => setEditProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              className="bg-white border border-gray-200 shadow-2xl p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="font-head text-2xl tracking-widest text-black mb-2">DELETE PRODUCT</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-red-600 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 text-xs font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
