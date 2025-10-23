// src/components/chapters/tabs/EjercicioTab.tsx
// ==========================================
// ✏️ TAB DE EJERCICIOS/TALLER - MATUC v4
// Muestra ejercicios de autoevaluación para estudiantes
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ClipboardCheck,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Target,
    Play,
    Lock,
} from 'lucide-react'

import type {
    EjercicioEvaluacionEstudiante,
    PermisosCapitulo,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface EjercicioTabProps {
    ejercicios: EjercicioEvaluacionEstudiante[]
    permisos: PermisosCapitulo
    onEjercicioClick: (ejercicio: EjercicioEvaluacionEstudiante) => void
    onIniciarEvaluacion: (ejercicioId: string) => void
}

// ==========================================
// ✏️ COMPONENTE PRINCIPAL
// ==========================================

export default function EjercicioTab({
    ejercicios,
    permisos,
    onEjercicioClick,
    onIniciarEvaluacion,
}: EjercicioTabProps) {
    return (
        <div className="space-y-4">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-feedback-exito/5 via-green-50/50 to-transparent p-6 rounded-2xl border border-feedback-exito/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <ClipboardCheck className="w-6 h-6 text-feedback-exito" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-uc-azul mb-2">
                            Ejercicios y Talleres
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Pon a prueba tus conocimientos con estos ejercicios.
                            Podrás ver tu progreso y resultados después de completarlos.
                        </p>
                    </div>
                </div>
            </div>

            {/* Estadísticas rápidas (solo para estudiantes) */}
            {permisos.rol === 'estudiante' && ejercicios.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Target}
                        label="Total ejercicios"
                        value={ejercicios.length}
                        color="blue"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Completados"
                        value={ejercicios.filter(e => e.mejorIntento?.completado).length}
                        color="green"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Promedio"
                        value={calcularPromedio(ejercicios)}
                        color="purple"
                        suffix="%"
                    />
                </div>
            )}

            {/* Lista de ejercicios */}
            <div className="grid grid-cols-1 gap-4">
                {ejercicios.map((ejercicio, index) => (
                    <EjercicioCard
                        key={ejercicio.id}
                        ejercicio={ejercicio}
                        index={index}
                        onClick={() => onEjercicioClick(ejercicio)}
                        onIniciar={() => onIniciarEvaluacion(ejercicio.id)}
                        permisos={permisos}
                    />
                ))}
            </div>

            {/* Estado vacío */}
            {ejercicios.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"
                >
                    <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No hay ejercicios disponibles
                    </h3>
                    <p className="text-gray-500">
                        Tu profesor agregará ejercicios pronto
                    </p>
                </motion.div>
            )}
        </div>
    )
}

// ==========================================
// 📊 COMPONENTE: STAT CARD
// ==========================================

interface StatCardProps {
    icon: React.ElementType
    label: string
    value: number
    color: 'blue' | 'green' | 'purple'
    suffix?: string
}

