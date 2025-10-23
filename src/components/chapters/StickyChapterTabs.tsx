// src/components/chapters/StickyChapterTabs.tsx
// ==========================================
// 🎯 TABS STICKY DESTACADOS - MATUC v4
// ==========================================

'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react'

// ==========================================
// 🎯 TIPOS
// ==========================================

type TabType = 'clase' | 'ayudantia' | 'evaluacion'

interface TabConfig {
    id: TabType
    label: string
    icon: React.ReactNode
    count: number
}

interface StickyChapterTabsProps {
    /** Tab activo actual */
    activeTab: TabType

    /** Callback al cambiar de tab */
    onTabChange: (tab: TabType) => void

    /** Conteos por tab */
    counts: {
        clase: number
        ayudantia: number
        evaluacion: number
    }

    /** Clase CSS adicional */
    className?: string
}

// ==========================================
// 🎨 COMPONENTE PRINCIPAL
// ==========================================

export default function StickyChapterTabs({
    activeTab,
    onTabChange,
    counts,
    className = '',
}: StickyChapterTabsProps) {

    // ==========================================
    // 📊 CONFIGURACIÓN DE TABS
    // ==========================================

    const tabs: TabConfig[] = [
        {
            id: 'clase',
            label: 'Clase',
            icon: <BookOpen className="w-5 h-5" />,
            count: counts.clase,
        },
        {
            id: 'ayudantia',
            label: 'Ayudantía',
            icon: <GraduationCap className="w-5 h-5" />,
            count: counts.ayudantia,
        },
        {
            id: 'evaluacion',
            label: 'Evaluación',
            icon: <ClipboardCheck className="w-5 h-5" />,
            count: counts.evaluacion,
        },
    ]

    return (
        <div
            className={`
        sticky top-0 z-50 
        bg-white/98 backdrop-blur-xl
        border-t-4 border-b-4 border-uc-amarillo
        shadow-lg
        ${className}
      `}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={() => onTabChange(tab.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 🔘 COMPONENTE: TAB BUTTON
// ==========================================

interface TabButtonProps {
    tab: TabConfig
    isActive: boolean
    onClick: () => void
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: isActive ? 1 : 1.02, y: isActive ? 0 : -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative group flex-1 md:flex-none"
        >
            {/* Contenedor del botón */}
            <div
                className={`
          relative overflow-hidden rounded-xl
          transition-all duration-300
          ${isActive
                        ? 'bg-gradient-to-r from-uc-azul to-uc-celeste shadow-xl'
                        : 'bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-uc-celeste'
                    }
        `}
            >
                {/* Efectos de fondo para tab activo */}
                {isActive && (
                    <>
                        <div className="absolute inset-0 bg-white/10" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12" />
                    </>
                )}

                {/* Contenido del tab */}
                <div className="relative z-10 px-6 py-3 flex items-center justify-center gap-3">
                    {/* Ícono */}
                    <div
                        className={`
              transition-colors duration-300
              ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-uc-azul'}
            `}
                    >
                        {tab.icon}
                    </div>

                    {/* Label */}
                    <span
                        className={`
              font-bold text-lg whitespace-nowrap
              transition-colors duration-300
              ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-uc-azul'}
            `}
                    >
                        {tab.label}
                    </span>

                    {/* Count badge */}
                    <div
                        className={`
              px-2.5 py-1 rounded-full text-sm font-bold
              transition-all duration-300
              ${isActive
                                ? 'bg-white/25 text-white backdrop-blur-sm'
                                : 'bg-gray-200 text-gray-600 group-hover:bg-uc-celeste/20 group-hover:text-uc-azul'
                            }
            `}
                    >
                        {tab.count}
                    </div>
                </div>

                {/* Barra inferior para tab activo */}
                {isActive && (
                    <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-uc-amarillo rounded-t-full"
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                        }}
                    />
                )}
            </div>

            {/* Glow effect en hover para tabs inactivos */}
            {!isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-uc-celeste/10 to-uc-azul/10 -z-10 blur-xl"
                />
            )}
        </motion.button>
    )
}

// ==========================================
// 📱 VERSIÓN MOBILE (OPCIONAL)
// ==========================================

export function MobileStickyTabs({
    activeTab,
    onTabChange,
    counts,
}: StickyChapterTabsProps) {
    const tabs: TabConfig[] = [
        {
            id: 'clase',
            label: 'Clase',
            icon: <BookOpen className="w-4 h-4" />,
            count: counts.clase,
        },
        {
            id: 'ayudantia',
            label: 'Ayud.',
            icon: <GraduationCap className="w-4 h-4" />,
            count: counts.ayudantia,
        },
        {
            id: 'evaluacion',
            label: 'Eval.',
            icon: <ClipboardCheck className="w-4 h-4" />,
            count: counts.evaluacion,
        },
    ]

    return (
        <div className="sticky top-0 z-50 bg-white/98 backdrop-blur-xl border-t-2 border-b-2 border-uc-amarillo shadow-lg md:hidden">
            <div className="px-4 py-2">
                <div className="flex items-center gap-2">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-lg
                transition-all duration-200
                ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-uc-azul to-uc-celeste text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600'
                                }
              `}
                        >
                            {tab.icon}
                            <span className="text-xs font-semibold">{tab.label}</span>
                            <span
                                className={`
                  text-xs font-bold px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.id
                                        ? 'bg-white/25 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }
                `}
                            >
                                {tab.count}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    )
}