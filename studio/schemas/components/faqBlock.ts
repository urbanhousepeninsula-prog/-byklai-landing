import { defineType, defineField, defineArrayMember } from 'sanity'

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title', title: 'Título del bloque', type: 'string',
      initialValue: 'Preguntas frecuentes',
      validation: R => R.required(),
    }),
    defineField({
      name: 'faqs', title: 'Preguntas', type: 'array',
      of: [defineArrayMember({
        name: 'faqItem',
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Pregunta', type: 'string', validation: R => R.required() }),
          defineField({ name: 'answer', title: 'Respuesta', type: 'text', rows: 4, validation: R => R.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
      validation: R => R.required().min(3),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
