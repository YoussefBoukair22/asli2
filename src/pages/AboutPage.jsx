import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

const STATS = [
  { num: '2019', label: 'Founded in East London' },
  { num: '12', label: 'Products in our permanent collection' },
  { num: '0', label: 'Compromises on quality' },
  { num: '100%', label: 'Ethically manufactured' },
]

const VALUES = [
  {
    title: 'Quality Over Quantity',
    body: 'Every piece is sampled dozens of times before it meets our standards. We would rather release nothing than release something we are not proud of.',
  },
  {
    title: 'Minimal Branding',
    body: 'You will not find our name plastered across our garments. The quality speaks. The fit speaks. That is enough.',
  },
  {
    title: 'Ethical Manufacturing',
    body: 'All ASLY pieces are produced in small batches in certified facilities in Portugal, Japan, and Italy. We know where every stitch comes from.',
  },
  {
    title: 'No Seasonal Noise',
    body: 'We don\'t drop 200 pieces twice a year. We build a considered wardrobe of enduring pieces that you will wear for a decade.',
  },
]

export default function AboutPage() {
  const navigate = useNavigate()
  useScrollReveal()

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end px-6 pb-16 border-b border-[#222] overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-head leading-none"
            style={{ fontSize: 'clamp(8rem, 25vw, 22rem)', color: 'rgba(255,255,255,0.025)', letterSpacing: '0.02em' }}
          >
            ASLY
          </span>
        </div>
        <motion.div
          className="relative z-10 max-w-7xl mx-auto w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#888] block mb-4">
            Our Story
          </span>
          <h1
            className="font-head leading-none tracking-wide text-white"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
          >
            WE MAKE
            <br />
            LESS.
            <br />
            BETTER.
          </h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 border-b border-[#222]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="reveal">
            <p className="text-base text-[#888] leading-[1.9] mb-6">
              ASLY started in 2019 as a reaction to the noise of modern fashion. Too many brands,
              too many drops, too much noise. We asked a simple question: what if a brand just made
              a few things — and made them perfect?
            </p>
            <p className="text-base text-[#888] leading-[1.9] mb-6">
              Every ASLY piece is designed in-house, sampled endlessly, and released only when it
              meets our standards. We don't have seasons. We don't chase hype. We build a wardrobe
              — not a collection.
            </p>
            <p className="text-base text-[#888] leading-[1.9]">
              Our fabrics are sourced from mills in Portugal and Japan. Manufacturing is done in
              small batches in London. Quality over quantity. Always.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px border border-[#222] reveal">
            {STATS.map(({ num, label }) => (
              <div key={num} className="bg-theme-card p-8 border-b border-r border-[#222] last:border-b-0">
                <div className="font-head text-5xl tracking-wide text-theme leading-none mb-2">
                  {num}
                </div>
                <p className="text-xs text-[#888] leading-relaxed tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 border-b border-[#222]">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#888] block mb-3">
              What We Stand For
            </span>
            <h2 className="font-head text-[clamp(3rem,7vw,6rem)] leading-none tracking-wide text-theme">
              OUR VALUES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-[#222]">
            {VALUES.map(({ title, body }, i) => (
              <motion.div
                key={title}
                className="bg-theme-card p-10 border-b border-r border-[#222]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="font-head text-3xl tracking-wide text-theme mb-4 leading-tight">
                  {title}
                </div>
                <p className="text-sm text-[#888] leading-[1.9]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center reveal">
        <div className="max-w-lg mx-auto">
          <h2 className="font-head text-[clamp(3rem,8vw,6rem)] leading-none tracking-wide text-theme mb-8">
            READY TO WEAR ASLY?
          </h2>
          <Button onClick={() => navigate('/shop')}>
            Shop the Collection <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
