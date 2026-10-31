import { GetServerSideProps } from 'next'
import { sanityClient } from '../lib/sanity'

const STATIC_URLS = [
  { loc: 'https://www.byklai.com/', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://www.byklai.com/blog', changefreq: 'weekly', priority: '0.9' },
  { loc: 'https://resources.byklai.com/', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://afiliados.byklai.com/', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://discovery.byklai.com/', changefreq: 'monthly', priority: '0.7' },
]

function generateSitemap(posts: { slug: string; fechaPublicacion: string }[]) {
  const staticEntries = STATIC_URLS.map(
    u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n')

  const postEntries = posts
    .map(
      p =>
        `  <url>\n    <loc>https://www.byklai.com/blog/${p.slug}</loc>\n    <lastmod>${p.fechaPublicacion}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticEntries}\n${postEntries}\n</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts: { slug: string; fechaPublicacion: string }[] = await sanityClient.fetch(
    `*[_type == "byklaiBlogPost" && estado == "publicado"]{ "slug": slug.current, fechaPublicacion }`
  )

  const xml = generateSitemap(posts)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
