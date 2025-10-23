// src/app/courses/[id]/chapters/[chapterId]/page.tsx
// ==========================================
// 📚 PÁGINA DE CAPÍTULO MEJORADA - MATUC v4
// Sistema de Tabs: Clase | Ayudantía | Ejercicio
// ==========================================

'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Users,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react'

// Tipos
import type {
  CapituloVistaCompleta,
  ContenidoFiltrado,
  EjercicioAyudantiaFiltrado,
  EjercicioEvaluacionEstudiante,
} from '@/types/chapter.types'

// Componentes de tabs
import ClaseTab from '@/components/chapters/tabs/ClaseTab'
import AyudantiaTab from '@/components/chapters/tabs/AyudantiaTab'
import EjercicioTab from '@/components/chapters/tabs/EjercicioTab'

// Mock data temporal
import { MOCK_CAPITULO_COMPLETO_ESTUDIANTE } from '@/lib/mock/chapter-mock-data'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ChapterPageProps {
  params: Promise<{
    id: string
    chapterId: string
  }>
}

type TabType = 'clase' | 'ayudantia' | 'ejercicio'

interface TabConfig {
  id: TabType
  label: string
  icon: React.ReactNode
  color: string
  gradient: string
}

// ==========================================
// 🎨 CONFIGURACIÓN DE TABS
// ==========================================

const TABS: TabConfig[] = [
  {
    id: 'clase',
    label: 'Clase',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'uc-azul',
    gradient: 'from-uc-azul to-uc-celeste',
  },
  {
    id: 'ayudantia',
    label: 'Ayudantía',
    icon: <Users className="w-5 h-5" />,
    color: 'uc-celeste',
    gradient: 'from-uc-celeste to-blue-400',
  },
  {
    id: 'ejercicio',
    label: 'Ejercicio',
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: 'feedback-exito',
    gradient: 'from-feedback-exito to-green-500',
  },
]

// ==========================================
// 🎓 COMPONENTE PRINCIPAL
// ==========================================

export default function ChapterPage({ params }: ChapterPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { id: courseId, chapterId } = resolvedParams

  // Estado del tab activo
  const [activeTab, setActiveTab] = useState<TabType>('clase')

  // Mock data (temporal - después será API call con chapterId)
  const data: CapituloVistaCompleta = MOCK_CAPITULO_COMPLETO_ESTUDIANTE
  const { capitulo, ejerciciosAyudantia, ejerciciosEvaluacion, permisos, progreso } = data

  // TODO: Usar chapterId para obtener datos del backend
  console.log('Chapter ID:', chapterId)

  // ==========================================
  // 🎯 HANDLERS
  // ==========================================

  const handleContenidoClick = (contenido: ContenidoFiltrado) => {
    console.log('Contenido clicked:', contenido)
    // TODO: Abrir modal de visualización
  }

  const handleEjercicioEvaluacionClick = (ejercicio: EjercicioEvaluacionEstudiante) => {
    console.log('Ejercicio evaluación clicked:', ejercicio)
    // TODO: Navegar a página de evaluación
  }

  const handleIniciarEvaluacion = async (ejercicioId: string) => {
    console.log('Iniciar evaluación:', ejercicioId)
    // TODO: Iniciar evaluación
  }

  // ==========================================
  // 🎨 RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-uc-celeste/5">
      {/* Header compacto y elegante */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb y título */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/courses/${courseId}`)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Volver al curso"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-uc-azul to-uc-celeste rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-uc-azul">
                    {capitulo.titulo}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {capitulo.temas.length} temas • {capitulo.contenidosTotales} contenidos
                  </p>
                </div>
              </div>
            </div>

            {/* Progreso (solo para estudiantes) */}
            {progreso && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-uc-celeste/10 to-feedback-exito/10 rounded-xl border border-uc-celeste/20"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Progreso</p>
                  <p className="text-lg font-bold text-uc-azul">
                    {progreso.porcentajeProgreso.toFixed(0)}%
                  </p>
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progreso.porcentajeProgreso}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-uc-celeste to-feedback-exito"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs de navegación - Estilo inspirado en tus imágenes */}
      <div className="bg-gradient-to-r from-uc-azul via-uc-azul to-uc-celeste shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pt-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: isActive ? 0 : -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-t-2xl font-semibold
                    transition-all duration-300
                    ${isActive
                      ? 'bg-white text-uc-azul shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>

                  {/* Indicador activo */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-uc-celeste to-feedback-exito rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenido de los tabs */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'clase' && (
              <ClaseTab
                temas={capitulo.temas}
                permisos={permisos}
                progreso={progreso}
                onContenidoClick={handleContenidoClick}
              />
            )}

            {activeTab === 'ayudantia' && (
              <AyudantiaTab
                ejercicios={ejerciciosAyudantia}
                permisos={permisos}
              />
            )}

            {activeTab === 'ejercicio' && (
              <EjercicioTab
                ejercicios={ejerciciosEvaluacion}
                permisos={permisos}
                onEjercicioClick={handleEjercicioEvaluacionClick}
                onIniciarEvaluacion={handleIniciarEvaluacion}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}