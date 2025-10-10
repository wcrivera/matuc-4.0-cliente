// src/app/courses/_components/CourseCard.tsx
// ==========================================
// 🃏 CARD DE CURSO INDIVIDUAL
// ==========================================

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    BookOpen,
    Users,
    Calendar,
    Award,
    BookMarked,
    ChevronRight,
    Settings,
    UserPlus,
} from 'lucide-react'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { RoleBadge } from '@/components/courses/RoleBadge'
import { getCategoryConfig } from '@/components/courses/CategoryConfig'
import type { MiCurso } from '@/lib/hooks/useMatricula'

// ==========================================
// 🎯 PROPS
// ==========================================

interface CourseCardProps {
    miCurso: MiCurso
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseCard({ miCurso }: CourseCardProps) {
    const categoryConfig = getCategoryConfig(miCurso.curso.categoria)
    const Icon = categoryConfig.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            {/* Header con gradiente */}
            <div className={`relative h-32 bg-gradient-to-br ${categoryConfig.color} p-6`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

                <div className="relative z-10 flex items-start justify-between h-full">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-6 h-6 text-white" />
                            <span className="text-white/90 text-sm font-semibold">
                                {miCurso.curso.sigla}
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-xl line-clamp-2 leading-tight">
                            {miCurso.curso.nombre}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                        <RoleBadge rol={miCurso.matricula.rol} />

                        {miCurso.curso.activo ? (
                            <div className="bg-green-400/90 text-green-900 text-xs font-medium px-2 py-1 rounded-full">
                                Activo
                            </div>
                        ) : (
                            <div className="bg-gray-300/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                Inactivo
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-4">
                {/* Descripción */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {miCurso.curso.descripcion || 'Sin descripción disponible'}
                </p>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{miCurso.curso.estadisticas?.totalEstudiantes || 0} estudiantes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{miCurso.curso.semestre}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4" />
                            <span>{miCurso.curso.creditos} créditos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookMarked className="w-4 h-4" />
                            <span>{miCurso.curso.estadisticas?.totalCapitulos || 0} módulos</span>
                        </div>
                    </div>
                </div>

                {/* Acciones según rol */}
                <div className="pt-4 flex items-center gap-2 border-t border-gray-100">
                    {/* Botón de acceso (todos) */}
                    <Link
                        href={`/courses/${miCurso.curso.cid}`}
                        className="flex-1"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-4 py-2.5 bg-gradient-to-br ${categoryConfig.color} text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Ver Curso</span>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </Link>

                    {/* Botón de gestión (solo profesores/admin) */}
                    <PermissionGate permission="canManageEnrollments">
                        <Link href={`/courses/${miCurso.curso.cid}/students`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                                title="Gestionar estudiantes"
                            >
                                <UserPlus className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </PermissionGate>

                    {/* Botón de edición (solo editores/admin) */}
                    <PermissionGate permission="canEditCourse">
                        <Link href={`/courses/${miCurso.curso.cid}/edit`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                                title="Editar curso"
                            >
                                <Settings className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </PermissionGate>
                </div>
            </div>
        </motion.div>
    )
}