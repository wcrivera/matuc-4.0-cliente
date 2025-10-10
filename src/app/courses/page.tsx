// src/app/courses/page.tsx
// ==========================================
// 📄 PÁGINA PRINCIPAL DE CURSOS
// ==========================================

'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/lib/stores/auth.store'
import { usePermissions } from '@/components/auth/PermissionGate'
import { useMisCursos } from '@/lib/hooks/useMatricula'
import { CourseHeader } from './_components/CourseHeader'
import { CourseFilters } from './_components/CourseFilters'
import { CourseGrid } from './_components/CourseGrid'

// ==========================================
// 📄 PÁGINA PRINCIPAL
// ==========================================

export default function CoursesPage() {
    // Hooks
    useAuth()
    usePermissions()
    const { data, isLoading, error } = useMisCursos()

    console.log(data, isLoading, error)

    // Estado local
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('todas')

    // Extraer cursos y memoizar (con manejo seguro)
    const misCursos = useMemo(() => {
        if (!data?.cursos) return []
        return data.cursos
    }, [data])

    // Filtrar cursos
    const cursosFiltrados = useMemo(() => {
        // if (!misCursos || misCursos.length === 0) return []

        // return misCursos.filter((miCurso) => {
        //     const matchesSearch =
        //         miCurso.curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //         miCurso.curso.sigla.toLowerCase().includes(searchTerm.toLowerCase())

        //     const matchesCategory =
        //         selectedCategory === 'todas' ||
        //         miCurso.curso.categoria === selectedCategory

        //     return matchesSearch && matchesCategory
        // })
    }, [misCursos, searchTerm, selectedCategory])

    // Extraer categorías únicas
    const categorias = useMemo(() => {
        // if (!misCursos || misCursos.length === 0) return ['todas']

        // const cats = new Set(misCursos.map((miCurso) => miCurso.curso.categoria))
        // return ['todas', ...Array.from(cats)]
    }, [misCursos])

    console.log(misCursos)

    // ==========================================
    // 🎨 RENDER
    // ==========================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <CourseHeader
                // totalCursos={cursosFiltrados.length}
                totalCursos={data?.cursos.length || 0}
                isLoading={isLoading}
            />

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filtros */}
                {/* <div className="mb-8">
                    <CourseFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        // categorias={categorias}
                        categorias={misCursos.length > 0 ? misCursos.map((miCurso) => miCurso.curso.categoria) : []}
                    />
                </div> */}

                {/* Grid de cursos */}
                {/* <CourseGrid
                    // cursos={cursosFiltrados}
                    cursos={misCursos}
                    isLoading={isLoading}
                    error={error}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                /> */}
            </div>
        </div>
    )
}