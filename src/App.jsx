import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Navbar from './components/Navbar'

import HomePage     from './pages/HomePage'
import ShopPage     from './pages/ShopPage'
import ProductPage  from './pages/ProductPage'
import CartPage     from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage    from './pages/AboutPage'
import ContactPage  from './pages/ContactPage'
import LoginPage    from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

import AdminLoginPage  from './pages/admin/AdminLoginPage'
import AdminLayout     from './pages/admin/AdminLayout'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'

function AdminPage({ children }) {
  const { isAdmin } = useAdmin()
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <AdminLayout>{children}</AdminLayout>
}

function AppInner() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPath && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Store */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/shop"       element={<ShopPage />} />
          <Route path="/product/:id"element={<ProductPage />} />
          <Route path="/cart"       element={<CartPage />} />
          <Route path="/checkout"   element={<CheckoutPage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/login"      element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin/login"    element={<AdminLoginPage />} />
          <Route path="/admin"          element={<AdminPage><AdminDashboard /></AdminPage>} />
          <Route path="/admin/products" element={<AdminPage><AdminProducts /></AdminPage>} />
          <Route path="/admin/orders"   element={<AdminPage><AdminOrders /></AdminPage>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}
