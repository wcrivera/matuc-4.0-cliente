// src/components/course/TopicList.tsx
// ==========================================
// 📚 LISTA DE TEMAS CON CONTENIDOS - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    Clock,
    FileText,
    CheckCircle2,
    Lock,
    BookOpen,
    Target
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ContentList } from './ContentItem'
import { CompactProgressBar } from './ProgressBar'
import type { TemaFiltrado, ContenidoFiltrado, TipoTema } from '@/types/course-content.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface TopicListProps {
    /** Temas a mostrar */
    temas: TemaFiltrado[]

    /** IDs de contenidos completados (para estudiantes) */
    completedContentIds?: string[]

    /** Callback al hacer click en un contenido */
    onContentClick?: (contenido: ContenidoFiltrado) => void

    /** Callback para habilitar/deshabilitar contenido */
    onToggleContent?: (contenidoId: string, enabled: boolean) => Promise<void>

    /** Callback para editar contenido */
    onEditContent?: (contenidoId: string) => void

    /** Todos los temas expandidos por defecto */
    defaultExpanded?: boolean

    /** Clase CSS adicional */
    className?: string
}

interface TopicItemProps {
    /** Tema a mostrar */
    tema: TemaFiltrado

    /** Índice del tema */
    index: number

    /** IDs de contenidos completados */
    completedContentIds?: string[]

    /** Callbacks */
    onContentClick?: (contenido: ContenidoFiltrado) => void
    onToggleContent?: (contenidoId: string, enabled: boolean) => Promise<void>
    onEditContent?: (contenidoId: string) => void

    /** Expandido por defecto */
    defaultExpanded?: boolean
}

// ==========================================
// 🎨 CONFIGURACIÓN DE TIPOS DE TEMA
// ==========================================

