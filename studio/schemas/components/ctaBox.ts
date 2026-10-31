import { defineType, defineField } from 'sanity'

export const ctaBox = defineType({
  name: 'ctaBox',
  title: 'CTA Box',
  type: 'object',
  fields: [
    defineField({
      name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: [
        { title: 'Diagnóstico gratuito', value: 'diagnostico' },
        { title: 'Demo en vivo',         value: 'demo'        },
        { title: 'Servicio / genérico',  value: 'servicio'    },
      ]},
      initialValue: 'diagnostico',
      validation: R => R.required(),
    }),
    defineField({ name: 'titulo',   title: 'Título',      type: 'string', initialValue: '¿Hablamos?', validation: R => R.required() }),
    defineField({ name: 'texto',    title: 'Texto',       type: 'text',   rows: 3, validation: R => R.required() }),
    defineField({ name: 'btnTexto', title: 'Texto botón', type: 'string', initialValue: 'Diagnóstico de 30 min, gratis', validation: R => R.required() }),
    defineField({ name: 'btnUrl',   title: 'URL botón',   type: 'string', initialValue: '/#form', validation: R => R.required() }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'tipo' },
  },
})
