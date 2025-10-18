// src/components/chapters/ChapterHeader.tsx
// ==========================================
// 📚 HEADER COMPACTO DE CAPÍTULO - MATUC v4
// ==========================================

'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Sparkles,
    Target,
    Clock,
    BookOpen,
    Settings,
    BarChart3,
    Edit,
    Eye,
    EyeOff,
    ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import type { CapituloFiltrado, PermisosCapitulo, ProgresoCapitulo } from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ChapterHeaderProps {
    capitulo: CapituloFiltrado
    courseId: string
    permisos: PermisosCapitulo
    progreso?: ProgresoCapitulo
    onEdit?: () => void
    onSettings?: () => void
    onViewStats?: () => void
    onToggleVisibility?: () => void
}

// ==========================================
// 📚 COMPONENTE PRINCIPAL
// ==========================================

export default function ChapterHeader({
    capitulo,
    courseId,
    permisos,
    progreso,
    onEdit,
    onSettings,
    onViewStats,
    onToggleVisibility,
}: ChapterHeaderProps) {
    const router = useRouter()
    const [showObjectives, setShowObjectives] = useState(false)

    return (
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
                {/* Fila principal compacta */}
                <div className="flex items-center justify-between gap-4">
                    {/* Lado izquierdo: Breadcrumb + Título */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Botón volver */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/courses/${courseId}`)}
                            className="flex items-center gap-2 text-gray-600 hover:text-uc-azul transition-colors shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Título e ícono */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-1.5 bg-gradient-to-br from-uc-celeste to-uc-azul rounded-lg shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-gray-900 truncate">
                                    {capitulo.titulo}
                                </h1>
                                <p className="text-sm text-gray-600 truncate">
                                    {capitulo.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Centro: Stats compactas */}
                    <div className="hidden lg:flex items-center gap-4 text-sm text-gray-600 shrink-0">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-uc-azul" />
                            <span>{capitulo.temasVisibles} temas</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-uc-celeste" />
                            <span>{capitulo.contenidosHabilitados}/{capitulo.contenidosTotales}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>{capitulo.duracionTotalMinutos} min</span>
                        </div>

                        {/* Progreso (solo estudiantes) */}
                        {progreso && (
                            <>
                                <div className="w-px h-4 bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Progreso:</span>
                                    <span className="font-semibold text-uc-celeste">
                                        {Math.round(progreso.porcentajeProgreso)}%
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Derecha: Acciones */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Badge de progreso móvil (solo estudiantes) */}
                        {progreso && (
                            <div className="lg:hidden">
                                <ProgressBadge percentage={progreso.porcentajeProgreso} />
                            </div>
                        )}

                        {/* Botón objetivos */}
                        {capitulo.objetivos.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowObjectives(!showObjectives)}
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Target className="w-4 h-4" />
                                <span>Objetivos</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${showObjectives ? 'rotate-180' : ''}`}
                                />
                            </motion.button>
                        )}

                        {/* Acciones de profesor/admin */}
                        {(permisos.puedeEditar || permisos.puedeVerEstadisticas) && (
                            <div className="hidden md:flex items-center gap-2">
                                {permisos.puedeVerEstadisticas && onViewStats && (
                                    <ActionButton
                                        icon={<BarChart3 className="w-4 h-4" />}
                                        onClick={onViewStats}
                                        variant="secondary"
                                        tooltip="Estadísticas"
                                    />
                                )}
                                {permisos.puedeEditar && onToggleVisibility && (
                                    <ActionButton
                                        icon={capitulo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        onClick={onToggleVisibility}
                                        variant={capitulo.visible ? 'success' : 'warning'}
                                        tooltip={capitulo.visible ? 'Visible' : 'Oculto'}
                                    />
                                )}
                                {permisos.puedeEditar && onEdit && (
                                    <ActionButton
                                        icon={<Edit className="w-4 h-4" />}
                                        onClick={onEdit}
                                        variant="primary"
                                        tooltip="Editar"
                                    />
                                )}
                                {permisos.puedeEditar && onSettings && (
                                    <ActionButton
                                        icon={<Settings className="w-4 h-4" />}
                                        onClick={onSettings}
                                        variant="secondary"
                                        tooltip="Configurar"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de objetivos expandible */}
                {showObjectives && capitulo.objetivos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-200"
                    >
                        <div className="bg-blue-50/50 rounded-lg p-3">
                            <ul className="space-y-1.5">
                                {capitulo.objetivos.map((objetivo, index) => (
                                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="text-blue-400 mt-0.5">•</span>
                                        <span>{objetivo}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: PROGRESS BADGE
// ==========================================

function ProgressBadge({ percentage }: { percentage: number }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-uc-celeste/10 rounded-lg border border-uc-celeste/20">
            <div className="w-8 h-8 relative">
                <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-200"
                    />
                    <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - percentage / 100)}`}
                        className="text-uc-celeste transition-all duration-500"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">
                        {Math.round(percentage)}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: ACTION BUTTON
// ==========================================

interface ActionButtonProps {
    icon: React.ReactNode
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'success' | 'warning'
    tooltip?: string
}

function ActionButton({ icon, onClick, variant = 'secondary', tooltip }: ActionButtonProps) {
    const variantStyles = {
        primary: 'bg-uc-azul hover:bg-uc-azul/90 text-white',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        success: 'bg-green-100 hover:bg-green-200 text-green-700',
        warning: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        p-2 rounded-lg font-medium text-sm transition-colors
        ${variantStyles[variant]}
      `}
            title={tooltip}
        >
            {icon}
        </motion.button>
    )
}