function StatCard({ icon: Icon, label, value, color, suffix = '' }: StatCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-uc-celeste',
        green: 'from-feedback-exito to-green-500',
        purple: 'from-purple-500 to-pink-500',
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-uc-azul">
                        {value}{suffix}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// 📦 COMPONENTE: EJERCICIO CARD
// ==========================================

interface EjercicioCardProps {
    ejercicio: EjercicioEvaluacionEstudiante
    index: number
    onClick: () => void
    onIniciar: () => void
    permisos: PermisosCapitulo
}

function EjercicioCard({
    ejercicio,
    index,
    onClick,
    onIniciar,
    permisos,
}: EjercicioCardProps) {
    const [expanded, setExpanded] = useState(false)

    // Determinar estado del ejercicio
    const isCompleted = ejercicio.mejorIntento?.completado || false
    const isLocked = !ejercicio.habilitado
    const hasAttempts = ejercicio.intentosRealizados > 0

    // Calcular mejor nota si hay intentos
    const mejorNota = ejercicio.mejorIntento?.puntajeObtenido || 0
    const notaMaxima = ejercicio.mejorIntento?.puntajeTotal || 100

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
        bg-white rounded-2xl shadow-sm border overflow-hidden
        transition-all duration-200
        ${isLocked
                    ? 'border-gray-300 opacity-60'
                    : 'border-gray-200 hover:shadow-md hover:border-uc-celeste/30'
                }
      `}
        >
            {/* Header del ejercicio */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Ícono de estado */}
                    <div className="flex-shrink-0">
                        {isLocked ? (
                            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-gray-400" />
                            </div>
                        ) : isCompleted ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-feedback-exito to-green-500 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                        ) : hasAttempts ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uc-amarillo to-yellow-500 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uc-celeste to-blue-400 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Título y metadata */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-uc-azul mb-2">
                            {ejercicio.titulo}
                        </h3>

                        {/* Badges de información */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            {/* Tipo de ejercicio */}
                            <span className="flex items-center gap-1 text-gray-600">
                                <FileText className="w-4 h-4" />
                                {ejercicio.tipo === 'autoevaluacion' ? 'Autoevaluación' : 'Evaluado'}
                            </span>

                            {/* Tiempo límite */}
                            {ejercicio.duracionMinutos && (
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {ejercicio.duracionMinutos} min
                                </span>
                            )}

                            {/* Intentos */}
                            {ejercicio.intentosPermitidos && (
                                <span className="flex items-center gap-1 text-gray-600">
                                    <TrendingUp className="w-4 h-4" />
                                    {ejercicio.intentosRealizados}/{ejercicio.intentosPermitidos} intentos
                                </span>
                            )}

                            {/* Estado */}
                            {isCompleted && (
                                <span className="px-2 py-1 rounded-lg bg-feedback-exito/10 text-feedback-exito text-xs font-semibold">
                                    ✓ Completado
                                </span>
                            )}

                            {isLocked && (
                                <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
                                    🔒 Bloqueado
                                </span>
                            )}
                        </div>

                        {/* Descripción (si existe) */}
                        {ejercicio.descripcion && (
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                {ejercicio.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Nota (si hay intentos) */}
                    {hasAttempts && permisos.rol === 'estudiante' && (
                        <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-gray-500 mb-1">Mejor nota</p>
                            <p className="text-2xl font-bold text-uc-azul">
                                {mejorNota}
                                <span className="text-base text-gray-400">/{notaMaxima}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Botón de acción */}
                <div className="mt-6">
                    {isLocked ? (
                        <button
                            disabled
                            className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed"
                        >
                            🔒 No disponible
                        </button>
                    ) : isCompleted ? (
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onClick}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-uc-celeste to-blue-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Ver resultados
                        </motion.button>
                    ) : hasAttempts ? (
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onIniciar}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-uc-amarillo to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Reintentar ejercicio
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onIniciar}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-feedback-exito to-green-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Iniciar ejercicio
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Sección expandible con preguntas (preview) */}
            {!isLocked && ejercicio.preguntas && ejercicio.preguntas.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-uc-azul transition-colors"
                    >
                        <span className="font-medium">
                            Ver detalles ({ejercicio.preguntas.length} pregunta{ejercicio.preguntas.length > 1 ? 's' : ''})
                        </span>
                        <motion.div
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Play className="w-4 h-4 rotate-90" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Total de puntos:</span>
                                        <span className="font-semibold text-uc-azul">
                                            {ejercicio.preguntas.reduce((sum, p) => sum + p.puntaje, 0)}
                                        </span>
                                    </div>
                                    {ejercicio.fechaInicio && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Disponible desde:</span>
                                            <span className="font-semibold text-uc-azul">
                                                {new Date(ejercicio.fechaInicio).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {ejercicio.fechaTermino && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Cierra:</span>
                                            <span className="font-semibold text-feedback-error">
                                                {new Date(ejercicio.fechaTermino).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    )
}

// ==========================================
// 🔧 UTILIDADES
// ==========================================

/**
 * Calcular promedio de notas de ejercicios completados
 */
function calcularPromedio(ejercicios: EjercicioEvaluacionEstudiante[]): number {
    const completados = ejercicios.filter(e => e.mejorIntento?.completado)

    if (completados.length === 0) return 0

    const suma = completados.reduce((acc, ej) => {
        if (!ej.mejorIntento) return acc
        const nota = ej.mejorIntento.puntajeObtenido
        const total = ej.mejorIntento.puntajeTotal
        return acc + (nota / total) * 100
    }, 0)

    return Math.round(suma / completados.length)
}