import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useReveal } from '../lib/useReveal'

// Promoción de 6 MSI — vigente hasta esta fecha (23:59 America/Merida). Pasado eso, la franja se oculta sola.
const PROMO_MSI_HASTA = new Date('2026-12-31T23:59:59-06:00')
const WHATSAPP_URL = 'https://wa.me/529994092332?text=Hola%2C%20quiero%20agendar%20el%20diagn%C3%B3stico%20gratis%20de%20BYKLAI'

interface FormData {
  nombre: string
  email: string
  telefono: string
  tipo_negocio: string
  que_necesitas: string
  interes_meses: string
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

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`${revealClass} ${className}`}>
      {children}
    </div>
  )
}

function FloatingCTA({ afterId }: { afterId: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById(afterId)
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { rootMargin: '-10% 0px 0px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [afterId])

  return (
    <a
      href="#diagnostico"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`hidden lg:inline-flex fixed bottom-7 right-7 z-40 items-center gap-2 min-h-[48px] px-6 bg-accent text-[#0b0a08] rounded-full font-mono text-[13px] font-semibold shadow-[0_12px_40px_rgba(224,138,0,0.35)] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      Diagnóstico gratis →
    </a>
  )
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipo_negocio: '',
    que_necesitas: '',
    interes_meses: '',
    mensaje: '',
    website: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [menuOpen, setMenuOpen] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const promoVigente = new Date() <= PROMO_MSI_HASTA

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
          interes_meses: form.interes_meses,
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
    `w-full font-sans text-sm px-3.5 py-3 rounded-xl border outline-none transition-colors duration-200 bg-white text-[#121110] min-h-[48px] ${
      errors[field] ? 'border-red-400' : 'border-[rgba(0,0,0,0.45)] focus:border-[#121110]'
    }`

  const navLinks = [
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#sistemas', label: 'Sistemas' },
    { href: '#inmobiliarias', label: 'Inmobiliarias' },
    { href: '#casos', label: 'Casos' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <>
      <Head>
        <title>BYKLAI · Sistemas de captación y seguimiento con IA</title>
        <meta
          name="description"
          content="Construimos el sistema que registra cada contacto, le responde en minutos y le da seguimiento hasta que tu equipo cierra. Página, CRM, WhatsApp con IA y correo, conectados. Mérida, México."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="BYKLAI · Sistemas de captación y seguimiento con IA" />
        <meta property="og:description" content="Que no se te escapen los clientes que ya te escribieron. Página, CRM, WhatsApp con IA y correo, conectados." />
        <meta property="og:url" content="https://www.byklai.com" />
        <meta property="og:site_name" content="BYKLAI" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'BYKLAI',
              alternateName: 'BYKLAI — Sistemas de captación y seguimiento con IA',
              url: 'https://www.byklai.com',
              logo: 'https://www.byklai.com/logo-byklai-nuevo.svg',
              description:
                'BYKLAI es un estudio de sistemas digitales en Mérida, México, fundado por Armando Medina Vázquez. Diseña e implementa sistemas de captación y seguimiento con IA: landing, CRM, WhatsApp con IA y correo, conectados.',
              founder: {
                '@type': 'Person',
                name: 'Armando Medina Vázquez',
                jobTitle: 'Fundador',
                url: 'https://www.byklai.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mérida',
                addressRegion: 'Yucatán',
                postalCode: '97000',
                addressCountry: 'MX',
              },
              areaServed: [
                { '@type': 'Country', name: 'México' },
                { '@type': 'AdministrativeArea', name: 'LATAM' },
              ],
              sameAs: ['https://byklai.com', 'https://bif.byklai.com', 'https://www.instagram.com/byklai_com'],
            }),
          }}
        />
      </Head>

      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      <div style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* NAV */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(11,10,8,0.92)] backdrop-blur-sm">
          <nav aria-label="Principal" className="max-w-[1240px] mx-auto px-6 py-[18px] flex flex-wrap items-center justify-between gap-4">
            <a href="#inicio" className="flex items-center shrink-0">
              <Image src="/logo-byklai-nuevo.svg" alt="BYKLAI" width={116} height={34} style={{ height: 34, width: 'auto' }} priority />
            </a>

            <div className="hidden md:flex flex-wrap items-center gap-7 font-mono text-[13px] tracking-[0.08em] uppercase">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="text-[#cfcac0] no-underline hover:text-white transition-colors duration-200">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-[18px] border-[1.5px] border-white/25 rounded-full text-[#f4f1ea] no-underline text-sm font-medium hover:border-white/50 hover:bg-white/5 transition-colors duration-200"
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5h16v10H9l-5 4z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="#diagnostico"
                className="inline-flex items-center min-h-[44px] px-[22px] bg-accent text-[#0b0a08] rounded-full no-underline text-sm font-semibold hover:bg-[#f3a72e] transition-colors duration-200"
              >
                Diagnóstico gratis
              </a>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 border border-white/25 rounded-full text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </nav>

          {menuOpen && (
            <div id="mobile-menu" className="md:hidden border-t border-white/10 bg-[#0b0a08] px-6 py-5 flex flex-col gap-4">
              {navLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-[13px] uppercase tracking-wider text-[#cfcac0] py-2 min-h-[44px] flex items-center"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 border-[1.5px] border-white/25 rounded-full text-white no-underline text-sm font-medium"
              >
                WhatsApp
              </a>
              <a
                href="#diagnostico"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center min-h-[48px] px-5 bg-accent text-[#0b0a08] rounded-full no-underline text-sm font-semibold"
              >
                Diagnóstico gratis
              </a>
            </div>
          )}
        </header>

        <main id="main">
          {/* HERO */}
          <section
            id="inicio"
            className="relative"
            style={{
              background:
                'radial-gradient(900px 620px at 78% 55%, rgba(224,138,0,0.22), rgba(224,138,0,0) 62%), linear-gradient(160deg, #18130c 0%, #0d0c0a 48%, #080808 100%)',
              color: '#f4f1ea',
            }}
          >
            <div className="max-w-[1240px] mx-auto px-6 pt-20 pb-16 sm:pt-24 sm:pb-[72px] flex flex-wrap items-center gap-14">
              <div className="flex-1 min-w-0 basis-[520px]">
                <p className="m-0 mb-7 inline-flex items-center gap-2.5 font-mono text-[13px] tracking-[0.2em] uppercase text-accent">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent inline-block shadow-[0_0_14px_#E08A00]" />
                  Sistemas de captación y seguimiento con IA
                </p>
                <h1 className="m-0 font-serif font-normal text-[clamp(40px,6.2vw,92px)] leading-[0.98] tracking-[-0.025em] text-white">
                  Tu negocio capta clientes. <span className="text-accent">Que no se te escapen.</span>
                </h1>
                <p className="mt-8 mb-0 max-w-[560px] text-[21px] leading-[1.55] font-light text-[#d9d5cc]">
                  Construimos el sistema que registra cada contacto, le responde en minutos y le da seguimiento hasta que tu equipo cierra. Página, CRM,
                  WhatsApp con IA y correo, conectados.
                </p>
                <div className="mt-10 flex flex-wrap gap-3.5">
                  <a
                    href="#diagnostico"
                    className="inline-flex items-center gap-2.5 min-h-[56px] px-[30px] bg-accent text-[#0b0a08] rounded-full no-underline text-[17px] font-semibold shadow-[0_12px_50px_rgba(224,138,0,0.35)] hover:bg-[#f3a72e] transition-colors duration-200"
                  >
                    Diagnóstico de 30 min, gratis <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href="#como-funciona"
                    className="inline-flex items-center min-h-[56px] px-[26px] border-[1.5px] border-white/25 text-[#f4f1ea] rounded-full no-underline text-base hover:border-white/50 hover:bg-white/5 transition-colors duration-200"
                  >
                    Ver cómo funciona
                  </a>
                </div>
                <p className="mt-[22px] mb-0 font-mono text-[13px] text-[#a8a297] tracking-[0.04em]">
                  {promoVigente ? 'Hasta 6 meses sin intereses con tarjeta · ' : ''}Mérida, México
                </p>
              </div>

              {/* Escena: mensajes que se enfrían */}
              <div aria-hidden="true" className="flex-1 min-w-0 basis-[460px] relative h-[420px] sm:h-[560px]">
                <div className="absolute left-[4%] top-[30px] w-[84%] rounded-[26px] p-6 bg-gradient-to-b from-[#1d1a15] to-[#141210] border border-white/[0.07] rotate-3 opacity-45">
                  <div className="flex items-center gap-3.5">
                    <span className="w-12 h-12 rounded-full bg-[#2e2921] flex items-center justify-center text-white font-medium">LC</span>
                    <strong className="font-medium text-xl">Laura C.</strong>
                    <span className="ml-auto font-mono text-[13px] text-[#8f8a80]">AYER</span>
                  </div>
                  <p className="mt-3.5 mb-0 text-[19px] font-light text-[#d9d5cc]">¿Me mandas precios y disponibilidad?</p>
                </div>
                <div className="absolute left-0 top-[100px] sm:top-[168px] w-[86%] rounded-[26px] p-6 bg-gradient-to-b from-[#1d1a15] to-[#141210] border border-white/[0.07] -rotate-2 opacity-70">
                  <div className="flex items-center gap-3.5">
                    <span className="w-12 h-12 rounded-full bg-[#2e2921] flex items-center justify-center text-white font-medium">JR</span>
                    <strong className="font-medium text-xl">Jorge R.</strong>
                    <span className="ml-auto font-mono text-[13px] text-[#8f8a80]">HACE 5 H</span>
                  </div>
                  <p className="mt-3.5 mb-0 text-[19px] font-light text-[#d9d5cc]">Me interesa, ¿podemos agendar una visita?</p>
                  <span className="inline-block mt-3.5 px-3.5 py-1.5 border-[1.5px] border-[#4a453d] rounded-full font-mono text-xs tracking-[0.14em] text-[#a8a297]">
                    SIN RESPUESTA
                  </span>
                </div>
                <div className="absolute left-[8%] top-[200px] sm:top-[330px] w-[86%] rounded-[26px] p-6 sm:p-7 bg-gradient-to-b from-[#221d15] to-[#16130f] border border-accent/35 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(224,138,0,0.15)] -rotate-1">
                  <div className="flex items-center gap-3.5">
                    <span className="w-12 h-12 rounded-full bg-[#3a3022] flex items-center justify-center text-white font-medium">MA</span>
                    <strong className="font-medium text-xl">María A.</strong>
                    <span className="ml-auto font-mono text-[13px] text-[#a8a297]">AHORA</span>
                  </div>
                  <p className="mt-3.5 mb-0 text-[19px] font-light text-[#f4f1ea]">Hola, ¿sigue disponible? Quisiera más información.</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-accent text-[#0b0a08] rounded-full font-mono text-xs tracking-[0.12em]">
                      ✓ RESPONDIDO
                    </span>
                    <span className="inline-flex items-center px-3.5 py-[7px] border-[1.5px] border-accent/60 text-[#f3c47a] rounded-full font-mono text-xs tracking-[0.12em]">
                      EN CRM · SEGUIMIENTO ACTIVO
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex absolute right-0 top-[60px] w-32 h-32 rounded-full border-[3px] border-accent bg-[rgba(11,10,8,0.7)] shadow-[0_0_70px_rgba(224,138,0,0.3)] items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E08A00" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5V12l3 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Prueba viva */}
            <div className="border-t border-white/10">
              <div className="max-w-[1240px] mx-auto px-6 py-[34px] flex flex-wrap items-center gap-x-14 gap-y-7">
                <p className="m-0 shrink-0 font-mono text-xs tracking-[0.2em] uppercase text-[#a8a297]">Prueba viva · nuestro portal BIF™</p>
                <div className="flex flex-wrap gap-x-14 gap-y-6 flex-1 basis-[600px]">
                  <div>
                    <p className="m-0 font-serif text-[44px] leading-none text-accent">91%</p>
                    <p className="mt-1.5 mb-0 text-sm text-[#cfcac0]">apertura en su seguimiento por correo</p>
                  </div>
                  <div>
                    <p className="m-0 font-serif text-[44px] leading-none text-accent">63</p>
                    <p className="mt-1.5 mb-0 text-sm text-[#cfcac0]">artículos publicados</p>
                  </div>
                  <div>
                    <p className="m-0 font-serif text-[44px] leading-none text-accent">10</p>
                    <p className="mt-1.5 mb-0 text-sm text-[#cfcac0]">agentes de IA operando</p>
                  </div>
                  <div>
                    <p className="m-0 font-serif text-[26px] sm:text-[30px] leading-[1.45] text-accent">Citado por Google IA</p>
                    <p className="mt-1.5 mb-0 text-sm text-[#cfcac0]">en su modo de respuestas · artículo de BIF™, 05-oct-2026</p>
                  </div>
                </div>
              </div>
              <p className="max-w-[1240px] mx-auto px-6 pb-[26px] font-mono text-xs text-[#8f8a80]">
                Datos propios del BIF™ · Resend 19-oct-2026 (91% grupo A / 82.5% grupo B) · Sanity 05-nov-2026 (63 artículos) · 10 agentes, conteo interno
                25-oct-2026 · Google 05-oct-2026
              </p>
            </div>
          </section>

          {/* PROBLEMA */}
          <Reveal>
            <section
              className="text-[#121110]"
              style={{ background: 'linear-gradient(170deg, #fbf7ef 0%, #f3ede1 100%)' }}
            >
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px]">
                <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent-ink">El problema</p>
                <h2 className="m-0 max-w-[820px] font-serif font-normal text-[clamp(32px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em]">
                  No te faltan clientes. <span className="text-accent-ink">Te falta que nadie se quede sin respuesta.</span>
                </h2>
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { n: '01', title: 'Te escriben por todos lados', desc: 'WhatsApp, tu página, Instagram, una llamada. Cada canal es una libreta distinta.' },
                    { n: '02', title: 'Contestas tarde', desc: 'Mientras esperas, el cliente sigue buscando y alguien más le responde primero.' },
                    { n: '03', title: 'El seguimiento depende de tu memoria', desc: 'Sin registro ni plan, los prospectos se enfrían sin que nadie lo note.' },
                  ].map(item => (
                    <div key={item.n} className="bg-white border border-black/[0.08] rounded-[22px] p-[30px] transition-shadow duration-200 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                      <p className="m-0 font-serif text-[52px] leading-none text-accent-ink">{item.n}</p>
                      <h3 className="mt-[18px] mb-2 text-[22px] font-medium">{item.title}</h3>
                      <p className="m-0 text-base leading-[1.55] text-[#3b3935]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* COMO FUNCIONA */}
          <Reveal>
            <section
              id="como-funciona"
              style={{ background: 'radial-gradient(800px 500px at 15% 80%, rgba(224,138,0,0.16), rgba(224,138,0,0) 60%), #0d0c0a', color: '#f4f1ea' }}
            >
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px]">
                <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent">Cómo funciona</p>
                <h2 className="m-0 max-w-[860px] font-serif font-normal text-[clamp(32px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em] text-white">
                  Un sistema, <span className="text-accent">no piezas sueltas.</span>
                </h2>
                <p className="mt-[22px] mb-0 max-w-[620px] text-[19px] leading-[1.55] font-light text-[#d9d5cc]">
                  Cada contacto sigue el mismo camino, a cualquier hora, sin que alguien tenga que acordarse.
                </p>
                <ol className="list-none m-0 mt-[52px] p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { step: 'PASO 1', title: 'Te escribe', desc: 'Por tu página, WhatsApp o redes.' },
                    { step: 'PASO 2', title: 'Queda en tu CRM', desc: 'Un solo registro, con qué busca y en qué etapa va.' },
                    { step: 'PASO 3', title: 'Respuesta en minutos', desc: 'Por correo o con un asistente de WhatsApp con IA.' },
                    { step: 'PASO 4', title: 'Seguimiento automático', desc: 'Una secuencia corta, con reglas para dejar de escribir.' },
                  ].map(s => (
                    <li
                      key={s.step}
                      className="border-[1.5px] border-accent/55 rounded-[20px] p-[26px] bg-accent/5 transition-colors duration-200 hover:bg-accent/10"
                    >
                      <p className="m-0 font-mono text-[13px] text-accent tracking-[0.14em]">{s.step}</p>
                      <p className="mt-3.5 mb-1.5 text-[21px] font-medium">{s.title}</p>
                      <p className="m-0 text-[15px] leading-[1.5] text-[#cfcac0]">{s.desc}</p>
                    </li>
                  ))}
                  <li className="rounded-[20px] p-[26px] bg-accent text-[#0b0a08] shadow-[0_0_60px_rgba(224,138,0,0.35)]">
                    <p className="m-0 font-mono text-[13px] tracking-[0.14em]">PASO 5</p>
                    <p className="mt-3.5 mb-1.5 text-[21px] font-semibold">Tu equipo cierra</p>
                    <p className="m-0 text-[15px] leading-[1.5]">Con aviso y los datos completos del prospecto.</p>
                  </li>
                </ol>
              </div>
            </section>
          </Reveal>

          {/* SISTEMAS — precios de producción actual, SIN cambios (P5: propuesta no aprobada) */}
          <Reveal>
            <section id="sistemas" style={{ background: 'linear-gradient(170deg, #fbf7ef 0%, #f3ede1 100%)', color: '#121110' }}>
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px]">
                <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent-ink">Inversión</p>
                <h2 className="m-0 max-w-[860px] font-serif font-normal text-[clamp(32px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em]">
                  Sistemas completos, <span className="text-accent-ink">no servicios aislados.</span>
                </h2>
                <p className="mt-[22px] mb-0 max-w-[640px] text-[19px] leading-[1.55] font-light text-[#3b3935]">
                  Cada sistema se adapta al flujo y contexto de tu negocio. Precios en USD.
                </p>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
                  {[
                    {
                      name: 'Básico',
                      price: '$800',
                      featured: false,
                      desc: 'Para negocios que necesitan una base sólida de captación.',
                      features: ['Landing page optimizada', 'Formulario + webhook', 'Automatización inicial n8n', 'Deploy en Vercel'],
                    },
                    {
                      name: 'Completo',
                      price: '$1,200',
                      featured: true,
                      desc: 'Sistema end-to-end con CRM, emails y seguimiento automático.',
                      features: ['Todo lo del plan Básico', 'CRM integrado (Sheets / HubSpot)', 'Email automation con Resend', 'DNS + entregabilidad', 'Seguimiento automático'],
                    },
                    {
                      name: 'Avanzado',
                      price: '$1,800',
                      featured: false,
                      desc: 'Lógica personalizada y arquitectura preparada para escalar.',
                      features: ['Todo lo del plan Completo', 'Lógica condicional avanzada', 'Flujos de venta automatizados', 'Escalabilidad sin rehacer el sistema'],
                    },
                  ].map(plan => (
                    <div
                      key={plan.name}
                      className={`relative rounded-[24px] flex flex-col p-7 gap-4 transition-shadow duration-200 ${
                        plan.featured ? 'bg-[#0d0c0a] text-[#f4f1ea] border-2 border-accent shadow-[0_30px_80px_rgba(224,138,0,0.22)]' : 'bg-white border border-black/10 hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]'
                      }`}
                    >
                      {plan.featured && (
                        <span className="absolute -top-[15px] left-[34px] px-3.5 py-1.5 bg-accent text-[#0b0a08] rounded-full font-mono text-xs tracking-[0.14em]">
                          RECOMENDADO
                        </span>
                      )}
                      <p className={`m-0 font-mono text-sm tracking-[0.16em] uppercase ${plan.featured ? 'text-accent' : 'text-accent-ink'}`}>{plan.name}</p>
                      <p className={`m-0 text-[17px] leading-[1.5] ${plan.featured ? 'text-[#d9d5cc]' : 'text-[#3b3935]'}`}>{plan.desc}</p>
                      <div>
                        <p className="m-0 font-serif text-[40px] leading-none">
                          {plan.price}
                          <span className={`text-[13px] font-sans font-normal ml-1.5 align-top ${plan.featured ? 'text-[#b9b3a8]' : 'text-[#5a564f]'}`}>USD</span>
                        </p>
                        <p className={`mt-2 mb-0 font-mono text-[11px] ${plan.featured ? 'text-accent' : 'text-accent-ink'}`}>
                          {promoVigente ? 'o hasta 6 meses sin intereses' : ''}
                        </p>
                      </div>
                      <ul className={`m-0 p-0 list-none flex flex-col gap-2.5 flex-1 text-base ${plan.featured ? 'text-[#e9e5dd]' : 'text-[#2b2925]'}`}>
                        {plan.features.map(f => (
                          <li key={f}>✓ {f}</li>
                        ))}
                      </ul>
                      <a
                        href="#diagnostico"
                        className={`mt-auto flex items-center justify-center min-h-[50px] rounded-full no-underline font-medium transition-colors duration-200 ${
                          plan.featured
                            ? 'bg-accent text-[#0b0a08] hover:bg-[#f3a72e]'
                            : 'border-[1.5px] border-[#121110] text-[#121110] hover:bg-[#121110] hover:text-white'
                        }`}
                      >
                        Empezar con {plan.name}
                      </a>
                    </div>
                  ))}
                </div>

                {promoVigente && (
                  <div className="mt-6 rounded-[22px] p-6 sm:p-7 bg-[#0d0c0a] text-[#f4f1ea] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="m-0 font-serif text-[26px] sm:text-[28px] leading-[1.15]">
                        Paga tu sistema en <span className="text-accent">6 meses sin intereses.</span>
                      </p>
                      <p className="mt-1.5 mb-0 text-[15px] text-[#cfcac0]">
                        Con tarjeta de crédito vía Mercado Pago. Promoción de temporada, válida hasta el{' '}
                        {PROMO_MSI_HASTA.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Merida' })}.
                      </p>
                    </div>
                    <a
                      href="#diagnostico"
                      className="inline-flex items-center min-h-[48px] px-6 border-[1.5px] border-accent rounded-full text-[#f4f1ea] no-underline font-mono text-[13px] tracking-[0.08em] hover:bg-accent hover:text-[#0b0a08] transition-colors duration-200"
                    >
                      PREGUNTAR POR EL PLAN →
                    </a>
                  </div>
                )}
                <p className="mt-[18px] mb-0 text-[15px] text-[#5a564f]">
                  ¿Necesitas una plataforma completa, a la medida? Sistemas a la medida desde $9,300 USD, por propuesta.
                </p>
              </div>
            </section>
          </Reveal>

          {/* INMOBILIARIAS */}
          <Reveal>
            <section id="inmobiliarias" style={{ background: '#0b0a08' }}>
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px] flex flex-wrap gap-14 items-center">
                <div className="flex-1 min-w-0 basis-[420px] relative rounded-[28px] overflow-hidden h-[340px] sm:h-[560px] bg-[#1a1712]">
                  <Image
                    src="/mostrador.jpg"
                    alt="Mostrador vacío de un negocio cerrado con un teléfono que sigue recibiendo mensajes"
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 basis-[480px]">
                  <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent">Para inmobiliarias y brokers</p>
                  <h2 className="m-0 font-serif font-normal text-[clamp(32px,4.2vw,60px)] leading-[1.02] tracking-[-0.02em] text-white">
                    Cerraste a las 7. <span className="text-accent">Te siguieron escribiendo hasta las 11.</span>
                  </h2>
                  <p className="mt-6 mb-0 text-[19px] leading-[1.55] font-light text-[#d9d5cc]">
                    Portales, WhatsApp, llamadas y visitas: configuramos el sistema para el ritmo de una inmobiliaria.
                  </p>
                  <ul className="list-none m-0 mt-7 p-0 flex flex-col gap-3.5 text-[17px] text-[#ece8e0]">
                    {[
                      'Todos los interesados en un solo lugar, vengan del portal que vengan',
                      'Respuesta inmediata y agenda de visitas por WhatsApp',
                      'Seguimiento después de la visita, hasta que decide',
                    ].map(t => (
                      <li key={t} className="flex gap-3">
                        <span aria-hidden="true" className="text-accent">
                          ●
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-[34px] flex flex-wrap gap-3.5">
                    <a
                      href="https://demo.byklai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[52px] px-[26px] bg-accent text-[#0b0a08] rounded-full no-underline font-semibold hover:bg-[#f3a72e] transition-colors duration-200"
                    >
                      Ver la demo de un broker →
                    </a>
                  </div>
                  <p className="mt-[26px] mb-0 text-sm leading-[1.55] text-[#a8a297]">
                    Nuestro portal BIF™ trabaja del lado del comprador y no analiza ni recomienda propiedades de clientes de BYKLAI.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          {/* CASOS */}
          <Reveal>
            <section id="casos" style={{ background: 'linear-gradient(170deg, #fbf7ef 0%, #f3ede1 100%)', color: '#121110' }}>
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px]">
                <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent-ink">Casos</p>
                <h2 className="m-0 max-w-[860px] font-serif font-normal text-[clamp(32px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em]">
                  Lo usamos <span className="text-accent-ink">primero en casa.</span>
                </h2>
                <p className="mt-4 mb-0 max-w-[640px] text-base text-[#5a564f]">
                  Sin testimonios de clientes todavía — BYKLAI es nuevo. Esto es lo que ya construimos y operamos con nuestra propia marca.
                </p>
                <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <article
                    className="rounded-[26px] p-9 flex flex-col gap-[22px] text-[#f4f1ea]"
                    style={{ backgroundColor: '#0d0c0a', backgroundImage: 'radial-gradient(500px 300px at 90% 0%, rgba(224,138,0,0.22), rgba(224,138,0,0) 70%)' }}
                  >
                    <p className="m-0 font-mono text-[13px] tracking-[0.16em] text-accent">CASO · BIF™ · bif.byklai.com</p>
                    <h3 className="m-0 font-serif font-normal text-[32px] leading-[1.1]">Un portal inmobiliario operado con agentes de IA y supervisión humana</h3>
                    <div className="grid grid-cols-3 gap-3.5">
                      {[
                        ['91%', 'apertura del seguimiento'],
                        ['63', 'artículos'],
                        ['10', 'agentes'],
                      ].map(([n, l]) => (
                        <div key={l}>
                          <p className="m-0 font-serif text-4xl text-accent leading-none">{n}</p>
                          <p className="mt-1.5 mb-0 text-[13px] text-[#cfcac0]">{l}</p>
                        </div>
                      ))}
                    </div>
                    <p className="m-0 font-mono text-xs leading-[1.6] text-[#a8a297]">
                      Fuentes: apertura de correo de seguimiento, grupo A 91% y grupo B 82.5% (Resend, 19-oct-2026) · 63 artículos (Sanity, 05-nov-2026), 10
                      agentes (conteo interno, 25-oct-2026). Métricas de operación propia, no de clientes.
                    </p>
                    <a href="https://bif.byklai.com" target="_blank" rel="noopener noreferrer" className="mt-auto text-accent no-underline font-mono text-sm tracking-[0.06em] hover:opacity-70 transition-opacity duration-200">
                      Ver el sistema en producción →
                    </a>
                  </article>
                  <article className="bg-white border border-black/10 rounded-[26px] p-9 flex flex-col gap-[22px]">
                    <p className="m-0 font-mono text-[13px] tracking-[0.16em] text-accent-ink">CASO · PEKMEX IS LIFE</p>
                    <h3 className="m-0 font-serif font-normal text-[32px] leading-[1.1]">El mismo sistema, en otro sector</h3>
                    <p className="m-0 text-[17px] leading-[1.55] text-[#3b3935]">
                      Marca editorial de bienestar animal: identidad, sitio, CMS y automatización construidos desde cero.
                    </p>
                    <a href="https://pekmexlife.com" target="_blank" rel="noopener noreferrer" className="mt-auto text-accent-ink no-underline font-mono text-sm tracking-[0.06em] hover:opacity-70 transition-opacity duration-200">
                      Ver el sitio →
                    </a>
                  </article>
                </div>
              </div>
            </section>
          </Reveal>

          {/* DIAGNÓSTICO + FORM */}
          <div id="form" aria-hidden="true" className="relative -top-24" />
          <Reveal>
            <section
              id="diagnostico"
              style={{ background: 'radial-gradient(900px 600px at 80% 30%, rgba(224,138,0,0.2), rgba(224,138,0,0) 60%), linear-gradient(170deg, #15110b 0%, #0b0a08 60%)' }}
            >
              <div className="max-w-[1240px] mx-auto px-6 py-[72px] sm:py-[110px] flex flex-wrap gap-16">
                <div className="flex-1 min-w-0 basis-[460px]">
                  <p className="m-0 mb-[18px] font-mono text-[13px] tracking-[0.2em] uppercase text-accent">Empieza aquí</p>
                  <h2 className="m-0 font-serif font-normal text-[clamp(34px,4.6vw,68px)] leading-none tracking-[-0.02em] text-white">
                    Diagnóstico de <span className="text-accent">30 minutos, gratis.</span>
                  </h2>
                  <p className="mt-6 mb-0 text-[19px] leading-[1.55] font-light text-[#d9d5cc]">
                    Te decimos dónde se te escapan clientes y qué conviene automatizar primero. Sin compromiso.
                  </p>
                  <ol className="list-none m-0 mt-9 p-0 flex flex-col gap-3.5">
                    {[
                      'Diagnóstico: cómo te llegan hoy los clientes',
                      'Propuesta cerrada: alcance, fechas y precio por escrito',
                      'Montaje y pruebas con casos reales',
                      'Capacitación y medición de las primeras semanas',
                    ].map((t, i) => (
                      <li key={t} className="flex gap-4 items-baseline text-[17px] text-[#ece8e0]">
                        <span className="font-mono text-accent">{String(i + 1).padStart(2, '0')}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-10 flex items-center gap-[18px]">
                    <Image src="/armando.jpg" alt="Armando, fundador de BYKLAI" width={72} height={72} className="rounded-full object-cover border-2 border-accent" />
                    <div>
                      <p className="m-0 font-medium text-[17px] text-white">Armando</p>
                      <p className="mt-1 mb-0 text-sm text-[#b9b3a8]">Fundador · más de 10 años en ventas inmobiliarias en la península</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 basis-[440px] bg-[#f7f3eb] text-[#121110] rounded-[28px] p-7 sm:p-9 flex flex-col gap-4 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                  {status === 'success' ? (
                    <div className="py-6 text-center">
                      <p className="font-serif text-[28px] tracking-tight mb-4">Recibido, {form.nombre}.</p>
                      <p className="text-[#3b3935] text-sm leading-relaxed mb-6">Revisa tu bandeja — ya te enviamos una confirmación. Esto es lo que sigue:</p>
                      <ol className="list-none m-0 p-0 flex flex-col gap-3 text-left max-w-sm mx-auto">
                        {[
                          'Diagnóstico: cómo te llegan hoy los clientes',
                          'Propuesta cerrada: alcance, fechas y precio por escrito',
                          'Montaje y pruebas con casos reales',
                          'Capacitación y medición de las primeras semanas',
                        ].map((t, i) => (
                          <li key={t} className="flex gap-3 items-baseline text-sm text-[#3b3935]">
                            <span className="font-mono text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                            {t}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <>
                      <p className="m-0 mb-1 font-serif text-[28px] sm:text-[30px]">Agenda tu diagnóstico</p>

                      {/* Honeypot */}
                      <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                        <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                      </div>

                      <div ref={formRef} className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          Nombre
                          <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            placeholder="Tu nombre"
                            className={inputClass('nombre')}
                          />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          Email
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            inputMode="email"
                            placeholder="tu@correo.com"
                            className={inputClass('email')}
                          />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          WhatsApp o teléfono
                          <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+52 999 000 0000"
                            className={inputClass('telefono')}
                          />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          Tipo de negocio
                          <select name="tipo_negocio" value={form.tipo_negocio} onChange={handleChange} required className={inputClass('tipo_negocio')} style={{ WebkitAppearance: 'none' }}>
                            <option value="">Seleccionar...</option>
                            <option>Inmobiliaria o broker</option>
                            <option>Consultorio o clínica</option>
                            <option>Servicios profesionales</option>
                            <option>E-commerce / tienda online</option>
                            <option>Agencia / consultoría</option>
                            <option>Otro</option>
                          </select>
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          Qué te gustaría resolver
                          <select name="que_necesitas" value={form.que_necesitas} onChange={handleChange} required className={inputClass('que_necesitas')} style={{ WebkitAppearance: 'none' }}>
                            <option value="">Seleccionar...</option>
                            <option>Captación y automatización de leads</option>
                            <option>CRM + seguimiento automático</option>
                            <option>Sistema completo end-to-end</option>
                            <option>Revisión / mejora de sistema existente</option>
                            <option>Todavía no tengo claro</option>
                          </select>
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-medium">
                          Mensaje
                          <textarea
                            name="mensaje"
                            value={form.mensaje}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Cuéntanos cómo te llegan hoy los clientes"
                            className="w-full font-sans text-sm px-3.5 py-3 rounded-xl border border-[rgba(0,0,0,0.45)] outline-none transition-colors duration-200 bg-white text-[#121110] focus:border-[#121110] resize-vertical"
                          />
                        </label>

                        {promoVigente && (
                          <label className="flex items-center gap-2.5 text-sm">
                            <input type="checkbox" name="interes_meses_check" checked={form.interes_meses === 'Sí'} onChange={e => setForm(p => ({ ...p, interes_meses: e.target.checked ? 'Sí' : 'No' }))} className="w-5 h-5" />
                            Me interesa pagar a 6 meses sin intereses
                          </label>
                        )}

                        <p className="m-0 text-sm leading-[1.5] text-[#3b3935]">Te respondemos en un máximo de 24 horas. Sin compromiso.</p>

                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={status === 'loading'}
                          className="min-h-[54px] border-0 rounded-full bg-[#0d0c0a] text-white font-sans text-base font-semibold cursor-pointer hover:bg-[#1a1712] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {status === 'loading' ? 'Enviando...' : 'Agendar diagnóstico gratis →'}
                        </button>

                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-center text-sm text-accent-ink hover:opacity-70 transition-opacity duration-200">
                          o escríbenos por WhatsApp
                        </a>

                        <p className={`m-0 text-center text-xs ${status === 'error' ? 'text-red-500' : 'text-[#5a564f]'}`}>
                          {status === 'error' && Object.keys(errors).length > 0
                            ? 'Completa los campos obligatorios.'
                            : status === 'error'
                            ? 'Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.'
                            : (
                              <>
                                Usamos tus datos solo para contactarte ·{' '}
                                <Link href="/aviso-de-privacidad" className="text-accent-ink underline">
                                  Aviso de privacidad
                                </Link>
                              </>
                            )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-[#080807]">
          <div className="max-w-[1240px] mx-auto px-6 py-9 flex flex-wrap items-center justify-between gap-5">
            <Image src="/logo-byklai-nuevo.svg" alt="BYKLAI" width={102} height={30} style={{ height: 30, width: 'auto' }} />
            <p className="m-0 font-mono text-[13px] text-[#a8a297]">© 2026 byklai.com · Sistemas de captación y seguimiento · Mérida, México</p>
            <div className="flex flex-wrap gap-5 font-mono text-[13px] items-center">
              <a href="https://www.instagram.com/byklai_com" target="_blank" rel="noopener noreferrer" className="text-[#cfcac0] no-underline hover:text-white transition-colors duration-200 min-h-[44px] flex items-center">
                @byklai_com
              </a>
              <Link href="/blog" className="text-[#cfcac0] no-underline hover:text-white transition-colors duration-200 min-h-[44px] flex items-center">
                Blog
              </Link>
              <a
                href="#diagnostico"
                className="inline-flex items-center min-h-[44px] px-5 border-[1.5px] border-accent rounded-full text-accent no-underline font-medium hover:bg-accent hover:text-[#0b0a08] transition-colors duration-200"
              >
                Agenda tu diagnóstico
              </a>
            </div>
          </div>
        </footer>
      </div>

      <FloatingCTA afterId="inicio" />
    </>
  )
}
