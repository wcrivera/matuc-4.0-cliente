// src/components/math/LatexRenderer.tsx - Componente para renderizar LaTeX
'use client'

import * as React from "react"
import { motion } from "framer-motion"
import katex from "katex"
import "katex/dist/katex.min.css"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const latexVariants = cva(
    // Base styles - aplicados siempre
    "math-container transition-all duration-300",
    {
        variants: {
            variant: {
                default: "text-gray-900",
                uc: "text-uc-azul",
                accent: "text-uc-amarillo",
                celeste: "text-uc-celeste",
                white: "text-white",
                muted: "text-gray-600"
            },
            size: {
                xs: "text-xs [&_.katex]:text-xs",
                sm: "text-sm [&_.katex]:text-sm",
                default: "text-base [&_.katex]:text-base",
                lg: "text-lg [&_.katex]:text-lg",
                xl: "text-xl [&_.katex]:text-xl",
                "2xl": "text-2xl [&_.katex]:text-2xl",
                "3xl": "text-3xl [&_.katex]:text-3xl"
            },
            display: {
                inline: "[&_.katex-display]:inline [&_.katex-display]:m-0",
                block: "[&_.katex-display]:block [&_.katex-display]:my-4"
            },
            animation: {
                none: "",
                appear: "animate-math-appear",
                render: "animate-latex-render"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            display: "inline",
            animation: "none"
        }
    }
)

interface LatexRendererProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof latexVariants> {
    latex: string
    displayMode?: boolean
    throwOnError?: boolean
    errorColor?: string
    trust?: boolean
    strict?: boolean | "warn" | "error" | "ignore"
    macros?: Record<string, string>
}

const LatexRenderer = React.forwardRef<HTMLDivElement, LatexRendererProps>(
    ({
        className,
        latex,
        variant,
        size,
        display,
        animation,
        displayMode = false,
        throwOnError = false,
        errorColor = "#cc0000",
        trust = false,
        strict = "warn" as const,
        macros,
        ...props
    }, ref) => {
        const [renderedHtml, setRenderedHtml] = React.useState<string>("")
        const [error, setError] = React.useState<string | null>(null)

        // Render LaTeX to HTML
        React.useEffect(() => {
            try {
                const html = katex.renderToString(latex, {
                    displayMode,
                    throwOnError,
                    errorColor,
                    trust,
                    strict,
                    macros,
                    output: 'html'
                })
                setRenderedHtml(html)
                setError(null)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error rendering LaTeX'
                setError(errorMessage)
                if (!throwOnError) {
                    // Show the original latex if rendering fails
                    setRenderedHtml(`<span style="color: ${errorColor};">${latex}</span>`)
                }
            }
        }, [latex, displayMode, throwOnError, errorColor, trust, strict, macros])

        if (error && throwOnError) {
            return (
                <div
                    ref={ref}
                    className={cn("text-red-500 font-mono text-sm p-2 bg-red-50 border border-red-200 rounded", className)}
                    {...props}
                >
                    LaTeX Error: {error}
                </div>
            )
        }

        return (
            <motion.div
                ref={ref}
                className={cn(latexVariants({ variant, size, display, animation, className }))}
                initial={animation === "appear" ? { opacity: 0, scale: 0.9 } : false}
                animate={animation === "appear" ? { opacity: 1, scale: 1 } : false}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.4
                }}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        )
    }
)

LatexRenderer.displayName = "LatexRenderer"

// Componente especializado para fórmulas inline
const InlineLatex = React.forwardRef<HTMLDivElement, Omit<LatexRendererProps, 'displayMode' | 'display'>>(
    ({ className, ...props }, ref) => (
        <LatexRenderer
            ref={ref}
            displayMode={false}
            display="inline"
            className={cn("inline", className)}
            {...props}
        />
    )
)

InlineLatex.displayName = "InlineLatex"

// Componente especializado para fórmulas en bloque
const BlockLatex = React.forwardRef<HTMLDivElement, Omit<LatexRendererProps, 'displayMode' | 'display'>>(
    ({ className, animation = "appear", ...props }, ref) => (
        <LatexRenderer
            ref={ref}
            displayMode={true}
            display="block"
            animation={animation}
            className={cn("text-center my-4", className)}
            {...props}
        />
    )
)

BlockLatex.displayName = "BlockLatex"

// Componente para ecuaciones numeradas
interface EquationProps extends Omit<LatexRendererProps, 'displayMode' | 'display'> {
    number?: string | number
    label?: string
}

const Equation = React.forwardRef<HTMLDivElement, EquationProps>(
    ({ className, number, label, ...props }, ref) => (
        <div className="relative my-6">
            <BlockLatex
                ref={ref}
                className={cn("pr-16", className)}
                {...props}
            />
            {number && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-gray-500 font-mono">({number})</span>
                </div>
            )}
            {label && (
                <div className="text-center mt-2">
                    <span className="text-sm text-gray-600 italic">{label}</span>
                </div>
            )}
        </div>
    )
)

Equation.displayName = "Equation"

// Hook para validar LaTeX
const useLatexValidation = (latex: string) => {
    const [isValid, setIsValid] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        try {
            katex.renderToString(latex, { throwOnError: true })
            setIsValid(true)
            setError(null)
        } catch (err) {
            setIsValid(false)
            setError(err instanceof Error ? err.message : 'Invalid LaTeX')
        }
    }, [latex])

    return { isValid, error }
}

// Macros comunes para matemáticas UC
const ucMathMacros = {
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\C": "\\mathbb{C}",
    "\\vec": "\\overrightarrow{#1}",
    "\\norm": "\\left\\|#1\\right\\|",
    "\\abs": "\\left|#1\\right|",
    "\\set": "\\left\\{#1\\right\\}",
    "\\paren": "\\left(#1\\right)",
    "\\bracket": "\\left[#1\\right]",
    "\\der": "\\frac{d#1}{d#2}",
    "\\pder": "\\frac{\\partial #1}{\\partial #2}",
    "\\limit": "\\lim_{#1 \\to #2}",
    "\\integral": "\\int_{#1}^{#2}",
    "\\sum": "\\sum_{#1}^{#2}",
    "\\prod": "\\prod_{#1}^{#2}"
}

export {
    LatexRenderer,
    InlineLatex,
    BlockLatex,
    Equation,
    useLatexValidation,
    ucMathMacros,
    latexVariants,
    type LatexRendererProps,
    type EquationProps
}