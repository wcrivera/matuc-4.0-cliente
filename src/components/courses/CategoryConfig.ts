// src/components/courses/CategoryConfig.ts
// ==========================================
// 🎨 CONFIGURACIÓN DE CATEGORÍAS DE CURSOS
// ==========================================

import type { LucideIcon } from 'lucide-react'
import {
    Calculator,
    BookOpen,
    TrendingUp,
    Award,
    BookMarked,
    Sparkles,
} from 'lucide-react'

// ==========================================
// 🎯 INTERFACE DE CONFIGURACIÓN
// ==========================================

export interface CategoryConfig {
    color: string      // Gradiente de Tailwind
    icon: LucideIcon   // Ícono de Lucide
}

// ==========================================
// 📋 MAPEO DE CATEGORÍAS
// ==========================================

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    'Cálculo': {
        color: 'from-blue-500 to-cyan-500',
        icon: Calculator
    },
    'Álgebra': {
        color: 'from-purple-500 to-pink-500',
        icon: BookOpen
    },
    'Estadística': {
        color: 'from-green-500 to-emerald-500',
        icon: TrendingUp
    },
    'Geometría': {
        color: 'from-orange-500 to-red-500',
        icon: Award
    },
    'Análisis': {
        color: 'from-indigo-500 to-purple-500',
        icon: BookMarked
    },
    'Matemática Aplicada': {
        color: 'from-teal-500 to-cyan-500',
        icon: Sparkles
    },
    'Otros': {
        color: 'from-gray-500 to-slate-500',
        icon: BookOpen
    },
}

// ==========================================
// 🔧 UTILIDADES
// ==========================================

/**
 * Obtiene la configuración de una categoría
 * Si no existe, devuelve la configuración de "Otros"
 */
export function getCategoryConfig(categoria: string): CategoryConfig {
    return CATEGORY_CONFIG[categoria] || CATEGORY_CONFIG['Otros']
}

/**
 * Obtiene todas las categorías disponibles
 */
export function getAllCategories(): string[] {
    return Object.keys(CATEGORY_CONFIG)
}