// src/app/courses/_components/CourseHeader.tsx
// ==========================================
// 📄 HEADER DE LA PÁGINA DE CURSOS
// ==========================================

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PermissionGate, RoleBasedContent } from '@/components/auth/PermissionGate'

// ==========================================
// 🎯 PROPS
// ==========================================

interface CourseHeaderProps {
    totalCursos: number
    isLoading: boolean
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseHeader({ totalCursos, isLoading }: CourseHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <RoleBasedContent
                                estudiante="Mis Cursos"
                                profesor="Cursos que Enseño"
                                administrador="Todos los Cursos"
                                fallback="Cursos"
                            />
                        </h1>
                        <p className="text-gray-600">
                            {isLoading ? 'Cargando...' : `${totalCursos} cursos disponibles`}
                        </p>
                    </div>

                    {/* Botón crear curso (solo admin) */}
                    <PermissionGate permission="canCreateCourse">
                        <Link href="/courses/create">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Crear Curso</span>
                            </motion.button>
                        </Link>
                    </PermissionGate>
                </div>
            </div>
        </div>
    )
}