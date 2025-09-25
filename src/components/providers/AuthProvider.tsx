// src/components/providers/AuthProvider.tsx - Provider para Autenticación
'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth.store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const isLoading = useAuthStore((state) => state.isLoading)

  // Verificar autenticación al inicializar la app
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Mostrar loading mientras verifica la sesión
  if (isLoading) {
    return <AuthLoadingScreen />
  }

  return <>{children}</>
}

// Componente de loading para autenticación
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/90 to-uc-celeste flex items-center justify-center">
      <div className="text-center">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block animate-pulse">
            <svg 
              className="h-16 w-16 text-white"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
        </div>

        {/* Texto de carga */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Cargando MATUC
        </h2>
        
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-uc-amarillo border-t-transparent"></div>
        </div>
        
        {/* Mensaje */}
        <p className="text-white/70 mt-4 text-sm">
          Verificando sesión...
        </p>
      </div>
    </div>
  )
}