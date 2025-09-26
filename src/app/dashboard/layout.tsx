// src/app/(dashboard)/layout.tsx - Layout principal del dashboard con sidebar hermoso
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/stores/auth.store'

import {
    Home,
    BookOpen,
    Calculator,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
    Search,
    LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import { User } from '@/types/user.types'

interface DashboardLayoutProps {
    children: React.ReactNode
}

interface NavigationItem {
    icon: LucideIcon
    label: string
    href: Route | string
}

// Configuración de navegación por rol - Usando Route types de Next.js
const getNavigationItems = (role: string): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' as Route },
    ]

    const studentItems: NavigationItem[] = [
        { icon: BookOpen, label: 'Mis Cursos', href: '/dashboard/courses' as Route },
        { icon: Calculator, label: 'Ejercicios', href: '/dashboard/exercises' as Route },
        { icon: BarChart3, label: 'Mi Progreso', href: '/dashboard/progress' as Route },
    ]

    const teacherItems: NavigationItem[] = [
        { icon: BookOpen, label: 'Cursos', href: '/dashboard/courses' as Route },
        { icon: Calculator, label: 'Ejercicios', href: '/dashboard/exercises' as Route },
        { icon: Users, label: 'Estudiantes', href: '/dashboard/students' as Route },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' as Route },
    ]

    const adminItems: NavigationItem[] = [
        { icon: BookOpen, label: 'Cursos', href: '/dashboard/courses' as Route },
        { icon: Users, label: 'Usuarios', href: '/dashboard/users' as Route },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' as Route },
        { icon: Settings, label: 'Sistema', href: '/dashboard/settings' as Route },
    ]

    switch (role) {
        case 'estudiante':
            return [...baseItems, ...studentItems]
        case 'profesor':
        case 'profesor_editor':
            return [...baseItems, ...teacherItems]
        case 'administrador':
            return [...baseItems, ...adminItems]
        default:
            return baseItems
    }
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout, displayName } = useAuth()
    const pathname = usePathname()

    const navigationItems = getNavigationItems(user?.role || 'estudiante')

    const handleLogout = async () => {
        await logout()
        // Redirect será manejado por el AuthProvider
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Sidebar Desktop */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col shadow-sm"
            >
                <SidebarContent
                    navigationItems={navigationItems}
                    pathname={pathname}
                    user={user}
                    displayName={displayName}
                    onLogout={handleLogout}
                />
            </motion.aside>

            {/* Sidebar Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl"
                        >
                            <SidebarContent
                                navigationItems={navigationItems}
                                pathname={pathname}
                                user={user}
                                displayName={displayName}
                                onLogout={handleLogout}
                                onClose={() => setSidebarOpen(false)}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Top Navigation */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between shadow-sm">

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Page title / Breadcrumb */}
                    <div className="flex-1 lg:flex-none">
                        <motion.h1
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-semibold text-gray-900 capitalize"
                        >
                            {pathname === '/dashboard' ? 'Dashboard' :
                                pathname.split('/').pop()?.replace('-', ' ') || 'MATUC'}
                        </motion.h1>
                    </div>

                    {/* Top actions */}
                    <div className="flex items-center space-x-3">

                        {/* Search */}
                        <button className="hidden md:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-uc-amarillo rounded-full"></span>
                        </button>

                        {/* User info desktop */}
                        <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-uc-azul to-uc-celeste rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {displayName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 lg:p-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

// Componente del contenido del sidebar (reutilizable)
function SidebarContent({
    navigationItems,
    pathname,
    user,
    displayName,
    onLogout,
    onClose
}: {
    navigationItems: NavigationItem[]
    pathname: string
    user: User | null
    displayName: string
    onLogout: () => void
    onClose?: () => void
}) {
    return (
        <>
            {/* Logo Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <motion.div
                            className="bg-gradient-to-br from-uc-azul to-uc-celeste rounded-xl p-2"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.7 }}
                        >
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                            </svg>
                        </motion.div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">MATUC</span>
                            <div className="text-xs text-uc-amarillo font-semibold">v4.0</div>
                        </div>
                    </Link>

                    {/* Close button mobile */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 text-gray-600 hover:text-gray-900 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-uc-azul to-uc-celeste rounded-full flex items-center justify-center text-white font-semibold">
                        {displayName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link key={index} href={item.href as Route} onClick={onClose}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-uc-azul text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    }`} />
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </motion.button>
            </div>
        </>
    )
}