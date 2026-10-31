// schemas/index.ts
// Punto de entrada principal del schema para sanity.config.ts

import { byklaiBlogPost } from './byklaiBlogPost'
import { faqBlock, ctaBox } from './components'

// Los componentes deben registrarse ANTES de los document types
// que los referencian en su body (portable text)
export const schemaTypes = [
  // Componentes del body
  faqBlock,
  ctaBox,
  // Document types
  byklaiBlogPost,
]
