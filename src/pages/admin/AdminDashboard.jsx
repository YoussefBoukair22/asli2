import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Package, ShoppingBag, Clock, ArrowRight, Plus } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const STATUS_COLORS = {
  pending:    'text-yellow-600 bg-yellow-50 border-yellow-200',
  processing: 'text-blue-600 bg-blue-50 border-blue-200',
  shipped:    'text-purple-600 bg-purple-50 border-purple-200',
  delivered:  'text-green-600 bg-green-50 border-green-200',
  cancelled:  'text-red-600 bg-red-50 border-red-200',
}

function StatCard({ label, value, icon: Icon, sub, delay = 0 }) {
  return (
    <motion.div
      className="bg-white border border-gray-100 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">{label}</span>
        <div className="w-8 h-8 bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Icon size={14} className="text-gray-400" />
        </div>
      </div>
      <div className="font-head text-4xl tracking-wide text-black leading-none mb-1">{value}</div>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { stats, orders, products } = useAdmin()
  const recentOrders = [...orders].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-head text-5xl tracking-widest text-black">DASHBOARD</h1>
        <p className="text-gray-400 text-xs tracking-widest mt-1 uppercase">
          {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={`${stats.totalRevenue.toFixed(0)} MAD`} icon={TrendingUp} sub="Excl. cancelled" delay={0}/>
        <StatCard label="Orders" value={stats.totalOrders} icon={ShoppingBag} sub={`${stats.pendingOrders} need attention`} delay={0.05}/>
        <StatCard label="Products" value={stats.totalProducts} icon={Package} sub="In catalogue" delay={0.1}/>
        <StatCard label="Pending" value={stats.pendingOrders} icon={Clock} sub="Awaiting action" delay={0.15}/>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={()=>navigate('/admin/products')}
          className="flex items-center gap-4 bg-black text-white p-5 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
            <Plus size={16} className="text-white"/>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-[0.15em] uppercase">Add New Product</div>
            <div className="text-[10px] text-white/50 mt-0.5">Upload photos, set price & category</div>
          </div>
          <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform"/>
        </button>
        <button
          onClick={()=>navigate('/admin/orders')}
          className="flex items-center gap-4 bg-white border border-gray-200 p-5 hover:border-black transition-colors group"
        >
          <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
            <ShoppingBag size={16} className="text-gray-400"/>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-black">Manage Orders</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{stats.pendingOrders} orders need attention</div>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:translate-x-1 group-hover:text-black transition-all"/>
        </button>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-black">Recent Orders</h2>
          <button
            onClick={()=>navigate('/admin/orders')}
            className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={11}/>
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingBag size={32} className="text-gray-200 mx-auto mb-3"/>
            <p className="text-xs text-gray-400 tracking-widest uppercase">No orders yet</p>
            <p className="text-[10px] text-gray-300 mt-1">Orders placed by customers will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order,i)=>(
              <motion.div
                key={order.id}
                className="flex items-center gap-4 px-6 py-4"
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-black font-mono">{order.id}</span>
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[order.status]||'text-gray-500 bg-gray-50 border-gray-200'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {order.customer} · {order.phone || order.email || ''} · {order.city || ''} · {order.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-black shrink-0">{order.total?.toFixed(2)} MAD</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-black">Products ({products.length})</h2>
          <button
            onClick={()=>navigate('/admin/products')}
            className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors flex items-center gap-1"
          >
            Manage <ArrowRight size={11}/>
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {products.slice(0,5).map(p=>(
            <div key={p.id} className="flex items-center gap-4 px-6 py-3">
              <div
                className="w-10 h-12 shrink-0 flex items-center justify-center overflow-hidden"
                style={{background:p.bgColor||'#f5f5f5'}}
              >
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/>
                  : <span className="font-head text-[8px] tracking-widest" style={{color:'rgba(0,0,0,0.12)'}}>ASLY</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-black truncate">{p.name}</p>
                <p className="text-[10px] text-gray-400">{p.category}</p>
              </div>
              <span className="text-sm font-semibold text-black shrink-0">{p.price?.toFixed(2)} MAD</span>
              {p.isNew && <span className="text-[8px] font-bold tracking-widest uppercase bg-black text-white px-1.5 py-0.5">New</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
