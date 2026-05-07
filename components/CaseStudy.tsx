// components/CaseStudy.tsx
// Sección de caso de estudio — Pekmex Is Life
// Reemplaza la sección anterior del caso Pekmex en index.tsx

export default function CaseStudy() {
  return (
    <section className="section" id="caso-pekmex">
      <div className="wrap">
        <div className="section-label">proyecto real</div>
        <h2 className="section-title">
          Sistema implementado, no
          <br />
          <em>solo diseñado.</em>
        </h2>

        <div className="case-card">
          {/* ── HEADER ── */}
          <div className="case-header">
            <span className="case-tag">caso de estudio · 2026</span>
            <h3>Pekmex Is Life</h3>
            <p className="case-year">
              Mérida, México — fundada por Armando Medina Vázquez
            </p>
            <p className="case-desc">
              Rediseño editorial completo de una casa editorial pet brand.
              Identidad, sistema de diseño, arquitectura web y automatización —
              construidos desde cero.
            </p>
          </div>

          {/* ── DIAGNÓSTICO ── */}
          <div className="case-diag">
            <p className="case-diag-label">diagnóstico inicial</p>
            <p>
              Sitio con identidad visual inconsistente, arquitectura de páginas
              sin jerarquía editorial, componentes sin sistema de diseño
              unificado y contenido desconectado del CMS.
            </p>
          </div>

          {/* ── PILARES ── */}
          <div className="case-pillars">
            <div className="pillar">
              <p className="pillar-label">estrategia editorial</p>
              <strong>ADN de marca definido</strong>
              <p>
                Filosofía, voces narrativas, buyer persona, jerarquía editorial
                y arquitectura de URLs. Decisiones de branding cerradas y no
                negociables.
              </p>
            </div>
            <div className="pillar">
              <p className="pillar-label">sistema visual</p>
              <strong>Design system completo</strong>
              <p>
                Paleta oficial, tipografía editorial (Lora + DM Sans), escala
                de espaciado, tokens CSS y sistema documentado y aplicado.
              </p>
            </div>
            <div className="pillar">
              <p className="pillar-label">arquitectura web</p>
              <strong>9 páginas blueprinteadas</strong>
              <p>
                Home, 3 sublandings de personaje, franquicia Ella &amp; Yo,
                tienda, blog, template de artículo y página de comunidad
                (Manada).
              </p>
            </div>
          </div>

          {/* ── IMPLEMENTACIÓN TÉCNICA ── */}
          <div className="case-deliverables">
            <p className="section-label">implementación técnica</p>
            <div className="del-grid">
              <div className="del-item">
                <strong>Componentes + CMS</strong>
                <span>
                  Librería reutilizable en Next.js. Schema de Sanity con campos
                  editoriales, block types extendidos y queries optimizadas.
                </span>
              </div>
              <div className="del-item">
                <strong>Automatización n8n</strong>
                <span>
                  Formularios de captura conectados a n8n. Flujos activos desde
                  el primer contacto sin intervención manual.
                </span>
              </div>
              <div className="del-item">
                <strong>Stripe Payment Links</strong>
                <span>
                  Integración de pagos sin plataforma externa. Confirmaciones
                  automáticas conectadas al sistema.
                </span>
              </div>
              <div className="del-item">
                <strong>SEO + rendimiento</strong>
                <span>
                  Schema.org implementado, metadata dinámica, AEO via excerpts,
                  sitemap activo y optimización de assets.
                </span>
              </div>
            </div>
          </div>

          {/* ── STACK ── */}
          <div className="case-stack">
            <p className="stack-label">stack</p>
            <div className="chips">
              {[
                "Next.js App Router",
                "Sanity CMS",
                "n8n",
                "Stripe",
                "Vercel",
                "Lora + DM Sans",
                "Schema.org",
                "DNS / dominios",
              ].map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ── AUDITORÍA LIGHTHOUSE ── */}
          <div className="case-lighthouse">
            <p className="section-label">
              auditoría lighthouse · mayo 2026
            </p>
            <p className="lighthouse-intro">
              Tras el deployment profesional de pekmexlife.com en Vercel con
              Next.js App Router, los resultados superaron los estándares de la
              industria.
            </p>

            <div className="lh-grid">
              {/* Mobile */}
              <div className="lh-group">
                <p className="lh-group-label">mobile</p>
                <div className="lh-scores">
                  <div className="lh-score lh-green">
                    <span className="lh-num">96</span>
                    <span className="lh-desc">Performance</span>
                  </div>
                  <div className="lh-score lh-green">
                    <span className="lh-num">94</span>
                    <span className="lh-desc">Accessibility</span>
                  </div>
                  <div className="lh-score lh-perfect">
                    <span className="lh-num">100</span>
                    <span className="lh-desc">Best Practices</span>
                  </div>
                  <div className="lh-score lh-perfect">
                    <span className="lh-num">100</span>
                    <span className="lh-desc">SEO</span>
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div className="lh-group">
                <p className="lh-group-label">desktop</p>
                <div className="lh-scores">
                  <div className="lh-score lh-perfect">
                    <span className="lh-num">100</span>
                    <span className="lh-desc">Best Practices</span>
                  </div>
                  <div className="lh-score lh-perfect">
                    <span className="lh-num">100</span>
                    <span className="lh-desc">SEO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="cwv-block">
              <p className="lh-group-label">
                core web vitals — todas las métricas en verde
              </p>
              <div className="cwv-grid">
                <div className="cwv-item">
                  <span className="cwv-val">1.9s</span>
                  <span className="cwv-label">First Contentful Paint</span>
                </div>
                <div className="cwv-item">
                  <span className="cwv-val">2.5s</span>
                  <span className="cwv-label">Largest Contentful Paint</span>
                </div>
                <div className="cwv-item">
                  <span className="cwv-val">0ms</span>
                  <span className="cwv-label">Total Blocking Time</span>
                </div>
                <div className="cwv-item">
                  <span className="cwv-val">0</span>
                  <span className="cwv-label">Cumulative Layout Shift</span>
                </div>
                <div className="cwv-item">
                  <span className="cwv-val">1.9s</span>
                  <span className="cwv-label">Speed Index</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RESULTADO ── */}
          <div className="case-result">
            <p className="result-label">resultado</p>
            <p>
              Sitio editorial funcional, con identidad coherente, sistema de
              diseño documentado y replicable, y arquitectura preparada para
              escalar con nuevas colecciones, Pekmex TV y página de fundación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
