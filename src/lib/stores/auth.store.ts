// src/lib/stores/ui.store.ts - Store Zustand para Estado de UI
'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Tipos
export type Theme = 'light' | 'dark' | 'system'
export type SidebarState = 'open' | 'closed' | 'collapsed'

export interface ToastMessage {
    id: string
    title: string
    description?: string
    variant: 'default' | 'success' | 'error' | 'warning' | 'info' | 'uc'
    duration?: number
}

export interface UIState {
    // Tema
    theme: Theme
    isDarkMode: boolean

    // Layout
    sidebarState: SidebarState
    isMobile: boolean

    // Modals
    modals: Record<string, boolean>

    // Loading states
    loadingStates: Record<string, boolean>

    // Toasts (respaldo si no usas ToastProvider)
    toasts: ToastMessage[]

    // Acciones de tema
    setTheme: (theme: Theme) => void
    toggleTheme: () => void

    // Acciones de layout  
    setSidebarState: (state: SidebarState) => void
    toggleSidebar: () => void
    setMobile: (isMobile: boolean) => void

    // Acciones de modals
    openModal: (modalId: string) => void
    closeModal: (modalId: string) => void
    toggleModal: (modalId: string) => void
    isModalOpen: (modalId: string) => boolean

    // Acciones de loading
    setLoading: (key: string, isLoading: boolean) => void
    isLoading: (key: string) => boolean

    // Acciones de toasts
    addToast: (toast: Omit<ToastMessage, 'id'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

// Store principal de UI
export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set, get) => ({
                // Estado inicial
                theme: 'system',
                isDarkMode: false,
                sidebarState: 'open',
                isMobile: false,
                modals: {},
                loadingStates: {},
                toasts: [],

                // Acciones de tema
                setTheme: (theme) => {
                    set({ theme }, false, 'setTheme')

                    // Actualizar isDarkMode basado en el tema
                    if (theme === 'dark') {
                        set({ isDarkMode: true }, false, 'setDarkMode')
                        document.documentElement.classList.add('dark')
                        document.documentElement.classList.remove('light')
                    } else if (theme === 'light') {
                        set({ isDarkMode: false }, false, 'setLightMode')
                        document.documentElement.classList.add('light')
                        document.documentElement.classList.remove('dark')
                    } else {
                        // System theme
                        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                        set({ isDarkMode: systemDark }, false, 'setSystemMode')
                        document.documentElement.classList.toggle('dark', systemDark)
                        document.documentElement.classList.toggle('light', !systemDark)
                    }
                },

                toggleTheme: () => {
                    const { theme } = get()
                    const newTheme = theme === 'dark' ? 'light' : 'dark'
                    get().setTheme(newTheme)
                },

                // Acciones de layout
                setSidebarState: (sidebarState) =>
                    set({ sidebarState }, false, 'setSidebarState'),

                toggleSidebar: () => {
                    const { sidebarState } = get()
                    const newState = sidebarState === 'open' ? 'collapsed' : 'open'
                    set({ sidebarState: newState }, false, 'toggleSidebar')
                },

                setMobile: (isMobile) =>
                    set({ isMobile }, false, 'setMobile'),

                // Acciones de modals
                openModal: (modalId) =>
                    set(
                        (state) => ({
                            modals: { ...state.modals, [modalId]: true }
                        }),
                        false,
                        'openModal'
                    ),

                closeModal: (modalId) =>
                    set(
                        (state) => ({
                            modals: { ...state.modals, [modalId]: false }
                        }),
                        false,
                        'closeModal'
                    ),

                toggleModal: (modalId) => {
                    const { modals } = get()
                    const isOpen = modals[modalId] || false
                    if (isOpen) {
                        get().closeModal(modalId)
                    } else {
                        get().openModal(modalId)
                    }
                },

                isModalOpen: (modalId) => {
                    const { modals } = get()
                    return modals[modalId] || false
                },

                // Acciones de loading
                setLoading: (key, isLoading) =>
                    set(
                        (state) => ({
                            loadingStates: { ...state.loadingStates, [key]: isLoading }
                        }),
                        false,
                        'setLoading'
                    ),

                isLoading: (key) => {
                    const { loadingStates } = get()
                    return loadingStates[key] || false
                },

                // Acciones de toasts
                addToast: (toast) => {
                    const id = Math.random().toString(36).substr(2, 9)
                    const newToast = { ...toast, id }

                    set(
                        (state) => ({
                            toasts: [...state.toasts, newToast]
                        }),
                        false,
                        'addToast'
                    )

                    // Auto remove after duration
                    if (toast.duration !== 0) {
                        setTimeout(() => {
                            get().removeToast(id)
                        }, toast.duration || 5000)
                    }
                },

                removeToast: (id) =>
                    set(
                        (state) => ({
                            toasts: state.toasts.filter(toast => toast.id !== id)
                        }),
                        false,
                        'removeToast'
                    ),

                clearToasts: () =>
                    set({ toasts: [] }, false, 'clearToasts')
            }),
            {
                name: 'ui-store',
                partialize: (state) => ({
                    theme: state.theme,
                    sidebarState: state.sidebarState
                })
            }
        ),
        {
            name: 'ui-store',
            enabled: process.env.NODE_ENV === 'development'
        }
    )
)