const tipoTemaConfig: Record<TipoTema, {
    icon: React.ElementType
    label: string
    color: string
    bgColor: string
    borderColor: string
}> = {
    teorico: {
        icon: BookOpen,
        label: 'Teórico',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    practico: {
        icon: Target,
        label: 'Práctico',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    evaluativo: {
        icon: CheckCircle2,
        label: 'Evaluativo',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    },
    mixto: {
        icon: FileText,
        label: 'Mixto',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    }
}

// ==========================================
// 📚 COMPONENTE DE TEMA INDIVIDUAL
// ==========================================

function TopicItem({
    tema,
    index,
    completedContentIds = [],
    onContentClick,
    onToggleContent,
    onEditContent,
    defaultExpanded = false
}: TopicItemProps) {

    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const config = tipoTemaConfig[tema.tipo]
    const Icon = config.icon

    // Calcular progreso
    const totalContenidos = tema.contenidos.length
    const contenidosCompletados = tema.contenidos.filter(c =>
        completedContentIds.includes(c.id)
    ).length
    const porcentajeProgreso = totalContenidos > 0
        ? (contenidosCompletados / totalContenidos) * 100
        : 0

    // Verificar si está completamente completado
    const isFullyCompleted = contenidosCompletados === totalContenidos && totalContenidos > 0

    // Verificar si hay contenidos habilitados
    // const hayContenidosHabilitados = tema.contenidosHabilitados > 0
    const todosBloqueados = tema.contenidosHabilitados === 0 && tema.contenidos.length > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                'bg-white rounded-xl border-2 overflow-hidden transition-all duration-200',
                isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md',
                todosBloqueados ? 'border-gray-200 opacity-60' : config.borderColor
            )}
        >
            {/* Header del tema (siempre visible) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full p-5 text-left transition-colors',
                    isExpanded ? config.bgColor : 'hover:bg-gray-50'
                )}
            >
                <div className="flex items-start gap-4">
                    {/* Ícono de tipo */}
                    <div className={cn(
                        'p-3 rounded-xl flex-shrink-0',
                        config.bgColor,
                        'ring-2 ring-offset-2',
                        config.borderColor
                    )}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                    </div>

                    {/* Contenido del header */}
                    <div className="flex-1 min-w-0">
                        {/* Título y badges */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    'font-semibold text-gray-900 mb-1',
                                    isFullyCompleted && 'text-green-700'
                                )}>
                                    {tema.orden}. {tema.titulo}
                                </h3>

                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Tipo de tema */}
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                        config.bgColor,
                                        config.color
                                    )}>
                                        {config.label}
                                    </span>

                                    {/* Estado completado */}
                                    {isFullyCompleted && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Completado
                                        </span>
                                    )}

                                    {/* Todo bloqueado */}
                                    {todosBloqueados && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            <Lock className="w-3 h-3" />
                                            Bloqueado
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Botón expandir */}
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className={cn(
                                    'w-5 h-5',
                                    isExpanded ? config.color : 'text-gray-400'
                                )} />
                            </motion.div>
                        </div>

                        {/* Descripción */}
                        {tema.descripcion && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {tema.descripcion}
                            </p>
                        )}

                        {/* Estadísticas */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                            {/* Duración estimada */}
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{tema.estimacionMinutos} min</span>
                            </div>

                            {/* Cantidad de contenidos */}
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>
                                    {tema.contenidosHabilitados} de {tema.contenidos.length} habilitados
                                </span>
                            </div>

                            {/* Progreso (si hay contenidos completados) */}
                            {completedContentIds.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                        {contenidosCompletados}/{totalContenidos} completados
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Barra de progreso (solo si hay contenidos completados) */}
                        {completedContentIds.length > 0 && totalContenidos > 0 && (
                            <div className="mt-3">
                                <CompactProgressBar progress={porcentajeProgreso} />
                            </div>
                        )}
                    </div>
                </div>
            </button>

            {/* Contenidos del tema (expandible) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-5 pb-5 pt-2 border-t-2 border-gray-100">
                            {tema.contenidos.length > 0 ? (
                                <ContentList
                                    contenidos={tema.contenidos}
                                    isCompleted={(id) => completedContentIds.includes(id)}
                                    onClick={onContentClick}
                                    onToggleEnable={onToggleContent}
                                    onEdit={onEditContent}
                                    compact={false}
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No hay contenidos en este tema</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ==========================================
// 📚 COMPONENTE DE LISTA DE TEMAS
// ==========================================

export function TopicList({
    temas,
    completedContentIds = [],
    onContentClick,
    onToggleContent,
    onEditContent,
    defaultExpanded = false,
    className
}: TopicListProps) {

    // Si no hay temas
    if (temas.length === 0) {
        return (
            <div className={cn(
                'text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200',
                className
            )}>
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No hay temas disponibles
                </h3>
                <p className="text-sm text-gray-500">
                    Este capítulo aún no tiene temas configurados
                </p>
            </div>
        )
    }

    return (
        <div className={cn('space-y-4', className)}>
            {temas.map((tema, index) => (
                <TopicItem
                    key={tema.id}
                    tema={tema}
                    index={index}
                    completedContentIds={completedContentIds}
                    onContentClick={onContentClick}
                    onToggleContent={onToggleContent}
                    onEditContent={onEditContent}
                    defaultExpanded={defaultExpanded}
                />
            ))}
        </div>
    )
}

// ==========================================
// 🎯 VARIANTE: LISTA COMPACTA
// ==========================================

export function CompactTopicList({
    temas,
    onTopicClick
}: {
    temas: TemaFiltrado[]
    onTopicClick?: (tema: TemaFiltrado) => void
}) {

    if (temas.length === 0) return null

    return (
        <div className="space-y-2">
            {temas.map((tema, index) => {
                const config = tipoTemaConfig[tema.tipo]
                const Icon = config.icon

                return (
                    <motion.button
                        key={tema.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onTopicClick?.(tema)}
                        className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-lg transition-all',
                            'hover:bg-gray-50 hover:shadow-sm',
                            'border border-transparent hover:border-gray-200'
                        )}
                    >
                        {/* Ícono */}
                        <div className={cn('p-2 rounded-lg', config.bgColor)}>
                            <Icon className={cn('w-4 h-4', config.color)} />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 text-left min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                                {tema.orden}. {tema.titulo}
                            </p>
                            <p className="text-xs text-gray-500">
                                {tema.contenidosHabilitados} contenidos
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {tema.estimacionMinutos}m
                        </div>
                    </motion.button>
                )
            })}
        </div>
    )
}