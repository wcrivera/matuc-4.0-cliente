// src/app/courses/_components/CourseGrid.tsx
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseCard } from './CourseCard'
import { CourseEmptyState } from './CourseEmptyState'
import type { CursoConMatricula } from '@/types/matricula.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CourseGridProps {
    cursos: CursoConMatricula[]
    isLoading: boolean
    error?: Error | null
    searchTerm?: string
    filtroActivo?: string
    onClearFilters?: () => void
}

// ==========================================
// 🎨 COMPONENTE DE SKELETON LOADING
// ==========================================

function CourseCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            {/* Header skeleton con gradiente UC */}
            <div className="h-24 bg-gradient-to-r from-uc-azul/20 to-uc-celeste/20" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />

                <div className="space-y-2 pt-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>

                <div className="flex justify-between pt-2">
                    <div className="h-6 bg-gray-100 rounded w-16" />
                    <div className="h-6 bg-gray-100 rounded w-20" />
                </div>
            </div>
        </div>
    )
}

// ==========================================
// 🎨 COMPONENTE PRINCIPAL
// ==========================================

export function CourseGrid({
    cursos,
    isLoading,
    error,
    searchTerm = '',
    filtroActivo = 'todos',
    onClearFilters
}: CourseGridProps) {

    // ==========================================
    // 🔄 ESTADO: CARGANDO
    // ==========================================
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <CourseCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    // ==========================================
    // ❌ ESTADO: ERROR
    // ==========================================
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center"
            >
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Error al cargar los cursos
                </h3>
                <p className="text-red-600 mb-4">
                    {error.message || 'Ocurrió un error inesperado'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-uc-azul hover:bg-uc-azul-700 text-white rounded-lg transition-colors shadow-uc"
                >
                    Reintentar
                </button>
            </motion.div>
        )
    }

    // ==========================================
    // 📭 ESTADO: VACÍO
    // ==========================================
    if (cursos.length === 0) {
        return (
            <CourseEmptyState
                hasSearch={!!searchTerm}
                searchTerm={searchTerm}
                filtroActivo={filtroActivo}
                onClearFilters={onClearFilters}
            />
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
                {cursos.map((cursoData, index) => (
                    <motion.div
                        key={cursoData.matricula.mid}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.05, // Efecto escalonado
                        }}
                    >
                        <CourseCard data={cursoData} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}