// src/components/chapters/CompactChapterHeader.tsx
// ==========================================
// 📚 HEADER COMPACTO DESTACADO - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Sparkles,
    BookOpen,
    Clock,
    Target,
    TrendingUp,
    ChevronDown,
    Eye,
    EyeOff,
    BarChart3,
    X,
} from 'lucide-react'
import type { CapituloFiltrado, PermisosCapitulo, ProgresoCapitulo } from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CompactChapterHeaderProps {
    /** Información del capítulo */
    capitulo: CapituloFiltrado

    /** Nombre completo del curso (ej: "MAT1610 - Cálculo I") */
    courseName: string

    /** ID del curso para navegación */
    courseId: string

    /** Permisos del usuario actual */
    permisos: PermisosCapitulo

    /** Progreso del estudiante (opcional) */
    progreso?: ProgresoCapitulo

    /** Callbacks opcionales */
    onViewStats?: () => void
    onToggleVisibility?: () => void
}

// ==========================================
// 📚 COMPONENTE PRINCIPAL
// ==========================================

export default function CompactChapterHeader({
    capitulo,
    courseName,
    courseId,
    permisos,
    progreso,
    onViewStats,
    onToggleVisibility,
}: CompactChapterHeaderProps) {
    const router = useRouter()
    const [showObjectives, setShowObjectives] = useState(false)

    return (
        <div className="bg-white border-b border-gray-200">
            {/* ==========================================
          SECCIÓN 1: BREADCRUMB (40px)
          ========================================== */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Botón volver + Nombre del curso */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push(`/courses/${courseId}`)}
                                className="flex items-center gap-2 text-gray-600 hover:text-uc-azul transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Volver</span>
                            </motion.button>

                            <div className="w-px h-4 bg-gray-300" />

                            <h2 className="text-sm font-semibold text-uc-azul">
                                {courseName}
                            </h2>
                        </div>

                        {/* Acciones rápidas (profesor/admin) */}
                        {(permisos.puedeVerEstadisticas || permisos.puedeEditar) && (
                            <div className="flex items-center gap-2">
                                {permisos.puedeVerEstadisticas && onViewStats && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onViewStats}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Ver estadísticas"
                                    >
                                        <BarChart3 className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                )}

                                {permisos.puedeEditar && onToggleVisibility && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onToggleVisibility}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={capitulo.visible ? 'Ocultar capítulo' : 'Mostrar capítulo'}
                                    >
                                        {capitulo.visible ? (
                                            <Eye className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ==========================================
          SECCIÓN 2: HERO CAPÍTULO (80px)
          ========================================== */}
            <div className="relative overflow-hidden bg-gradient-to-r from-uc-azul to-uc-celeste">
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-32 -translate-x-32" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-4">
                        {/* Ícono del capítulo */}
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shrink-0"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                            {/* Badge + Título */}
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2.5 py-1 bg-white/25 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                    CAPÍTULO {capitulo.orden}
                                </span>
                            </div>

                            {/* Título del capítulo */}
                            <h1 className="text-2xl font-bold text-white mb-1 leading-tight">
                                {capitulo.titulo}
                            </h1>

                            {/* Descripción */}
                            <p className="text-sm text-white/90 line-clamp-1">
                                {capitulo.descripcion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==========================================
          SECCIÓN 3: STATS CARDS (50px)
          ========================================== */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Stat: Temas */}
                        <StatCard
                            icon={<BookOpen className="w-4 h-4" />}
                            value={capitulo.temasVisibles}
                            label="Temas"
                            color="blue"
                        />

                        {/* Stat: Duración */}
                        <StatCard
                            icon={<Clock className="w-4 h-4" />}
                            value={`${capitulo.duracionTotalMinutos}min`}
                            label="Duración"
                            color="purple"
                        />

                        {/* Stat: Progreso (solo estudiantes) */}
                        {progreso && (
                            <StatCard
                                icon={<TrendingUp className="w-4 h-4" />}
                                value={`${Math.round(progreso.porcentajeProgreso)}%`}
                                label="Progreso"
                                color="green"
                            />
                        )}

                        {/* Stat: Completados (solo estudiantes) */}
                        {progreso && (
                            <StatCard
                                icon={<Target className="w-4 h-4" />}
                                value={`${progreso.contenidosCompletados}/${progreso.contenidosTotales}`}
                                label="Completados"
                                color="orange"
                            />
                        )}

                        {/* Botón Ver Objetivos */}
                        {capitulo.objetivos.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowObjectives(!showObjectives)}
                                className="ml-auto flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-sm font-medium text-gray-700 hover:text-uc-azul"
                            >
                                <Target className="w-4 h-4" />
                                <span>Ver Objetivos ({capitulo.objetivos.length})</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${showObjectives ? 'rotate-180' : ''
                                        }`}
                                />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* ==========================================
          MODAL: OBJETIVOS (Expandible)
          ========================================== */}
            <AnimatePresence>
                {showObjectives && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-b border-gray-100 bg-blue-50/50"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-4">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-uc-azul" />
                                    Objetivos de Aprendizaje
                                </h3>
                                <button
                                    onClick={() => setShowObjectives(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {capitulo.objetivos.map((objetivo, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3 text-sm text-gray-700"
                                    >
                                        <span className="flex-shrink-0 w-6 h-6 bg-uc-celeste/20 text-uc-azul rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span>{objetivo}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ==========================================
// 📊 COMPONENTE: STAT CARD
// ==========================================

interface StatCardProps {
    icon: React.ReactNode
    value: string | number
    label: string
    color: 'blue' | 'purple' | 'green' | 'orange'
}

function StatCard({ icon, value, label, color }: StatCardProps) {
    const colorClasses = {
        blue: 'text-uc-azul bg-blue-50 border-blue-200',
        purple: 'text-purple-600 bg-purple-50 border-purple-200',
        green: 'text-green-600 bg-green-50 border-green-200',
        orange: 'text-orange-600 bg-orange-50 border-orange-200',
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
            <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <div className="text-sm font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
            </div>
        </div>
    )
}