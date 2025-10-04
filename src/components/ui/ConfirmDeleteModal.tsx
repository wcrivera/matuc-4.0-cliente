// src/components/ui/ConfirmDeleteModal.tsx
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning';
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    isLoading = false,
    variant = 'danger'
}: ConfirmDeleteModalProps) {

    const [confirmText, setConfirmText] = React.useState('');
    const isConfirmValid = itemName ? confirmText === itemName : true;

    const handleConfirm = () => {
        if (isConfirmValid && !isLoading) {
            onConfirm();
        }
    };

    const handleClose = React.useCallback(() => {
        if (!isLoading) {
            setConfirmText('');
            onClose();
        }
    }, [isLoading, onClose]);

    // Cerrar con ESC
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isLoading, handleClose]);

    const colors = variant === 'danger'
        ? {
            gradient: 'from-red-500 to-red-600',
            glow: 'rgba(239, 68, 68, 0.3)',
            icon: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-600'
        }
        : {
            gradient: 'from-yellow-500 to-orange-500',
            glow: 'rgba(234, 179, 8, 0.3)',
            icon: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-700'
        };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="relative w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Card Container */}
                            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">

                                {/* Gradient Header */}
                                <div className={`relative h-32 bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
                                    {/* Animated circles background */}
                                    <div className="absolute inset-0">
                                        <motion.div
                                            className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                x: [0, 20, 0],
                                                y: [0, -20, 0],
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                x: [0, -15, 0],
                                                y: [0, 15, 0],
                                            }}
                                            transition={{
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </div>

                                    {/* Icon */}
                                    <div className="relative h-full flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 20,
                                                delay: 0.1
                                            }}
                                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
                                        >
                                            {variant === 'danger' ? (
                                                <Trash2 className="w-10 h-10 text-red-600" strokeWidth={2.5} />
                                            ) : (
                                                <AlertTriangle className="w-10 h-10 text-yellow-600" strokeWidth={2.5} />
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Close button */}
                                    <button
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                        {title}
                                    </h3>

                                    {/* Message */}
                                    <p className="text-gray-600 text-center mb-6 leading-relaxed">
                                        {message}
                                    </p>

                                    {/* Item name highlight (if provided) */}
                                    {itemName && (
                                        <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 mb-6`}>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Para confirmar, escribe el nombre del curso:
                                                    </p>
                                                    <p className="font-mono font-semibold text-gray-900 mb-3 break-all">
                                                        {itemName}
                                                    </p>
                                                    <input
                                                        type="text"
                                                        value={confirmText}
                                                        onChange={(e) => setConfirmText(e.target.value)}
                                                        placeholder="Escribe aquí..."
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all disabled:opacity-50 disabled:bg-gray-50"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Warning box */}
                                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-red-900 mb-1">
                                                    Esta acción no se puede deshacer
                                                </p>
                                                <p className="text-sm text-red-700">
                                                    Todos los datos asociados se eliminarán permanentemente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleConfirm}
                                            disabled={!isConfirmValid || isLoading}
                                            loading={isLoading}
                                            rightIcon={!isLoading ? <Trash2 className="w-4 h-4" /> : undefined}
                                            className="flex-1"
                                        >
                                            {isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}