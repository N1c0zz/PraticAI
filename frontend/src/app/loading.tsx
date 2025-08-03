// frontend/src/app/loading.tsx

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Caricamento...</p>
      </div>
    </div>
  )
}