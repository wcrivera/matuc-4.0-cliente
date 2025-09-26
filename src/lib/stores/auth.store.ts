// src/lib/stores/auth.store.ts - Store actualizado con tipos centralizados
'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
    type User,
    type AuthState,
    type AuthResponse,
    // type BackendUser,
    mapBackendUserToUser,
    getUserDisplayName,
    hasPermission,
    canUserAccessRoute
} from '@/types/user.types'

// Interface del store de autenticación
interface AuthStore extends AuthState {
    // Acciones principales
    login: (email: string, password: string) => Promise<boolean>
    loginGoogle: (token: string) => Promise<boolean>
    loginOutlook: (token: string) => Promise<boolean>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>

    // Acciones de estado
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void

    // Utilidades con tipos centralizados
    hasPermission: (permission: string) => boolean
    canAccessRoute: (route: string) => boolean
    getDisplayName: () => string
}

// Función auxiliar para manejar cookies
const cookieUtils = {
    set: (name: string, value: string, days = 7) => {
        if (typeof document !== 'undefined') {
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
            document.cookie = `${name}=${value}; expires=${expires}; path=/; samesite=strict`
        }
    },
    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = value
            return acc
        }, {} as Record<string, string>)
        return cookies[name] || null
    },
    remove: (name: string) => {
        if (typeof document !== 'undefined') {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
        }
    }
}

// Store principal usando Zustand
export const useAuthStore = create<AuthStore>()(
    devtools(
        (set, get) => ({
            // Estado inicial
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Acción: Login tradicional email/password
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null })

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    })

                    const data: AuthResponse = await response.json()

                    if (response.ok && data.ok && data.usuario) {
                        const user = mapBackendUserToUser(data.usuario)

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        })

                        // Guardar en cookies
                        if (data.token) {
                            cookieUtils.set('matuc_token', data.token)
                            cookieUtils.set('matuc_role', user.role)
                            cookieUtils.set('matuc_user', JSON.stringify({
                                uid: user.uid,
                                nombre: user.nombre,
                                email: user.email
                            }))
                        }

                        return true
                    } else {
                        set({
                            error: data.message || 'Error de autenticación',
                            isLoading: false
                        })
                        return false
                    }
                } catch {
                    set({
                        error: 'Error de conexión',
                        isLoading: false
                    })
                    return false
                }
            },

            // Acción: Login con Google
            loginGoogle: async (token: string) => {
                set({ isLoading: true, error: null })

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    })

                    const data: AuthResponse = await response.json()

                    if (response.ok && data.ok && data.usuario) {
                        const user = mapBackendUserToUser(data.usuario)

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        })

                        if (data.token) {
                            cookieUtils.set('matuc_token', data.token)
                            cookieUtils.set('matuc_role', user.role)
                        }

                        return true
                    } else {
                        set({
                            error: data.message || 'Error con Google',
                            isLoading: false
                        })
                        return false
                    }
                } catch {
                    set({
                        error: 'Error de conexión con Google',
                        isLoading: false
                    })
                    return false
                }
            },

            // Acción: Login con Outlook/Microsoft
            loginOutlook: async (token: string) => {
                set({ isLoading: true, error: null })

                try {
                    console.log('🔐 Enviando token al backend...')

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/outlook`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    })

                    const data: AuthResponse = await response.json()
                    console.log('📡 Respuesta del backend:', data)

                    if (response.ok && data.ok && data.usuario) {
                        const user = mapBackendUserToUser(data.usuario)

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        })

                        // Guardar en cookies
                        if (data.token) {
                            cookieUtils.set('matuc_token', data.token)
                            cookieUtils.set('matuc_role', user.role)
                            cookieUtils.set('matuc_user', JSON.stringify({
                                uid: user.uid,
                                nombre: user.nombre,
                                email: user.email
                            }))
                        }

                        console.log('✅ Login Outlook exitoso:', getUserDisplayName(user))
                        return true

                    } else {
                        console.error('❌ Error del backend:', data.message)
                        set({
                            error: data.message || 'Error de autenticación con Outlook',
                            isLoading: false
                        })
                        return false
                    }
                } catch (error) {
                    console.error('❌ Error de red:', error)
                    set({
                        error: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
                        isLoading: false
                    })
                    return false
                }
            },

            // Acción: Logout
            logout: async () => {
                // Limpiar cookies
                cookieUtils.remove('matuc_token')
                cookieUtils.remove('matuc_role')
                cookieUtils.remove('matuc_user')

                // Limpiar estado
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                })

                console.log('👋 Logout completado')
            },

            // Acción: Verificar autenticación existente
            checkAuth: async () => {
                set({ isLoading: true })

                try {
                    const token = cookieUtils.get('matuc_token')

                    if (!token) {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                        return
                    }

                    // Verificar token con backend
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    })

                    if (response.ok) {
                        const data: AuthResponse = await response.json()

                        if (data.ok && data.usuario) {
                            const user = mapBackendUserToUser(data.usuario)

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })

                            console.log('✅ Sesión restaurada:', user.email)
                            return
                        }
                    }

                    // Token inválido - limpiar
                    console.log('❌ Token inválido, limpiando sesión')
                    cookieUtils.remove('matuc_token')
                    cookieUtils.remove('matuc_role')
                    cookieUtils.remove('matuc_user')

                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    })

                } catch (error) {
                    console.error('❌ Error verificando auth:', error)
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    })
                }
            },

            // Acciones de estado
            setUser: (user) => set({ user }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            // Utilidades con tipos centralizados
            hasPermission: (permission: string) => {
                const { user } = get()
                return user ? hasPermission(user, permission) : false
            },

            canAccessRoute: (route: string) => {
                const { user } = get()
                return user ? canUserAccessRoute(user, route) : false
            },

            getDisplayName: () => {
                const { user } = get()
                return user ? getUserDisplayName(user) : ''
            }
        }),
        {
            name: 'matuc-auth-store',
            enabled: process.env.NODE_ENV === 'development'
        }
    )
)

// Hooks de conveniencia para usar en componentes
export const useAuth = () => {
    const store = useAuthStore()
    return {
        // Estado
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        error: store.error,

        // Acciones principales
        login: store.login,
        loginGoogle: store.loginGoogle,
        loginOutlook: store.loginOutlook,
        logout: store.logout,

        // Utilidades
        hasPermission: store.hasPermission,
        canAccessRoute: store.canAccessRoute,
        displayName: store.getDisplayName(),

        // Acciones de estado
        clearError: store.clearError,
    }
}

// Hook específico para datos del usuario (optimizado)
export const useUser = () => useAuthStore((state) => state.user)

// Hook para loading state (optimizado)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)

// Hook para errores (optimizado)
export const useAuthError = () => useAuthStore((state) => state.error)