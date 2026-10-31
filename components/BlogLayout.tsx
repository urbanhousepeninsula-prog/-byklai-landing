import Image from 'next/image'
import { ReactNode } from 'react'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-ink min-h-screen">
      <nav className="sticky top-0 z-50 bg-surface border-b border-line py-4">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="nav-logo">
            <Image src="/logo-byklai_ambar.png" alt="byklai.com" width={140} height={37} priority />
          </a>
          <a href="/#form" className="font-mono text-xs font-medium px-4 py-2 border-[1.5px] border-ink rounded-full hover:bg-ink hover:text-white transition-colors">
            → solicitar sistema
          </a>
        </div>
      </nav>

      {children}

      <footer className="border-t border-line py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap">
          <Image src="/logo-byklai_ambar.png" alt="byklai.com" width={100} height={27} className="opacity-60" />
          <span className="font-mono text-[12px] text-ink3">© 2026 byklai.com — sistemas automatizados</span>
          <span className="font-mono text-[12px] text-ink3">Next.js + n8n + Resend</span>
        </div>
      </footer>
    </div>
  )
}
