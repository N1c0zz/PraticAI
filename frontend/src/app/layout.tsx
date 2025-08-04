// frontend/src/app/layout.tsx

import type { Metadata, Viewport } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'PraticAI - Burocrazia Semplificata con AI',
  description: 'Genera automaticamente documenti burocratici con l\'aiuto dell\'intelligenza artificiale. Partita IVA, moduli fiscali e guide personalizzate.',
  keywords: ['burocrazia', 'partita iva', 'AI', 'documenti', 'fiscale', 'automatico'],
  authors: [{ name: 'PraticAI Team' }],
  
  // 🎯 FAVICON OTTIMIZZATA
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB', // 🎯 Colore tema browser
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        {/* 🎯 FAVICON LINK TAGS ESPLICITI */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 🎯 META TAG PER TEMA COLORE */}
        <meta name="theme-color" content="#2563EB" />
        <meta name="msapplication-TileColor" content="#2563EB" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}