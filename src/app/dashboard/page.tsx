// src/app/(dashboard)/page.tsx - Dashboard principal hermoso post-login
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/stores/auth.store'
import {
  BookOpen,
  Calculator,
  Users,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Award,
  Target,
  Zap,
  Heart,
  Coffee
} from 'lucide-react'

export default function DashboardPage() {
  const { user, displayName } = useAuth()

  // Determinar el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // Contenido específico por rol
  const getDashboardContent = () => {
    const role = user?.role || 'estudiante'

    switch (role) {
      case 'estudiante':
        return <StudentDashboard />
      case 'profesor':
      case 'profesor_editor':
        return <TeacherDashboard />
      case 'administrador':
        return <AdminDashboard />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header de bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-uc-azul to-uc-celeste rounded-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-uc-amarillo/20 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <motion.h1
            className="text-3xl lg:text-4xl font-bold mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {getGreeting()}, {displayName.split(' ')[0]} 👋
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Listo para una sesión productiva de matemáticas
          </motion.p>

          {/* Badge de rol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-uc-amarillo/20 rounded-full"
          >
            <Award className="w-4 h-4 text-uc-amarillo" />
            <span className="text-uc-amarillo font-semibold text-sm capitalize">
              {user?.role?.replace('_', ' ')}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenido específico por rol */}
      {getDashboardContent()}

      {/* Footer motivacional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 border border-gray-200 text-center"
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Heart className="w-5 h-5 text-red-500" />
          <span>Hecho con amor para la comunidad UC</span>
          <Coffee className="w-5 h-5 text-uc-amarillo" />
        </div>
      </motion.div>
    </div>
  )
}

// Dashboard para estudiantes
function StudentDashboard() {
  const quickStats = [
    { icon: BookOpen, label: 'Cursos Activos', value: '4', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Calculator, label: 'Ejercicios Pendientes', value: '7', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: TrendingUp, label: 'Progreso General', value: '82%', color: 'text-uc-azul', bg: 'bg-uc-azul/10' },
    { icon: Target, label: 'Racha Actual', value: '5 días', color: 'text-uc-amarillo', bg: 'bg-uc-amarillo/10' },
  ]

  const recentActivities = [
    { title: 'Límites y Continuidad', course: 'Cálculo I', status: 'completed', time: '2 horas' },
    { title: 'Derivadas Parciales', course: 'Cálculo II', status: 'in-progress', time: 'Ahora' },
    { title: 'Sistemas Lineales', course: 'Álgebra', status: 'pending', time: '1 día' },
  ]

  return (
    <div className="space-y-8">

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 text-uc-azul mr-2" />
              Actividad Reciente
            </h3>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + 0.1 * index }}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'in-progress' ? 'bg-uc-amarillo' : 'bg-gray-300'
                    }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.course}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-500">{activity.time}</span>
                  {activity.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 ml-auto" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panel lateral */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Próxima clase */}
          <div className="bg-gradient-to-br from-uc-celeste to-uc-azul rounded-xl p-6 text-white">
            <h4 className="font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Próxima Clase
            </h4>
            <p className="text-sm text-white/90 mb-1">Cálculo II - Derivadas</p>
            <p className="text-white/80 text-xs">Hoy 14:30 - Sala 301</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/70">Profesor: Dr. González</p>
            </div>
          </div>

          {/* Motivación */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-900 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-uc-amarillo" />
              Tip del Día
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              &quot;La matemática es el lenguaje con el que Dios ha escrito el universo.&quot; - Galileo Galilei
            </p>
            <div className="mt-3 text-xs text-gray-400">
              ¡Mantén el ritmo! 🚀
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Dashboard para profesores
function TeacherDashboard() {
  const teacherStats = [
    { icon: Users, label: 'Estudiantes Activos', value: '124', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BookOpen, label: 'Cursos', value: '3', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Calculator, label: 'Ejercicios Creados', value: '28', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Star, label: 'Rating Promedio', value: '4.9', color: 'text-uc-amarillo', bg: 'bg-uc-amarillo/10' },
  ]

  return (
    <div className="space-y-8">

      {/* Estadísticas del profesor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Cursos activos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mis Cursos</h3>

          <div className="space-y-4">
            {[
              { name: 'Cálculo I', students: 45, progress: 78 },
              { name: 'Cálculo II', students: 38, progress: 65 },
              { name: 'Álgebra Lineal', students: 41, progress: 82 },
            ].map((course, index) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + 0.1 * index }}
                className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{course.name}</h4>
                  <span className="text-sm text-gray-500">{course.students} estudiantes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-uc-celeste h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 1 + 0.1 * index, duration: 1 }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{course.progress}% completado</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actividad de estudiantes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>

          <div className="space-y-3">
            {[
              { student: 'María González', action: 'completó Límites', time: '5 min' },
              { student: 'Juan Pérez', action: 'envió tarea', time: '12 min' },
              { student: 'Ana Silva', action: 'hizo pregunta', time: '1 hora' },
              { student: 'Carlos López', action: 'completó quiz', time: '2 horas' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + 0.1 * index }}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Dashboard para administradores
function AdminDashboard() {
  const adminStats = [
    { icon: Users, label: 'Usuarios Totales', value: '1,247', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BookOpen, label: 'Cursos Activos', value: '18', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: TrendingUp, label: 'Uso del Sistema', value: '94%', color: 'text-uc-azul', bg: 'bg-uc-azul/10' },
    { icon: AlertCircle, label: 'Reportes Pendientes', value: '3', color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-8">

      {/* Estadísticas del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Panel de administración */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-uc-azul to-uc-celeste rounded-xl p-8 text-white"
      >
        <h3 className="text-xl font-bold mb-4">Panel de Control</h3>
        <p className="text-white/90 mb-6">
          Gestiona usuarios, cursos y configuraciones del sistema desde aquí.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left">
            <Users className="w-6 h-6 mb-2" />
            <div className="font-semibold">Gestionar Usuarios</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left">
            <BookOpen className="w-6 h-6 mb-2" />
            <div className="font-semibold">Administrar Cursos</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left">
            <TrendingUp className="w-6 h-6 mb-2" />
            <div className="font-semibold">Ver Analytics</div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}