// src/app/courses/_components/CourseGrid.tsx
// ==========================================
// 📊 GRID DE CURSOS CON ESTADOS
// ==========================================

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { CourseCard } from './CourseCard'
import type { MiCurso } from '@/lib/hooks/useMatricula'

// ==========================================
// 🎯 PROPS
// ==========================================

interface CourseGridProps {
    cursos: MiCurso[]
    isLoading: boolean
    error: Error | null
    searchTerm: string
    selectedCategory: string
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseGrid({
    cursos,
    isLoading,
    error,
    searchTerm,
    selectedCategory
}: CourseGridProps) {
    // ==========================================
    // 🔄 ESTADO: CARGANDO
    // ==========================================
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Cargando cursos...</p>
                </div>
            </div>
        )
    }

    // ==========================================
    // ❌ ESTADO: ERROR
    // ==========================================
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">
                    Error al cargar los cursos. Por favor, intenta de nuevo.
                </p>
            </div>
        )
    }

    // ==========================================
    // 📭 ESTADO: VACÍO
    // ==========================================
    if (cursos.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
            >
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No se encontraron cursos
                </h3>
                <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'todas'
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Aún no estás matriculado en ningún curso'}
                </p>
            </motion.div>
        )
    }

    // ==========================================
    // ✅ ESTADO: GRID CON CURSOS
    // ==========================================
    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {cursos.map((miCurso) => (
                    <CourseCard
                        key={miCurso.curso.cid}
                        miCurso={miCurso}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    )
}