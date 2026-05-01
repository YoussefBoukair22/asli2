import { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import Button from '../components/Button'

const CONTACT_INFO = [
  { label: 'Email', value: 'hello@asly.co' },
  { label: 'Instagram', value: '@aslywear' },
  { label: 'Location', value: 'London, UK' },
  { label: 'Hours', value: 'Mon–Fri, 9am–6pm GMT' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && form.email && form.message) {
      setSent(true)
    }
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="border-b border-[#222] px-6 py-16 max-w-7xl mx-auto">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#888] block mb-3">
          Get In Touch
        </span>
        <h1 className="font-head text-[clamp(3.5rem,9vw,8rem)] leading-none tracking-wide text-theme">
          LET'S
          <br />
          TALK
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#222]">
        {/* Left — info */}
        <div className="px-6 md:px-12 py-16 border-b md:border-b-0 md:border-r border-[#222] flex flex-col justify-between">
          <div>
            <p className="text-sm text-[#888] leading-[1.9] mb-10 max-w-sm">
              Questions about your order, sizing, or just want to say hi? We're a small team
              and we actually read every single email.
            </p>

            <div className="flex flex-col gap-8">
              {CONTACT_INFO.map(({ label, value }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[#555] mb-1">
                    {label}
                  </p>
                  <p className="text-sm text-theme font-medium">{value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-4">Follow us</p>
            <div className="flex gap-6">
              {['Instagram', 'TikTok', 'Twitter', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[10px] tracking-widest uppercase text-[#888] hover:text-white transition-colors border-b border-[#333] pb-0.5"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="px-6 md:px-12 py-16 bg-theme-dark">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-start justify-center gap-4"
            >
              <div className="font-head text-5xl tracking-wide text-theme">MESSAGE SENT</div>
              <p className="text-[#888] text-sm max-w-sm leading-relaxed">
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-white transition-colors mt-4 border-b border-[#333] pb-0.5"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                { key: 'subject', label: 'Subject', type: 'text', placeholder: 'What\'s this about?' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[9px] tracking-[0.25em] uppercase text-[#888] mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={set(key)}
                    required={key !== 'subject'}
                    className="w-full bg-transparent border-b border-[#222] py-3 text-sm text-theme placeholder-[#444] outline-none focus:border-white transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#888] mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Tell us everything..."
                  value={form.message}
                  onChange={set('message')}
                  required
                  rows={5}
                  className="w-full bg-transparent border-b border-[#222] py-3 text-sm text-theme placeholder-[#444] outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <Button type="submit" fullWidth className="justify-center mt-2">
                Send Message →
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ strip */}
      <section className="py-16 px-6 border-b border-[#222]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-head text-3xl tracking-widest text-theme mb-8">QUICK ANSWERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: 'How long does shipping take?', a: '2–5 business days within UK. 5–10 days internationally.' },
              { q: 'What is your returns policy?', a: 'Free returns within 30 days of purchase, unworn and in original packaging.' },
              { q: 'How do I find my size?', a: 'Our pieces run true to size with a relaxed fit. When in doubt, size up.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-t border-[#222] pt-6">
                <p className="text-sm font-semibold text-theme mb-2">{q}</p>
                <p className="text-sm text-[#888] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
