// src/components/chapters/tabs/ClaseTab.tsx
// ==========================================
// 📘 TAB DE CLASE - MATUC v4
// Muestra temas en acordeón con sus contenidos
// CADA CONTENIDO tiene: Diapositiva + Video + Ejercicio
// ==========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    FileText,
    Video,
    Pencil,
    CheckCircle2,
    Circle,
    Clock,
    Target,
    Settings,
} from 'lucide-react'

import type {
    TemaFiltrado,
    ContenidoFiltrado,
    PermisosCapitulo,
    ProgresoCapitulo,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ClaseTabProps {
    temas: TemaFiltrado[]
    permisos: PermisosCapitulo
    progreso?: ProgresoCapitulo
    onContenidoClick: (contenido: ContenidoFiltrado) => void
}

type ComponenteType = 'diapositiva' | 'video' | 'ejercicio'

// ==========================================
// 🎨 CONFIGURACIÓN DE COMPONENTES
// ==========================================

const COMPONENTE_CONFIG = {
    diapositiva: {
        icon: FileText,
        label: 'DIAPOSITIVA',
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-600',
        hoverBg: 'hover:bg-amber-100',
    },
    video: {
        icon: Video,
        label: 'VIDEO',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-600',
        hoverBg: 'hover:bg-red-100',
    },
    ejercicio: {
        icon: Pencil,
        label: 'EJERCICIO',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-600',
        hoverBg: 'hover:bg-blue-100',
    },
} as const

// ==========================================
// 📘 COMPONENTE PRINCIPAL
// ==========================================

export default function ClaseTab({
    temas,
    permisos,
    progreso,
    onContenidoClick,
}: ClaseTabProps) {
    const [expandedTemas, setExpandedTemas] = useState<Set<string>>(
        new Set([temas[0]?.id]) // Primer tema expandido por defecto
    )

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

    // Obtener contenidos completados del progreso
    const completedContentIds: string[] = []

    if (progreso) {
        temas.forEach((tema) => {
            tema.contenidos.forEach((contenido) => {
                if (contenido.completado) {
                    completedContentIds.push(contenido.id)
                }
            })
        })
    }

    return (
        <div className="space-y-4">
            {/* Header informativo */}
            <div className="bg-gradient-to-r from-uc-azul/5 via-uc-celeste/5 to-transparent p-6 rounded-2xl border border-uc-celeste/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Target className="w-6 h-6 text-uc-azul" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-uc-azul mb-2">
                            Contenidos de Clase
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Cada contenido incluye una diapositiva teórica, un video explicativo
                            y un ejercicio práctico para reforzar el aprendizaje.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de temas en acordeón */}
            <div className="space-y-3">
                {temas.map((tema, index) => (
                    <TemaAccordion
                        key={tema.id}
                        tema={tema}
                        index={index}
                        isExpanded={expandedTemas.has(tema.id)}
                        onToggle={() => toggleTema(tema.id)}
                        completedContentIds={completedContentIds}
                        onContenidoClick={onContenidoClick}
                        permisos={permisos}
                    />
                ))}
            </div>

            {/* Estado vacío */}
            {temas.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"
                >
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No hay temas disponibles
                    </h3>
                    <p className="text-gray-500">
                        Tu profesor agregará contenido pronto
                    </p>
                </motion.div>
            )}
        </div>
    )
}

// ==========================================
// 📦 COMPONENTE: TEMA ACCORDION
// ==========================================

interface TemaAccordionProps {
    tema: TemaFiltrado
    index: number
    isExpanded: boolean
    onToggle: () => void
    completedContentIds: string[]
    onContenidoClick: (contenido: ContenidoFiltrado) => void
    permisos: PermisosCapitulo
}

