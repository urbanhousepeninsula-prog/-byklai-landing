import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

type SanityImageSource = { asset?: { _ref?: string; _type?: string } } | string | Record<string, unknown>

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2ofn45dv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export interface BlogFaqItem {
  question: string
  answer: string
}

export interface BlogFaqBlock {
  _type: 'faqBlock'
  _key: string
  title: string
  faqs: BlogFaqItem[]
}

export interface BlogCtaBox {
  _type: 'ctaBox'
  _key: string
  tipo: 'diagnostico' | 'demo' | 'servicio'
  titulo: string
  texto: string
  btnTexto: string
  btnUrl: string
}

export interface BlogPostSummary {
  _id: string
  titulo: string
  slug: string
  excerpt: string
  coverImage: { asset: SanityImageSource; alt: string }
  fechaPublicacion: string
  tiempoDeLectura: number
}

export interface BlogPost extends BlogPostSummary {
  body: unknown[]
  seoTitle: string
  seoDescription: string
  keywords: string
}

const summaryProjection = `{
  _id,
  titulo,
  "slug": slug.current,
  excerpt,
  coverImage,
  fechaPublicacion,
  tiempoDeLectura
}`

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "byklaiBlogPost" && estado == "publicado"] | order(fechaPublicacion desc) ${summaryProjection}`
  )
}

export async function getPublishedSlugs(): Promise<string[]> {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "byklaiBlogPost" && estado == "publicado"].slug.current`
  )
  return slugs
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch(
    `*[_type == "byklaiBlogPost" && slug.current == $slug && estado == "publicado"][0]{
      _id,
      titulo,
      "slug": slug.current,
      excerpt,
      coverImage,
      fechaPublicacion,
      tiempoDeLectura,
      body,
      seoTitle,
      seoDescription,
      keywords
    }`,
    { slug }
  )
}
