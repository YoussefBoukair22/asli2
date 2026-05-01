import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="hero-grid fixed inset-0 opacity-20 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div
          className="font-head leading-none text-theme select-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(255,255,255,0.04)' }}
        >
          404
        </div>
        <h1 className="font-head text-5xl tracking-widest text-theme -mt-8 mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-[#888] text-sm mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={() => navigate('/')}>Go Home</Button>
          <Button variant="dark" onClick={() => navigate('/shop')}>Browse Shop</Button>
        </div>
      </motion.div>
    </div>
  )
}
