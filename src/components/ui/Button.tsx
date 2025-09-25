'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type MotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Utility function para combinar clases
function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

/**
 * Button variants usando class-variance-authority
 * Sistema completo de variantes visuales para MATUC v4
 */
const buttonVariants = cva(
    // Clases base - Fundación del design system
    [
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'rounded-lg font-medium text-sm leading-none',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'relative overflow-hidden',
        'transform-gpu', // Hardware acceleration
        'select-none', // No selección de texto

        // Efecto shimmer espectacular en hover
        'before:absolute before:inset-0 before:-translate-x-full before:rotate-45',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:transition-transform before:duration-700 before:ease-out',
        'hover:before:translate-x-full hover:before:rotate-45',

        // Micro-interacciones deliciosas
        'active:scale-95 active:transition-transform active:duration-75',
        'hover:shadow-lg hover:shadow-primary/25',
        'hover:-translate-y-0.5 hover:transition-all hover:duration-200',
    ],
    {
        variants: {
            variant: {
                // Variante principal - Azul moderno
                default: [
                    'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
                    'shadow-lg shadow-blue-600/30',
                    'hover:from-blue-500 hover:to-blue-600',
                    'hover:shadow-xl hover:shadow-blue-600/40',
                    'active:from-blue-700 active:to-blue-800',
                    'ring-blue-500/30',
                ],

                // Variante secundaria - Gris elegante
                secondary: [
                    'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900',
                    'shadow-lg shadow-gray-200/50',
                    'hover:from-gray-50 hover:to-gray-100',
                    'hover:shadow-xl hover:shadow-gray-300/40',
                    'active:from-gray-200 active:to-gray-300',
                    'ring-gray-300/30',
                ],

                // Variante de acento - Verde vibrante
                accent: [
                    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
                    'shadow-lg shadow-emerald-500/30',
                    'hover:from-emerald-400 hover:to-emerald-500',
                    'hover:shadow-xl hover:shadow-emerald-500/40',
                    'active:from-emerald-600 active:to-emerald-700',
                    'ring-emerald-500/30',
                    'font-semibold',
                ],

                // Variante destructiva elegante
                destructive: [
                    'bg-gradient-to-r from-red-500 to-red-600 text-white',
                    'shadow-lg shadow-red-500/30',
                    'hover:from-red-400 hover:to-red-500',
                    'hover:shadow-xl hover:shadow-red-500/40',
                    'active:from-red-600 active:to-red-700',
                    'ring-red-500/30',
                ],

                // Variante outline sofisticada
                outline: [
                    'border-2 border-blue-600 bg-transparent text-blue-700',
                    'hover:bg-blue-50 hover:border-blue-700',
                    'hover:text-blue-800 hover:shadow-lg hover:shadow-blue-600/20',
                    'active:bg-blue-100 active:border-blue-800',
                    'ring-blue-600/30',
                    'backdrop-blur-sm',
                ],

                // Variante ghost minimalista
                ghost: [
                    'bg-transparent text-gray-700 hover:text-blue-700',
                    'hover:bg-gray-100/80 hover:backdrop-blur-sm',
                    'active:bg-gray-200/80',
                    'ring-gray-500/20',
                ],

                // Variante glass - Glassmorphism
                glass: [
                    'bg-white/10 backdrop-blur-md border border-white/20',
                    'text-gray-800 shadow-lg shadow-black/10',
                    'hover:bg-white/20 hover:border-white/30',
                    'hover:shadow-xl hover:shadow-black/20',
                    'active:bg-white/30',
                    'ring-white/30',
                    'supports-[backdrop-filter]:bg-white/5',
                ],

                // Variante gradient - Multicolor
                gradient: [
                    'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
                    'text-white font-semibold',
                    'shadow-xl shadow-pink-500/40',
                    'hover:shadow-2xl hover:shadow-pink-500/50',
                    'hover:scale-105',
                    'active:scale-95',
                    'ring-pink-500/40',
                    'animate-gradient-x bg-[length:200%_100%]',
                ],

                // Variante success
                success: [
                    'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
                    'shadow-lg shadow-green-500/30',
                    'hover:from-green-400 hover:to-emerald-500',
                    'hover:shadow-xl hover:shadow-green-500/40',
                    'active:from-green-600 active:to-emerald-700',
                    'ring-green-500/30',
                ],
            },

            size: {
                xs: 'h-7 px-2 text-xs gap-1 rounded-md',
                sm: 'h-8 px-3 text-xs gap-1.5',
                default: 'h-10 px-4 py-2 gap-2',
                lg: 'h-12 px-6 py-3 text-base gap-2.5',
                xl: 'h-14 px-8 py-4 text-lg gap-3',
                '2xl': 'h-16 px-10 py-5 text-xl gap-4 rounded-xl',
                icon: 'h-10 w-10 p-0',
            },

            fullWidth: {
                true: 'w-full',
            },

            loading: {
                true: 'cursor-wait',
            },

            // Animaciones CSS
            animated: {
                glow: 'animate-pulse shadow-lg',
                float: 'animate-bounce',
                shimmer: 'overflow-hidden',
                wiggle: 'hover:animate-pulse',
                rubber: 'hover:animate-bounce',
                heartbeat: 'animate-pulse',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

/**
 * Props del componente Button
 */
interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    /** Estado de carga con spinner */
    loading?: boolean
    /** Icono a la izquierda del texto */
    leftIcon?: React.ReactNode
    /** Icono a la derecha del texto */
    rightIcon?: React.ReactNode
    /** Usar Framer Motion para animaciones avanzadas */
    asMotion?: boolean
    /** Props customizadas de Framer Motion */
    motionProps?: Omit<MotionProps, 'children'>
    /** Ancho completo responsive */
    fullWidth?: boolean
    /** Tooltip text on hover */
    tooltip?: string
}

/**
 * 🎨 Button Component - Componente de botón moderno
 * 
 * Características:
 * - 9 variantes visuales con gradientes y efectos
 * - 7 tamaños diferentes (xs a 2xl + icon)
 * - Animaciones CSS nativas + Framer Motion opcional
 * - Glassmorphism, gradientes, y micro-interacciones
 * - Estados de loading, disabled, y hover
 * - Totalmente accesible y responsive
 * 
 * @example
 * ```tsx
 * // Botón principal
 * <Button variant="default" size="lg">
 *   Iniciar Sesión
 * </Button>
 * 
 * // Botón con icono
 * <Button variant="accent" leftIcon={<PlusIcon />} animated="glow">
 *   Crear Nuevo
 * </Button>
 * 
 * // Botón con Framer Motion
 * <Button 
 *   variant="gradient" 
 *   asMotion 
 *   motionProps={{ whileHover: { rotate: 5 } }}
 * >
 *   Botón Animado
 * </Button>
 * 
 * // Botón con loading
 * <Button variant="secondary" loading={isLoading} disabled={isLoading}>
 *   {isLoading ? 'Guardando...' : 'Guardar'}
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            fullWidth,
            loading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            asMotion = false,
            motionProps,
            animated,
            tooltip,
            ...props
        },
        ref
    ) => {
        // Contenido interno del botón
        const ButtonContent = () => (
            <>
                {/* Icono izquierdo con micro-animación */}
                {leftIcon && !loading && (
                    <span className="inline-flex transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12">
                        {leftIcon}
                    </span>
                )}

                {/* Spinner de loading */}
                {loading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {/* Texto principal */}
                {children && (
                    <span className="relative transition-transform duration-200 group-hover:scale-105">
                        {children}
                    </span>
                )}

                {/* Icono derecho con micro-animación */}
                {rightIcon && !loading && (
                    <span className="inline-flex transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12">
                        {rightIcon}
                    </span>
                )}
            </>
        )

        // Props comunes para button regular
        const buttonProps = {
            className: cn(
                buttonVariants({
                    variant,
                    size,
                    fullWidth,
                    loading: loading || undefined,
                    animated
                }),
                'group', // Para efectos hover en iconos
                className
            ),
            disabled: disabled || loading,
            title: tooltip,
            ...props,
        }

        // Versión con Framer Motion
        if (asMotion) {
            // Solo extraemos las props básicas que son compatibles con motion.button
            const motionCompatibleProps = {
                className: buttonProps.className,
                disabled: buttonProps.disabled,
                title: buttonProps.title,
                type: props.type,
                onClick: props.onClick,
                onMouseEnter: props.onMouseEnter,
                onMouseLeave: props.onMouseLeave,
                onFocus: props.onFocus,
                onBlur: props.onBlur,
                'aria-label': props['aria-label'],
                'aria-describedby': props['aria-describedby'],
                id: props.id,
                tabIndex: props.tabIndex
            }

            const motionProps_safe = motionProps || {}

            return (
                <motion.button
                    {...motionCompatibleProps}
                    ref={ref}
                    whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2, ease: "easeOut" },
                        ...(typeof motionProps_safe.whileHover === 'object' ? motionProps_safe.whileHover : {})
                    }}
                    whileTap={{
                        scale: 0.98,
                        y: 0,
                        transition: { duration: 0.1, ease: "easeOut" },
                        ...(typeof motionProps_safe.whileTap === 'object' ? motionProps_safe.whileTap : {})
                    }}
                    initial={{
                        scale: 1,
                        y: 0,
                        ...(typeof motionProps_safe.initial === 'object' ? motionProps_safe.initial : {})
                    }}
                    animate={{
                        scale: 1,
                        y: 0,
                        ...(typeof motionProps_safe.animate === 'object' ? motionProps_safe.animate : {})
                    }}
                    transition={{
                        type: 'spring' as const,
                        stiffness: 500,
                        damping: 30,
                        mass: 1,
                        ...(typeof motionProps_safe.transition === 'object' ? motionProps_safe.transition : {})
                    }}
                    {...(motionProps_safe.whileInView && { whileInView: motionProps_safe.whileInView })}
                    {...(motionProps_safe.exit && { exit: motionProps_safe.exit })}
                    {...(motionProps_safe.variants && { variants: motionProps_safe.variants })}
                    {...(motionProps_safe.drag && { drag: motionProps_safe.drag })}
                    {...(motionProps_safe.dragConstraints && { dragConstraints: motionProps_safe.dragConstraints })}
                >
                    <ButtonContent />
                </motion.button>
            )
        }

        // Versión regular con animaciones CSS
        return (
            <button {...buttonProps} ref={ref}>
                <ButtonContent />
            </button>
        )
    }
)

Button.displayName = 'Button'

// Exports
export { Button, buttonVariants }
export type { ButtonProps }