// src/components/ui/Button.tsx - Componente Button Premium
'use client'

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
    // Base styles
    [
        "relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl font-semibold",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        "overflow-hidden group",
        "active:scale-[0.98] active:translate-y-0",
        "hover:scale-[1.02] hover:-translate-y-0.5"
    ].join(" "),
    {
        variants: {
            variant: {
                // Botón principal UC Amarillo
                primary: [
                    "bg-gradient-to-br from-[#ffd93d] via-[#ffc72c] to-[#ffb020]",
                    "text-gray-900",
                    "shadow-[0_4px_15px_rgba(255,199,44,0.4),0_1px_3px_rgba(0,0,0,0.1)]",
                    "before:absolute before:inset-0 before:rounded-xl before:p-[2px]",
                    "before:bg-gradient-to-br before:from-white/40 before:to-transparent",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:before:opacity-100",
                    "hover:shadow-[0_8px_25px_rgba(255,199,44,0.5),0_3px_10px_rgba(0,0,0,0.15)]",
                    "focus-visible:ring-[#ffc72c]/50"
                ].join(" "),

                // Botón secundario UC Azul
                secondary: [
                    "bg-gradient-to-br from-[#003f7f] to-[#00294d]",
                    "text-white",
                    "shadow-[0_4px_15px_rgba(0,63,127,0.3),0_1px_3px_rgba(0,0,0,0.1)]",
                    "before:absolute before:inset-0 before:rounded-xl before:bg-white/10",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:before:opacity-100",
                    "hover:shadow-[0_8px_25px_rgba(0,63,127,0.4),0_3px_10px_rgba(0,0,0,0.15)]",
                    "focus-visible:ring-[#003f7f]/50"
                ].join(" "),

                // Botón outline
                outline: [
                    "bg-white",
                    "text-[#003f7f]",
                    "border-2 border-[#003f7f]",
                    "shadow-[0_4px_15px_rgba(0,63,127,0.15)]",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-50 before:to-white",
                    "before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:before:opacity-100",
                    "hover:shadow-[0_8px_25px_rgba(0,63,127,0.25)]",
                    "focus-visible:ring-[#003f7f]/50"
                ].join(" "),

                // Botón ghost
                ghost: [
                    "text-[#003f7f]",
                    "hover:bg-[#003f7f]/5",
                    "focus-visible:ring-[#003f7f]/30"
                ].join(" "),

                // Botón destructivo
                destructive: [
                    "bg-gradient-to-br from-red-500 to-red-600",
                    "text-white",
                    "shadow-[0_4px_15px_rgba(239,68,68,0.3),0_1px_3px_rgba(0,0,0,0.1)]",
                    "hover:shadow-[0_8px_25px_rgba(239,68,68,0.4),0_3px_10px_rgba(0,0,0,0.15)]",
                    "focus-visible:ring-red-500/50"
                ].join(" "),

                // Botón UC Celeste
                celeste: [
                    "bg-gradient-to-br from-[#00a0d1] to-[#0088b3]",
                    "text-white",
                    "shadow-[0_4px_15px_rgba(0,160,209,0.3),0_1px_3px_rgba(0,0,0,0.1)]",
                    "hover:shadow-[0_8px_25px_rgba(0,160,209,0.4),0_3px_10px_rgba(0,0,0,0.15)]",
                    "focus-visible:ring-[#00a0d1]/50"
                ].join(" "),
            },
            size: {
                sm: "h-9 px-4 text-xs",
                default: "h-11 px-6 text-sm",
                lg: "h-13 px-8 text-base",
                xl: "h-16 px-10 text-lg",
                icon: "h-11 w-11 p-0"
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default"
        }
    }
)

interface ButtonPropsBase
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export type ButtonProps = ButtonPropsBase

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
        ...props
    }, ref) => {

        const isDisabled = disabled || loading

        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={isDisabled}
                {...props}
            >
                {/* Contenido del botón */}
                <span className="relative flex items-center justify-center gap-2.5 z-10">
                    {loading ? (
                        <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    ) : leftIcon ? (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-x-1">
                            {leftIcon}
                        </span>
                    ) : null}

                    {children && <span className="leading-none">{children}</span>}

                    {!loading && rightIcon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1">
                            {rightIcon}
                        </span>
                    )}
                </span>
            </button>
        )
    }
)

Button.displayName = "Button"

export { Button, buttonVariants }

// // src/components/ui/Button.tsx - Componente Button del Design System
// 'use client'

// import * as React from "react"
// import { motion } from "framer-motion"
// import { cva, type VariantProps } from "class-variance-authority"
// import { cn } from "@/lib/utils/cn"

// const buttonVariants = cva(
//     // Base styles - aplicados siempre
//     "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
//     {
//         variants: {
//             variant: {
//                 // Botón principal UC
//                 primary: "bg-uc-amarillo text-uc-azul hover:shadow-lg hover:shadow-uc-amarillo/25 focus-visible:ring-uc-amarillo",

//                 // Botón secundario UC
//                 secondary: "bg-uc-azul text-white hover:bg-uc-azul/90 focus-visible:ring-uc-azul",

//                 // Botón outline UC
//                 outline: "border border-uc-azul text-uc-azul hover:bg-uc-azul hover:text-white focus-visible:ring-uc-azul",

//                 // Botón ghost UC
//                 ghost: "text-uc-azul hover:bg-uc-azul/10 focus-visible:ring-uc-azul",

//                 // Botón de peligro
//                 destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",

//                 // Botón glassmorphism
//                 glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white/50",

//                 // Botón celeste UC
//                 celeste: "bg-uc-celeste text-white hover:bg-uc-celeste/90 focus-visible:ring-uc-celeste"
//             },
//             size: {
//                 sm: "h-8 px-3 text-xs",
//                 default: "h-10 px-4",
//                 lg: "h-12 px-6 text-base",
//                 xl: "h-14 px-8 text-lg",
//                 icon: "h-10 w-10"
//             }
//         },
//         defaultVariants: {
//             variant: "primary",
//             size: "default"
//         }
//     }
// )

// interface ButtonProps
//     extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
//     VariantProps<typeof buttonVariants> {
//     loading?: boolean
//     leftIcon?: React.ReactNode
//     rightIcon?: React.ReactNode
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//     ({
//         className,
//         variant,
//         size,
//         loading = false,
//         leftIcon,
//         rightIcon,
//         children,
//         disabled,
//         onClick,
//         onMouseEnter,
//         onMouseLeave,
//         onFocus,
//         onBlur,
//         type = "button"
//     }, ref) => {
//         return (
//             <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                 className={cn(buttonVariants({ variant, size, className }))}
//                 ref={ref}
//                 disabled={disabled || loading}
//                 onClick={onClick}
//                 onMouseEnter={onMouseEnter}
//                 onMouseLeave={onMouseLeave}
//                 onFocus={onFocus}
//                 onBlur={onBlur}
//                 type={type}
//             >
//                 {/* Left icon */}
//                 {leftIcon && !loading && (
//                     <span className="flex-shrink-0">
//                         {leftIcon}
//                     </span>
//                 )}

//                 {/* Loading spinner */}
//                 {loading && (
//                     <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                         className="w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"
//                     />
//                 )}

//                 {/* Button text */}
//                 {children && (
//                     <span className="truncate">
//                         {children}
//                     </span>
//                 )}

//                 {/* Right icon */}
//                 {rightIcon && !loading && (
//                     <span className="flex-shrink-0">
//                         {rightIcon}
//                     </span>
//                 )}
//             </motion.button>
//         )
//     }
// )

// Button.displayName = "Button"

// export { Button, buttonVariants, type ButtonProps }