// frontend/src/app/layout.tsx

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Risolve warning metadataBase
  title: 'PraticAI - Burocrazia Semplificata con AI',
  description: 'Genera automaticamente documenti burocratici con l\'aiuto dell\'intelligenza artificiale. Partita IVA, moduli fiscali e guide personalizzate.',
  keywords: ['burocrazia', 'partita iva', 'AI', 'documenti', 'fiscale', 'automatico'],
  authors: [{ name: 'PraticAI Team' }],
  
  // Icone
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (social sharing)
  openGraph: {
    title: 'PraticAI - Burocrazia Semplificata',
    description: 'Genera documenti burocratici automaticamente con AI',
    url: 'http://localhost:3000',
    siteName: 'PraticAI',
    images: [{ url: '/logo.svg', width: 200, height: 60 }],
    locale: 'it_IT',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'PraticAI - Burocrazia Semplificata',
    description: 'Genera documenti burocratici automaticamente con AI',
    images: ['/logo.svg'],
  },
  
  robots: 'index, follow',
}

// Viewport separato (risolve warning viewport)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}