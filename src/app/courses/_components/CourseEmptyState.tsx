// src/app/courses/_components/CourseEmptyState.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, GraduationCap } from 'lucide-react'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CourseEmptyStateProps {
    hasSearch?: boolean
    searchTerm?: string
    filtroActivo?: string
    onClearFilters?: () => void
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseEmptyState({
    hasSearch = false,
    searchTerm = '',
    filtroActivo = 'todos',
    onClearFilters
}: CourseEmptyStateProps) {

    // Determinar el tipo de estado vacío
    const getEmptyStateConfig = () => {
        // Caso 1: Búsqueda sin resultados
        if (hasSearch && searchTerm) {
            return {
                icon: Search,
                title: 'No se encontraron cursos',
                description: `No hay cursos que coincidan con "${searchTerm}"`,
                suggestion: 'Intenta con otros términos de búsqueda o revisa la ortografía',
                color: 'text-uc-celeste',
                bgColor: 'bg-uc-celeste/10',
                borderColor: 'border-uc-celeste/20'
            }
        }

        // Caso 2: Filtro activo sin resultados
        if (filtroActivo !== 'todos') {
            const filtroLabels = {
                estudiante: 'como estudiante',
                ayudante: 'como ayudante',
                profesor: 'como profesor'
            }

            return {
                icon: Filter,
                title: 'No tienes cursos en esta categoría',
                description: `No estás matriculado en ningún curso ${filtroLabels[filtroActivo as keyof typeof filtroLabels] || ''}`,
                suggestion: 'Prueba con otra categoría o contacta a tu administrador',
                color: 'text-uc-amarillo',
                bgColor: 'bg-uc-amarillo/10',
                borderColor: 'border-uc-amarillo/20'
            }
        }

        // Caso 3: Sin cursos en absoluto
        return {
            icon: GraduationCap,
            title: 'Aún no tienes cursos',
            description: 'No estás matriculado en ningún curso actualmente',
            suggestion: 'Contacta a tu administrador para que te matricule en los cursos correspondientes',
            color: 'text-uc-gris',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200'
        }
    }

    const config = getEmptyStateConfig()
    const IconComponent = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center min-h-[400px] py-12"
        >
            <div className="text-center max-w-md">
                {/* Icono animado */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.1
                    }}
                    className={`
            w-24 h-24 mx-auto mb-6 rounded-full 
            ${config.bgColor} 
            flex items-center justify-center
            border-2 ${config.borderColor}
          `}
                >
                    <IconComponent className={`w-12 h-12 ${config.color}`} />
                </motion.div>

                {/* Título */}
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-uc-azul mb-3"
                >
                    {config.title}
                </motion.h3>

                {/* Descripción */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-uc-gris mb-2"
                >
                    {config.description}
                </motion.p>

                {/* Sugerencia */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-uc-gris/70 mb-6"
                >
                    {config.suggestion}
                </motion.p>

                {/* Botón de acción (opcional) */}
                {onClearFilters && (hasSearch || filtroActivo !== 'todos') && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={onClearFilters}
                        className="
              px-6 py-2.5 
              bg-uc-azul hover:bg-uc-azul-700 
              text-white font-medium rounded-lg 
              transition-colors
              shadow-uc hover:shadow-uc-lg
            "
                    >
                        Limpiar filtros
                    </motion.button>
                )}

                {/* Ilustración decorativa */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-6xl"
                >
                    📚
                </motion.div>
            </div>
        </motion.div>
    )
}