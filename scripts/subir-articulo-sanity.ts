/**
 * Subir artículo a Sanity — BYKLAI (byklai.com/blog)
 * Lee un archivo de blog/articulos-generados/*.md (mismo formato SALIDA OBLIGATORIA
 * que el skill blog-writer-lite debe producir) y lo sube a Sanity como byklaiBlogPost
 * con `estado: pendiente` — Armando revisa, agrega coverImage y publica cambiando el
 * estado en Sanity Studio (https://byklai-blog.sanity.studio).
 *
 * Portado de byklai-realestate/scripts/subir-articulo-sanity.ts (BIF™), simplificado:
 * sin glosarioTermino, sin taxonomía BIF™ (pilar/cluster/esPillar/fase/canal_*), sin
 * statNumber/bisOrientativoBlock/riskFlagAlert (no existen en este schema). Mantiene
 * los 2 bugs ya corregidos en el parser original (ver parseInline): bold con link
 * anidado, y el fallback de componentes sin marcador en el body.
 * Dedupe contra SANITY directo, nunca Supabase — BYKLAI no duplica en Supabase
 * (ver colab/bandeja/PARA-CLAUDE-AI-2026-10-25-arq-blog-redes-lite-byklai.md §2).
 *
 * SEGURIDAD — igual que el original, nunca sube nada "a ciegas":
 *   1. DRY-RUN POR DEFECTO. Sin `--push`, solo parsea y escribe el documento Sanity
 *      resultante en output/sanity-dryrun-<slug>.json para revisar antes de escribir.
 *   2. VERIFICA DUPLICADO antes de crear — mismo slug ya en Sanity (cualquier
 *      estado) → aborta, no sube nada.
 *   3. Si el parser no puede extraer un campo obligatorio, falla fuerte.
 *
 * Uso:
 *   npx ts-node scripts/subir-articulo-sanity.ts blog/articulos-generados/ARCHIVO.md
 *   npx ts-node scripts/subir-articulo-sanity.ts blog/articulos-generados/ARCHIVO.md --push
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const PUSH = process.argv.includes('--push')
const archivoArg = process.argv.slice(2).find((a) => !a.startsWith('--'))

const REQUIRED_ENV = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_TOKEN'] as const

function validarEnv() {
  const faltantes = REQUIRED_ENV.filter((k) => !process.env[k])
  if (faltantes.length > 0) throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}`)
}

function key(): string {
  return crypto.randomBytes(6).toString('hex')
}

// ─────────────────────────────────────────────────────────────────────────
// Utilidades de parseo de texto plano con **bold** y [texto](href)
// ─────────────────────────────────────────────────────────────────────────

// Dos pasadas: primero separa **bold** del resto (sin tocar su contenido), luego
// parsea [..](..) y URLs sueltas DENTRO de cada segmento — así un link anidado en
// bold conserva ambas marcas en vez de que el bold se trague el markdown del link
// entero (bug real del script original, BIF™, 2026-10-20 — se porta ya corregido).
function parseInline(text: string): { children: any[]; markDefs: any[] } {
  const markDefs: any[] = []
  const children: any[] = []

  const boldRe = /\*\*([^*]+)\*\*/g
  const segmentos: { texto: string; bold: boolean }[] = []
  let last = 0
  let bm: RegExpExecArray | null
  while ((bm = boldRe.exec(text))) {
    if (bm.index > last) segmentos.push({ texto: text.slice(last, bm.index), bold: false })
    segmentos.push({ texto: bm[1], bold: true })
    last = boldRe.lastIndex
  }
  if (last < text.length) segmentos.push({ texto: text.slice(last), bold: false })
  if (segmentos.length === 0) segmentos.push({ texto: text, bold: false })

  const linkRe = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)/g
  for (const seg of segmentos) {
    const base = seg.bold ? ['strong'] : []
    let segLast = 0
    let lm: RegExpExecArray | null
    linkRe.lastIndex = 0
    while ((lm = linkRe.exec(seg.texto))) {
      if (lm.index > segLast) children.push(span(seg.texto.slice(segLast, lm.index), base))
      if (lm[1] !== undefined) {
        const mdKey = key()
        markDefs.push({ _key: mdKey, _type: 'link', href: lm[2], blank: lm[2].startsWith('http') })
        children.push(span(lm[1], [...base, mdKey]))
      } else if (lm[3] !== undefined) {
        const mdKey = key()
        markDefs.push({ _key: mdKey, _type: 'link', href: lm[3], blank: true })
        children.push(span(lm[3], [...base, mdKey]))
      }
      segLast = linkRe.lastIndex
    }
    if (segLast < seg.texto.length) children.push(span(seg.texto.slice(segLast), base))
  }
  if (children.length === 0) children.push(span(text, []))
  return { children, markDefs }
}

