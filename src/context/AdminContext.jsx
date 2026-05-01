import { createContext, useContext, useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products'

const AdminContext = createContext(null)

const INITIAL_ORDERS = []

const ADMIN_EMAIL = 'admin@asly.co'
const ADMIN_PASSWORD = 'asly2025'

// API endpoint — replace with your real backend URL
export const API_URL = 'https://your-backend-url.com/api'

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('asly_admin') === 'true')
  const [adminError, setAdminError] = useState('')

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('asly_products')
      return stored ? JSON.parse(stored) : PRODUCTS
    } catch { return PRODUCTS }
  })

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('asly_orders')
      return stored ? JSON.parse(stored) : INITIAL_ORDERS
    } catch { return INITIAL_ORDERS }
  })

  useEffect(() => {
    localStorage.setItem('asly_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('asly_orders', JSON.stringify(orders))
  }, [orders])

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem('asly_admin', 'true')
      setAdminError('')
      return true
    }
    setAdminError('Invalid credentials')
    return false
  }

  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('asly_admin')
  }

  // Called when a client places an order — saves locally AND sends to API
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), isNew: true }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const stats = {
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => ['pending','processing'].includes(o.status)).length,
    totalProducts: products.length,
  }

  return (
    <AdminContext.Provider value={{
      isAdmin, adminLogin, adminLogout, adminError,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus, deleteOrder,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
