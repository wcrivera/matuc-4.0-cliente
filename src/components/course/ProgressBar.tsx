// src/components/course/ProgressBar.tsx
// ==========================================
// 📊 BARRA DE PROGRESO ANIMADA - MATUC v4
// ==========================================

'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ProgressBarProps {
    /** Porcentaje de progreso (0-100) */
    progress: number

    /** Muestra el porcentaje como texto */
    showPercentage?: boolean

    /** Muestra estadísticas adicionales */
    showStats?: boolean

    /** Número de items completados */
    completedItems?: number

    /** Número total de items */
    totalItems?: number

    /** Variante de color */
    variant?: 'default' | 'success' | 'warning' | 'info'

    /** Tamaño de la barra */
    size?: 'sm' | 'md' | 'lg'

    /** Clase CSS adicional */
    className?: string

    /** Muestra animación al montar */
    animated?: boolean
}

// ==========================================
// 🎨 CONFIGURACIÓN DE VARIANTES
// ==========================================

const variantStyles = {
    default: {
        bg: 'bg-gray-200',
        fill: 'bg-gradient-to-r from-uc-azul to-uc-celeste',
        text: 'text-uc-azul'
    },
    success: {
        bg: 'bg-green-100',
        fill: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-green-700'
    },
    warning: {
        bg: 'bg-yellow-100',
        fill: 'bg-gradient-to-r from-uc-amarillo to-yellow-500',
        text: 'text-yellow-700'
    },
    info: {
        bg: 'bg-blue-100',
        fill: 'bg-gradient-to-r from-uc-celeste to-blue-500',
        text: 'text-blue-700'
    }
}

const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
}

// ==========================================
// 📊 COMPONENTE PRINCIPAL
// ==========================================

export function ProgressBar({
    progress,
    showPercentage = true,
    showStats = false,
    completedItems,
    totalItems,
    variant = 'default',
    size = 'md',
    className,
    animated = true
}: ProgressBarProps) {

    // Asegurar que el progreso esté entre 0 y 100
    const clampedProgress = Math.min(100, Math.max(0, progress))

    // Determinar variante automática según progreso
    const autoVariant = clampedProgress === 100 ? 'success'
        : clampedProgress >= 75 ? 'info'
            : clampedProgress >= 50 ? 'default'
                : 'warning'

    const currentVariant = variant === 'default' ? autoVariant : variant
    const styles = variantStyles[currentVariant]

    return (
        <div className={cn('w-full', className)}>
            {/* Header con porcentaje y stats */}
            {(showPercentage || showStats) && (
                <div className="flex items-center justify-between mb-2">
                    {/* Porcentaje */}
                    {showPercentage && (
                        <div className="flex items-center gap-2">
                            <motion.span
                                className={cn(
                                    'text-sm font-semibold',
                                    styles.text
                                )}
                                initial={animated ? { opacity: 0, scale: 0.8 } : false}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                {clampedProgress.toFixed(0)}%
                            </motion.span>

                            {clampedProgress === 100 && (
                                <motion.div
                                    initial={animated ? { scale: 0, rotate: -180 } : false}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 15,
                                        delay: 0.2
                                    }}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Estadísticas */}
                    {showStats && completedItems !== undefined && totalItems !== undefined && (
                        <motion.span
                            className="text-xs text-gray-600 font-medium"
                            initial={animated ? { opacity: 0, x: 10 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                        >
                            {completedItems} de {totalItems} completados
                        </motion.span>
                    )}
                </div>
            )}

            {/* Barra de progreso */}
            <div className={cn(
                'relative w-full rounded-full overflow-hidden',
                styles.bg,
                sizeStyles[size]
            )}>
                {/* Relleno animado */}
                <motion.div
                    className={cn(
                        'h-full rounded-full relative overflow-hidden',
                        styles.fill
                    )}
                    initial={animated ? { width: 0 } : { width: `${clampedProgress}%` }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{
                        duration: animated ? 1 : 0,
                        ease: [0.16, 1, 0.3, 1],
                        delay: animated ? 0.1 : 0
                    }}
                >
                    {/* Efecto shimmer */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '200%']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatDelay: 1
                        }}
                    />
                </motion.div>

                {/* Puntos de progreso (opcional para barra grande) */}
                {size === 'lg' && totalItems && (
                    <div className="absolute inset-0 flex items-center justify-between px-1">
                        {Array.from({ length: totalItems }).map((_, index) => {
                            const itemProgress = ((index + 1) / totalItems) * 100
                            const isCompleted = clampedProgress >= itemProgress

                            return (
                                <motion.div
                                    key={index}
                                    initial={animated ? { scale: 0 } : false}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: animated ? 0.3 + (index * 0.05) : 0,
                                        type: 'spring',
                                        stiffness: 200
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-3 h-3 text-white drop-shadow-md" />
                                    ) : (
                                        <Circle className="w-3 h-3 text-gray-400/50" />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Label opcional debajo */}
            {showStats && completedItems !== undefined && totalItems !== undefined && (
                <motion.div
                    className="mt-1 flex justify-between text-xs text-gray-500"
                    initial={animated ? { opacity: 0, y: -5 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <span>Inicio</span>
                    <span>Completado</span>
                </motion.div>
            )}
        </div>
    )
}

// ==========================================
// 🎯 VARIANTES ESPECÍFICAS
// ==========================================

/**
 * Barra de progreso compacta para listas
 */
export function CompactProgressBar({
    progress,
    className
}: Pick<ProgressBarProps, 'progress' | 'className'>) {
    return (
        <ProgressBar
            progress={progress}
            showPercentage={false}
            showStats={false}
            size="sm"
            animated={false}
            className={className}
        />
    )
}

/**
 * Barra de progreso con estadísticas completas
 */
export function DetailedProgressBar({
    progress,
    completedItems,
    totalItems,
    className
}: Pick<ProgressBarProps, 'progress' | 'completedItems' | 'totalItems' | 'className'>) {
    return (
        <ProgressBar
            progress={progress}
            showPercentage={true}
            showStats={true}
            completedItems={completedItems}
            totalItems={totalItems}
            size="md"
            className={className}
        />
    )
}

/**
 * Barra de progreso circular (para uso futuro)
 */
export function CircularProgress({
    progress,
    size = 60,
    strokeWidth = 4,
    className
}: {
    progress: number
    size?: number
    strokeWidth?: number
    className?: string
}) {
    const clampedProgress = Math.min(100, Math.max(0, progress))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedProgress / 100) * circumference

    return (
        <div className={cn('relative inline-flex', className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200"
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#003f7f" />
                        <stop offset="100%" stopColor="#00a0d1" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-uc-azul">
                    {clampedProgress.toFixed(0)}%
                </span>
            </div>
        </div>
    )
}