// src/components/course/ContentItem.tsx
// ==========================================
// 📄 ITEM DE CONTENIDO INDIVIDUAL - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FileText,
    Video,
    Calculator,
    PlayCircle,
    CheckCircle2,
    Circle,
    Lock,
    Eye,
    EyeOff,
    Edit,
    ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ContenidoFiltrado, TipoContenido } from '@/types/course-content.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ContentItemProps {
    /** Contenido a mostrar */
    contenido: ContenidoFiltrado

    /** Si el contenido está completado (para estudiantes) */
    isCompleted?: boolean

    /** Callback al hacer click en el contenido */
    onClick?: (contenido: ContenidoFiltrado) => void

    /** Callback para habilitar/deshabilitar (profesores) */
    onToggleEnable?: (contenidoId: string, enabled: boolean) => Promise<void>

    /** Callback para editar (profesor editor) */
    onEdit?: (contenidoId: string) => void

    /** Muestra en modo compacto */
    compact?: boolean

    /** Clase CSS adicional */
    className?: string
}

// ==========================================
// 🎨 CONFIGURACIÓN DE ÍCONOS Y COLORES
// ==========================================

const contentTypeConfig: Record<TipoContenido, {
    icon: React.ElementType
    label: string
    color: string
    bgColor: string
    borderColor: string
}> = {
    teoria: {
        icon: FileText,
        label: 'Teoría',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    ejemplo: {
        icon: Calculator,
        label: 'Ejemplo',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    ejercicio: {
        icon: Edit,
        label: 'Ejercicio',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    video: {
        icon: Video,
        label: 'Video',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    },
    latex: {
        icon: FileText,
        label: 'LaTeX',
        color: 'text-uc-azul',
        bgColor: 'bg-uc-azul/5',
        borderColor: 'border-uc-azul/20'
    },
    simulacion: {
        icon: PlayCircle,
        label: 'Simulación',
        color: 'text-uc-celeste',
        bgColor: 'bg-uc-celeste/10',
        borderColor: 'border-uc-celeste/30'
    }
}

// ==========================================
// 📄 COMPONENTE PRINCIPAL
// ==========================================

export function ContentItem({
    contenido,
    isCompleted = false,
    onClick,
    onToggleEnable,
    onEdit,
    compact = false,
    className
}: ContentItemProps) {

    const [isEnabling, setIsEnabling] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const config = contentTypeConfig[contenido.tipo]
    const Icon = config.icon

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const handleClick = () => {
        if (contenido.habilitado && onClick) {
            onClick(contenido)
        }
    }

    const handleToggleEnable = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!onToggleEnable || isEnabling) return

        setIsEnabling(true)
        try {
            await onToggleEnable(contenido.id, !contenido.habilitado)
        } catch (error) {
            console.error('Error toggling content:', error)
        } finally {
            setIsEnabling(false)
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onEdit) {
            onEdit(contenido.id)
        }
    }

    // ==========================================
    // 🎨 ESTILOS DINÁMICOS
    // ==========================================

    // const isDisabled = !contenido.habilitado && !contenido.puedeHabilitar
    const isClickable = contenido.habilitado || contenido.puedeHabilitar

    // ==========================================
    // 🎯 RENDER COMPACTO
    // ==========================================

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    'flex items-center gap-3 p-2 rounded-lg transition-colors',
                    isClickable && 'cursor-pointer hover:bg-gray-50',
                    !contenido.habilitado && 'opacity-60',
                    className
                )}
                onClick={handleClick}
            >
                {/* Ícono de tipo */}
                <div className={cn(
                    'p-1.5 rounded-md',
                    config.bgColor
                )}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                </div>

                {/* Título */}
                <span className={cn(
                    'text-sm flex-1',
                    isCompleted && 'line-through text-gray-500'
                )}>
                    {contenido.titulo}
                </span>

                {/* Estado */}
                {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : !contenido.habilitado ? (
                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                    <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
            </motion.div>
        )
    }

    // ==========================================
    // 🎯 RENDER COMPLETO
    // ==========================================

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isClickable ? { scale: 1.01, y: -2 } : undefined}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                'group relative bg-white rounded-xl border-2 transition-all duration-200',
                isClickable && 'cursor-pointer hover:shadow-md',
                contenido.habilitado
                    ? cn(config.borderColor, 'hover:border-opacity-50')
                    : 'border-gray-200',
                !contenido.habilitado && 'opacity-50',
                className
            )}
            onClick={handleClick}
        >
            {/* Badge de estado (esquina superior derecha) */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
                {/* Completado */}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </motion.div>
                )}

                {/* Bloqueado (para estudiantes) */}
                {!contenido.habilitado && !contenido.puedeHabilitar && (
                    <Lock className="w-5 h-5 text-gray-400" />
                )}

                {/* Deshabilitado (para profesores) */}
                {!contenido.habilitado && contenido.puedeHabilitar && (
                    <div className="px-2 py-1 bg-gray-100 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                            Deshabilitado
                        </span>
                    </div>
                )}
            </div>

            {/* Contenido principal */}
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    {/* Ícono de tipo */}
                    <div className={cn(
                        'p-3 rounded-xl flex-shrink-0',
                        config.bgColor,
                        'ring-2 ring-offset-2',
                        contenido.habilitado ? config.borderColor : 'ring-gray-200'
                    )}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                    </div>

                    {/* Título y tipo */}
                    <div className="flex-1 min-w-0">
                        <h4 className={cn(
                            'font-semibold text-gray-900 mb-1',
                            isCompleted && 'line-through text-gray-500'
                        )}>
                            {contenido.titulo}
                        </h4>

                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Badge de tipo */}
                            <span className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                config.bgColor,
                                config.color
                            )}>
                                {config.label}
                            </span>

                            {/* Badge de obligatorio */}
                            {contenido.obligatorio && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                    Obligatorio
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Vista previa del contenido (primeros caracteres) */}
                {contenido.contenido && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {contenido.contenido.substring(0, 100)}
                        {contenido.contenido.length > 100 && '...'}
                    </p>
                )}

                {/* Footer con acciones */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Botón ver contenido */}
                    {contenido.habilitado && (
                        <button
                            className={cn(
                                'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                                config.color,
                                'hover:underline'
                            )}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Ver contenido
                        </button>
                    )}

                    {/* Controles de profesor */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Toggle habilitar (solo profesores) */}
                        {contenido.puedeHabilitar && onToggleEnable && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleToggleEnable}
                                disabled={isEnabling}
                                className={cn(
                                    'p-2 rounded-lg transition-all',
                                    contenido.habilitado
                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                                    isEnabling && 'opacity-50 cursor-not-allowed'
                                )}
                                title={contenido.habilitado ? 'Deshabilitar' : 'Habilitar'}
                            >
                                {contenido.habilitado ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </motion.button>
                        )}

                        {/* Botón editar (solo profesor editor) */}
                        {contenido.puedeEditar && onEdit && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="p-2 rounded-lg bg-uc-azul/10 text-uc-azul hover:bg-uc-azul/20 transition-colors"
                                title="Editar contenido"
                            >
                                <Edit className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicador de hover */}
            {isHovered && isClickable && (
                <motion.div
                    layoutId="content-hover"
                    className={cn(
                        'absolute inset-0 rounded-xl pointer-events-none',
                        config.borderColor,
                        'ring-2 ring-offset-2'
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.div>
    )
}

// ==========================================
// 🎯 VARIANTE: LISTA DE CONTENIDOS
// ==========================================

export function ContentList({
    contenidos,
    isCompleted,
    onClick,
    onToggleEnable,
    onEdit,
    compact = false
}: {
    contenidos: ContenidoFiltrado[]
    isCompleted?: (contenidoId: string) => boolean
    onClick?: (contenido: ContenidoFiltrado) => void
    onToggleEnable?: (contenidoId: string, enabled: boolean) => Promise<void>
    onEdit?: (contenidoId: string) => void
    compact?: boolean
}) {

    if (contenidos.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No hay contenidos disponibles</p>
            </div>
        )
    }

    return (
        <div className={cn(
            'space-y-3',
            compact && 'space-y-1'
        )}>
            {contenidos.map((contenido, index) => (
                <motion.div
                    key={contenido.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <ContentItem
                        contenido={contenido}
                        isCompleted={isCompleted?.(contenido.id)}
                        onClick={onClick}
                        onToggleEnable={onToggleEnable}
                        onEdit={onEdit}
                        compact={compact}
                    />
                </motion.div>
            ))}
        </div>
    )
}