// src/components/ui/Toast.tsx - Componente Toast del Design System
'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const toastVariants = cva(
    // Base styles - aplicados siempre
    "relative flex items-start gap-3 p-4 rounded-xl border shadow-elevation-2 backdrop-blur-sm max-w-md",
    {
        variants: {
            variant: {
                default: "bg-white border-gray-200 text-gray-900",
                success: "bg-green-50 border-green-200 text-green-800",
                error: "bg-red-50 border-red-200 text-red-800",
                warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
                info: "bg-blue-50 border-blue-200 text-blue-800",
                uc: "bg-uc-azul/10 border-uc-azul/20 text-uc-azul backdrop-blur-lg"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

interface ToastProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
    title?: string
    description?: string
    action?: React.ReactNode
    onClose?: () => void
    duration?: number
    showCloseButton?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({
        className,
        variant,
        title,
        description,
        action,
        onClose,
        duration = 5000,
        showCloseButton = true,
        children,
        ...props
    }, ref) => {

        // Auto dismiss timer
        React.useEffect(() => {
            if (duration > 0 && onClose) {
                const timer = setTimeout(onClose, duration)
                return () => clearTimeout(timer)
            }
        }, [duration, onClose])

        // Icon based on variant
        const getIcon = () => {
            switch (variant) {
                case 'success':
                    return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                case 'error':
                    return <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                case 'warning':
                    return <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                case 'info':
                    return <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                case 'uc':
                    return <CheckCircle className="h-5 w-5 text-uc-azul flex-shrink-0 mt-0.5" />
                default:
                    return null
            }
        }

        return (
            <div
                ref={ref}
                className={cn(toastVariants({ variant, className }))}
                role="alert"
                aria-live={variant === 'error' ? 'assertive' : 'polite'}
                {...props}
            >
                {/* Icon */}
                {getIcon()}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {title && (
                        <div className="font-semibold text-sm mb-1">
                            {title}
                        </div>
                    )}
                    {description && (
                        <div className="text-sm opacity-90">
                            {description}
                        </div>
                    )}
                    {children && !title && !description && (
                        <div className="text-sm">
                            {children}
                        </div>
                    )}
                </div>

                {/* Action */}
                {action && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}

                {/* Close Button */}
                {showCloseButton && onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors duration-200 ml-2"
                        aria-label="Cerrar notificación"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }
)

Toast.displayName = "Toast"

// Toast Provider Context
interface ToastContextValue {
    toasts: ToastItem[]
    addToast: (toast: Omit<ToastItem, 'id'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
    id: string
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

// Toast Provider Component
interface ToastProviderProps {
    children: React.ReactNode
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const ToastProvider: React.FC<ToastProviderProps> = ({
    children,
    position = 'top-right'
}) => {
    const [toasts, setToasts] = React.useState<ToastItem[]>([])

    const addToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { ...toast, id }])
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const clearToasts = React.useCallback(() => {
        setToasts([])
    }, [])

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4'
            case 'top-right':
                return 'top-4 right-4'
            case 'top-center':
                return 'top-4 left-1/2 -translate-x-1/2'
            case 'bottom-left':
                return 'bottom-4 left-4'
            case 'bottom-right':
                return 'bottom-4 right-4'
            case 'bottom-center':
                return 'bottom-4 left-1/2 -translate-x-1/2'
            default:
                return 'top-4 right-4'
        }
    }

    const contextValue: ToastContextValue = {
        toasts,
        addToast,
        removeToast,
        clearToasts
    }

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            {/* Toast Container */}
            <div className={cn('fixed z-50 flex flex-col gap-2', getPositionClasses())}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <Toast
                                {...toast}
                                onClose={() => removeToast(toast.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

// Hook para usar toasts
const useToast = () => {
    const context = React.useContext(ToastContext)

    if (!context) {
        throw new Error('useToast debe ser usado dentro de ToastProvider')
    }

    const toast = React.useCallback((props: Omit<ToastItem, 'id'>) => {
        context.addToast(props)
    }, [context])

    // Helper methods
    const success = React.useCallback((title: string, description?: string) => {
        toast({ variant: 'success', title, description })
    }, [toast])

    const error = React.useCallback((title: string, description?: string) => {
        toast({ variant: 'error', title, description })
    }, [toast])

    const warning = React.useCallback((title: string, description?: string) => {
        toast({ variant: 'warning', title, description })
    }, [toast])

    const info = React.useCallback((title: string, description?: string) => {
        toast({ variant: 'info', title, description })
    }, [toast])

    const uc = React.useCallback((title: string, description?: string) => {
        toast({ variant: 'uc', title, description })
    }, [toast])

    return {
        toast,
        success,
        error,
        warning,
        info,
        uc,
        clear: context.clearToasts,
        toasts: context.toasts
    }
}

export {
    Toast,
    ToastProvider,
    useToast,
    toastVariants,
    type ToastProps,
    type ToastItem
}