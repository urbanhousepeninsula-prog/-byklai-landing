import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import BlogLayout from '../../components/BlogLayout'
import { getPostBySlug, getPublishedSlugs, urlForImage, BlogPost, BlogFaqBlock, BlogCtaBox } from '../../lib/sanity'

interface Props {
  post: BlogPost
}

function FaqBlockView({ value }: { value: BlogFaqBlock }) {
  return (
    <div className="my-10 border-t border-line pt-8">
      <h2 className="font-serif text-[24px] tracking-tight mb-5">{value.title}</h2>
      <div className="flex flex-col gap-5">
        {value.faqs.map((faq, i) => (
          <div key={i}>
            <p className="font-medium text-[15px] mb-1">{faq.question}</p>
            <p className="text-[14px] text-ink2 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CtaBoxView({ value }: { value: BlogCtaBox }) {
  return (
    <div className="my-10 rounded-2xl bg-accent-bg p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 not-prose">
      <div>
        <p className="font-serif text-[20px] tracking-tight leading-snug">{value.titulo}</p>
        <p className="text-[13px] text-ink2 mt-1">{value.texto}</p>
      </div>
      <a
        href={value.btnUrl}
        className="shrink-0 text-center font-mono text-[12px] font-medium px-6 py-3 bg-ink text-white rounded-full border-[1.5px] border-ink hover:bg-ink2 transition-colors whitespace-nowrap"
      >
        {value.btnTexto} →
      </a>
    </div>
  )
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="font-serif text-[26px] tracking-tight mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-serif text-[20px] tracking-tight mt-8 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-[15px] text-ink2 leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 text-[15px] text-ink2 leading-relaxed mb-4 flex flex-col gap-1.5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 text-[15px] text-ink2 leading-relaxed mb-4 flex flex-col gap-1.5">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-accent-ink underline underline-offset-2 hover:opacity-70"
      >
        {children}
      </a>
    ),
  },
  types: {
    faqBlock: FaqBlockView,
    ctaBox: CtaBoxView,
    image: ({ value }) => (
      <div className="my-8 -mx-1">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-surface2">
          <Image src={urlForImage(value).width(1200).url()} alt={value.alt || ''} fill className="object-cover" />
        </div>
        {value.caption && <p className="font-mono text-[11px] text-ink3 mt-2">{value.caption}</p>}
      </div>
    ),
  },
}

export default function BlogPostPage({ post }: Props) {
  const faqBlocks = (post.body || []).filter(
    (b): b is BlogFaqBlock => (b as { _type?: string })?._type === 'faqBlock'
  )

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.seoDescription,
    image: post.coverImage ? urlForImage(post.coverImage).width(1200).url() : undefined,
    datePublished: post.fechaPublicacion,
    author: { '@type': 'Organization', name: 'BYKLAI', url: 'https://www.byklai.com' },
    publisher: { '@type': 'Organization', name: 'BYKLAI', url: 'https://www.byklai.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.byklai.com/blog/${post.slug}` },
  }

  const faqJsonLd =
    faqBlocks.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqBlocks.flatMap(block =>
            block.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            }))
          ),
        }
      : null

  return (
    <>
      <Head>
        <title>{post.seoTitle} | BYKLAI</title>
        <meta name="description" content={post.seoDescription} />
        <meta name="keywords" content={post.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:url" content={`https://www.byklai.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        {post.coverImage && <meta property="og:image" content={urlForImage(post.coverImage).width(1200).url()} />}
        <link rel="canonical" href={`https://www.byklai.com/blog/${post.slug}`} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        )}
      </Head>

      <BlogLayout>
        <article className="max-w-2xl mx-auto px-6 py-16">
          <Link href="/blog" className="font-mono text-[11px] uppercase tracking-widest text-ink3 hover:text-ink">
            ← blog
          </Link>
          <h1 className="font-serif text-[clamp(28px,4.5vw,44px)] leading-tight tracking-tight mt-4 mb-4">
            {post.titulo}
          </h1>
          <p className="font-mono text-[12px] text-ink3 mb-8">
            {new Date(post.fechaPublicacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            {' · '}{post.tiempoDeLectura} min de lectura
          </p>

          {post.coverImage && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface2 mb-10">
              <Image
                src={urlForImage(post.coverImage).width(1200).height(675).url()}
                alt={post.coverImage.alt || post.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <PortableText value={post.body} components={portableTextComponents} />
        </article>
      </BlogLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPublishedSlugs()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: { post },
    revalidate: 300,
  }
}
