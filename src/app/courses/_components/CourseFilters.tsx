// src/app/courses/_components/CourseFilters.tsx
// ==========================================
// 🔍 BARRA DE BÚSQUEDA Y FILTROS
// ==========================================

'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'

// ==========================================
// 🎯 PROPS
// ==========================================

export interface CourseFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    categorias: string[]
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseFilters({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categorias
}: CourseFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o sigla..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Filtro de categoría */}
            <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[200px]"
                >
                    {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === 'todas' ? 'Todas las categorías' : cat}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}