// Selectores optimizados
export const useTheme = () => useUIStore(state => state.theme)
export const useIsDarkMode = () => useUIStore(state => state.isDarkMode)
export const useSidebarState = () => useUIStore(state => state.sidebarState)
export const useIsMobile = () => useUIStore(state => state.isMobile)

// Hook para manejo de modals
export const useModal = (modalId: string) => {
    const isOpen = useUIStore(state => state.isModalOpen(modalId))
    const openModal = useUIStore(state => state.openModal)
    const closeModal = useUIStore(state => state.closeModal)
    const toggleModal = useUIStore(state => state.toggleModal)

    return {
        isOpen,
        open: () => openModal(modalId),
        close: () => closeModal(modalId),
        toggle: () => toggleModal(modalId)
    }
}

// Hook para manejo de loading states
export const useLoading = (key: string) => {
    const isLoading = useUIStore(state => state.isLoading(key))
    const setLoading = useUIStore(state => state.setLoading)

    return {
        isLoading,
        setLoading: (loading: boolean) => setLoading(key, loading)
    }
}

// Hook para toasts (respaldo del ToastProvider)
export const useUIToasts = () => {
    const toasts = useUIStore(state => state.toasts)
    const addToast = useUIStore(state => state.addToast)
    const removeToast = useUIStore(state => state.removeToast)
    const clearToasts = useUIStore(state => state.clearToasts)

    return {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        // Helper methods
        success: (title: string, description?: string) =>
            addToast({ title, description, variant: 'success' }),
        error: (title: string, description?: string) =>
            addToast({ title, description, variant: 'error' }),
        warning: (title: string, description?: string) =>
            addToast({ title, description, variant: 'warning' }),
        info: (title: string, description?: string) =>
            addToast({ title, description, variant: 'info' }),
        uc: (title: string, description?: string) =>
            addToast({ title, description, variant: 'uc' })
    }
}

// Hook completo de UI
export const useUI = () => {
    const store = useUIStore()

    return {
        // Tema
        theme: store.theme,
        isDarkMode: store.isDarkMode,
        setTheme: store.setTheme,
        toggleTheme: store.toggleTheme,

        // Layout
        sidebarState: store.sidebarState,
        isMobile: store.isMobile,
        setSidebarState: store.setSidebarState,
        toggleSidebar: store.toggleSidebar,
        setMobile: store.setMobile,

        // Modals
        openModal: store.openModal,
        closeModal: store.closeModal,
        toggleModal: store.toggleModal,
        isModalOpen: store.isModalOpen,

        // Loading
        setLoading: store.setLoading,
        isLoading: store.isLoading,

        // Toasts
        addToast: store.addToast,
        removeToast: store.removeToast,
        clearToasts: store.clearToasts
    }
}