// src/app/courses/_components/CourseHeader.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus } from 'lucide-react'
import { useAuth } from '@/lib/stores/auth.store'
import Link from 'next/link'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface CourseHeaderProps {
  totalCursos: number
  isLoading?: boolean
  contadores?: {
    estudiante: number
    ayudante: number
    profesor: number
    total: number
  }
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function CourseHeader({ totalCursos, isLoading = false, contadores }: CourseHeaderProps) {
  const { user } = useAuth()

  // Determinar título según rol principal del usuario
  const getTitulo = () => {
    if (!user) return 'Mis Cursos'

    // Si es admin
    if (user.admin) {
      return 'Todos los Cursos del Sistema'
    }

    // Si tiene cursos como profesor
    if (contadores && contadores.profesor > 0) {
      return 'Mis Cursos'
    }

    // Por defecto
    return 'Mis Cursos'
  }

  // Generar descripción dinámica
  const getDescripcion = () => {
    if (isLoading) return 'Cargando...'

    if (!contadores || totalCursos === 0) {
      return 'No tienes cursos activos'
    }

    const partes = []

    if (contadores.estudiante > 0) {
      partes.push(`${contadores.estudiante} como estudiante`)
    }

    if (contadores.ayudante > 0) {
      partes.push(`${contadores.ayudante} como ayudante`)
    }

    if (contadores.profesor > 0) {
      partes.push(`${contadores.profesor} como profesor`)
    }

    if (partes.length === 0) {
      return `${totalCursos} curso${totalCursos !== 1 ? 's' : ''} disponible${totalCursos !== 1 ? 's' : ''}`
    }

    if (partes.length === 1) {
      return `Tienes acceso a ${partes[0]}`
    }

    if (partes.length === 2) {
      return `Tienes acceso a ${partes[0]} y ${partes[1]}`
    }

    // 3 roles
    const ultimaParte = partes.pop()
    return `Tienes acceso a ${partes.join(', ')} y ${ultimaParte}`
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-uc-azul via-uc-celeste to-uc-azul-700 rounded-2xl p-8 text-white mb-6 shadow-uc-lg">
      {/* Contenido principal */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          {/* Lado izquierdo: Título y descripción */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-10 h-10" />
              <h1 className="text-4xl font-bold">
                {getTitulo()}
              </h1>
            </div>

            <p className="text-white/90 text-lg">
              {getDescripcion()}
            </p>

            {/* Badges de roles (solo si hay múltiples roles) */}
            {contadores && (contadores.estudiante > 0 || contadores.ayudante > 0 || contadores.profesor > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-4"
              >
                {contadores.estudiante > 0 && (
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5 border border-white/20">
                    <span>👨‍🎓</span>
                    <span>{contadores.estudiante}</span>
                  </div>
                )}

                {contadores.ayudante > 0 && (
                  <div className="px-3 py-1 bg-uc-amarillo/30 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5 border border-uc-amarillo/40">
                    <span>🤝</span>
                    <span>{contadores.ayudante}</span>
                  </div>
                )}

                {contadores.profesor > 0 && (
                  <div className="px-3 py-1 bg-uc-celeste/30 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5 border border-uc-celeste/40">
                    <span>👨‍🏫</span>
                    <span>{contadores.profesor}</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Lado derecho: Botón crear curso (solo admin) */}
          {user?.admin && (
            <Link href="/courses/create">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  flex items-center gap-2 px-6 py-3
                  bg-uc-amarillo text-uc-azul rounded-xl font-semibold
                  shadow-lg hover:shadow-amarillo-lg transition-all
                "
              >
                <Plus className="w-5 h-5" />
                <span>Crear Curso</span>
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>

      {/* Efectos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-uc-celeste/20 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-uc-amarillo/10 rounded-full translate-y-24 -translate-x-24 blur-2xl" />

      {/* Efecto de brillo animado */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'linear'
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  )
}