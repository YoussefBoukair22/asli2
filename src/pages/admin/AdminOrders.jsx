import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, Trash2, Eye } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled']
const STATUS_STYLE = {
  pending:    'text-yellow-600 bg-yellow-50 border-yellow-200',
  processing: 'text-blue-600 bg-blue-50 border-blue-200',
  shipped:    'text-purple-600 bg-purple-50 border-purple-200',
  delivered:  'text-green-600 bg-green-50 border-green-200',
  cancelled:  'text-red-600 bg-red-50 border-red-200',
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 border ${STATUS_STYLE[status]||'text-gray-500 bg-gray-50 border-gray-200'}`}>
      {status}
    </span>
  )
}

function StatusDropdown({ current, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={()=>setOpen(o=>!o)}
        className="flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
      >
        Change <ChevronDown size={10}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-6 bg-white border border-gray-200 shadow-lg z-20 min-w-[130px] py-1"
            initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}
          >
            {STATUS_OPTIONS.map(s=>(
              <button
                key={s}
                onClick={()=>{onChange(s);setOpen(false)}}
                className={`w-full text-left px-4 py-2 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                  s===current ? 'text-black bg-gray-50' : 'text-gray-400 hover:text-black hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderDetail({ order, onClose, onStatusChange }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}
    >
      <motion.div
        className="bg-white border border-gray-200 shadow-xl w-full max-w-lg"
        initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
        onClick={e=>e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="font-head text-2xl tracking-widest text-black">{order.id}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{order.date}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors"><X size={18}/></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-50 border border-gray-100 p-4">
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Customer Info</p>
            <p className="text-sm text-black font-medium">{order.customer}</p>
            {order.phone   && <p className="text-xs text-gray-500 mt-0.5">📞 {order.phone}</p>}
            {order.address && <p className="text-xs text-gray-500 mt-0.5">📍 {order.address}</p>}
            {order.city    && <p className="text-xs text-gray-500 mt-0.5">🏙 {order.city}</p>}
            {order.notes   && <p className="text-xs text-gray-400 mt-2 italic">"{order.notes}"</p>}
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Status</p>
            <div className="flex items-center gap-4 flex-wrap">
              <StatusBadge status={order.status}/>
              <StatusDropdown current={order.status} onChange={s=>onStatusChange(order.id,s)}/>
            </div>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Items</p>
            <div className="flex flex-col gap-2">
              {(order.items||[]).map((item,i)=>(
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-xs text-black font-medium">{item.name||item.product}</p>
                    <p className="text-[10px] text-gray-400">Size: {item.size||'—'} · Qty: {item.qty||item.quantity}</p>
                  </div>
                  <span className="text-xs text-black font-semibold">
                    {((item.price)*(item.qty||item.quantity)).toFixed(2)} MAD
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="text-[10px] tracking-widest uppercase text-gray-400">Total</span>
            <span className="font-head text-3xl tracking-wide text-black">{order.total?.toFixed(2)} MAD</span>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s=>(
                <button
                  key={s}
                  onClick={()=>onStatusChange(order.id,s)}
                  className={`px-3 py-2 text-[9px] font-bold tracking-widest uppercase border transition-all ${
                    order.status===s ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = orders
    .filter(o => filterStatus==='all'||o.status===filterStatus)
    .filter(o =>
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.city?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a,b)=>new Date(b.date)-new Date(a.date))

  const counts = STATUS_OPTIONS.reduce((acc,s)=>({...acc,[s]:orders.filter(o=>o.status===s).length}),{})

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-head text-5xl tracking-widest text-black">ORDERS</h1>
        <p className="text-gray-400 text-xs tracking-widest mt-1 uppercase">{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={()=>setFilterStatus('all')}
          className={`px-4 py-2 text-[10px] font-semibold tracking-widest uppercase border transition-all ${filterStatus==='all'?'bg-black text-white border-black':'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)}
            className={`px-4 py-2 text-[10px] font-semibold tracking-widest uppercase border transition-all ${filterStatus===s?'bg-black text-white border-black':'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
          >
            {s} ({counts[s]||0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 mb-5 max-w-md bg-white">
        <Search size={14} className="text-gray-300 shrink-0"/>
        <input
          placeholder="Search by ID, name, phone, city..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="bg-transparent text-sm text-black placeholder-gray-300 outline-none flex-1"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Order ID','Customer','Phone','City','Date','Total','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.2em] uppercase text-gray-400 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length===0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-300 text-xs tracking-widest uppercase">No orders found</td></tr>
            ) : filtered.map((order,i)=>(
              <motion.tr
                key={order.id}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-5 py-4 text-xs font-bold text-black font-mono">{order.id}</td>
                <td className="px-5 py-4 text-xs text-black font-medium">{order.customer}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{order.phone||'—'}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{order.city||'—'}</td>
                <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{order.date}</td>
                <td className="px-5 py-4 text-xs font-bold text-black">{order.total?.toFixed(2)} MAD</td>
                <td className="px-5 py-4"><StatusBadge status={order.status}/></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>setSelectedOrder(order)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors" title="View">
                      <Eye size={13}/>
                    </button>
                    <StatusDropdown current={order.status} onChange={s=>updateOrderStatus(order.id,s)}/>
                    <button onClick={()=>setDeleteId(order.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetail
            order={orders.find(o=>o.id===selectedOrder.id)||selectedOrder}
            onClose={()=>setSelectedOrder(null)}
            onStatusChange={(id,status)=>{
              updateOrderStatus(id,status)
              setSelectedOrder(prev=>prev?.id===id?{...prev,status}:prev)
            }}
          />
        )}
        {deleteId && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          >
            <motion.div
              className="bg-white border border-gray-200 shadow-xl p-8 max-w-sm w-full text-center"
              initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
            >
              <Trash2 size={32} className="text-red-400 mx-auto mb-4"/>
              <h3 className="font-head text-2xl tracking-widest text-black mb-2">DELETE ORDER</h3>
              <p className="text-gray-400 text-sm mb-6">Remove <strong>{deleteId}</strong>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={()=>{deleteOrder(deleteId);setDeleteId(null)}} className="flex-1 bg-red-500 text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-red-600 transition-colors">Delete</button>
                <button onClick={()=>setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-500 py-3 text-xs font-semibold tracking-widest uppercase hover:border-black hover:text-black transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
