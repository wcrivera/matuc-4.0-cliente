// src/components/chapters/ChapterHeader.tsx
// ==========================================
// 📚 HEADER DE CAPÍTULO - MATUC v4
// ==========================================

'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Sparkles,
    Target,
    Clock,
    TrendingUp,
    BookOpen,
    Settings,
    BarChart3,
    Edit,
    Eye,
    EyeOff,
} from 'lucide-react'
import type { CapituloFiltrado, PermisosCapitulo, ProgresoCapitulo } from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ChapterHeaderProps {
    /** Datos del capítulo */
    capitulo: CapituloFiltrado

    /** ID del curso para navegación */
    courseId: string

    /** Permisos del usuario actual */
    permisos: PermisosCapitulo

    /** Progreso del estudiante (opcional) */
    progreso?: ProgresoCapitulo

    /** Callbacks opcionales */
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

    // ==========================================
    // 🎨 ANIMACIONES
    // ==========================================

    const headerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const statsVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { delay: 0.4 } },
    }

    // ==========================================
    // 🎨 RENDER
    // ==========================================

    return (
        <motion.div
            variants={headerVariants}
            initial="initial"
            animate="animate"
            className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
        >
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between mb-6">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/courses/${courseId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-uc-azul transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Volver al curso</span>
                    </motion.button>

                    {/* Acciones de profesor/admin */}
                    {(permisos.puedeEditar || permisos.puedeVerEstadisticas) && (
                        <div className="flex items-center gap-2">
                            {permisos.puedeVerEstadisticas && onViewStats && (
                                <ActionButton
                                    icon={<BarChart3 className="w-4 h-4" />}
                                    label="Estadísticas"
                                    onClick={onViewStats}
                                    variant="secondary"
                                />
                            )}
                            {permisos.puedeEditar && onToggleVisibility && (
                                <ActionButton
                                    icon={capitulo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    label={capitulo.visible ? 'Visible' : 'Oculto'}
                                    onClick={onToggleVisibility}
                                    variant={capitulo.visible ? 'success' : 'warning'}
                                />
                            )}
                            {permisos.puedeEditar && onEdit && (
                                <ActionButton
                                    icon={<Edit className="w-4 h-4" />}
                                    label="Editar"
                                    onClick={onEdit}
                                    variant="primary"
                                />
                            )}
                            {permisos.puedeEditar && onSettings && (
                                <ActionButton
                                    icon={<Settings className="w-4 h-4" />}
                                    label="Configurar"
                                    onClick={onSettings}
                                    variant="secondary"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Título y descripción */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-6">
                        {/* Lado izquierdo: Info */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-3"
                            >
                                <div className="p-2 bg-gradient-to-br from-uc-celeste to-uc-azul rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">{capitulo.titulo}</h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                                className="text-lg text-gray-600 max-w-3xl mb-4"
                            >
                                {capitulo.descripcion}
                            </motion.p>

                            {/* Objetivos */}
                            {capitulo.objetivos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                                    className="mt-4"
                                >
                                    <div className="flex items-start gap-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                        <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-blue-900 mb-2">Objetivos de aprendizaje:</h3>
                                            <ul className="space-y-1">
                                                {capitulo.objetivos.map((objetivo, index) => (
                                                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        <span>{objetivo}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Lado derecho: Progreso (solo estudiantes) */}
                        {progreso && (
                            <ProgressCircle
                                percentage={progreso.porcentajeProgreso}
                                label="Tu progreso"
                            />
                        )}
                    </div>
                </div>

                {/* Stats rápidas */}
                <motion.div
                    variants={statsVariants}
                    initial="initial"
                    animate="animate"
                    className="flex items-center flex-wrap gap-6 text-sm"
                >
                    {/* Stats básicas (para todos) */}
                    <StatItem
                        icon={<BookOpen className="w-4 h-4 text-uc-azul" />}
                        label={`${capitulo.temasVisibles} ${capitulo.temasVisibles === 1 ? 'tema' : 'temas'}`}
                        value={null}
                    />
                    <StatItem
                        icon={<Target className="w-4 h-4 text-uc-celeste" />}
                        label="contenidos"
                        value={`${capitulo.contenidosHabilitados}/${capitulo.contenidosTotales}`}
                    />
                    <StatItem
                        icon={<Clock className="w-4 h-4 text-purple-500" />}
                        label="estimado"
                        value={`${capitulo.duracionTotalMinutos} min`}
                    />

                    {/* Stats de progreso (solo estudiantes) */}
                    {progreso && (
                        <>
                            <div className="w-px h-6 bg-gray-300" />
                            <StatItem
                                icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                                label="completados"
                                value={`${progreso.contenidosCompletados}/${progreso.contenidosTotales}`}
                            />
                            <StatItem
                                icon={<Clock className="w-4 h-4 text-amber-500" />}
                                label="tiempo invertido"
                                value={`${progreso.tiempoTotalMinutos} min`}
                            />
                        </>
                    )}

                    {/* Badge de estado (profesores) */}
                    {permisos.puedeEditar && (
                        <>
                            <div className="w-px h-6 bg-gray-300" />
                            <StatusBadge visible={capitulo.visible} />
                        </>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: CÍRCULO DE PROGRESO
// ==========================================

interface ProgressCircleProps {
    percentage: number
    label: string
}

function ProgressCircle({ percentage, label }: ProgressCircleProps) {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - percentage / 100)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
            className="flex flex-col items-center gap-2"
        >
            <div className="relative w-24 h-24">
                {/* Círculo de fondo */}
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                    />
                    {/* Círculo de progreso */}
                    <motion.circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-uc-celeste transition-all duration-1000"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    />
                </svg>
                {/* Porcentaje en el centro */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-2xl font-bold text-gray-900"
                    >
                        {Math.round(percentage)}%
                    </motion.span>
                </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">{label}</span>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: STAT ITEM
// ==========================================

interface StatItemProps {
    icon: React.ReactNode
    label: string
    value: string | null
}

function StatItem({ icon, label, value }: StatItemProps) {
    return (
        <div className="flex items-center gap-2 text-gray-600">
            <div className="flex items-center justify-center">{icon}</div>
            <span>
                {value && <strong className="text-gray-900">{value}</strong>}
                {value && ' '}
                {label}
            </span>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: ACTION BUTTON
// ==========================================

interface ActionButtonProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'success' | 'warning'
}

function ActionButton({ icon, label, onClick, variant = 'secondary' }: ActionButtonProps) {
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
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-colors ${variantStyles[variant]}
      `}
        >
            {icon}
            <span>{label}</span>
        </motion.button>
    )
}

// ==========================================
// 🎨 COMPONENTE: STATUS BADGE
// ==========================================

interface StatusBadgeProps {
    visible: boolean
}

function StatusBadge({ visible }: StatusBadgeProps) {
    return (
        <div
            className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        ${visible
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }
      `}
        >
            <span className={`w-2 h-2 rounded-full ${visible ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>{visible ? 'Visible para estudiantes' : 'Oculto para estudiantes'}</span>
        </div>
    )
}