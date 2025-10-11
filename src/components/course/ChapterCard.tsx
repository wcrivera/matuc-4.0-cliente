// src/components/course/ChapterCard.tsx
// ==========================================
// 📖 CAPÍTULO EXPANDIBLE - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    BookOpen,
    Target,
    CheckCircle2,
    FileText,
    Edit,
    Trash2,
    Plus,
    MoreVertical,
    Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { TopicList } from './TopicList'
import { DetailedProgressBar } from './ProgressBar'
import type { CapituloFiltrado, ContenidoFiltrado } from '@/types/course-content.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ChapterCardProps {
    /** Capítulo a mostrar */
    capitulo: CapituloFiltrado

    /** Si el capítulo está expandido */
    expanded: boolean

    /** Toggle de expansión */
    onToggle: () => void

    /** IDs de contenidos completados (estudiantes) */
    completedContentIds?: string[]

    /** Permisos del usuario */
    permisos: {
        puedeHabilitar: boolean
        puedeEditar: boolean
        puedeVerTodo: boolean
    }

    /** Callbacks */
    onContentClick?: (contenido: ContenidoFiltrado) => void
    onToggleContent?: (contenidoId: string, enabled: boolean) => Promise<void>
    onEditContent?: (contenidoId: string) => void
    onEditChapter?: (capitulo: CapituloFiltrado) => void
    onDeleteChapter?: (capituloId: string) => void
    onAddTopic?: (capituloId: string) => void

    /** Índice del capítulo (para animaciones) */
    index?: number

    /** Clase CSS adicional */
    className?: string
}

// ==========================================
// 📖 COMPONENTE PRINCIPAL
// ==========================================

