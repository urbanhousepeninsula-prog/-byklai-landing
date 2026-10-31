import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import BlogLayout from '../../components/BlogLayout'
import { getPublishedPosts, urlForImage, BlogPostSummary } from '../../lib/sanity'

interface Props {
  posts: BlogPostSummary[]
}

export default function BlogIndex({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Blog · byklai.com — automatización, IA y captación de leads</title>
        <meta
          name="description"
          content="Guías prácticas sobre automatización, agentes de IA, CRM y captación de leads para negocios en México, escritas por quien opera los sistemas."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Blog · byklai.com" />
        <meta property="og:description" content="Automatización, IA y captación de leads — práctico y local." />
        <meta property="og:url" content="https://www.byklai.com/blog" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <BlogLayout>
        <section className="max-w-4xl mx-auto px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink3 mb-5">blog</p>
          <h1 className="font-serif text-[clamp(26px,4vw,40px)] leading-tight tracking-tight mb-4 max-w-xl">
            Automatización, IA y captación de leads, <em>sin relleno.</em>
          </h1>
          <p className="text-ink2 font-light max-w-lg mb-10">
            Lo que aprendemos operando nuestros propios sistemas, escrito para dueños de negocio, no para técnicos.
          </p>

          {posts.length === 0 ? (
            <p className="text-ink2 text-[14px] font-mono">Todavía no hay artículos publicados. Vuelve pronto.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map(post => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-line overflow-hidden bg-white hover:border-ink transition-colors"
                >
                  <div className="relative w-full aspect-[16/9] bg-surface2">
                    <Image
                      src={urlForImage(post.coverImage).width(800).height(450).url()}
                      alt={post.coverImage?.alt || post.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[11px] text-ink3 mb-2">
                      {new Date(post.fechaPublicacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                      {' · '}{post.tiempoDeLectura} min de lectura
                    </p>
                    <h2 className="font-serif text-[20px] leading-snug tracking-tight mb-2 group-hover:text-accent-ink transition-colors">
                      {post.titulo}
                    </h2>
                    <p className="text-[13px] text-ink2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </BlogLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getPublishedPosts()
  return {
    props: { posts },
    revalidate: 300,
  }
}
