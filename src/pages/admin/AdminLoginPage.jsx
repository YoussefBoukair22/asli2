import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { adminLogin, adminError } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const ok = adminLogin(email, password)
    setLoading(false)
    if (ok) navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6" style={{fontFamily:"'Outfit',sans-serif"}}>
      <motion.div className="w-full max-w-md" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black mb-4">
            <Shield size={22} className="text-white"/>
          </div>
          <div className="font-head text-4xl tracking-widest text-black">ASLY ADMIN</div>
          <p className="text-gray-400 text-xs tracking-widest mt-1 uppercase">Management Portal</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Admin Email</label>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                placeholder="admin@asly.co"
                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm text-black placeholder-gray-300 outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm text-black placeholder-gray-300 outline-none focus:border-black transition-colors pr-10"
                />
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-0 top-3 text-gray-300 hover:text-black transition-colors">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {adminError && (
              <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-500 text-xs tracking-wider">
                ✕ {adminError}
              </motion.p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Verifying...' : 'Enter Admin Panel →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-300 tracking-wider text-center mb-2">DEMO CREDENTIALS</p>
            <div className="bg-gray-50 border border-gray-100 p-3 text-[11px] font-mono text-gray-400 space-y-1">
              <div>Email: <span className="text-black">admin@asly.co</span></div>
              <div>Password: <span className="text-black">asly2025</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={()=>navigate('/')} className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
            ← Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  )
}
