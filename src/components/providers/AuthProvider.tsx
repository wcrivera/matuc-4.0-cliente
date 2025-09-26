// src/components/providers/AuthProvider.tsx - Con manejo de logout automático
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MsalProvider } from '@azure/msal-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { type User, getUserDefaultRoute } from '@/types/user.types'
import { msalInstance, initializeMsal } from '@/lib/config/msal.config'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore()
  const [msalInitialized, setMsalInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar si la ruta actual es de autenticación
  const isAuthRoute = useCallback((path: string): boolean => {
    const authRoutes = ['/login', '/register', '/auth']
    return authRoutes.some(route => path.startsWith(route))
  }, [])

  // Verificar si la ruta actual es pública (no requiere autenticación)
  const isPublicRoute = useCallback((path: string): boolean => {
    const publicRoutes = ['/', '/about', '/contact']
    return publicRoutes.includes(path)
  }, [])

  // Determinar destino según el rol del usuario usando utilidades centralizadas
  const determineUserDestination = useCallback((user: User): string => {
    return getUserDefaultRoute(user.role)
  }, [])

  // Manejar cambios de estado de autenticación
  const handleAuthStateChange = useCallback(() => {
    // CASO 1: Usuario autenticado en página de auth -> redirigir a dashboard
    if (isAuthenticated && user && isAuthRoute(pathname)) {
      const destination = determineUserDestination(user)
      console.log('Usuario autenticado en página de auth, redirigiendo a:', destination)
      router.replace(destination as `/admin` | `/courses` | `/classroom` | `/dashboard`)
    }

    // CASO 2: Usuario NO autenticado en ruta protegida -> redirigir a login
    else if (!isAuthenticated && !isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      console.log('Usuario no autenticado en ruta protegida, redirigiendo a login')
      router.replace('/login')
    }

    // CASO 3: Logout detectado -> redirigir a home
    else if (!isAuthenticated && !user && !isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      console.log('Logout detectado, redirigiendo a home')
      router.replace('/')
    }
  }, [isAuthenticated, user, pathname, router, isAuthRoute, isPublicRoute, determineUserDestination])

  // Inicializar MSAL y verificar autenticación
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        await initializeMsal()
        console.log('MSAL inicializado')
        setMsalInitialized(true)

        await checkAuth()
        console.log('Verificación de auth completada')
      } catch (error) {
        console.error('Error inicializando auth:', error)
        setMsalInitialized(true)
      }
    }

    initializeAuth()
  }, [checkAuth])

  // Manejar cambios de estado de autenticación
  useEffect(() => {
    if (msalInitialized && !isLoading) {
      handleAuthStateChange()
    }
  }, [msalInitialized, isLoading, handleAuthStateChange])

  // Mostrar loading mientras inicializa
  if (!msalInitialized || isLoading) {
    return <AuthLoadingScreen />
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  )
}

// Componente de loading
function AuthLoadingScreen(): React.ReactElement {
  const [loadingText, setLoadingText] = useState<string>('Inicializando autenticación...')

  useEffect(() => {
    const messages: string[] = [
      'Inicializando autenticación...',
      'Conectando con Microsoft...',
      'Verificando credenciales...',
      'Casi listo...'
    ]

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingText(messages[index])
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/90 to-uc-celeste flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block animate-pulse">
            <svg
              className="h-16 w-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">
          MATUC v4.0
        </h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-uc-amarillo/30"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-uc-amarillo border-t-transparent absolute top-0 left-0"></div>
          </div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed">
          {loadingText}
        </p>

        <div className="mt-8 flex items-center justify-center space-x-6 text-white/40 text-xs">
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Seguro</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verificado</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>UC</span>
          </span>
        </div>
      </div>
    </div>
  )
}