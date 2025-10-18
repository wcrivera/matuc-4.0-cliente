// src/app/courses/[id]/page.tsx
// ==========================================
// 🎓 PÁGINA DE CURSO - LEARNING JOURNEY - MATUC v4
// ==========================================

'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    Clock,
    CheckCircle2,
    Lock,
    Trophy,
    Zap,
    Target,
    PlayCircle,
    AlertCircle,
    Settings,
    BarChart3,
    Sparkles
} from 'lucide-react'
import { useCourseContent } from '@/lib/hooks/useCourseContent'
import { useAuth } from '@/lib/stores/auth.store'
import type { CapituloFiltrado } from '@/types/course-content.types'
import { useCapitulosCurso } from '@/lib/hooks/useCapitulo'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CoursePageProps {
    params: Promise<{
        id: string
    }>
}

// ==========================================
// 🎓 COMPONENTE PRINCIPAL
// ==========================================

export default function CoursePage({ params }: CoursePageProps) {

    // ==========================================
    // 📊 ESTADO Y DATOS
    // ==========================================
    const router = useRouter()
    const { user } = useAuth()
    const resolvedParams = use(params)
    const courseId = resolvedParams.id

    // Hook de contenido del curso
    const {
        curso,
        capitulosFiltrados,
        permisos,
        isLoading,
        isError,
        error
    } = useCourseContent(courseId)

    // Progreso mock (TODO: traer del backend)
    const [completedContentIds] = useState<string[]>([])

    // Calcular progreso global
    const totalContenidos = capitulosFiltrados.reduce(
        (acc, cap) => acc + cap.contenidosTotales,
        0
    )
    const contenidosCompletados = completedContentIds.length
    const progresoGlobal = totalContenidos > 0
        ? (contenidosCompletados / totalContenidos) * 100
        : 0

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const handleChapterClick = (capitulo: CapituloFiltrado) => {
        router.push(`/courses/${courseId}/chapters/${capitulo.id}`)
    }

    // ==========================================
    // 🎨 ESTADOS DE CARGA Y ERROR
    // ==========================================

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-uc-azul/5 via-uc-celeste/5 to-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Sparkles className="w-16 h-16 text-uc-celeste mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-600 font-medium">Cargando tu camino de aprendizaje...</p>
                </motion.div>
            </div>
        )
    }

    if (isError || !curso) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-red-100"
                >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        No pudimos cargar el curso
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error?.message || 'Ocurrió un error inesperado'}
                    </p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-uc-azul text-white rounded-xl hover:bg-uc-azul/90 transition-all hover:shadow-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a mis cursos
                    </button>
                </motion.div>
            </div>
        )
    }

    // ==========================================
    // 🎯 RENDER PRINCIPAL
    // ==========================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-uc-azul/5 via-uc-celeste/5 to-white relative overflow-hidden">
            {/* Efectos de fondo decorativos */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-uc-celeste/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-uc-azul/10 rounded-full blur-3xl" />
            </div>

            {/* Contenido */}
            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-30"
                >
                    <div className="max-w-5xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between mb-4">
                            {/* Botón volver */}
                            <motion.button
                                whileHover={{ scale: 1.05, x: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/courses')}
                                className="flex items-center gap-2 text-gray-600 hover:text-uc-azul transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Mis cursos</span>
                            </motion.button>

                            {/* Acciones */}
                            <div className="flex items-center gap-2">
                                {permisos.puedeVerEstadisticas && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/courses/${courseId}/analytics`)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Estadísticas"
                                    >
                                        <BarChart3 className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                )}

                                {permisos.puedeEditar && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/courses/${courseId}/edit`)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Configuración"
                                    >
                                        <Settings className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Título del curso */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {curso.nombre}
                            </h1>
                            <p className="text-gray-600">
                                {curso.sigla} • {curso.categoria} • {curso.semestre}
                            </p>
                        </div>

                        {/* Barra de progreso (solo estudiantes) */}
                        {user?.role === 'estudiante' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-r from-uc-azul/10 to-uc-celeste/10 rounded-2xl p-6 border border-uc-azul/20"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-uc-amarillo" />
                                        <span className="font-semibold text-gray-900">Tu Progreso</span>
                                    </div>
                                    <span className="text-2xl font-bold text-uc-azul">
                                        {progresoGlobal.toFixed(0)}%
                                    </span>
                                </div>

                                {/* Barra de progreso hermosa */}
                                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progresoGlobal}%` }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute h-full bg-gradient-to-r from-uc-azul to-uc-celeste rounded-full"
                                    >
                                        {/* Efecto shimmer */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </motion.div>
                                </div>

                                <p className="text-sm text-gray-600 mt-2">
                                    {contenidosCompletados} de {totalContenidos} contenidos completados
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Contenido principal - Timeline de capítulos */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-uc-azul" />
                            Capítulos
                        </h2>
                        <p className="text-gray-600">
                            Sigue tu camino de aprendizaje paso a paso
                        </p>
                    </motion.div>

                    {/* Lista de capítulos con timeline */}
                    <div className="relative">
                        {/* Línea vertical conectora */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-uc-azul via-uc-celeste to-transparent" />

                        {/* Capítulos */}
                        <div className="space-y-8">
                            {capitulosFiltrados.map((capitulo, index) => (
                                <ChapterTimelineCard
                                    // key={capitulo.id}
                                    key={index}
                                    capitulo={capitulo}
                                    index={index}
                                    onClick={() => handleChapterClick(capitulo)}
                                    completedContentIds={completedContentIds}
                                    isLocked={false} // TODO: Lógica de bloqueo
                                />
                            ))}
                        </div>

                        {/* Mensaje final motivacional */}
                        {capitulosFiltrados.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: capitulosFiltrados.length * 0.1 + 0.5 }}
                                className="mt-12 text-center"
                            >
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-uc-amarillo/20 to-uc-celeste/20 rounded-full border border-uc-amarillo/30">
                                    <Sparkles className="w-5 h-5 text-uc-amarillo" />
                                    <span className="font-medium text-gray-700">
                                        ¡Sigue así! Estás haciendo un gran trabajo 🚀
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Estado vacío */}
                    {capitulosFiltrados.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200"
                        >
                            <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Aún no hay contenido disponible
                            </h3>
                            <p className="text-gray-500">
                                Tu profesor pronto agregará los capítulos del curso
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: CHAPTER TIMELINE CARD
// ==========================================

interface ChapterTimelineCardProps {
    capitulo: CapituloFiltrado
    index: number
    onClick: () => void
    completedContentIds: string[]
    isLocked: boolean
}

function ChapterTimelineCard({
    capitulo,
    index,
    onClick,
    completedContentIds,
    isLocked
}: ChapterTimelineCardProps) {
    // Calcular progreso
    const totalContenidos = capitulo.contenidosTotales
    const contenidosCompletadosCount = completedContentIds.filter(id =>
        capitulo.temas.some(tema =>
            tema.contenidos.some(cont => cont.id === id)
        )
    ).length

    const progreso = totalContenidos > 0
        ? (contenidosCompletadosCount / totalContenidos) * 100
        : 0

    const isCompleted = progreso === 100 && totalContenidos > 0
    const isInProgress = progreso > 0 && progreso < 100

    // Duración estimada total
    const duracionTotal = capitulo.temas.reduce(
        (acc, tema) => acc + tema.estimacionMinutos,
        0
    )

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative pl-20"
        >
            {/* Número del capítulo (círculo en la línea) */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
                className={`
          absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl
          ${isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                        : isInProgress
                            ? 'bg-gradient-to-br from-uc-celeste to-blue-500 text-white shadow-lg shadow-uc-celeste/30'
                            : isLocked
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-gradient-to-br from-uc-azul to-uc-azul-700 text-white shadow-lg shadow-uc-azul/30'
                    }
        `}
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" />
                ) : isLocked ? (
                    <Lock className="w-7 h-7" />
                ) : (
                    <span>{capitulo.orden}</span>
                )}
            </motion.div>

            {/* Card del capítulo */}
            <motion.button
                onClick={isLocked ? undefined : onClick}
                whileHover={isLocked ? {} : { scale: 1.02, y: -4 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}
                className={`
          w-full text-left bg-white rounded-2xl shadow-md border-2 p-6 transition-all
          ${isLocked
                        ? 'opacity-60 cursor-not-allowed border-gray-200'
                        : 'hover:shadow-xl border-gray-200 hover:border-uc-celeste/50 cursor-pointer'
                    }
        `}
                disabled={isLocked}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {capitulo.titulo}
                        </h3>
                        {capitulo.descripcion && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {capitulo.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Badge de estado */}
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="ml-4 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Completado
                        </motion.div>
                    )}

                    {isInProgress && !isCompleted && (
                        <div className="ml-4 flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            <PlayCircle className="w-4 h-4" />
                            En progreso
                        </div>
                    )}

                    {isLocked && (
                        <div className="ml-4 flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                            <Lock className="w-4 h-4" />
                            Bloqueado
                        </div>
                    )}
                </div>

                {/* Estadísticas */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-uc-celeste" />
                        <span>{capitulo.temas.length} temas</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-uc-celeste" />
                        <span>{duracionTotal} min</span>
                    </div>

                    {!isLocked && (
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-uc-amarillo" />
                            <span>{capitulo.contenidosHabilitados} contenidos disponibles</span>
                        </div>
                    )}
                </div>

                {/* Barra de progreso (si hay progreso) */}
                {progreso > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progreso</span>
                            <span className="text-sm font-bold text-uc-azul">{progreso.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progreso}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-gradient-to-r from-uc-azul to-uc-celeste rounded-full"
                            />
                        </div>
                    </div>
                )}
            </motion.button>
        </motion.div>
    )
}