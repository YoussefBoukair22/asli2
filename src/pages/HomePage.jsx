import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import ProductCarousel from '../components/ProductCarousel'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { products } = useAdmin()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(true)
  useScrollReveal()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="pt-16">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="hero-grid absolute inset-0 opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/30" />
        <div className="absolute bottom-0 left-0 right-0 text-center overflow-hidden pointer-events-none select-none">
          <span className="font-head leading-none" style={{fontSize:'clamp(8rem,22vw,20rem)',color:'rgba(0,0,0,0.04)'}}>
            ASLY
          </span>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="text-[11px] tracking-[0.4em] uppercase text-gray-400 mb-6"
          >
            Spring / Summer 2025
          </motion.p>
          <motion.h1
            initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.8}}
            className="font-head text-[clamp(5rem,18vw,15rem)] leading-[0.88] tracking-tight text-black"
          >
            NEW<br/>COLLECTION
          </motion.h1>
          <motion.p
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
            className="text-base text-gray-400 mt-5 mb-10 tracking-widest"
          >
            Minimalist streetwear for the discerning few.
          </motion.p>
          <motion.div
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
            className="flex gap-3 justify-center flex-wrap"
          >
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              Shop Now <ArrowRight size={14}/>
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="border border-black text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all flex items-center gap-2"
            >
              <ShoppingBag size={14}/> View Cart
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-gray-300">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gray-200"
            animate={{scaleY:[1,0.3,1]}}
            transition={{duration:1.5,repeat:Infinity}}
          />
        </motion.div>
      </section>

      {/* ── PRODUCT CAROUSEL ── */}
      <ProductCarousel title="NEW ARRIVALS" label="Just Dropped" />

      {/* ── FEATURED GRID ── */}
      <section className="py-20 px-6 border-b border-theme">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-theme-muted block mb-2">Featured</span>
            <h2 className="font-head text-[clamp(3rem,7vw,5rem)] leading-none text-theme">BEST SELLERS</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-theme">
              {[1,2,3,4].map(i=>(
                <div key={i}>
                  <div className="skeleton aspect-[3/4] w-full"/>
                  <div className="p-4 border-t border-theme">
                    <div className="skeleton h-3 w-3/4 mb-2 rounded"/><div className="skeleton h-3 w-1/2 rounded"/>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-theme reveal">
              {products.slice(0,4).map(p=>(
                <div key={p.id} className="border-r border-b border-theme group cursor-pointer bg-theme-card hover:bg-theme-dark transition-colors">
                  <div className="aspect-[3/4] overflow-hidden" onClick={()=>navigate(`/product/${p.id}`)}>
                    <div
                      className="product-img-inner w-full h-full flex items-center justify-center"
                      style={{background:p.bgColor||'#f5f5f5'}}
                    >
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/>
                        : <span className="font-head text-4xl tracking-widest" style={{color:'rgba(0,0,0,0.06)'}}>ASLY</span>
                      }
                    </div>
                  </div>
                  <div className="p-4 border-t border-theme">
                    <p className="text-xs font-medium text-theme mb-1 truncate">{p.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-muted">{p.price?.toFixed(2)} MAD</span>
                      <button
                        onClick={()=>addToCart(p,'M')}
                        className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 border border-theme text-theme-muted hover:bg-black hover:text-white hover:border-black transition-all"
                      >Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center reveal">
            <button
              onClick={()=>navigate('/shop')}
              className="border border-black text-black px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
            >
              View All Products <ArrowRight size={12} className="inline ml-1"/>
            </button>
          </div>
        </div>
      </section>

      {/* ── BRAND SECTION ── */}
      <section className="py-24 px-6 border-b border-theme">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <h2 className="font-head leading-none tracking-wide text-theme" style={{fontSize:'clamp(4rem,10vw,8rem)'}}>
              BUILT<br/>FOR THE<br/>STREETS
            </h2>
          </div>
          <div className="reveal">
            <span className="text-[10px] tracking-[0.3em] uppercase text-theme-muted block mb-4">About ASLY</span>
            <p className="text-theme-muted leading-[1.9] text-sm mb-4 max-w-md">
              ASLY was founded on a single principle: make fewer things, but make them better.
              Every garment is a considered exercise in restraint — no excess branding, no seasonal noise.
            </p>
            <p className="text-theme-muted leading-[1.9] text-sm mb-8 max-w-md">
              We don't follow trends. We set them by refusing to follow them.
            </p>
            <button
              onClick={()=>navigate('/about')}
              className="border border-black text-black px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
            >
              Our Story <ArrowRight size={12} className="inline ml-1"/>
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 px-6 text-center reveal">
        <div className="max-w-lg mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-theme-muted block mb-3">Newsletter</span>
          <h2 className="font-head text-[clamp(3rem,7vw,5rem)] leading-none text-theme mb-5">
            STAY IN<br/>THE LOOP
          </h2>
          <p className="text-theme-muted text-sm mb-8 leading-relaxed">New drops and exclusive access. No spam.</p>
          <form
            className="flex border border-theme max-w-sm mx-auto"
            onSubmit={e=>{e.preventDefault();alert('Subscribed!')}}
          >
            <input
              type="email" required placeholder="your@email.com"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-theme placeholder-gray-300 outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-5 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
            >
              Join
            </button>
          </form>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
