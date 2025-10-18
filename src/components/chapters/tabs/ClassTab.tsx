// src/components/chapters/tabs/ClassTab.tsx
// ==========================================
// 📖 TAB DE CLASE - TIMELINE DE TEMAS - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    BookOpen,
    Video,
    FileText,
    Calculator,
    Lightbulb,
    Beaker,
    CheckCircle2,
    Circle,
    Clock,
    Lock,
    Play,
    Eye,
} from 'lucide-react'
import type {
    TemaFiltrado,
    ContenidoFiltrado,
    PermisosCapitulo,
    TipoContenido,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ClassTabProps {
    /** Temas del capítulo */
    temas: TemaFiltrado[]

    /** Permisos del usuario */
    permisos: PermisosCapitulo

    /** IDs de contenidos completados (estudiantes) */
    completedContentIds?: string[]

    /** Callback al hacer click en contenido */
    onContenidoClick: (contenido: ContenidoFiltrado) => void

    /** Callback para habilitar/deshabilitar (profesores) */
    onToggleHabilitacion?: (contenidoId: string, habilitado: boolean) => void
}

// ==========================================
// 📖 COMPONENTE PRINCIPAL
// ==========================================

export default function ClassTab({
    temas,
    permisos,
    completedContentIds = [],
    onContenidoClick,
    onToggleHabilitacion,
}: ClassTabProps) {
    const [expandedTemas, setExpandedTemas] = useState<Set<string>>(new Set([temas[0]?.id]))

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const toggleTema = (temaId: string) => {
        setExpandedTemas((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(temaId)) {
                newSet.delete(temaId)
            } else {
                newSet.add(temaId)
            }
            return newSet
        })
    }

    // ==========================================
    // 🎨 RENDER
    // ==========================================

    if (temas.length === 0) {
        return (
            <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No hay temas disponibles aún
                </h3>
                <p className="text-gray-500">El profesor agregará contenido pronto</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-uc-azul to-uc-celeste rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Contenido de Clase</h2>
                </div>
                <p className="text-white/90">
                    Avanza por los temas en orden. Haz click en cada contenido para estudiarlo en detalle.
                </p>
            </div>

            {/* Timeline de temas */}
            <div className="relative">
                {/* Línea vertical conectora */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-uc-celeste via-uc-azul to-uc-celeste" />

                {/* Lista de temas */}
                <div className="space-y-6">
                    {temas.map((tema, index) => (
                        <TemaCard
                            key={tema.id}
                            tema={tema}
                            index={index}
                            expanded={expandedTemas.has(tema.id)}
                            onToggle={() => toggleTema(tema.id)}
                            completedContentIds={completedContentIds}
                            permisos={permisos}
                            onContenidoClick={onContenidoClick}
                            onToggleHabilitacion={onToggleHabilitacion}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: TEMA CARD
// ==========================================

interface TemaCardProps {
    tema: TemaFiltrado
    index: number
    expanded: boolean
    onToggle: () => void
    completedContentIds: string[]
    permisos: PermisosCapitulo
    onContenidoClick: (contenido: ContenidoFiltrado) => void
    onToggleHabilitacion?: (contenidoId: string, habilitado: boolean) => void
}

function TemaCard({
    tema,
    index,
    expanded,
    onToggle,
    completedContentIds,
    permisos,
    onContenidoClick,
    onToggleHabilitacion,
}: TemaCardProps) {
    const isCompleted = tema.porcentajeProgreso === 100
    const isInProgress = tema.porcentajeProgreso != null && tema.porcentajeProgreso > 0 && tema.porcentajeProgreso < 100

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-20"
        >
            {/* Número del tema (círculo en la línea) */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                className={`
          absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center
          font-bold text-2xl shadow-lg transition-all
          ${isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                        : isInProgress
                            ? 'bg-gradient-to-br from-uc-celeste to-uc-azul text-white'
                            : 'bg-white text-gray-700 border-2 border-gray-300'
                    }
        `}
            >
                {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : index + 1}
            </motion.div>

            {/* Card del tema */}
            <motion.div
                layout
                className={`
          bg-white rounded-2xl border-2 transition-all
          ${expanded ? 'border-uc-azul shadow-xl' : 'border-gray-200 shadow-md hover:shadow-lg'}
        `}
            >
                {/* Header del tema (clickeable para expandir) */}
                <button
                    onClick={onToggle}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors rounded-t-2xl"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{tema.titulo}</h3>
                            <TipoBadge tipo={tema.tipo} />
                        </div>
                        <p className="text-gray-600 mb-3">{tema.descripcion}</p>

                        {/* Stats del tema */}
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <FileText className="w-4 h-4" />
                                {tema.contenidos.length} contenidos
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <Clock className="w-4 h-4" />
                                {tema.estimacionMinutos} min
                            </span>
                            {tema.porcentajeProgreso !== undefined && (
                                <span className="flex items-center gap-1.5 font-medium text-uc-celeste">
                                    {Math.round(tema.porcentajeProgreso)}% completado
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ícono expandir/colapsar */}
                    <motion.div
                        animate={{ rotate: expanded ? 0 : -90 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                </button>

                {/* Barra de progreso */}
                {tema.porcentajeProgreso !== undefined && (
                    <div className="px-6 pb-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${tema.porcentajeProgreso}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                                className={`h-full rounded-full ${isCompleted
                                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                                    : 'bg-gradient-to-r from-uc-celeste to-uc-azul'
                                    }`}
                            />
                        </div>
                    </div>
                )}

                {/* Lista de contenidos (expandible) */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 overflow-hidden"
                        >
                            <div className="p-6 space-y-3">
                                {tema.contenidos.map((contenido, cIndex) => (
                                    <ContenidoItem
                                        key={contenido.id}
                                        contenido={contenido}
                                        index={cIndex}
                                        completed={completedContentIds.includes(contenido.id)}
                                        permisos={permisos}
                                        onClick={() => onContenidoClick(contenido)}
                                        onToggleHabilitacion={onToggleHabilitacion}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: CONTENIDO ITEM
// ==========================================

interface ContenidoItemProps {
    contenido: ContenidoFiltrado
    index: number
    completed: boolean
    permisos: PermisosCapitulo
    onClick: () => void
    onToggleHabilitacion?: (contenidoId: string, habilitado: boolean) => void
}

function ContenidoItem({
    contenido,
    index,
    completed,
    permisos,
    onClick,
    onToggleHabilitacion,
}: ContenidoItemProps) {
    const isDisabled = !contenido.habilitado && permisos.rol === 'estudiante'

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
        group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all
        ${isDisabled
                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    : completed
                        ? 'bg-green-50 border-green-200 hover:border-green-300 cursor-pointer'
                        : 'bg-white border-gray-200 hover:border-uc-celeste hover:shadow-md cursor-pointer'
                }
      `}
            onClick={!isDisabled ? onClick : undefined}
        >
            {/* Ícono de tipo */}
            <div
                className={`
        flex items-center justify-center w-10 h-10 rounded-lg
        ${completed ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-uc-azul/10'}
        transition-colors
      `}
            >
                <TipoIcon tipo={contenido.tipo} completed={completed} />
            </div>

            {/* Info del contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{contenido.titulo}</h4>
                    {contenido.obligatorio && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            Obligatorio
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="capitalize">{getTipoLabel(contenido.tipo)}</span>
                    {contenido.duracionEstimadaMinutos && (
                        <>
                            <span>•</span>
                            <span>{contenido.duracionEstimadaMinutos} min</span>
                        </>
                    )}
                </div>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">
                {/* Toggle habilitación (solo profesores) */}
                {permisos.puedeHabilitarContenido && onToggleHabilitacion && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleHabilitacion(contenido.id, !contenido.habilitado)
                        }}
                        className={`
              p-2 rounded-lg transition-colors
              ${contenido.habilitado
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }
            `}
                        title={contenido.habilitado ? 'Deshabilitar' : 'Habilitar'}
                    >
                        <Eye className="w-4 h-4" />
                    </motion.button>
                )}

                {/* Ícono de estado (estudiantes) */}
                {permisos.rol === 'estudiante' && (
                    <>
                        {isDisabled ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                        ) : completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <Circle className="w-5 h-5 text-gray-300 group-hover:text-uc-celeste" />
                        )}
                    </>
                )}

                {/* Botón de acción */}
                {!isDisabled && (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Play className="w-5 h-5 text-uc-azul" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: BADGE DE TIPO
// ==========================================

function TipoBadge({ tipo }: { tipo: 'teorico' | 'practico' | 'evaluativo' | 'mixto' }) {
    const styles = {
        teorico: 'bg-blue-100 text-blue-700',
        practico: 'bg-purple-100 text-purple-700',
        evaluativo: 'bg-green-100 text-green-700',
        mixto: 'bg-amber-100 text-amber-700',
    }

    const labels = {
        teorico: 'Teórico',
        practico: 'Práctico',
        evaluativo: 'Evaluativo',
        mixto: 'Mixto',
    }

    return (
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${styles[tipo]}`}>
            {labels[tipo]}
        </span>
    )
}

// ==========================================
// 🎨 UTILIDADES: ÍCONOS Y LABELS
// ==========================================

function TipoIcon({ tipo, completed }: { tipo: TipoContenido; completed: boolean }) {
    const className = `w-5 h-5 ${completed ? 'text-green-600' : 'text-gray-600 group-hover:text-uc-azul'}`

    const icons: Record<TipoContenido, React.ReactNode> = {
        teoria: <BookOpen className={className} />,
        ejemplo: <Lightbulb className={className} />,
        ejercicio: <Calculator className={className} />,
        video: <Video className={className} />,
        latex: <FileText className={className} />,
        simulacion: <Beaker className={className} />,
    }

    return icons[tipo]
}

function getTipoLabel(tipo: TipoContenido): string {
    const labels: Record<TipoContenido, string> = {
        teoria: 'Teoría',
        ejemplo: 'Ejemplo',
        ejercicio: 'Ejercicio',
        video: 'Video',
        latex: 'Fórmulas',
        simulacion: 'Simulación',
    }

    return labels[tipo]
}