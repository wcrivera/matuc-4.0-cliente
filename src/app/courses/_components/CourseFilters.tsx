// src/app/courses/_components/CourseFilters.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'

// ==========================================
// 🎯 TIPOS
// ==========================================

export type FiltroRol = 'todos' | 'estudiante' | 'ayudante' | 'profesor'

interface CourseFiltersProps {
    filtroActivo: FiltroRol
    onFiltroChange: (filtro: FiltroRol) => void
    contadores: {
        estudiante: number
        ayudante: number
        profesor: number
        total: number
    }
}

// ==========================================
// 🎨 CONFIGURACIÓN DE FILTROS CON COLORES UC
// ==========================================

const FILTROS = [
    {
        id: 'todos' as FiltroRol,
        label: 'Todos',
        icon: '📚',
        colorActive: 'bg-uc-azul',
        colorHover: 'hover:bg-uc-azul/10 hover:border-uc-azul/30',
        colorBorder: 'border-uc-azul/20'
    },
    {
        id: 'estudiante' as FiltroRol,
        label: 'Estudiante',
        icon: '👨‍🎓',
        colorActive: 'bg-uc-celeste',
        colorHover: 'hover:bg-uc-celeste/10 hover:border-uc-celeste/30',
        colorBorder: 'border-uc-celeste/20'
    },
    {
        id: 'ayudante' as FiltroRol,
        label: 'Ayudante',
        icon: '🤝',
        colorActive: 'bg-uc-amarillo',
        colorHover: 'hover:bg-uc-amarillo/10 hover:border-uc-amarillo/30',
        colorBorder: 'border-uc-amarillo/20'
    },
    {
        id: 'profesor' as FiltroRol,
        label: 'Profesor',
        icon: '👨‍🏫',
        colorActive: 'bg-uc-azul-700',
        colorHover: 'hover:bg-uc-azul/10 hover:border-uc-azul/30',
        colorBorder: 'border-uc-azul/20'
    }
]

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseFilters({ filtroActivo, onFiltroChange, contadores }: CourseFiltersProps) {
    const getContador = (filtroId: FiltroRol): number => {
        switch (filtroId) {
            case 'todos': return contadores.total
            case 'estudiante': return contadores.estudiante
            case 'ayudante': return contadores.ayudante
            case 'profesor': return contadores.profesor
            default: return 0
        }
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTROS.map((filtro) => {
                const contador = getContador(filtro.id)
                const isActivo = filtroActivo === filtro.id

                // No mostrar filtro si no hay cursos en esa categoría (excepto "Todos")
                if (contador === 0 && filtro.id !== 'todos') {
                    return null
                }

                return (
                    <motion.button
                        key={filtro.id}
                        onClick={() => onFiltroChange(filtro.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              relative px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap
              ${isActivo
                                ? `${filtro.colorActive} text-white shadow-uc`
                                : `bg-white text-uc-gris border border-gray-200 ${filtro.colorHover}`
                            }
            `}
                    >
                        {/* Badge animado cuando está activo */}
                        {isActivo && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Contenido del botón */}
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg">{filtro.icon}</span>
                            <span>{filtro.label}</span>
                            <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${isActivo
                                    ? 'bg-white/30'
                                    : 'bg-gray-100 text-uc-gris'
                                }
              `}>
                                {contador}
                            </span>
                        </span>
                    </motion.button>
                )
            })}
        </div>
    )
}