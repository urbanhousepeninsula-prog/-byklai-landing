// schemas/byklaiBlogPost.ts
// Document type principal del blog — byklai.com/blog
// Esquema simplificado a propósito: sin taxonomía BIF™ (pilar/cluster/esPillar),
// sin componentes específicos del BIF™ (bisOrientativoBlock, riskFlagAlert).
// Ver colab/bandeja/PARA-CLAUDE-AI-2026-10-25-arq-blog-redes-lite-byklai.md §1-2.

import { defineType, defineField, defineArrayMember } from 'sanity'

export const byklaiBlogPost = defineType({
  name: 'byklaiBlogPost',
  title: 'Artículo del blog',
  type: 'document',

  groups: [
    { name: 'contenido', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'publicacion', title: 'Publicación' },
  ],

  fields: [
    // ── CONTENIDO ────────────────────────────────────────────────────────────

    defineField({
      name: 'titulo',
      title: 'Título (H1)',
      type: 'string',
      group: 'contenido',
      description: 'Máximo 80 caracteres. Es el H1 del artículo.',
      validation: Rule => Rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'contenido',
      description: 'Del ROADMAP-BLOG-BYKLAI-v0.md.',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'contenido',
      description: 'Resumen visible en el listado del blog. Máximo 160 caracteres.',
      validation: Rule => Rule.required().max(160),
    }),

    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      group: 'contenido',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (obligatorio)',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption (opcional)',
          type: 'string',
        }),
      ],
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'body',
      title: 'Contenido del artículo',
      type: 'array',
      group: 'contenido',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Párrafo', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'string',
                    description: 'Ruta relativa para internos (/blog/slug) · absoluta para externos.',
                    validation: Rule => Rule.required(),
                  }),
                  defineField({
                    name: 'blank',
                    title: 'Abrir en nueva pestaña',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'ctaBox' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text (obligatorio)',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'tiempoDeLectura',
      title: 'Tiempo de lectura (minutos)',
      type: 'number',
      group: 'contenido',
      validation: Rule => Rule.required().min(1).max(30).integer(),
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Máximo 60 caracteres. Puede diferir del H1.',
      validation: Rule => Rule.required().max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Máximo 160 caracteres. Incluir la keyword principal.',
      validation: Rule => Rule.required().max(160),
    }),

    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'string',
      group: 'seo',
      description: 'Separadas por coma. Incluir la pregunta AEO y variantes.',
      validation: Rule => Rule.required(),
    }),

    // ── PUBLICACIÓN ──────────────────────────────────────────────────────────

    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      group: 'publicacion',
      description:
        'Texto libre a propósito (no dropdown de lista fija): en el BIF™ un campo con ' +
        'opciones fijas reseteaba en silencio cualquier valor fuera de la lista al abrir ' +
        'el documento — confirmado en vivo 3 veces. Usar "pendiente", "en-produccion" o ' +
        '"publicado" por convención, sin que el schema lo imponga.',
      initialValue: 'pendiente',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de publicación',
      type: 'date',
      group: 'publicacion',
      description: 'Se completa cuando estado = publicado.',
    }),
  ],

  preview: {
    select: {
      title: 'titulo',
      estado: 'estado',
      media: 'coverImage',
    },
    prepare({ title, estado, media }) {
      const estadoIcon: Record<string, string> = {
        pendiente: '⏳',
        'en-produccion': '✍️',
        publicado: '✅',
      }
      return {
        title,
        subtitle: `${estadoIcon[estado] || estado || ''}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Fecha de publicación',
      name: 'fechaPublicacionDesc',
      by: [{ field: 'fechaPublicacion', direction: 'desc' }],
    },
    {
      title: 'Estado',
      name: 'estadoAsc',
      by: [{ field: 'estado', direction: 'asc' }],
    },
  ],
})
