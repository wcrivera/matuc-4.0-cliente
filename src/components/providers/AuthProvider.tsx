// src/components/providers/AuthProvider.tsx - Coordinado con homepage inteligente
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MsalProvider } from '@azure/msal-react'
import { useAuthStore } from '@/lib/stores/auth.store'
import { type User, getUserDefaultRoute } from '@/types/user.types'
import { msalInstance, initializeMsal } from '@/lib/config/msal.config'
import type { Route } from 'next'

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul to-uc-celeste flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/80">Inicializando autenticación...</p>
      </div>
    </div>
  )
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
    const publicRoutes = ['/', '/about', '/contact', '/demo']
    return publicRoutes.includes(path)
  }, [])

  // Verificar si es una ruta protegida (requiere autenticación)
  const isProtectedRoute = useCallback((path: string): boolean => {
    const protectedPrefixes = ['/dashboard', '/admin', '/courses', '/classroom', '/exercises', '/analytics']
    return protectedPrefixes.some(prefix => path.startsWith(prefix))
  }, [])

  // Manejar cambios de estado de autenticación
  const handleAuthStateChange = useCallback(() => {
    // No hacer nada mientras está cargando
    if (isLoading) return

    console.log('AuthProvider - Estado:', {
      isAuthenticated,
      user: user?.role,
      pathname,
      isLoading
    })

    // CASO 1: Usuario autenticado en página de auth -> redirigir según rol
    if (isAuthenticated && user && isAuthRoute(pathname)) {
      const destination = getUserDefaultRoute(user.role) as Route
      console.log('AuthProvider - Usuario autenticado en auth route, redirigiendo a:', destination)
      router.replace(destination)
      return
    }

    // CASO 2: Usuario NO autenticado en ruta protegida -> redirigir a login
    if (!isAuthenticated && isProtectedRoute(pathname)) {
      console.log('AuthProvider - Usuario no autenticado en ruta protegida, redirigiendo a login')
      router.replace('/login' as Route)
      return
    }

    // CASO 3: Logout detectado desde ruta protegida -> redirigir a home
    if (!isAuthenticated && !user && isProtectedRoute(pathname)) {
      console.log('AuthProvider - Logout detectado desde ruta protegida, redirigiendo a home')
      router.replace('/' as Route)
      return
    }

    // NOTA: NO manejamos redirección desde '/' aquí
    // Eso lo maneja directamente la homepage para evitar conflictos

  }, [isAuthenticated, user, pathname, router, isLoading, isAuthRoute, isProtectedRoute])

  // Inicializar MSAL y verificar autenticación
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        await initializeMsal()
        console.log('AuthProvider - MSAL inicializado correctamente')
        setMsalInitialized(true)

        // Verificar estado de autenticación
        await checkAuth()
        console.log('AuthProvider - Verificación de auth completada')
      } catch (error) {
        console.error('AuthProvider - Error inicializando auth:', error)
        setMsalInitialized(true) // Continuar aunque falle
      }
    }

    initializeAuth()
  }, [checkAuth])

  // Manejar cambios de estado de autenticación
  useEffect(() => {
    if (msalInitialized) {
      handleAuthStateChange()
    }
  }, [msalInitialized, handleAuthStateChange])

  // Mostrar loading mientras inicializa
  if (!msalInitialized) {
    return <AuthLoadingScreen />
  }

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  )
}