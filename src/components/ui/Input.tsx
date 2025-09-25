// src/components/ui/Input.tsx - Componente Input del Design System
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const inputVariants = cva(
    // Base styles - aplicados siempre
    "flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-gray-300 bg-white focus-visible:ring-uc-azul focus-visible:border-uc-azul",
                uc: "input-uc border-uc-azul/20 bg-white/90 focus-visible:ring-uc-azul focus-visible:border-uc-azul",
                glass: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50 focus-visible:border-white/50",
                outline: "border-2 border-uc-azul bg-transparent focus-visible:ring-uc-celeste",
                minimal: "border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus-visible:border-uc-azul focus-visible:ring-0",
                search: "bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:ring-uc-celeste pl-10"
            },
            size: {
                sm: "h-8 px-2 text-xs",
                default: "h-10 px-3",
                lg: "h-12 px-4 text-base",
                xl: "h-14 px-6 text-lg"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    error?: string
    helperText?: string
    label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        variant,
        size,
        type = "text",
        leftIcon,
        rightIcon,
        error,
        helperText,
        label,
        id,
        ...props
    }, ref) => {
        const generatedId = React.useId()
        const inputId = id || generatedId

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                        {props.required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            inputVariants({ variant, size, className }),
                            {
                                'pl-10': leftIcon && size !== 'sm',
                                'pl-8': leftIcon && size === 'sm',
                                'pr-10': rightIcon && size !== 'sm',
                                'pr-8': rightIcon && size === 'sm',
                                'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500': error
                            }
                        )}
                        ref={ref}
                        {...props}
                    />

                    {/* Right Icon */}
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Helper Text / Error */}
                {(error || helperText) && (
                    <div className="mt-1 min-h-[1.25rem]">
                        {error ? (
                            <p className="text-sm text-red-600 animate-slide-down">
                                {error}
                            </p>
                        ) : helperText ? (
                            <p className="text-sm text-gray-500">
                                {helperText}
                            </p>
                        ) : null}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input, inputVariants, type InputProps }