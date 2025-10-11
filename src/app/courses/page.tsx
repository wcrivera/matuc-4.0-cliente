// src/app/courses/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useMisCursos } from '@/lib/hooks/useMatricula'
import { CourseHeader } from './_components/CourseHeader'
import { CourseFilters, type FiltroRol } from './_components/CourseFilters'
import { CourseSearch } from './_components/CourseSearch'
import { CourseGrid } from './_components/CourseGrid'
import { motion } from 'framer-motion'

// ==========================================
// 🎨 PÁGINA PRINCIPAL DE CURSOS
// ==========================================

export default function CoursesPage() {
    // ==========================================
    // 📊 ESTADO Y DATOS
    // ==========================================
    const { data, isLoading, error } = useMisCursos()
    const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos')
    const [busqueda, setBusqueda] = useState('')

    // ==========================================
    // 🔢 CALCULAR CONTADORES
    // ==========================================
    const contadores = useMemo(() => {
        if (!data?.cursos) {
            return { estudiante: 0, ayudante: 0, profesor: 0, total: 0 }
        }

        const cursos = data.cursos
        return {
            estudiante: cursos.filter(c => c.matricula.rol === 'estudiante').length,
            ayudante: cursos.filter(c => c.matricula.rol === 'ayudante').length,
            profesor: cursos.filter(c =>
                c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor'
            ).length,
            total: cursos.length
        }
    }, [data])

    // ==========================================
    // 🔍 FILTRAR CURSOS
    // ==========================================
    const cursosFiltrados = useMemo(() => {
        if (!data?.cursos) return []

        let resultado = data.cursos

        // Filtrar por rol
        if (filtroRol !== 'todos') {
            resultado = resultado.filter(c => {
                if (filtroRol === 'profesor') {
                    return c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor'
                }
                return c.matricula.rol === filtroRol
            })
        }

        // Filtrar por búsqueda
        if (busqueda.trim()) {
            const termino = busqueda.toLowerCase().trim()
            resultado = resultado.filter(c =>
                c.curso.nombre.toLowerCase().includes(termino) ||
                c.curso.sigla.toLowerCase().includes(termino) ||
                c.curso.descripcion.toLowerCase().includes(termino) ||
                c.curso.categoria.toLowerCase().includes(termino)
            )
        }

        return resultado
    }, [data, filtroRol, busqueda])

    // ==========================================
    // 🔄 LIMPIAR FILTROS
    // ==========================================
    const handleClearFilters = () => {
        setBusqueda('')
        setFiltroRol('todos')
    }

    // ==========================================
    // 🎨 RENDER
    // ==========================================
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <CourseHeader
                    totalCursos={data?.total || 0}
                    isLoading={isLoading}
                    contadores={contadores}
                />

                {/* Controles: Filtros y Búsqueda */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 mb-6"
                >
                    {/* Filtros por rol */}
                    <CourseFilters
                        filtroActivo={filtroRol}
                        onFiltroChange={setFiltroRol}
                        contadores={contadores}
                    />

                    {/* Barra de búsqueda */}
                    <CourseSearch
                        value={busqueda}
                        onChange={setBusqueda}
                        placeholder="Buscar por nombre, sigla, descripción o categoría..."
                        totalResultados={busqueda ? cursosFiltrados.length : undefined}
                    />
                </motion.div>

                {/* Grid de cursos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <CourseGrid
                        cursos={cursosFiltrados}
                        isLoading={isLoading}
                        error={error || null}
                        searchTerm={busqueda}
                        filtroActivo={filtroRol}
                        onClearFilters={handleClearFilters}
                    />
                </motion.div>

                {/* Footer informativo (opcional) */}
                {!isLoading && cursosFiltrados.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center text-sm text-gray-500"
                    >
                        Mostrando {cursosFiltrados.length} de {data?.total || 0} curso{data?.total !== 1 ? 's' : ''}
                        {busqueda && ` que coinciden con "${busqueda}"`}
                        {filtroRol !== 'todos' && ` en la categoría "${filtroRol}"`}
                    </motion.div>
                )}
            </div>
        </div>
    )
}