// src/lib/stores/auth.store.ts - Store de autenticación con Zustand + Next.js 15 (SIN IMMER)
'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Tipos principales para autenticación
export interface User {
    uid: string
    nombre: string
    apellido: string
    email: string
    admin: boolean
    role: 'estudiante' | 'ayudante' | 'profesor' | 'profesor_editor' | 'administrador'
    ultimaConexion?: Date
    conectado: boolean
    avatar?: string
}

// Interface del store de autenticación
interface AuthStore {
    // Estado
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

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

    // Utilidades
    hasPermission: (permission: string) => boolean
    isRole: (role: string) => boolean
    getDisplayName: () => string
}

// Store principal usando Zustand SIN immer
export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
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
                        // TODO: Conectar con tu backend existente
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password }),
                        })

                        const data = await response.json()

                        if (response.ok && data.ok) {
                            const user: User = {
                                uid: data.usuario.uid,
                                nombre: data.usuario.nombre,
                                apellido: data.usuario.apellido,
                                email: data.usuario.email,
                                admin: data.usuario.admin,
                                role: data.usuario.admin ? 'administrador' : 'estudiante',
                                conectado: true,
                                ultimaConexion: new Date()
                            }

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })

                            // Guardar token
                            if (data.token) {
                                localStorage.setItem('matuc_token', data.token)
                            }

                            return true
                        } else {
                            set({
                                error: data.message || 'Credenciales incorrectas',
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

                // Acción: Login con Google OAuth
                loginGoogle: async (credential: string) => {
                    set({ isLoading: true, error: null })

                    try {
                        const response = await fetch('/api/auth/google', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ credential }),
                        })

                        const data = await response.json()

                        if (response.ok && data.ok) {
                            const user: User = {
                                uid: data.usuario.uid,
                                nombre: data.usuario.nombre,
                                apellido: data.usuario.apellido,
                                email: data.usuario.email,
                                admin: data.usuario.admin,
                                role: data.usuario.admin ? 'administrador' : 'estudiante',
                                conectado: true,
                                ultimaConexion: new Date()
                            }

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })

                            if (data.token) {
                                localStorage.setItem('matuc_token', data.token)
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
                loginOutlook: async (credential: string) => {
                    set({ isLoading: true, error: null })

                    try {
                        // Usar el endpoint que ya tienes en tu backend
                        const response = await fetch('/api/auth/outlook', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ credential }),
                        })

                        const data = await response.json()

                        if (response.ok && data.ok) {
                            const user: User = {
                                uid: data.usuario.uid,
                                nombre: data.usuario.nombre,
                                apellido: data.usuario.apellido,
                                email: data.usuario.email,
                                admin: data.usuario.admin,
                                role: data.usuario.admin ? 'administrador' : 'estudiante',
                                conectado: true,
                                ultimaConexion: new Date()
                            }

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })

                            if (data.token) {
                                localStorage.setItem('matuc_token', data.token)
                            }

                            return true
                        } else {
                            set({
                                error: data.message || 'Error con Outlook',
                                isLoading: false
                            })
                            return false
                        }
                    } catch {
                        set({
                            error: 'Error de conexión con Outlook',
                            isLoading: false
                        })
                        return false
                    }
                },

                // Acción: Cerrar sesión
                logout: async () => {
                    set({ isLoading: true })

                    try {
                        const token = localStorage.getItem('matuc_token')

                        if (token) {
                            // Notificar al backend
                            await fetch('/api/auth/logout', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                            })
                        }

                        // Limpiar estado local
                        localStorage.removeItem('matuc_token')

                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null
                        })

                    } catch (error) {
                        console.error('Error en logout:', error)

                        // Limpiar estado local aunque falle
                        localStorage.removeItem('matuc_token')

                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null
                        })
                    }
                },

                // Acción: Verificar autenticación existente
                checkAuth: async () => {
                    const token = localStorage.getItem('matuc_token')

                    if (!token) {
                        set({
                            isLoading: false,
                            isAuthenticated: false,
                            user: null
                        })
                        return
                    }

                    set({ isLoading: true })

                    try {
                        // Usar tu endpoint de verificación existente
                        const response = await fetch('/api/auth/me', {
                            headers: { 'Authorization': `Bearer ${token}` },
                        })

                        const data = await response.json()

                        if (response.ok && data.ok) {
                            const user: User = {
                                uid: data.usuario.uid,
                                nombre: data.usuario.nombre,
                                apellido: data.usuario.apellido,
                                email: data.usuario.email,
                                admin: data.usuario.admin,
                                role: data.usuario.admin ? 'administrador' : 'estudiante',
                                conectado: true,
                                ultimaConexion: new Date()
                            }

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })
                        } else {
                            // Token inválido
                            localStorage.removeItem('matuc_token')

                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                                error: null
                            })
                        }
                    } catch (error) {
                        console.error('Error verificando auth:', error)

                        set({
                            isLoading: false,
                            error: 'Error de verificación'
                        })
                    }
                },

                // Acciones de estado directo
                setUser: (user: User | null) => {
                    set({
                        user,
                        isAuthenticated: !!user
                    })
                },

                setLoading: (loading: boolean) => {
                    set({ isLoading: loading })
                },

                setError: (error: string | null) => {
                    set({ error })
                },

                clearError: () => {
                    set({ error: null })
                },

                // Utilidad: Verificar permisos por rol
                hasPermission: (permission: string) => {
                    const { user } = get()
                    if (!user) return false

                    // Admin tiene todos los permisos
                    if (user.admin || user.role === 'administrador') return true

                    // Mapa de permisos por rol
                    const rolePermissions = {
                        estudiante: [
                            'read_content',
                            'submit_exercises',
                            'view_progress'
                        ],
                        ayudante: [
                            'read_content',
                            'submit_exercises',
                            'moderate_chat',
                            'help_students'
                        ],
                        profesor: [
                            'read_content',
                            'create_content',
                            'manage_students',
                            'view_analytics',
                            'create_exercises'
                        ],
                        profesor_editor: [
                            'read_content',
                            'create_content',
                            'edit_content',
                            'manage_students',
                            'view_analytics',
                            'create_exercises',
                            'edit_any_content'
                        ],
                        administrador: ['*'] // Todos los permisos
                    }

                    const userPermissions = rolePermissions[user.role] || []
                    return userPermissions.includes(permission) || userPermissions.includes('*')
                },

                // Utilidad: Verificar rol específico
                isRole: (role: string) => {
                    const { user } = get()
                    return user?.role === role
                },

                // Utilidad: Nombre completo para display
                getDisplayName: () => {
                    const { user } = get()
                    if (!user) return 'Usuario'
                    return `${user.nombre} ${user.apellido}`.trim()
                },

            }),
            {
                name: 'matuc-auth-store',
                // Solo persistir datos esenciales
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
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
        isRole: store.isRole,
        displayName: store.getDisplayName(),

        // Acciones de estado
        clearError: store.clearError,
    }
}

// Hook específico para datos del usuario (optimizado)
export const useUser = () => {
    return useAuthStore((state) => state.user)
}

// Hook para loading state (optimizado)
export const useAuthLoading = () => {
    return useAuthStore((state) => state.isLoading)
}

// Hook para errores (optimizado)
export const useAuthError = () => {
    return useAuthStore((state) => state.error)
}

// Hook para verificar permisos específicos
export const usePermission = (permission: string) => {
    return useAuthStore((state) => state.hasPermission(permission))
}

// Hook para verificar rol específico
export const useRole = (role: string) => {
    return useAuthStore((state) => state.isRole(role))
}