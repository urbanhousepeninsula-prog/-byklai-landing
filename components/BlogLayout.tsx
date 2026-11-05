import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-ink min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(11,10,8,0.92)] backdrop-blur-sm">
        <nav aria-label="Principal" className="max-w-4xl mx-auto px-6 py-[18px] flex justify-between items-center">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo-byklai-nuevo.svg" alt="BYKLAI" width={116} height={34} style={{ height: 34, width: 'auto' }} priority />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-[#cfcac0] hover:text-white transition-colors duration-200">
              blog
            </Link>
            <a
              href="/#diagnostico"
              className="inline-flex items-center min-h-[44px] px-5 bg-accent text-[#0b0a08] rounded-full no-underline font-mono text-xs font-semibold hover:bg-[#f3a72e] transition-colors duration-200 whitespace-nowrap"
            >
              → solicitar sistema
            </a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-[#080807]">
        <div className="max-w-4xl mx-auto px-6 py-9 flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
          <Image src="/logo-byklai-nuevo.svg" alt="BYKLAI" width={102} height={30} style={{ height: 30, width: 'auto' }} />
          <span className="font-mono text-[12px] text-[#a8a297]">© 2026 byklai.com — sistemas automatizados</span>
          <span className="font-mono text-[12px] text-[#a8a297]">Next.js + n8n + Resend</span>
        </div>
      </footer>
    </div>
  )
}