function span(text: string, marks: string[]) {
  return { _key: key(), _type: 'span', text, marks }
}

function block(style: string, text: string, extra: Record<string, any> = {}) {
  const { children, markDefs } = parseInline(text)
  return { _key: key(), _type: 'block', style, markDefs, children, ...extra }
}

// ─────────────────────────────────────────────────────────────────────────
// Parser del archivo completo
// ─────────────────────────────────────────────────────────────────────────

interface SeccionComponentes {
  faqBlock?: { title: string; faqs: { question: string; answer: string }[] }
  ctaBox?: { tipo: string; titulo: string; texto: string; btnTexto: string; btnUrl: string }
}

function extraerBloque(texto: string, inicio: string, fin: string | null): string {
  const i = texto.indexOf(inicio)
  if (i === -1) return ''
  const desde = i + inicio.length
  const j = fin ? texto.indexOf(fin, desde) : -1
  return j === -1 ? texto.slice(desde) : texto.slice(desde, j)
}

// "CAMPOS SANITY" es una lista `clave:   valor` de ancho fijo — parseo línea por
// línea, tolerante a espacios variables después de los dos puntos.
function parseCamposSanity(bloque: string): Record<string, string> {
  const campos: Record<string, string> = {}
  for (const linea of bloque.split('\n')) {
    const m = linea.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (!m) continue
    campos[m[1]] = m[2].trim()
  }
  return campos
}

function campoNumero(v: string | undefined): number | null {
  if (!v || v === 'null') return null
  const m = v.match(/-?\d+(\.\d+)?/)
  return m ? Number(m[0]) : null
}

// Parsea el bloque "COMPONENTES SANITY" (faqBlock, ctaBox) — valores finales y
// exactos, más confiables que re-derivar de los marcadores ▶ dentro del cuerpo
// (esos solo marcan DÓNDE va el componente).
function parseComponentes(texto: string): SeccionComponentes {
  const resultado: SeccionComponentes = {}

  const ctaM = texto.match(/▶ ctaBox\s*→\s*tipo:\s*"([^"]*)"\s*·\s*titulo:\s*"([^"]*)"\s*·\s*texto:\s*"([^"]*)"\s*·\s*btnTexto:\s*"([^"]*)"\s*·\s*btnUrl:\s*"([^"]*)"/)
  if (ctaM) resultado.ctaBox = { tipo: ctaM[1], titulo: ctaM[2], texto: ctaM[3], btnTexto: ctaM[4], btnUrl: ctaM[5] }

  const faqTitleM = texto.match(/▶ faqBlock\s*→\s*title:\s*"([^"]*)"/)
  if (faqTitleM) {
    const faqs: { question: string; answer: string }[] = []
    const faqSeccion = texto.slice(texto.indexOf(faqTitleM[0]))
    // ,?  antes del salto de línea: el formato real trae una coma después del
    // cierre de comillas de `question` (ej. `question: "..?",\n  answer: "..`).
    // Bug encontrado 2026-10-31 al validar este script contra el original de BIF™
    // (articulos-generados/A06-bis-tixcacal-opichen-merida.md): sin el `,?` el
    // regex nunca matchea NINGÚN faq, en ningún artículo — confirmado con 0
    // matches contra una muestra real del BIF™, no solo en esta copia.
    const faqRe = /question:\s*"([^"]*)"\s*,?\s*\n\s*answer:\s*"([^"]*)"/g
    let fm: RegExpExecArray | null
    while ((fm = faqRe.exec(faqSeccion))) faqs.push({ question: fm[1], answer: fm[2] })
    resultado.faqBlock = { title: faqTitleM[1], faqs }
  }

  return resultado
}

