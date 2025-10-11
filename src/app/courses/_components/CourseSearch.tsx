// src/app/courses/_components/CourseSearch.tsx
'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CourseSearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    totalResultados?: number
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseSearch({
    value,
    onChange,
    placeholder = 'Buscar por nombre, sigla o descripción...',
    totalResultados
}: CourseSearchProps) {

    const handleClear = () => {
        onChange('')
    }

    return (
        <div className="relative">
            {/* Input de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-uc-gris/60" />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="
            w-full pl-10 pr-12 py-3 
            rounded-lg border border-gray-200 
            bg-white
            text-uc-gris placeholder-uc-gris/50
            focus:border-uc-celeste focus:ring-2 focus:ring-uc-celeste/20 
            outline-none transition-all
            hover:border-uc-azul/30
          "
                />

                {/* Botón para limpiar búsqueda */}
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="
                absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded-full
                text-uc-gris/60 hover:text-uc-azul hover:bg-uc-azul/10
                transition-colors
              "
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Contador de resultados */}
            <AnimatePresence>
                {value && totalResultados !== undefined && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-uc-gris"
                    >
                        {totalResultados === 0 ? (
                            <span className="text-red-600">
                                No se encontraron resultados para &quot;<strong>{value}</strong>&quot;
                            </span>
                        ) : totalResultados === 1 ? (
                            <span>
                                Se encontró <strong className="text-uc-azul">1 curso</strong> que coincide con &quot;<strong>{value}</strong>&quot;
                            </span>
                        ) : (
                            <span>
                                Se encontraron <strong className="text-uc-azul">{totalResultados} cursos</strong> que coinciden con &quot;<strong>{value}</strong>&quot;
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}