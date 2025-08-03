// frontend/src/components/ui/Logo.tsx

import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizeConfig = {
  sm: { width: 120, height: 38 },
  md: { width: 160, height: 50 },
  lg: { width: 200, height: 62 },
  xl: { width: 240, height: 75 }
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const config = sizeConfig[size]
  
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg 
          width={config.height} 
          height={config.height} 
          viewBox="0 0 50 50" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          
          <g transform="translate(10, 11)">
            <rect x="0" y="0" width="20" height="28" rx="3" fill="none" stroke="#2563EB" strokeWidth="2"/>
            
            <line x1="4" y1="6" x2="16" y2="6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="4" y1="10" x2="12" y2="10" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="4" y1="14" x2="16" y2="14" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            
            <circle cx="14" cy="20" r="3" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
            <circle cx="14" cy="20" r="1" fill="#7C3AED"/>
            <line x1="17" y1="20" x2="19" y2="20" stroke="#7C3AED" strokeWidth="1.5"/>
            <circle cx="19" cy="20" r="1" fill="#7C3AED"/>
          </g>
        </svg>
      </div>
    )
  }
  
  if (variant === 'text') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-2xl">
          PraticAI
        </span>
      </div>
    )
  }
  
  // Variant 'full' - Logo completo
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg 
        width={config.width} 
        height={config.height} 
        viewBox="0 0 160 50" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        
        <g transform="translate(10, 11)">
          <rect x="0" y="0" width="20" height="28" rx="3" fill="none" stroke="#2563EB" strokeWidth="2"/>
          
          <line x1="4" y1="6" x2="16" y2="6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <line x1="4" y1="10" x2="12" y2="10" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <line x1="4" y1="14" x2="16" y2="14" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          
          <circle cx="14" cy="20" r="3" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="14" cy="20" r="1" fill="#7C3AED"/>
          <line x1="17" y1="20" x2="19" y2="20" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="19" cy="20" r="1" fill="#7C3AED"/>
        </g>
        
        <text 
          x="45" 
          y="33" 
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" 
          fontSize="24" 
          fontWeight="600" 
          fill="url(#textGradient)"
        >
          PraticAI
        </text>
      </svg>
    </div>
  )
}

// Esempi di utilizzo:
// <Logo size="lg" />                    → Logo completo grande
// <Logo size="sm" variant="icon" />     → Solo icona piccola
// <Logo variant="text" />               → Solo testo con gradiente