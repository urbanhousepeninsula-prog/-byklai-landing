import { useEffect, useRef, useState } from 'react'

/**
 * Reveal suave al hacer scroll — por defecto el contenido está SIEMPRE visible
 * (opacity:1, sin transform). Solo se agrega una clase que dispara una animación
 * de entrada una vez, nunca se oculta contenido esperando a JS/al observer.
 * Respeta prefers-reduced-motion (no se anima, pero sigue visible).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, className: animate ? 'reveal-animate' : '' }
}
