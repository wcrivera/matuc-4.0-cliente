// src/components/ui/Modal.tsx - Componente Modal del Design System
'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const modalVariants = cva(
    // Base styles - aplicados siempre
    "relative bg-background rounded-xl shadow-elevation-3 border border-border max-h-[90vh] overflow-y-auto",
    {
        variants: {
            size: {
                sm: "w-full max-w-sm p-4",
                default: "w-full max-w-md p-6",
                lg: "w-full max-w-lg p-6",
                xl: "w-full max-w-2xl p-8",
                full: "w-full max-w-4xl p-8"
            },
            variant: {
                default: "bg-white border-gray-200",
                uc: "bg-white/95 border-white/20 backdrop-blur-lg",
                glass: "glass-morphism text-white",
                elevated: "bg-white border-gray-200 shadow-elevation-3"
            }
        },
        defaultVariants: {
            size: "default",
            variant: "default"
        }
    }
)

interface ModalProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
    open: boolean
    onClose: () => void
    title?: string
    description?: string
    showCloseButton?: boolean
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    ({
        className,
        open,
        onClose,
        title,
        description,
        showCloseButton = true,
        closeOnBackdrop = true,
        closeOnEscape = true,
        size,
        variant,
        children
    }, ref) => {

        // Handle escape key
        React.useEffect(() => {
            if (!closeOnEscape || !open) return

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose()
                }
            }

            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }, [closeOnEscape, open, onClose])

        // Prevent body scroll when modal is open
        React.useEffect(() => {
            if (open) {
                document.body.style.overflow = 'hidden'
                return () => {
                    document.body.style.overflow = 'unset'
                }
            }
        }, [open])

        const handleBackdropClick = (e: React.MouseEvent) => {
            if (closeOnBackdrop && e.target === e.currentTarget) {
                onClose()
            }
        }

        return (
            <AnimatePresence>
                {open && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? "modal-title" : undefined}
                        aria-describedby={description ? "modal-description" : undefined}
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={handleBackdropClick}
                        />

                        {/* Modal Content */}
                        <motion.div
                            ref={ref}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                duration: 0.3
                            }}
                            className={cn(modalVariants({ size, variant, className }))}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 
                           hover:bg-gray-100 transition-colors duration-200 z-10"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                            {/* Header */}
                            {(title || description) && (
                                <div className="mb-6">
                                    {title && (
                                        <h2
                                            id="modal-title"
                                            className="text-2xl font-semibold text-uc-azul mb-2"
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p
                                            id="modal-description"
                                            className="text-gray-600"
                                        >
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        )
    }
)

Modal.displayName = "Modal"

// Sub-componentes para estructura semántica
const ModalHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("mb-6", className)}
        {...props}
    />
))

ModalHeader.displayName = "ModalHeader"

const ModalTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-2xl font-semibold text-uc-azul mb-2", className)}
        {...props}
    />
))

ModalTitle.displayName = "ModalTitle"

const ModalDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-gray-600", className)}
        {...props}
    />
))

ModalDescription.displayName = "ModalDescription"

const ModalContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
    />
))

ModalContent.displayName = "ModalContent"

const ModalFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center justify-end space-x-3 mt-6", className)}
        {...props}
    />
))

ModalFooter.displayName = "ModalFooter"

// Modal especializado para confirmación
interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
    confirmText?: string
    cancelText?: string
    confirmVariant?: 'primary' | 'destructive'
    onConfirm: () => void
}

const ConfirmModal = React.forwardRef<HTMLDivElement, ConfirmModalProps>(
    ({
        confirmText = "Confirmar",
        cancelText = "Cancelar",
        confirmVariant = "primary",
        onConfirm,
        onClose,
        ...props
    }, ref) => (
        <Modal ref={ref} onClose={onClose} {...props}>
            <ModalFooter>
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm()
                        onClose()
                    }}
                    className={cn(
                        "px-6 py-2 rounded-xl font-semibold transition-all duration-200",
                        confirmVariant === "destructive"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-uc-amarillo hover:shadow-amarillo text-uc-azul"
                    )}
                >
                    {confirmText}
                </button>
            </ModalFooter>
        </Modal>
    )
)

ConfirmModal.displayName = "ConfirmModal"

export {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalContent,
    ModalFooter,
    ConfirmModal,
    modalVariants,
    type ModalProps,
    type ConfirmModalProps
}