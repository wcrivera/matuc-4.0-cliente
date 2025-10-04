// src/app/dashboard/courses/page.tsx - Página de Cursos Hermosa e Impactante
'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Calculator,
  TrendingUp,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Zap,
  Award,
  Target,
  Play,
  Calendar,
  BookMarked,
  Brain,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/stores/auth.store'

// Datos simulados de cursos (reemplazar con API real)
const MOCK_COURSES = [
  {
    id: 'calc1',
    titulo: 'Cálculo I',
    descripcion: 'Fundamentos del cálculo diferencial e integral con aplicaciones prácticas',
    profesor: 'Dr. María González',
    estudiantes: 156,
    progreso: 75,
    color: 'from-blue-500 to-cyan-500',
    icono: Calculator,
    dificultad: 'Intermedio',
    duracion: '16 semanas',
    modulos: 8,
    rating: 4.8,
    activo: true,
    ultimaActividad: '2 horas',
    categoria: 'Matemáticas'
  },
  {
    id: 'algebra',
    titulo: 'Álgebra Lineal',
    descripcion: 'Vectores, matrices y espacios vectoriales con enfoque computacional',
    profesor: 'Dr. Carlos Ruiz',
    estudiantes: 89,
    progreso: 45,
    color: 'from-purple-500 to-pink-500',
    icono: BookOpen,
    dificultad: 'Avanzado',
    duracion: '14 semanas',
    modulos: 6,
    rating: 4.9,
    activo: true,
    ultimaActividad: '1 día',
    categoria: 'Matemáticas'
  },
  {
    id: 'estadistica',
    titulo: 'Estadística Aplicada',
    descripcion: 'Análisis estadístico y probabilidad para la toma de decisiones',
    profesor: 'Dra. Ana Martínez',
    estudiantes: 134,
    progreso: 60,
    color: 'from-green-500 to-emerald-500',
    icono: TrendingUp,
    dificultad: 'Intermedio',
    duracion: '12 semanas',
    modulos: 5,
    rating: 4.7,
    activo: true,
    ultimaActividad: '3 horas',
    categoria: 'Estadística'
  },
  {
    id: 'geometria',
    titulo: 'Geometría Analítica',
    descripcion: 'Coordenadas, cónicas y transformaciones geométricas',
    profesor: 'Dr. Roberto Silva',
    estudiantes: 67,
    progreso: 30,
    color: 'from-orange-500 to-red-500',
    icono: Target,
    dificultad: 'Básico',
    duracion: '10 semanas',
    modulos: 4,
    rating: 4.6,
    activo: false,
    ultimaActividad: '1 semana',
    categoria: 'Geometría'
  }
]

// Componente para tarjeta de curso individual
function CourseCard({ course, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = course.icono

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const getStatusBadge = () => {
    if (course.activo) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Activo
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
        <Clock className="w-3 h-3" />
        Pausado
      </div>
    )
  }

  const getDifficultyColor = (dificultad) => {
    switch (dificultad) {
      case 'Básico': return 'text-green-600 bg-green-50'
      case 'Intermedio': return 'text-yellow-600 bg-yellow-50'
      case 'Avanzado': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/dashboard/courses/${course.id}`}>
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200">

          {/* Header con gradiente */}
          <div className={`relative h-24 bg-gradient-to-r ${course.color} p-6 overflow-hidden`}>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />

            <div className="relative z-10 flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-lg leading-tight">{course.titulo}</h3>
                  <p className="text-white/80 text-sm">{course.categoria}</p>
                </div>
              </div>

              {getStatusBadge()}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-4">

            {/* Descripción */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {course.descripcion}
            </p>

            {/* Profesor */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xs">
                  {course.profesor.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{course.profesor}</span>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{course.estudiantes} estudiantes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookMarked className="w-4 h-4" />
                  <span>{course.modulos} módulos</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{course.duracion}</span>
                </div>
              </div>
            </div>

            {/* Progreso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progreso</span>
                <span className="font-semibold text-gray-900">{course.progreso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progreso}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.dificultad)}`}>
                {course.dificultad}
              </div>

              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 group-hover:text-uc-azul transition-colors"
              >
                Acceder
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Componente principal
export default function CoursesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'todos' || course.categoria === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, filterCategory])

  const categories = ['todos', ...new Set(MOCK_COURSES.map(c => c.categoria))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header heroico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Header principal */}
          <div className="relative overflow-hidden bg-gradient-to-r from-uc-azul via-uc-celeste to-blue-600 rounded-3xl p-8 text-white">

            {/* Efectos de fondo */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-uc-amarillo/10 rounded-full translate-y-32 -translate-x-32" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Matemáticas del Futuro
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl lg:text-5xl font-bold leading-tight"
                >
                  Tus Cursos de
                  <span className="block text-uc-amarillo">Matemáticas</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/90 leading-relaxed"
                >
                  Descubre, aprende y domina las matemáticas con nuestra plataforma de última generación.
                </motion.p>

                {/* Stats rápidas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-6 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-uc-amarillo rounded-full animate-pulse" />
                    <span>{MOCK_COURSES.length} cursos disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>{MOCK_COURSES.filter(c => c.activo).length} activos</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                {/* Ilustración matemática animada */}
                <div className="relative w-full h-64 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
                  <div className="relative z-10 text-6xl font-bold text-white/80">
                    ∑∫dx
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-4 right-4 w-8 h-8 border-2 border-uc-amarillo/50 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 left-4 w-4 h-4 bg-uc-amarillo/80 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uc-azul/20 focus:border-uc-azul transition-all"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-uc-azul transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </motion.button>

              {user?.role === 'profesor' || user?.role === 'administrador' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-uc-azul text-white rounded-xl hover:bg-uc-azul/90 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Crear Curso
                </motion.button>
              ) : null}
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategory === category
                          ? 'bg-uc-azul text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {category === 'todos' ? 'Todos' : category}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid de cursos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros o términos de búsqueda</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}