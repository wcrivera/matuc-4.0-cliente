// src/components/chapters/tabs/EvaluationTab.tsx
// ==========================================
// ✅ TAB DE EVALUACIÓN - WIZARD - MATUC v4
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ClipboardCheck,
    Clock,
    TrendingUp,
    Award,
    Target,
    PlayCircle,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    RotateCcw,
    Trophy,
    Star,
    Calendar,
    Eye,
    EyeOff,
} from 'lucide-react'
import type {
    EjercicioEvaluacionEstudiante,
    PermisosCapitulo,
    IntentoEvaluacion,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface EvaluationTabProps {
    /** Ejercicios de evaluación */
    ejercicios: EjercicioEvaluacionEstudiante[]

    /** Permisos del usuario */
    permisos: PermisosCapitulo

    /** Callback al hacer click en ejercicio */
    onEjercicioClick: (ejercicio: EjercicioEvaluacionEstudiante) => void

    /** Callback para iniciar evaluación */
    onIniciarEvaluacion: (ejercicioId: string) => void

    /** Callback para habilitar/deshabilitar (profesores) */
    onToggleHabilitacion?: (ejercicioId: string, habilitado: boolean) => void
}

// ==========================================
// ✅ COMPONENTE PRINCIPAL
// ==========================================

export default function EvaluationTab({
    ejercicios,
    permisos,
    onEjercicioClick,
    onIniciarEvaluacion,
    onToggleHabilitacion,
}: EvaluationTabProps) {
    const [selectedEjercicio, setSelectedEjercicio] = useState<EjercicioEvaluacionEstudiante | null>(
        null
    )

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const handleCardClick = (ejercicio: EjercicioEvaluacionEstudiante) => {
        setSelectedEjercicio(ejercicio)
    }

    const handleCloseModal = () => {
        setSelectedEjercicio(null)
    }

    const handleIniciar = (ejercicioId: string) => {
        onIniciarEvaluacion(ejercicioId)
        setSelectedEjercicio(null)
    }

    // ==========================================
    // 🎨 RENDER
    // ==========================================

    if (ejercicios.length === 0) {
        return (
            <div className="text-center py-20">
                <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No hay evaluaciones disponibles
                </h3>
                <p className="text-gray-500">El profesor agregará evaluaciones pronto</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <ClipboardCheck className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Evaluaciones</h2>
                </div>
                <p className="text-white/90 mb-4">
                    Pon a prueba tus conocimientos con ejercicios evaluados. Revisa tus intentos anteriores y
                    mejora tus calificaciones.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {ejercicios.length} {ejercicios.length === 1 ? 'evaluación' : 'evaluaciones'}
                    </span>
                    {permisos.rol === 'estudiante' && (
                        <>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {ejercicios.filter((e) => e.mejorIntento?.aprobado).length} aprobadas
                            </span>
                            <span className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                {ejercicios.filter((e) => e.intentosRealizados > 0).length} intentadas
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Lista de evaluaciones */}
            <div className="space-y-4">
                {ejercicios.map((ejercicio, index) => (
                    <EvaluacionCard
                        key={ejercicio.id}
                        ejercicio={ejercicio}
                        index={index}
                        permisos={permisos}
                        onClick={() => handleCardClick(ejercicio)}
                        onIniciar={() => handleIniciar(ejercicio.id)}
                        onToggleHabilitacion={onToggleHabilitacion}
                    />
                ))}
            </div>

            {/* Modal de detalles */}
            <AnimatePresence>
                {selectedEjercicio && (
                    <EvaluacionModal
                        ejercicio={selectedEjercicio}
                        permisos={permisos}
                        onClose={handleCloseModal}
                        onIniciar={() => handleIniciar(selectedEjercicio.id)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE: EVALUACIÓN CARD
// ==========================================

interface EvaluacionCardProps {
    ejercicio: EjercicioEvaluacionEstudiante
    index: number
    permisos: PermisosCapitulo
    onClick: () => void
    onIniciar: () => void
    onToggleHabilitacion?: (ejercicioId: string, habilitado: boolean) => void
}

function EvaluacionCard({
    ejercicio,
    index,
    permisos,
    onClick,
    onIniciar,
    onToggleHabilitacion,
}: EvaluacionCardProps) {
    const isDisabled = !ejercicio.habilitado && permisos.rol === 'estudiante'
    const hasAttempts = ejercicio.intentosRealizados > 0
    const isApproved = ejercicio.mejorIntento?.aprobado
    const canRetry = ejercicio.intentosRestantes > 0

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
        group bg-white rounded-2xl border-2 transition-all
        ${isDisabled
                    ? 'border-gray-200 opacity-60'
                    : isApproved
                        ? 'border-green-300 hover:border-green-400 hover:shadow-xl'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-xl'
                }
      `}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{ejercicio.titulo}</h3>
                            <TipoEvaluacionBadge tipo={ejercicio.tipo} />
                            {isApproved && (
                                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Aprobado</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 mb-4">{ejercicio.descripcion}</p>

                        {/* Stats */}
                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                                <Target className="w-4 h-4 text-blue-500" />
                                {ejercicio.preguntas.length} preguntas
                            </span>
                            {ejercicio.duracionMinutos && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-purple-500" />
                                    {ejercicio.duracionMinutos} minutos
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <RotateCcw className="w-4 h-4 text-amber-500" />
                                {ejercicio.intentosRestantes}{' '}
                                {ejercicio.intentosRestantes === 1 ? 'intento restante' : 'intentos restantes'}
                            </span>
                            {ejercicio.fechaInicio && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    Disponible desde{' '}
                                    {new Date(ejercicio.fechaInicio).toLocaleDateString('es-CL', {
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mejor nota (si existe) */}
                    {ejercicio.mejorIntento && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                            className="text-center ml-6"
                        >
                            <div
                                className={`
                text-4xl font-bold mb-1
                ${isApproved
                                        ? 'text-green-600'
                                        : ejercicio.mejorIntento.nota && ejercicio.mejorIntento.nota >= 4.0
                                            ? 'text-blue-600'
                                            : 'text-red-600'
                                    }
              `}
                            >
                                {ejercicio.mejorIntento.nota?.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500">Mejor nota</div>
                            {isApproved && <Trophy className="w-5 h-5 mx-auto mt-1 text-amber-500" />}
                        </motion.div>
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
                ml-3 p-2 rounded-lg transition-colors
                ${ejercicio.habilitado
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }
              `}
                        >
                            {ejercicio.habilitado ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </motion.button>
                    )}
                </div>

                {/* Progress bar (si hay intentos) */}
                {hasAttempts && ejercicio.mejorIntento && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Mejor resultado</span>
                            <span className="font-semibold text-gray-900">
                                {ejercicio.mejorIntento.porcentaje}%
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${ejercicio.mejorIntento.porcentaje}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                                className={`h-full rounded-full ${isApproved
                                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                                        : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                    }`}
                            />
                        </div>
                    </div>
                )}

                {/* Historial de intentos */}
                {hasAttempts && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Has realizado{' '}
                                <strong className="text-gray-900">{ejercicio.intentosRealizados}</strong>{' '}
                                {ejercicio.intentosRealizados === 1 ? 'intento' : 'intentos'}
                            </span>
                            {ejercicio.promedioIntentos && (
                                <span className="text-gray-600">
                                    Promedio: <strong className="text-gray-900">{ejercicio.promedioIntentos.toFixed(1)}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center gap-3">
                    {!isDisabled && canRetry && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onIniciar}
                            className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                font-semibold transition-all
                ${hasAttempts
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }
              `}
                        >
                            {hasAttempts ? (
                                <>
                                    <RotateCcw className="w-5 h-5" />
                                    <span>Reintentar Evaluación</span>
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="w-5 h-5" />
                                    <span>Iniciar Evaluación</span>
                                </>
                            )}
                        </motion.button>
                    )}

                    {hasAttempts && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClick}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2"
                        >
                            <span>Ver Detalles</span>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    )}

                    {isDisabled && (
                        <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-500 text-center rounded-xl font-medium">
                            No disponible aún
                        </div>
                    )}

                    {!canRetry && !isDisabled && (
                        <div className="flex-1 px-6 py-3 bg-red-50 text-red-600 text-center rounded-xl font-medium">
                            No quedan intentos disponibles
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTE: MODAL DE EVALUACIÓN
// ==========================================

interface EvaluacionModalProps {
    ejercicio: EjercicioEvaluacionEstudiante
    permisos: PermisosCapitulo
    onClose: () => void
    onIniciar: () => void
}

function EvaluacionModal({ ejercicio, permisos, onClose, onIniciar }: EvaluacionModalProps) {
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
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold">{ejercicio.titulo}</h2>
                                <TipoEvaluacionBadge tipo={ejercicio.tipo} variant="white" />
                            </div>
                            <p className="text-white/90">{ejercicio.descripcion}</p>
                        </div>
                        {ejercicio.mejorIntento && (
                            <div className="text-center ml-6">
                                <div className="text-4xl font-bold">{ejercicio.mejorIntento.nota?.toFixed(1)}</div>
                                <div className="text-sm text-white/80">Mejor nota</div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center flex-wrap gap-4 text-sm text-white/90">
                        <span className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            {ejercicio.preguntas.length} preguntas
                        </span>
                        {ejercicio.duracionMinutos && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {ejercicio.duracionMinutos} minutos
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <RotateCcw className="w-4 h-4" />
                            {ejercicio.intentosRestantes} intentos restantes
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Historial de intentos */}
                    {ejercicio.intentosRealizados > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Historial de Intentos
                            </h3>
                            <div className="space-y-3">
                                {/* Mejor intento */}
                                {ejercicio.mejorIntento && (
                                    <IntentoCard intento={ejercicio.mejorIntento} label="Mejor Intento" isBest />
                                )}
                                {/* Último intento */}
                                {ejercicio.ultimoIntento && ejercicio.ultimoIntento.id !== ejercicio.mejorIntento?.id && (
                                    <IntentoCard intento={ejercicio.ultimoIntento} label="Último Intento" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard
                            icon={<Award className="w-5 h-5 text-blue-500" />}
                            label="Nota de aprobación"
                            value={ejercicio.notaAprobacion ? `${ejercicio.notaAprobacion.toFixed(1)}` : 'N/A'}
                        />
                        <InfoCard
                            icon={<Star className="w-5 h-5 text-amber-500" />}
                            label="Promedio de intentos"
                            value={ejercicio.promedioIntentos ? ejercicio.promedioIntentos.toFixed(1) : 'N/A'}
                        />
                        <InfoCard
                            icon={<AlertCircle className="w-5 h-5 text-purple-500" />}
                            label="Solución disponible"
                            value={ejercicio.mostrarSolucion ? 'Sí' : 'No'}
                        />
                        <InfoCard
                            icon={<RotateCcw className="w-5 h-5 text-green-500" />}
                            label="Intentos realizados"
                            value={`${ejercicio.intentosRealizados} / ${ejercicio.intentosPermitidos}`}
                        />
                    </div>

                    {/* Fechas */}
                    {(ejercicio.fechaInicio || ejercicio.fechaTermino) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-2">Disponibilidad</h4>
                                    <div className="space-y-1 text-sm text-blue-700">
                                        {ejercicio.fechaInicio && (
                                            <p>
                                                <strong>Inicio:</strong>{' '}
                                                {new Date(ejercicio.fechaInicio).toLocaleString('es-CL', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        )}
                                        {ejercicio.fechaTermino && (
                                            <p>
                                                <strong>Término:</strong>{' '}
                                                {new Date(ejercicio.fechaTermino).toLocaleString('es-CL', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Cerrar
                    </motion.button>
                    {ejercicio.intentosRestantes > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onIniciar}
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                            <PlayCircle className="w-5 h-5" />
                            <span>
                                {ejercicio.intentosRealizados > 0 ? 'Reintentar' : 'Iniciar'} Evaluación
                            </span>
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

// ==========================================
// 🎨 COMPONENTES AUXILIARES
// ==========================================

function TipoEvaluacionBadge({
    tipo,
    variant = 'default',
}: {
    tipo: 'autoevaluacion' | 'evaluado'
    variant?: 'default' | 'white'
}) {
    const isWhite = variant === 'white'
    return (
        <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${isWhite
                    ? 'bg-white/20 text-white border border-white/30'
                    : tipo === 'evaluado'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}
        >
            {tipo === 'evaluado' ? 'Evaluado' : 'Autoevaluación'}
        </span>
    )
}

function IntentoCard({
    intento,
    label,
    isBest,
}: {
    intento: IntentoEvaluacion
    label: string
    isBest?: boolean
}) {
    return (
        <div
            className={`p-4 rounded-xl border-2 ${isBest
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{label}</span>
                    {isBest && <Trophy className="w-4 h-4 text-amber-500" />}
                </div>
                <div className={`text-2xl font-bold ${intento.aprobado ? 'text-green-600' : 'text-red-600'}`}>
                    {intento.nota?.toFixed(1)}
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{intento.porcentaje}% correcto</span>
                <span>•</span>
                <span>
                    {Math.floor(intento.duracionSegundos / 60)} min {intento.duracionSegundos % 60} seg
                </span>
                <span>•</span>
                <span>{new Date(intento.fechaInicio).toLocaleDateString('es-CL')}</span>
            </div>
        </div>
    )
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
    )
}