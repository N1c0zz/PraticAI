// frontend/src/components/layout/Header.tsx

import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface HeaderProps {
  className?: string
}

export default function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`container mx-auto px-6 py-8 ${className}`}>
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo size="md" />
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/partita-iva" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Partita IVA
          </Link>
          <Link 
            href="/autocertificazione-residenza" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Autocertificazione
          </Link>
          <Link 
            href="#features" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Funzionalità
          </Link>
          <Link 
            href="#about" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Chi Siamo
          </Link>
        </nav>

        {/* Mobile menu button - TODO: implementare menu mobile */}
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}