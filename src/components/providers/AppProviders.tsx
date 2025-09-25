// src/components/providers/AppProviders.tsx - Providers principales de la aplicación
'use client'

import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from './AuthProvider'

interface AppProvidersProps {
    children: React.ReactNode
}

// Crear QueryClient con configuración optimizada para MATUC
const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
                // No reintentar para errores de autenticación
                const errorObj = error as { status?: number }
                if (errorObj?.status === 401 || errorObj?.status === 403) {
                    return false
                }
                return failureCount < 3
            }
        },
        mutations: {
            retry: 1
        }
    }
})

let queryClient: QueryClient

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: crear nueva instancia
        return createQueryClient()
    }

    if (!queryClient) {
        // Client: crear instancia singleton
        queryClient = createQueryClient()
    }

    return queryClient
}

export function AppProviders({ children }: AppProvidersProps) {
    const client = getQueryClient()

    return (
        <QueryClientProvider client={client}>
            <ThemeInitializer>
                <ToastProvider position="top-right">
                    {/* <AuthProvider> */}
                        {children}
                    {/* </AuthProvider> */}
                </ToastProvider>
            </ThemeInitializer>
        </QueryClientProvider>
    )
}

// Componente para inicializar el tema del sistema
function ThemeInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Detectar cambios de viewport para mobile
        const handleResize = () => {
            // Por ahora sin UI store, implementar después
            console.log('Viewport changed:', window.innerWidth)
        }

        // Establecer estado inicial
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <>{children}</>
}