function filaATexto(celdas: string[]): string {
  return celdas.filter((c) => c.trim().length > 0).join(' — ')
}

// Bug real del script original (BIF™, FASE2-07, 2026-10-27): el parser nunca
// manejó "### " porque ningún artículo anterior usó H3 anidado bajo H2 — se porta
// ya corregido ("### ".startsWith('## ') es false, el orden del check no importa).
function parseBody(bodyMd: string, componentes: SeccionComponentes): any[] {
  const lineas = bodyMd.split('\n')
  const bloques: any[] = []
  let i = 0

  while (i < lineas.length) {
    const linea = lineas[i].trim()

    if (!linea) { i++; continue }

    if (linea.startsWith('## ')) {
      const heading = linea.slice(3).trim()
      if (/preguntas frecuentes/i.test(heading) && componentes.faqBlock) {
        bloques.push({
          _key: key(), _type: 'faqBlock', title: componentes.faqBlock.title,
          faqs: componentes.faqBlock.faqs.map((f) => ({ _key: key(), _type: 'faqItem', question: f.question, answer: f.answer })),
        })
        i++
        while (i < lineas.length && !lineas[i].trim().match(/^(##\s|▶)/)) i++
        continue
      }
      bloques.push(block('h2', heading))
      i++
      continue
    }

    if (linea.startsWith('### ')) {
      bloques.push(block('h3', linea.slice(4).trim()))
      i++
      continue
    }

    if (linea.startsWith('▶ FAQ BLOCK')) {
      if (componentes.faqBlock) {
        bloques.push({
          _key: key(), _type: 'faqBlock', title: componentes.faqBlock.title,
          faqs: componentes.faqBlock.faqs.map((f) => ({ _key: key(), _type: 'faqItem', question: f.question, answer: f.answer })),
        })
      }
      i++
      continue
    }

    if (linea.startsWith('▶ CTA BOX')) {
      if (componentes.ctaBox) {
        bloques.push({ _key: key(), _type: 'ctaBox', ...componentes.ctaBox })
      }
      i++
      continue
    }

    // Tabla markdown: fila de encabezado + fila separadora "|---|---|" — no hay
    // componente "tabla" en el renderer, se convierte a bullets.
    if (linea.startsWith('|') && lineas[i + 1]?.trim().match(/^\|[\s-:|]+\|$/)) {
      i += 2
      while (i < lineas.length && lineas[i].trim().startsWith('|')) {
        const celdas = lineas[i].trim().split('|').slice(1, -1).map((c) => c.trim())
        bloques.push(block('normal', filaATexto(celdas), { listItem: 'bullet', level: 1 }))
        i++
      }
      continue
    }

    const numM = linea.match(/^\d+\.\s+(.*)$/)
    if (numM) {
      bloques.push(block('normal', numM[1], { listItem: 'number', level: 1 }))
      i++
      continue
    }

    const bulletM = linea.match(/^[-*]\s+(.*)$/)
    if (bulletM) {
      bloques.push(block('normal', bulletM[1], { listItem: 'bullet', level: 1 }))
      i++
      continue
    }

    const parrafo: string[] = [linea]
    i++
    while (i < lineas.length && lineas[i].trim() && !lineas[i].trim().match(/^(##\s|▶|\||\d+\.\s|[-*]\s)/)) {
      parrafo.push(lineas[i].trim())
      i++
    }
    bloques.push(block('normal', parrafo.join(' ')))
  }

  return bloques
}

interface ArticuloParseado {
  campos: Record<string, string>
  body: any[]
}

function parseArchivo(contenido: string): ArticuloParseado {
  const campos = parseCamposSanity(
    extraerBloque(contenido, 'CAMPOS SANITY (document type: byklaiBlogPost)', 'ARTÍCULO COMPLETO')
  )
  if (!campos.slug || !campos.titulo) {
    throw new Error('No se pudo parsear CAMPOS SANITY (faltan slug/titulo) — revisar formato del archivo')
  }

  const bodyMd = extraerBloque(contenido, 'ARTÍCULO COMPLETO', 'COMPONENTES SANITY (campos exactos')
    .replace(/^\s*─+\s*\n/, '')
  const componentesTexto = extraerBloque(contenido, 'COMPONENTES SANITY (campos exactos', 'INTERLINKING APLICADO')
  const componentes = parseComponentes(componentesTexto)
  const body = parseBody(bodyMd, componentes)
  if (body.length === 0) throw new Error('El body quedó vacío — revisar el parseo de ARTÍCULO COMPLETO')

  return { campos, body }
}

// ─────────────────────────────────────────────────────────────────────────
// Sanity
// ─────────────────────────────────────────────────────────────────────────

async function sanityQuery<T>(query: string): Promise<T> {
  const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const ds = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const url = `https://${pid}.api.sanity.io/v2024-01-01/data/query/${ds}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const json = (await res.json()) as { result: T }
  return json.result
}

async function sanityMutate(mutations: any[]): Promise<any> {
  const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const ds = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const url = `https://${pid}.api.sanity.io/v2024-01-01/data/mutate/${ds}?returnIds=true`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Sanity mutate falló: ${JSON.stringify(json)}`)
  return json
}

async function existeEnSanity(slugSinBarra: string): Promise<boolean> {
  const doc = await sanityQuery<any>(`*[_type=="byklaiBlogPost" && slug.current=="${slugSinBarra}"][0]._id`)
  return Boolean(doc)
}

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────

async function main() {
  validarEnv()
  if (!archivoArg) {
    console.error('Uso: npx ts-node scripts/subir-articulo-sanity.ts <archivo.md> [--push]')
    process.exit(1)
  }
  const rutaArchivo = path.resolve(archivoArg)
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8')
  const { campos, body } = parseArchivo(contenido)

  const slugSinBarra = campos.slug.replace(/^\/?(blog\/)?/, '')
  console.log(`Artículo parseado: ${campos.titulo}`)
  console.log(`Slug: ${slugSinBarra} · ${body.length} bloques en el body`)

  console.log('Verificando duplicado contra Sanity...')
  const enSanity = await existeEnSanity(slugSinBarra)
  if (enSanity) {
    console.error(`🔴 ABORTADO — el slug "${slugSinBarra}" ya existe en Sanity.`)
    console.error('No se sube nada.')
    process.exit(1)
  }
  console.log('✅ Sin duplicado — slug libre.')

  const doc: Record<string, any> = {
    _type: 'byklaiBlogPost',
    slug: { _type: 'slug', current: slugSinBarra },
    titulo: campos.titulo,
    excerpt: campos.excerpt,
    seoTitle: campos.seoTitle,
    seoDescription: campos.seoDescription,
    keywords: campos.keywords,
    tiempoDeLectura: campoNumero(campos.tiempoDeLectura),
    estado: 'pendiente', // siempre — nunca se publica directo desde este script
    body,
  }

  const outputDir = path.join(__dirname, '..', 'output')
  fs.mkdirSync(outputDir, { recursive: true })
  const dryRunPath = path.join(outputDir, `sanity-dryrun-${slugSinBarra}.json`)
  fs.writeFileSync(dryRunPath, JSON.stringify({ articulo: doc }, null, 2))
  console.log(`Documento completo escrito en ${dryRunPath} — revisar antes de --push.`)

  if (!PUSH) {
    console.log('\n⚠️  DRY-RUN (default). Nada se subió a Sanity. Revisa el JSON y vuelve a correr con --push.')
    return
  }

  console.log('\n--push activo: subiendo a Sanity...')
  const resArticulo = await sanityMutate([{ create: doc }])
  const articleId = resArticulo.results?.[0]?.id
  console.log(`✅ byklaiBlogPost creado (estado: pendiente): ${articleId}`)
  console.log('\nPendiente del operador: revisar en https://byklai-blog.sanity.studio,')
  console.log('agregar coverImage, fechaPublicacion, y cambiar estado a "publicado".')
}

main().catch((err) => {
  console.error('Error fatal:', err.message)
  process.exit(1)
})
