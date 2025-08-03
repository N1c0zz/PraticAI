// frontend/src/components/layout/Footer.tsx

import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface FooterProps {
  className?: string
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gray-900 text-white py-8 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo e descrizione */}
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <Logo size="sm" className="filter brightness-0 invert" />
            </Link>
            <p className="text-gray-400 mt-2">Semplifichiamo la burocrazia italiana</p>
          </div>
          
          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Termini
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contatti
            </Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} PraticAI. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  )
}