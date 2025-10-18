// src/components/chapters/tabs/WorkshopTab.tsx
// ==========================================
// 🎓 TAB DE AYUDANTÍA - GRID DE EJERCICIOS - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GraduationCap,
    Video,
    Clock,
    TrendingUp,
    X,
    ChevronRight,
    PlayCircle,
    FileText,
    Lightbulb,
    Award,
    Eye,
} from 'lucide-react'
import type { EjercicioAyudantiaFiltrado, PermisosCapitulo } from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface WorkshopTabProps {
    /** Ejercicios de ayudantía */
    ejercicios: EjercicioAyudantiaFiltrado[]

    /** Permisos del usuario */
    permisos: PermisosCapitulo

    /** Callback al hacer click en ejercicio */
    onEjercicioClick: (ejercicio: EjercicioAyudantiaFiltrado) => void

    /** Callback para habilitar/deshabilitar (profesores) */
    onToggleHabilitacion?: (ejercicioId: string, habilitado: boolean) => void
}

// ==========================================
// 🎓 COMPONENTE PRINCIPAL
// ==========================================

export default function WorkshopTab({
    ejercicios,
    permisos,
    onEjercicioClick,
    onToggleHabilitacion,
}: WorkshopTabProps) {
    const [selectedEjercicio, setSelectedEjercicio] = useState<EjercicioAyudantiaFiltrado | null>(null)
    const [filterDificultad, setFilterDificultad] = useState<'all' | 'facil' | 'medio' | 'dificil'>('all')

    // ==========================================
    // 🎯 FILTRADO
    // ==========================================

    const ejerciciosFiltrados = ejercicios.filter((ej) => {
        if (filterDificultad === 'all') return true
        return ej.dificultad === filterDificultad
    })

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const handleCardClick = (ejercicio: EjercicioAyudantiaFiltrado) => {
        setSelectedEjercicio(ejercicio)
    }

    const handleCloseModal = () => {
        setSelectedEjercicio(null)
    }

    const handleVerSolucion = () => {
        // Aquí iría la lógica para mostrar la solución
        console.log('Ver solución completa')
    }

    // ==========================================
    // 🎨 RENDER
    // ==========================================

    if (ejercicios.length === 0) {
        return (
            <div className="text-center py-20">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No hay ejercicios de ayudantía disponibles
                </h3>
                <p className="text-gray-500">El profesor agregará ejercicios pronto</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Ejercicios de Ayudantía</h2>
                </div>
                <p className="text-white/90 mb-4">
                    Practica con ejercicios guiados que incluyen soluciones paso a paso y videos explicativos.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {ejercicios.length} ejercicios disponibles
                    </span>
                    {permisos.rol === 'estudiante' && ejercicios.some(e => e.intentos) && (
                        <span className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {ejercicios.filter(e => e.intentos && e.intentos > 0).length} practicados
                        </span>
                    )}
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Dificultad:</span>
                <div className="flex items-center gap-2">
                    <FilterButton
                        active={filterDificultad === 'all'}
                        onClick={() => setFilterDificultad('all')}
                        label="Todos"
                        count={ejercicios.length}
                    />
                    <FilterButton
                        active={filterDificultad === 'facil'}
                        onClick={() => setFilterDificultad('facil')}
                        label="Fácil"
                        count={ejercicios.filter((e) => e.dificultad === 'facil').length}
                        color="green"
                    />
                    <FilterButton
                        active={filterDificultad === 'medio'}
                        onClick={() => setFilterDificultad('medio')}
                        label="Medio"
                        count={ejercicios.filter((e) => e.dificultad === 'medio').length}
                        color="amber"
                    />
                    <FilterButton
                        active={filterDificultad === 'dificil'}
                        onClick={() => setFilterDificultad('dificil')}
                        label="Difícil"
                        count={ejercicios.filter((e) => e.dificultad === 'dificil').length}
                        color="red"
                    />
                </div>
            </div>

            {/* Grid de ejercicios */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {ejerciciosFiltrados.map((ejercicio, index) => (
                        <EjercicioCard
                            key={ejercicio.id}
                            ejercicio={ejercicio}
                            index={index}
                            permisos={permisos}
                            onClick={() => handleCardClick(ejercicio)}
                            onToggleHabilitacion={onToggleHabilitacion}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Modal de ejercicio expandido */}
            <AnimatePresence>
                {selectedEjercicio && (
                    <EjercicioModal
                        ejercicio={selectedEjercicio}
                        permisos={permisos}
                        onClose={handleCloseModal}
                        onVerSolucion={handleVerSolucion}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: FILTER BUTTON
// ==========================================

interface FilterButtonProps {
    active: boolean
    onClick: () => void
    label: string
    count: number
    color?: 'green' | 'amber' | 'red'
}

function FilterButton({ active, onClick, label, count, color }: FilterButtonProps) {
    const colorStyles = {
        green: 'bg-green-100 text-green-700 border-green-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        red: 'bg-red-100 text-red-700 border-red-200',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all
        ${active
                    ? color
                        ? colorStyles[color]
                        : 'bg-uc-azul text-white border-uc-azul'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }
      `}
        >
            {label} <span className="ml-1">({count})</span>
        </motion.button>
    )
}

// ==========================================
// 🎨 COMPONENTE: EJERCICIO CARD
// ==========================================

interface EjercicioCardProps {
    ejercicio: EjercicioAyudantiaFiltrado
    index: number
    permisos: PermisosCapitulo
    onClick: () => void
    onToggleHabilitacion?: (ejercicioId: string, habilitado: boolean) => void
}

function EjercicioCard({
    ejercicio,
    index,
    permisos,
    onClick,
    onToggleHabilitacion,
}: EjercicioCardProps) {
    const isDisabled = !ejercicio.habilitado && permisos.rol === 'estudiante'

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            whileHover={!isDisabled ? { y: -8, scale: 1.02 } : undefined}
            onClick={!isDisabled ? onClick : undefined}
            className={`
        group relative bg-white rounded-2xl border-2 p-6 transition-all
        ${isDisabled
                    ? 'opacity-60 cursor-not-allowed border-gray-200'
                    : 'cursor-pointer border-gray-200 hover:border-amber-300 hover:shadow-2xl'
                }
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <DificultadBadge dificultad={ejercicio.dificultad} />
                <div className="flex items-center gap-2">
                    {ejercicio.videoUrl && (
                        <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                        </div>
                    )}
                    {/* Toggle habilitación (profesores) */}
                    {permisos.puedeHabilitarContenido && onToggleHabilitacion && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleHabilitacion(ejercicio.id, !ejercicio.habilitado)
                            }}
                            className={`
                p-1.5 rounded-lg transition-colors
                ${ejercicio.habilitado
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }
              `}
                        >
                            <Eye className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Título */}
            <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-uc-azul transition-colors">
                {ejercicio.titulo}
            </h3>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {ejercicio.duracionEstimadaMinutos} min
                </span>
                {ejercicio.intentos !== undefined && ejercicio.intentos > 0 && (
                    <span className="flex items-center gap-1.5 text-amber-600">
                        <TrendingUp className="w-4 h-4" />
                        {ejercicio.intentos} {ejercicio.intentos === 1 ? 'intento' : 'intentos'}
                    </span>
                )}
            </div>

            {/* Tags */}
            {ejercicio.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {ejercicio.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                    {ejercicio.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{ejercicio.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                    {isDisabled ? 'No disponible' : 'Click para ver'}
                </span>
                {!isDisabled && (
                    <motion.div
                        className="flex items-center gap-1 text-uc-azul font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <span>Abrir</span>
                        <ChevronRight className="w-4 h-4" />
                    </motion.div>
                )}
            </div>

            {/* Indicador de tiempo invertido */}
            {ejercicio.tiempoInvertido && ejercicio.tiempoInvertido > 0 && (
                <div className="absolute top-4 left-4 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                    {ejercicio.tiempoInvertido} min practicado
                </div>
            )}
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: MODAL DE EJERCICIO
// ==========================================

interface EjercicioModalProps {
    ejercicio: EjercicioAyudantiaFiltrado
    permisos: PermisosCapitulo
    onClose: () => void
    onVerSolucion: () => void
}

function EjercicioModal({ ejercicio, permisos, onClose, onVerSolucion }: EjercicioModalProps) {
    const [showSolucion, setShowSolucion] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <DificultadBadge dificultad={ejercicio.dificultad} variant="white" />
                            {ejercicio.videoUrl && (
                                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                                    <Video className="w-4 h-4" />
                                    <span>Con video</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{ejercicio.titulo}</h2>
                        <div className="flex items-center gap-4 text-sm text-white/90">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {ejercicio.duracionEstimadaMinutos} minutos
                            </span>
                            {ejercicio.intentos && ejercicio.intentos > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <TrendingUp className="w-4 h-4" />
                                    {ejercicio.intentos} {ejercicio.intentos === 1 ? 'intento' : 'intentos'}
                                </span>
                            )}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Enunciado */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-amber-600" />
                            <h3 className="text-lg font-bold text-gray-900">Enunciado</h3>
                        </div>
                        <div
                            className="prose prose-sm max-w-none bg-amber-50 rounded-xl p-4 border border-amber-100"
                            dangerouslySetInnerHTML={{ __html: ejercicio.enunciado }}
                        />
                    </div>

                    {/* Video (si existe) */}
                    {ejercicio.videoUrl && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <PlayCircle className="w-5 h-5 text-red-600" />
                                <h3 className="text-lg font-bold text-gray-900">Video Explicativo</h3>
                            </div>
                            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video">
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <PlayCircle className="w-16 h-16 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm opacity-70">Video player aquí</p>
                                        <p className="text-xs opacity-50 mt-1">{ejercicio.videoUrl}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Solución */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Solución</h3>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSolucion(!showSolucion)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium text-sm transition-colors"
                            >
                                {showSolucion ? 'Ocultar' : 'Ver'} solución
                            </motion.button>
                        </div>
                        <AnimatePresence>
                            {showSolucion && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="prose prose-sm max-w-none bg-green-50 rounded-xl p-4 border border-green-100"
                                        dangerouslySetInnerHTML={{ __html: ejercicio.solucion }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tags */}
                    {ejercicio.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                            {ejercicio.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>
                            ¡Sigue practicando para dominar este ejercicio!
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-6 py-2 bg-uc-azul hover:bg-uc-azul/90 text-white rounded-lg font-medium transition-colors"
                    >
                        Cerrar
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: BADGE DE DIFICULTAD
// ==========================================

interface DificultadBadgeProps {
    dificultad: 'facil' | 'medio' | 'dificil'
    variant?: 'default' | 'white'
}

function DificultadBadge({ dificultad, variant = 'default' }: DificultadBadgeProps) {
    const styles = {
        facil: variant === 'white'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-green-100 text-green-700 border border-green-200',
        medio: variant === 'white'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-amber-100 text-amber-700 border border-amber-200',
        dificil: variant === 'white'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-red-100 text-red-700 border border-red-200',
    }

    const labels = {
        facil: 'Fácil',
        medio: 'Medio',
        dificil: 'Difícil',
    }

    return (
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${styles[dificultad]}`}>
            {labels[dificultad]}
        </span>
    )
}