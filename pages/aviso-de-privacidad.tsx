import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function AvisoDePrivacidad() {
  return (
    <>
      <Head>
        <title>Aviso de Privacidad · BYKLAI</title>
        <meta name="description" content="Aviso de privacidad de byklai.com — qué datos recopilamos, para qué los usamos y cómo ejercer tus derechos ARCO." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div style={{ fontFamily: "'Outfit', sans-serif" }} className="min-h-screen">
        <header className="border-b border-white/10 bg-[#0b0a08] sticky top-0 z-10">
          <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo-byklai-nuevo.svg" alt="BYKLAI" width={110} height={32} style={{ height: 32, width: 'auto' }} />
            </Link>
            <Link href="/" className="font-mono text-xs uppercase tracking-wider text-[#cfcac0] hover:text-white transition-colors duration-200">
              ← volver
            </Link>
          </div>
        </header>

        <main id="main" className="max-w-[720px] mx-auto px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-3">Legal · BYKLAI</p>
          <h1 className="font-serif text-[clamp(28px,4vw,42px)] tracking-tight leading-tight mb-2">Aviso de Privacidad</h1>
          <p className="font-mono text-sm text-ink3 mb-12">Última actualización: 5 de noviembre de 2026 · Versión 1.0</p>

          <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-ink2">
            <section>
              <h2 className="font-serif text-xl text-ink mb-3">1. Responsable del tratamiento</h2>
              <p>
                BYKLAI (&quot;nosotros&quot;, &quot;la empresa&quot; o &quot;el responsable&quot;) es un estudio de sistemas digitales con sede en
                Mérida, Yucatán, México, operador del sitio byklai.com. Para dudas sobre el tratamiento de tus datos escríbenos a{' '}
                <a href="mailto:hola@byklai.com" className="text-accent-ink underline">
                  hola@byklai.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">2. Datos que recopilamos</h2>
              <p className="mb-2">Recopilamos únicamente los datos que nos das al llenar el formulario de diagnóstico del sitio:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>
                  <strong>Datos de contacto:</strong> nombre, correo electrónico y, si lo compartes, tu WhatsApp o teléfono.
                </li>
                <li>
                  <strong>Datos de tu negocio:</strong> tipo de negocio, qué te gustaría resolver, y el mensaje que nos escribas.
                </li>
                <li>
                  <strong>Interés en forma de pago:</strong> si marcas la casilla de meses sin intereses, registramos esa preferencia.
                </li>
                <li>
                  <strong>Datos de navegación:</strong> registros técnicos básicos de acceso (dirección IP, tipo de dispositivo) que nuestro proveedor de
                  hosting (Vercel) puede generar como parte normal de operar el sitio. No usamos cookies de publicidad ni de rastreo de terceros.
                </li>
              </ul>
              <p className="mt-2">No recopilamos datos personales sensibles ni datos de pago — la instalación y mensualidad se cotizan y facturan directamente, fuera del sitio.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">3. Finalidades del tratamiento</h2>
              <p className="mb-2">
                <strong>Primarias</strong> (necesarias para atenderte):
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Darte seguimiento a tu solicitud de diagnóstico gratuito.</li>
                <li>Responder tus preguntas por correo o WhatsApp.</li>
                <li>Preparar una propuesta si decides avanzar.</li>
              </ul>
              <p className="mb-2">
                <strong>Secundarias</strong> (puedes oponerte sin afectar tu solicitud):
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Enviarte correos de seguimiento relacionados con tu solicitud.</li>
                <li>Estadísticas internas para mejorar el sitio y el servicio.</li>
              </ul>
              <p className="mt-2">
                Para oponerte a las finalidades secundarias escríbenos a{' '}
                <a href="mailto:hola@byklai.com" className="text-accent-ink underline">
                  hola@byklai.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">4. Base legal del tratamiento</h2>
              <p>Tratamos tus datos con base en tu consentimiento, otorgado al completar el formulario del sitio o al escribirnos por WhatsApp.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">5. Compartición y transferencia de datos</h2>
              <p className="mb-2">Compartimos datos únicamente con proveedores necesarios para operar, y solo para las finalidades descritas:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>
                  <strong>Google Sheets:</strong> registro interno de tu solicitud (nuestro CRM).
                </li>
                <li>
                  <strong>Resend:</strong> proveedor de envío de correo, usado para confirmar tu solicitud y dar seguimiento.
                </li>
                <li>
                  <strong>Vercel:</strong> hosting del sitio; puede registrar logs técnicos de acceso.
                </li>
                <li>
                  <strong>n8n (infraestructura propia):</strong> automatización interna que conecta los servicios anteriores; no es un tercero con acceso
                  independiente a tus datos.
                </li>
                <li>
                  <strong>WhatsApp (Meta):</strong> si nos escribes por el enlace de WhatsApp, esa conversación corre directo en tu aplicación de WhatsApp,
                  sujeta a la{' '}
                  <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-ink underline">
                    Política de Privacidad de WhatsApp
                  </a>
                  .
                </li>
              </ul>
              <p className="mt-2">No vendemos, alquilamos ni cedemos tus datos personales a terceros con fines comerciales propios.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">6. Conservación de datos</h2>
              <p>
                Conservamos tus datos mientras mantengas una relación activa con nosotros o mientras exista una posibilidad razonable de retomar contacto
                comercial. Puedes solicitar su eliminación en cualquier momento, salvo cuando deban conservarse por obligación legal.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">7. Tus derechos (ARCO)</h2>
              <p>
                Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), tienes derecho a Acceder, Rectificar,
                Cancelar tus datos u Oponerte a su tratamiento. Para ejercerlos escríbenos a{' '}
                <a href="mailto:hola@byklai.com" className="text-accent-ink underline">
                  hola@byklai.com
                </a>{' '}
                con asunto &quot;Derechos ARCO&quot;, indicando tu nombre, un medio de contacto, copia de una identificación y la descripción de tu
                solicitud. Respondemos en un máximo de 20 días hábiles.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">8. Cookies y tecnologías similares</h2>
              <p>
                Actualmente byklai.com no utiliza cookies de publicidad ni de rastreo de terceros. Si en el futuro incorporamos analítica o remarketing,
                actualizaremos este aviso antes de activarlas.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">9. Cambios a este aviso</h2>
              <p>
                Podemos actualizar este aviso para reflejar cambios legales o en nuestros servicios. Publicaremos siempre la versión vigente con su fecha de
                actualización en esta misma página.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-ink mb-3">10. INAI</h2>
              <p>
                Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir al{' '}
                <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-accent-ink underline">
                  INAI
                </a>
                .
              </p>
            </section>
          </div>
        </main>

        <footer className="border-t border-line py-6">
          <div className="max-w-[720px] mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-ink3">© 2026 byklai.com</span>
            <Link href="/#diagnostico" className="font-mono text-xs text-accent-ink hover:underline">
              Volver al diagnóstico →
            </Link>
          </div>
        </footer>
      </div>
    </>
  )
}
