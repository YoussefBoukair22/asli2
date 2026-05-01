import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ExternalLink, ChevronRight } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products',  icon: Package },
  { to: '/admin/orders',   label: 'Orders',    icon: ShoppingBag },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { adminLogout, stats } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { adminLogout(); navigate('/admin/login') }
  const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="font-head text-3xl tracking-widest text-black">ASLY</div>
        <div className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mt-0.5">Admin Panel</div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-[0.12em] uppercase transition-all ${
              isActive(to, exact)
                ? 'bg-black text-white'
                : 'text-gray-400 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Icon size={15}/>
            {label}
            {isActive(to, exact) && <ChevronRight size={12} className="ml-auto"/>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
        <Link
          to="/" target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-gray-400 hover:text-black transition-colors"
        >
          <ExternalLink size={15}/> View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-gray-400 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={15}/> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{fontFamily:"'Outfit',sans-serif"}}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 bottom-0 left-0 z-40">
        <SidebarContent/>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-100 z-50 md:hidden flex flex-col"
              initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}}
              transition={{duration:0.3}}
            >
              <button onClick={()=>setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={20}/>
              </button>
              <SidebarContent/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button className="md:hidden text-gray-400 hover:text-black" onClick={()=>setSidebarOpen(true)}>
            <Menu size={20}/>
          </button>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400">
            {NAV.find(n=>isActive(n.to,n.exact))?.label||'Admin'}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[10px] tracking-widest uppercase text-gray-400 hidden sm:block">admin@asly.co</span>
            <div className="w-7 h-7 bg-black flex items-center justify-center">
              <span className="font-head text-white text-sm">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <motion.div key={pathname} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.25}}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
