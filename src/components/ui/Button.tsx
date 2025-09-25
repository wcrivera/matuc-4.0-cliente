// src/components/ui/Button.tsx - Componente Button del Design System
'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
    // Base styles - aplicados siempre
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                // Botón principal UC
                primary: "bg-uc-amarillo text-uc-azul hover:shadow-lg hover:shadow-uc-amarillo/25 focus-visible:ring-uc-amarillo",

                // Botón secundario UC
                secondary: "bg-uc-azul text-white hover:bg-uc-azul/90 focus-visible:ring-uc-azul",

                // Botón outline UC
                outline: "border border-uc-azul text-uc-azul hover:bg-uc-azul hover:text-white focus-visible:ring-uc-azul",

                // Botón ghost UC
                ghost: "text-uc-azul hover:bg-uc-azul/10 focus-visible:ring-uc-azul",

                // Botón de peligro
                destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",

                // Botón glassmorphism
                glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white/50",

                // Botón celeste UC
                celeste: "bg-uc-celeste text-white hover:bg-uc-celeste/90 focus-visible:ring-uc-celeste"
            },
            size: {
                sm: "h-8 px-3 text-xs",
                default: "h-10 px-4",
                lg: "h-12 px-6 text-base",
                xl: "h-14 px-8 text-lg",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default"
        }
    }
)

interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        loading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onFocus,
        onBlur,
        type = "button"
    }, ref) => {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onFocus={onFocus}
                onBlur={onBlur}
                type={type}
            >
                {/* Left icon */}
                {leftIcon && !loading && (
                    <span className="flex-shrink-0">
                        {leftIcon}
                    </span>
                )}

                {/* Loading spinner */}
                {loading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"
                    />
                )}

                {/* Button text */}
                {children && (
                    <span className="truncate">
                        {children}
                    </span>
                )}

                {/* Right icon */}
                {rightIcon && !loading && (
                    <span className="flex-shrink-0">
                        {rightIcon}
                    </span>
                )}
            </motion.button>
        )
    }
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }