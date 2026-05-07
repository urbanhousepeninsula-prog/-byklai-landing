import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef } from 'react'
import CaseStudy from '../components/CaseStudy'

interface FormData {
  nombre: string
  email: string
  telefono: string
  tipo_negocio: string
  que_necesitas: string
  mensaje: string
  website: string // honeypot
}

interface FormErrors {
  nombre?: boolean
  email?: boolean
  telefono?: boolean
  tipo_negocio?: boolean
  que_necesitas?: boolean
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipo_negocio: '',
    que_necesitas: '',
    mensaje: '',
    website: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLDivElement>(null)

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validarTelefono = (tel: string) => tel === '' || tel.replace(/[\s\-\+\(\)]/g, '').length >= 10

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const handleSubmit = async () => {
    if (form.website) return // honeypot

    const newErrors: FormErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = true
    if (!form.email.trim() || !validarEmail(form.email)) newErrors.email = true
    if (!validarTelefono(form.telefono)) newErrors.telefono = true
    if (!form.tipo_negocio) newErrors.tipo_negocio = true
    if (!form.que_necesitas) newErrors.que_necesitas = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          tipo_negocio: form.tipo_negocio,
          que_necesitas: form.que_necesitas,
          mensaje: form.mensaje.trim(),
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        throw new Error('server_error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full font-sans text-sm px-3.5 py-3 rounded-lg border outline-none transition-colors bg-white text-ink ${
      errors[field] ? 'border-red-400' : 'border-line focus:border-ink'
    }`

  return (
    <>
      <Head>
        <title>byklai.com — sistemas automatizados de captación</title>
        <meta name="description" content="Diseño e implementación del sistema completo que conecta tu landing, formulario, CRM y seguimiento automático — desde el día uno, sin intervención manual." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="byklai.com — sistemas automatizados de captación" />
        <meta property="og:description" content="Landing → Formulario → Webhook → CRM → Email → Seguimiento. Todo conectado, sin intervención manual." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-surface text-ink min-h-screen">

        {/* NAV */}
        <nav className="sticky top-0 z-50 bg-surface border-b border-line py-4">
          <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
            <div className="nav-logo">
              <Image src="/logo-byklai_TN.png" alt="byklai.com" width={140} height={37} priority />
            </div>
            <a href="#form" className="font-mono text-xs font-medium px-4 py-2 border-[1.5px] border-ink rounded-full hover:bg-ink hover:text-white transition-colors">
              → solicitar sistema
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-20 border-b border-line">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink3 border border-line px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            sistemas de captación automatizados
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,52px)] leading-[1.1] tracking-tight mb-5 max-w-2xl">
            Tu negocio capta leads.<br /><em className="text-ink2">Tu sistema los convierte.</em>
          </h1>
          <p className="text-[17px] text-ink2 max-w-xl mb-9 leading-relaxed font-light">
            Diseño e implemento el sistema completo que conecta tu landing, formulario, CRM y seguimiento automático — desde el día uno, sin intervención manual.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <a href="#form" className="font-mono text-[13px] font-medium px-7 py-3.5 bg-ink text-white rounded-full border-[1.5px] border-ink hover:bg-ink2 transition-colors">
              → solicitar mi sistema
            </a>
            <a href="#como-funciona" className="font-mono text-[13px] font-medium px-6 py-3.5 text-ink2 hover:text-ink transition-colors">
              ver cómo funciona ↓
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { num: '3', label: 'planes disponibles' },
              { num: '<24h', label: 'respuesta inicial' },
              { num: 'end-to-end', label: 'todo conectado' },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="font-serif text-[28px] leading-none">{s.num}</span>
                <span className="font-mono text-[12px] text-ink3">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-b border-line">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">el problema real</p>
          <h2 className="font-serif text-[clamp(26px,4vw,40px)] leading-tight tracking-tight mb-4 max-w-xl">
            No te faltan herramientas.<br />Te falta que <em>funcionen juntas.</em>
          </h2>
          <p className="text-ink2 font-light max-w-lg mb-8">La mayoría de negocios ya tienen lo básico. El problema es que cada pieza opera en su propia isla.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { sym: '× sin conexión', title: 'Landing sin seguimiento', desc: 'Tienes página, pero los leads que llegan no tienen a dónde ir.' },
              { sym: '× sin estructura', title: 'Mensajes sin sistema', desc: 'Recibes consultas, pero las gestionas manualmente una por una.' },
              { sym: '× sin flujo', title: 'Herramientas aisladas', desc: 'Cada plataforma vive sola. No hay automatización real entre ellas.' },
              { sym: '× sin resultado', title: 'Oportunidades perdidas', desc: 'Leads que entran fríos porque la respuesta llegó tarde o no llegó.' },
            ].map(item => (
              <div key={item.title} className="p-5 border border-line rounded-xl bg-surface2">
                <span className="font-mono text-[11px] text-red-400 mb-2 block">{item.sym}</span>
                <strong className="block text-[15px] font-medium text-ink mb-1">{item.title}</strong>
                <p className="text-[14px] text-ink2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SOLUTION + FLOW */}
        <section id="como-funciona" className="max-w-4xl mx-auto px-6 py-16 border-b border-line">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">la solución</p>
          <h2 className="font-serif text-[clamp(26px,4vw,40px)] leading-tight tracking-tight mb-4 max-w-xl">
            No construyo piezas.<br />Construyo <em>el sistema completo.</em>
          </h2>
          <p className="text-ink2 font-light max-w-lg mb-7">
            Cada componente está diseñado para encajar con el siguiente. El sistema funciona solo, sin que tengas que mover nada.
          </p>
          <div className="bg-ink rounded-xl px-7 py-5 flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <Image src="/logo-byklai_TB.png" alt="byklai" width={90} height={24} className="opacity-80 mr-4 flex-shrink-0" />
            {['Landing', 'Formulario', 'Webhook n8n', 'CRM', 'Email Resend', 'Seguimiento'].map((node, i, arr) => (
              <div key={node} className="flex items-center flex-shrink-0">
                <span className="font-mono text-[11px] text-white opacity-90 px-3.5 py-1.5 border border-white/20 rounded-md tracking-wider whitespace-nowrap">
                  {node}
                </span>
                {i < arr.length - 1 && <span className="text-white/30 px-2.5 text-base">→</span>}
              </div>
            ))}
          </div>
          <p className="font-mono text-[13px] text-ink3 mt-4">Cada lead entra, se registra, recibe respuesta y queda activo — sin intervención manual.</p>
        </section>

        {/* INCLUDES */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-b border-line">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">qué incluye</p>
          <h2 className="font-serif text-[clamp(26px,4vw,40px)] leading-tight tracking-tight mb-8 max-w-xl">
            Todo lo necesario para operar<br />desde el <em>día uno.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { title: 'Landing de alta conversión', desc: 'Next.js + Vercel — rápida, optimizada, lista para deploy' },
              { title: 'Automatización con n8n', desc: 'Lógica real: webhooks, condicionales, workflows completos' },
              { title: 'CRM integrado', desc: 'Google Sheets o HubSpot — cada lead registrado automáticamente' },
              { title: 'Email automation — Resend', desc: 'Respuesta inmediata con entregabilidad real y dominio propio' },
              { title: 'Dominio + DNS + entregabilidad', desc: 'Configuración completa para que los emails lleguen donde deben' },
              { title: 'Deploy con Git + Vercel', desc: 'Control de versiones, CI/CD y entorno de producción listo' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-4.5 border border-line rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <strong className="block text-[14px] font-medium text-ink mb-0.5">{item.title}</strong>
                  <span className="text-[12px] text-ink3">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CASE STUDY */}
        <CaseStudy />

        {/* PRICING */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-b border-line">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">inversión</p>
          <h2 className="font-serif text-[clamp(26px,4vw,40px)] leading-tight tracking-tight mb-8 max-w-xl">
            Sistemas completos,<br />no <em>servicios aislados.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
            {[
              {
                name: 'Básico', price: '$800', featured: false,
                desc: 'Para negocios que necesitan una base sólida de captación.',
                features: ['Landing page optimizada', 'Formulario + webhook', 'Automatización inicial n8n', 'Deploy en Vercel'],
              },
              {
                name: 'Completo', price: '$1,200', featured: true,
                desc: 'Sistema end-to-end con CRM, emails y seguimiento automático.',
                features: ['Todo lo del plan Básico', 'CRM integrado (Sheets / HubSpot)', 'Email automation con Resend', 'DNS + entregabilidad', 'Seguimiento automático'],
              },
              {
                name: 'Avanzado', price: '$1,800', featured: false,
                desc: 'Lógica personalizada y arquitectura preparada para escalar.',
                features: ['Todo lo del plan Completo', 'Lógica condicional avanzada', 'Flujos de venta automatizados', 'Escalabilidad sin rehacer el sistema'],
              },
            ].map(plan => (
              <div key={plan.name} className={`relative rounded-2xl flex flex-col p-6 ${plan.featured ? 'border-2 border-ink bg-white' : 'border border-line bg-surface'}`}>
                {plan.featured && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider bg-ink text-white px-3 py-1 rounded-b-lg whitespace-nowrap">
                    más solicitado
                  </div>
                )}
                <p className="font-mono text-[14px] font-medium text-ink3 mb-3 tracking-wider">{plan.name}</p>
                <p className="font-serif text-[36px] tracking-tight leading-none mb-2">{plan.price}</p>
                <p className="text-[13px] text-ink2 mb-5 leading-relaxed">{plan.desc}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="text-[13px] text-ink2 pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-green before:text-[12px] before:font-semibold">{f}</li>
                  ))}
                </ul>
                <a href="#form" className={`block text-center font-mono text-[12px] font-medium py-2.5 border-[1.5px] border-ink rounded-full transition-colors mt-auto ${plan.featured ? 'bg-ink text-white hover:bg-ink2' : 'text-ink hover:bg-ink hover:text-white'}`}>
                  solicitar
                </a>
              </div>
            ))}
          </div>
          <p className="font-mono text-[12px] text-ink3 mt-4 text-center">Cada sistema se adapta al flujo y contexto de tu negocio.</p>
        </section>

        {/* FORM */}
        <section id="form" className="max-w-4xl mx-auto px-6 py-16">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">contacto</p>
            <h2 className="font-serif text-[clamp(26px,4vw,38px)] tracking-tight leading-tight mb-3">
              Cuéntame qué<br /><em>necesitas.</em>
            </h2>
            <p className="text-ink2 font-light text-[15px] mb-7">Te propongo la estructura ideal para tu caso y recibirás respuesta en menos de 24 horas.</p>

            {status === 'success' ? (
              <div className="py-12 text-center">
                <p className="font-serif text-[28px] tracking-tight mb-3">Recibido, {form.nombre}.</p>
                <p className="text-ink2 text-[14px] font-mono leading-relaxed">
                  Revisaré tu caso y te escribo en menos de 24 horas.<br />
                  Revisa tu bandeja — ya te envié una confirmación.
                </p>
              </div>
            ) : (
              <div ref={formRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Honeypot */}
                <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                  <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">nombre *</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" className={inputClass('nombre')} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" autoComplete="email" className={inputClass('email')} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">teléfono</label>
                  <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+52 000 000 0000" autoComplete="tel" className={inputClass('telefono')} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">tipo de negocio *</label>
                  <select name="tipo_negocio" value={form.tipo_negocio} onChange={handleChange} className={inputClass('tipo_negocio')} style={{ WebkitAppearance: 'none' }}>
                    <option value="">Seleccionar...</option>
                    <option>E-commerce / tienda online</option>
                    <option>Servicios profesionales</option>
                    <option>Agencia / consultoría</option>
                    <option>SaaS / producto digital</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">qué necesitas *</label>
                  <select name="que_necesitas" value={form.que_necesitas} onChange={handleChange} className={inputClass('que_necesitas')} style={{ WebkitAppearance: 'none' }}>
                    <option value="">Seleccionar...</option>
                    <option>Captación y automatización de leads</option>
                    <option>CRM + seguimiento automático</option>
                    <option>Sistema completo end-to-end</option>
                    <option>Revisión / mejora de sistema existente</option>
                    <option>Todavía no tengo claro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink3">mensaje</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="Cuéntame brevemente dónde está el problema y qué resultado buscas..." rows={4} className="w-full font-sans text-sm px-3.5 py-3 rounded-lg border border-line outline-none transition-colors bg-white text-ink focus:border-ink resize-vertical" />
                </div>

                <div className="sm:col-span-2 mt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="w-full font-mono text-[13px] font-medium py-3.5 bg-ink text-white rounded-full border-none cursor-pointer hover:bg-ink2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? '→ enviando...' : '→ enviar y comenzar'}
                  </button>
                  <p className={`font-mono text-[12px] text-center mt-3 ${status === 'error' && Object.keys(errors).length > 0 ? 'text-red-400' : 'text-ink3'}`}>
                    {status === 'error' && Object.keys(errors).length > 0
                      ? '⚠ Completa los campos obligatorios.'
                      : status === 'error'
                      ? '✕ Hubo un error. Intenta de nuevo.'
                      : 'Respuesta y propuesta inicial en menos de 24 horas.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CLOSING */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-line">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12">
            <div className="flex-shrink-0">
              <Image src="/foto-perfil.png" alt="Armando — byklai.com" width={100} height={100} className="rounded-full object-cover border-2 border-line" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] tracking-tight leading-tight mb-3">
                Si sigues gestionando leads manualmente, estás dejando dinero sobre la mesa.
              </h2>
              <p className="text-[15px] text-ink2 font-light leading-relaxed mb-6">
                Un sistema bien conectado no solo ahorra tiempo. Hace que tu negocio funcione mejor desde el primer contacto.
              </p>
              <a href="#form" className="inline-block font-mono text-[13px] font-medium px-7 py-3.5 bg-ink text-white rounded-full border-[1.5px] border-ink hover:bg-ink2 transition-colors">
                → solicitar mi sistema
              </a>
              <div className="font-mono text-[12px] text-ink3 mt-5">
                <strong className="block text-[13px] text-ink mb-0.5">Armando</strong>
                byklai.com — sistemas automatizados · Mérida, México
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-line py-6">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap">
            <Image src="/logo-byklai_TN.png" alt="byklai.com" width={100} height={27} className="opacity-60" />
            <span className="font-mono text-[12px] text-ink3">© 2026 byklai.com — sistemas automatizados</span>
            <span className="font-mono text-[12px] text-ink3">Next.js + n8n + Resend</span>
          </div>
        </footer>

      </div>
    </>
  )
}