function TemaAccordion({
    tema,
    index,
    isExpanded,
    onToggle,
    completedContentIds,
    onContenidoClick,
    permisos,
}: TemaAccordionProps) {
    // Calcular progreso del tema
    const contenidosCompletados = tema.contenidos.filter((c) =>
        completedContentIds.includes(c.id)
    ).length
    const totalContenidos = tema.contenidos.length
    const progresoTema =
        totalContenidos > 0 ? (contenidosCompletados / totalContenidos) * 100 : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
            {/* Header del tema - clickeable */}
            <button
                onClick={onToggle}
                className="w-full p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
                {/* Lado izquierdo: Número, título y progreso */}
                <div className="flex items-center gap-4 flex-1 text-left">
                    {/* Número del tema */}
                    <div className="flex-shrink-0">
                        <div
                            className={`
              w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
              ${progresoTema === 100
                                    ? 'bg-gradient-to-br from-feedback-exito to-green-500 text-white'
                                    : progresoTema > 0
                                        ? 'bg-gradient-to-br from-uc-celeste to-blue-400 text-white'
                                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                                }
            `}
                        >
                            {tema.orden}
                        </div>
                    </div>

                    {/* Título y metadata */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-uc-azul mb-1">
                            {tema.titulo}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {totalContenidos} contenidos
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {tema.estimacionMinutos} min
                            </span>
                            {permisos.rol === 'estudiante' && (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {contenidosCompletados}/{totalContenidos} completados
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lado derecho: Barra de progreso y chevron */}
                <div className="flex items-center gap-4">
                    {/* Barra de progreso circular */}
                    {permisos.rol === 'estudiante' && (
                        <div className="relative w-16 h-16">
                            <svg className="transform -rotate-90 w-16 h-16">
                                {/* Fondo */}
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                {/* Progreso */}
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progresoTema / 100)
                                        }`}
                                    className={`
                    ${progresoTema === 100
                                            ? 'text-feedback-exito'
                                            : 'text-uc-celeste'
                                        }
                  `}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-uc-azul">
                                    {Math.round(progresoTema)}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Chevron */}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                </div>
            </button>

            {/* Contenidos del tema - expandible */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2 bg-gray-50/50">
                            <div className="space-y-3">
                                {tema.contenidos.map((contenido, idx) => (
                                    <ContenidoRow
                                        key={contenido.id}
                                        contenido={contenido}
                                        index={idx}
                                        isCompleted={completedContentIds.includes(contenido.id)}
                                        onClick={onContenidoClick}
                                        permisos={permisos}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ==========================================
// 📄 COMPONENTE: CONTENIDO ROW
// Cada fila tiene: Título + DIAPOSITIVA + VIDEO + EJERCICIO
// ==========================================

interface ContenidoRowProps {
    contenido: ContenidoFiltrado
    index: number
    isCompleted: boolean
    onClick: (contenido: ContenidoFiltrado) => void
    permisos: PermisosCapitulo
}

function ContenidoRow({
    contenido,
    index,
    isCompleted,
    onClick,
    permisos,
}: ContenidoRowProps) {
    const [showSettings, setShowSettings] = useState(false)

    const handleComponentClick = (tipo: ComponenteType) => {
        // Pasamos el contenido original, el componente padre decidirá qué hacer
        // basado en el tipo de interacción del usuario
        console.log(`Clicked ${tipo} for content:`, contenido.titulo)
        onClick(contenido)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-4">
                {/* Número y título del contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        {/* Check de completado */}
                        <div className="flex-shrink-0">
                            {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-feedback-exito" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                            )}
                        </div>

                        {/* Título */}
                        <h4 className="font-semibold text-gray-800">
                            {contenido.orden}. {contenido.titulo}
                        </h4>
                    </div>
                </div>

                {/* Botones de componentes: DIAPOSITIVA | VIDEO | EJERCICIO */}
                <div className="flex items-center gap-2">
                    {/* DIAPOSITIVA */}
                    <ComponentButton
                        tipo="diapositiva"
                        onClick={() => handleComponentClick('diapositiva')}
                    />

                    {/* VIDEO */}
                    <ComponentButton
                        tipo="video"
                        onClick={() => handleComponentClick('video')}
                    />

                    {/* EJERCICIO */}
                    <ComponentButton
                        tipo="ejercicio"
                        onClick={() => handleComponentClick('ejercicio')}
                    />

                    {/* Settings (solo para profesores) */}
                    {permisos.puedeHabilitarContenido && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Settings className="w-4 h-4 text-gray-400" />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// 🔘 COMPONENTE: COMPONENT BUTTON
// ==========================================

interface ComponentButtonProps {
    tipo: ComponenteType
    onClick: () => void
}

function ComponentButton({ tipo, onClick }: ComponentButtonProps) {
    const config = COMPONENTE_CONFIG[tipo]
    const Icon = config.icon

    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        flex flex-col items-center gap-1 px-4 py-2 rounded-lg border
        transition-all duration-200
        ${config.bgColor} ${config.borderColor} ${config.hoverBg}
        group
      `}
        >
            <Icon className={`w-5 h-5 ${config.textColor}`} />
            <span className={`text-xs font-semibold uppercase ${config.textColor}`}>
                {config.label}
            </span>
        </motion.button>
    )
}