export function ChapterCard({
    capitulo,
    expanded,
    onToggle,
    completedContentIds = [],
    permisos,
    onContentClick,
    onToggleContent,
    onEditContent,
    onEditChapter,
    onDeleteChapter,
    onAddTopic,
    index = 0,
    className
}: ChapterCardProps) {

    const [showMenu, setShowMenu] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Calcular estadísticas
    // const totalTemas = capitulo.temas.length
    const temasVisibles = capitulo.temasVisibles
    const contenidosTotales = capitulo.contenidosTotales
    const contenidosHabilitados = capitulo.contenidosHabilitados

    // Calcular progreso (si hay contenidos completados)
    const contenidosCompletados = completedContentIds.length
    const porcentajeProgreso = contenidosTotales > 0
        ? (contenidosCompletados / contenidosTotales) * 100
        : 0
    const isFullyCompleted = contenidosCompletados === contenidosTotales && contenidosTotales > 0

    // Verificar si todo está bloqueado
    const todosBloqueados = contenidosHabilitados === 0 && contenidosTotales > 0

    // ==========================================
    // 🎨 ESTILOS DINÁMICOS
    // ==========================================

    const getChapterColor = () => {
        if (isFullyCompleted) return 'from-green-500 to-emerald-600'
        if (porcentajeProgreso > 50) return 'from-uc-celeste to-blue-500'
        if (todosBloqueados) return 'from-gray-400 to-gray-500'
        return 'from-uc-azul to-uc-azul-700'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                'bg-white rounded-2xl overflow-hidden transition-all duration-300',
                expanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg',
                className
            )}
        >
            {/* Header del capítulo */}
            <div className={cn(
                'relative bg-gradient-to-r p-6 overflow-hidden',
                getChapterColor()
            )}>
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                {/* Contenido del header */}
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        {/* Título y número */}
                        <button
                            onClick={onToggle}
                            className="flex-1 text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {/* Número del capítulo */}
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <span className="text-2xl font-bold text-white">
                                        {capitulo.orden}
                                    </span>
                                </motion.div>

                                {/* Estado completado */}
                                {isFullyCompleted && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-white drop-shadow-lg" />
                                    </motion.div>
                                )}

                                {/* Estado bloqueado */}
                                {todosBloqueados && !permisos.puedeVerTodo && (
                                    <Lock className="w-6 h-6 text-white/70" />
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1 group-hover:underline">
                                {capitulo.titulo}
                            </h2>

                            {capitulo.descripcion && (
                                <p className="text-white/90 text-sm line-clamp-2 max-w-3xl">
                                    {capitulo.descripcion}
                                </p>
                            )}
                        </button>

                        {/* Acciones del capítulo */}
                        <div className="flex items-center gap-2">
                            {/* Menú de opciones (solo para editores) */}
                            {permisos.puedeEditar && (
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5 text-white" />
                                    </motion.button>

                                    {/* Dropdown menu */}
                                    <AnimatePresence>
                                        {showMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20"
                                            >
                                                {onEditChapter && (
                                                    <button
                                                        onClick={() => {
                                                            onEditChapter(capitulo)
                                                            setShowMenu(false)
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Editar capítulo
                                                    </button>
                                                )}

                                                {onAddTopic && (
                                                    <button
                                                        onClick={() => {
                                                            onAddTopic(capitulo.id)
                                                            setShowMenu(false)
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Agregar tema
                                                    </button>
                                                )}

                                                {onDeleteChapter && (
                                                    <>
                                                        <div className="border-t border-gray-100 my-1" />
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('¿Estás seguro de eliminar este capítulo?')) {
                                                                    onDeleteChapter(capitulo.id)
                                                                }
                                                                setShowMenu(false)
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Eliminar capítulo
                                                        </button>
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Botón expandir/colapsar */}
                            <motion.button
                                onClick={onToggle}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                            >
                                <ChevronDown className="w-6 h-6 text-white" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Estadísticas del capítulo */}
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                        {/* Temas */}
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-medium">
                                {temasVisibles} {temasVisibles === 1 ? 'tema' : 'temas'}
                            </span>
                        </div>

                        {/* Contenidos */}
                        <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">
                                {contenidosHabilitados}/{contenidosTotales} contenidos habilitados
                            </span>
                        </div>

                        {/* Objetivos */}
                        {capitulo.objetivos && capitulo.objetivos.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Target className="w-4 h-4" />
                                <span className="font-medium">
                                    {capitulo.objetivos.length} {capitulo.objetivos.length === 1 ? 'objetivo' : 'objetivos'}
                                </span>
                            </div>
                        )}

                        {/* Progreso (solo si hay contenidos completados) */}
                        {contenidosCompletados > 0 && (
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="font-medium">
                                    {porcentajeProgreso.toFixed(0)}% completado
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Barra de progreso (estudiantes) */}
                    {contenidosCompletados > 0 && contenidosTotales > 0 && (
                        <div className="mt-4">
                            <DetailedProgressBar
                                progress={porcentajeProgreso}
                                completedItems={contenidosCompletados}
                                totalItems={contenidosTotales}
                            />
                        </div>
                    )}

                    {/* Objetivos del capítulo (cuando está expandido) */}
                    {expanded && capitulo.objetivos && capitulo.objetivos.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 pt-4 border-t border-white/20"
                        >
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Objetivos de aprendizaje
                            </h4>
                            <ul className="space-y-1">
                                {capitulo.objetivos.map((objetivo, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.05) }}
                                        className="text-white/90 text-sm flex items-start gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{objetivo}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Contenido del capítulo (temas) */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <div className="p-6 bg-gray-50">
                            {capitulo.temas.length > 0 ? (
                                <TopicList
                                    temas={capitulo.temas}
                                    completedContentIds={completedContentIds}
                                    onContentClick={onContentClick}
                                    onToggleContent={onToggleContent}
                                    onEditContent={onEditContent}
                                    defaultExpanded={false}
                                />
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No hay temas disponibles
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Este capítulo aún no tiene temas configurados
                                    </p>

                                    {permisos.puedeEditar && onAddTopic && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onAddTopic(capitulo.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-uc-azul text-white rounded-lg hover:bg-uc-azul/90 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar primer tema
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicador de hover */}
            {isHovered && !expanded && (
                <motion.div
                    layoutId={`chapter-hover-${capitulo.id}`}
                    className="absolute inset-0 ring-2 ring-uc-celeste ring-offset-2 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.div>
    )
}

// ==========================================
// 🎯 VARIANTE: LISTA DE CAPÍTULOS
// ==========================================

export function ChapterList({
    capitulos,
    expandedChapterId,
    onToggleChapter,
    completedContentIds,
    permisos,
    onContentClick,
    onToggleContent,
    onEditContent,
    onEditChapter,
    onDeleteChapter,
    onAddTopic,
    className
}: {
    capitulos: CapituloFiltrado[]
    expandedChapterId: string | null
    onToggleChapter: (chapterId: string) => void
    completedContentIds?: string[]
    permisos: ChapterCardProps['permisos']
    onContentClick?: ChapterCardProps['onContentClick']
    onToggleContent?: ChapterCardProps['onToggleContent']
    onEditContent?: ChapterCardProps['onEditContent']
    onEditChapter?: ChapterCardProps['onEditChapter']
    onDeleteChapter?: ChapterCardProps['onDeleteChapter']
    onAddTopic?: ChapterCardProps['onAddTopic']
    className?: string
}) {

    if (capitulos.length === 0) {
        return (
            <div className={cn(
                'text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200',
                className
            )}>
                <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                    No hay capítulos disponibles
                </h2>
                <p className="text-gray-500">
                    Este curso aún no tiene contenido configurado
                </p>
            </div>
        )
    }

    return (
        <div className={cn('space-y-6', className)}>
            {capitulos.map((capitulo, index) => (
                <ChapterCard
                    key={capitulo.id}
                    capitulo={capitulo}
                    expanded={expandedChapterId === capitulo.id}
                    onToggle={() => onToggleChapter(capitulo.id)}
                    completedContentIds={completedContentIds}
                    permisos={permisos}
                    onContentClick={onContentClick}
                    onToggleContent={onToggleContent}
                    onEditContent={onEditContent}
                    onEditChapter={onEditChapter}
                    onDeleteChapter={onDeleteChapter}
                    onAddTopic={onAddTopic}
                    index={index}
                />
            ))}
        </div>
    )
}