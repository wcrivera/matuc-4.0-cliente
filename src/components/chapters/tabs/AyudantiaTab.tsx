// src/components/chapters/tabs/AyudantiaTab.tsx
// ==========================================
// 👥 TAB DE AYUDANTÍA - MATUC v4
// Muestra ejercicios con enunciado, solución y video
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    FileText,
    Lightbulb,
    Video,
    Play,
    Eye,
    EyeOff,
} from 'lucide-react'

import type {
    EjercicioAyudantiaFiltrado,
    PermisosCapitulo,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface AyudantiaTabProps {
    ejercicios: EjercicioAyudantiaFiltrado[]
    permisos: PermisosCapitulo
}

// ==========================================
// 👥 COMPONENTE PRINCIPAL
// ==========================================

export default function AyudantiaTab({
    ejercicios,
}: AyudantiaTabProps) {
    return (
        <div className="space-y-4">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-uc-celeste/5 via-blue-50/50 to-transparent p-6 rounded-2xl border border-uc-celeste/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Users className="w-6 h-6 text-uc-celeste" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-uc-azul mb-2">
                            Ejercicios de Ayudantía
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Practica con ejercicios guiados. Cada ejercicio incluye el enunciado,
                            la solución paso a paso y un video explicativo.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de ejercicios */}
            <div className="space-y-4">
                {ejercicios.map((ejercicio, index) => (
                    <EjercicioCard
                        key={ejercicio.id}
                        ejercicio={ejercicio}
                        index={index}
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
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No hay ejercicios de ayudantía
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
// 📦 COMPONENTE: EJERCICIO CARD
// ==========================================

interface EjercicioCardProps {
    ejercicio: EjercicioAyudantiaFiltrado
    index: number
}

function EjercicioCard({ ejercicio, index }: EjercicioCardProps) {
    const [showSolution, setShowSolution] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    const handleToggleSolution = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowSolution(!showSolution)
    }

    const handleToggleVideo = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowVideo(!showVideo)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
            {/* Header del ejercicio */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                    {/* Ícono y número */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uc-celeste to-blue-400 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {ejercicio.orden}
                            </span>
                        </div>
                    </div>

                    {/* Título y metadata */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-uc-azul mb-2">
                            {ejercicio.titulo}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Ejercicio {ejercicio.orden}
                            </span>
                            {ejercicio.solucion && (
                                <span className="flex items-center gap-1">
                                    <Lightbulb className="w-4 h-4" />
                                    Con solución
                                </span>
                            )}
                            {ejercicio.videoUrl && (
                                <span className="flex items-center gap-1">
                                    <Video className="w-4 h-4" />
                                    Con video
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enunciado */}
            <div className="p-6 bg-gray-50/50">
                <div className="prose prose-sm max-w-none">
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: ejercicio.enunciado }}
                    />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 mt-6">
                    {/* Botón ver solución */}
                    {ejercicio.solucion && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleToggleSolution}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
                transition-all duration-200
                ${showSolution
                                    ? 'bg-uc-celeste text-white shadow-lg shadow-uc-celeste/25'
                                    : 'bg-white border-2 border-uc-celeste/30 text-uc-celeste hover:border-uc-celeste hover:bg-uc-celeste/5'
                                }
              `}
                        >
                            {showSolution ? (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    Ocultar solución
                                </>
                            ) : (
                                <>
                                    <Eye className="w-4 h-4" />
                                    Ver solución
                                </>
                            )}
                        </motion.button>
                    )}

                    {/* Botón ver video */}
                    {ejercicio.videoUrl && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleToggleVideo}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
                transition-all duration-200
                ${showVideo
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                    : 'bg-white border-2 border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50'
                                }
              `}
                        >
                            {showVideo ? (
                                <>
                                    <Video className="w-4 h-4" />
                                    Ocultar video
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Ver video
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Solución - Expandible */}
            <AnimatePresence>
                {showSolution && ejercicio.solucion && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-r from-uc-celeste/5 to-blue-50/50 border-t border-uc-celeste/20">
                            {/* Badge de solución */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-uc-celeste/20 rounded-lg">
                                    <Lightbulb className="w-4 h-4 text-uc-celeste" />
                                </div>
                                <span className="text-sm font-semibold text-uc-celeste">
                                    Solución paso a paso
                                </span>
                            </div>

                            {/* Contenido de la solución */}
                            <div className="prose prose-sm max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: ejercicio.solucion }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video - Expandible */}
            <AnimatePresence>
                {showVideo && ejercicio.videoUrl && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-gray-900 border-t border-gray-800">
                            {/* Badge de video */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-red-500/20 rounded-lg">
                                    <Video className="w-4 h-4 text-red-400" />
                                </div>
                                <span className="text-sm font-semibold text-red-400">
                                    Video explicativo
                                </span>
                            </div>

                            {/* Video player */}
                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
                                <video
                                    controls
                                    className="w-full h-full"
                                >
                                    <source src={ejercicio.videoUrl} type="video/mp4" />
                                    Tu navegador no soporta la reproducción de video.
                                </video>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}