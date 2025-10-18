// src/app/courses/[id]/chapters/[chapterId]/page.tsx
// ==========================================
// 📚 PÁGINA DE CAPÍTULO - MATUC v4
// ==========================================

'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react'

// Componentes
import ChapterHeader from '@/components/chapters/ChapterHeader'
import ClassTab from '@/components/chapters/tabs/ClassTab'
import WorkshopTab from '@/components/chapters/tabs/WorkshopTab'
import EvaluationTab from '@/components/chapters/tabs/EvaluationTab'

// Mock data
import {
  MOCK_CAPITULO_COMPLETO_ESTUDIANTE,
} from '@/lib/mock/chapter-mock-data'
import type {
  ContenidoFiltrado,
  EjercicioAyudantiaFiltrado,
  EjercicioEvaluacionEstudiante,
} from '@/types/chapter.types'

// ==========================================
// 🎯 TIPOS
// ==========================================

interface ChapterPageProps {
  params: Promise<{
    id: string
    chapterId: string
  }>
}

type ActiveTab = 'clase' | 'ayudantia' | 'evaluacion'

// ==========================================
// 🎓 COMPONENTE PRINCIPAL
// ==========================================

export default function ChapterPage({ params }: ChapterPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { id: courseId, chapterId } = resolvedParams

  // Estados
  const [activeTab, setActiveTab] = useState<ActiveTab>('clase')

  // Mock data (temporal - después será API call)
  const data = MOCK_CAPITULO_COMPLETO_ESTUDIANTE
  const { capitulo, ejerciciosAyudantia, ejerciciosEvaluacion, permisos, progreso } = data

  // NUEVO: Nombre del curso (mock - después vendrá de la API)
  const courseName = "MAT1610 - Cálculo I"

  // ==========================================
  // 🎨 ANIMACIONES
  // ==========================================

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const tabContentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  }

  // ==========================================
  // 🎯 HANDLERS
  // ==========================================

  const handleContenidoClick = (contenido: ContenidoFiltrado) => {
    console.log('Contenido clicked:', contenido)
    // TODO: Abrir modal o navegar a vista detallada
  }

  const handleToggleHabilitacion = async (contenidoId: string, habilitado: boolean) => {
    console.log('Toggle habilitación contenido:', contenidoId, habilitado)
    // TODO: API call para habilitar/deshabilitar
  }

  const handleEjercicioAyudantiaClick = (ejercicio: EjercicioAyudantiaFiltrado) => {
    console.log('Ejercicio ayudantía clicked:', ejercicio)
    // TODO: Abrir modal con ejercicio
  }

  const handleToggleHabilitacionAyudantia = async (ejercicioId: string, habilitado: boolean) => {
    console.log('Toggle habilitación ayudantía:', ejercicioId, habilitado)
    // TODO: API call
  }

  const handleEjercicioEvaluacionClick = (ejercicio: EjercicioEvaluacionEstudiante) => {
    console.log('Ejercicio evaluación clicked:', ejercicio)
    // TODO: Abrir modal de detalles
  }

  const handleIniciarEvaluacion = (ejercicioId: string) => {
    console.log('Iniciar evaluación:', ejercicioId)
    // TODO: Navegar a página de evaluación
    router.push(`/courses/${courseId}/chapters/${chapterId}/evaluation/${ejercicioId}`)
  }

  const handleToggleHabilitacionEvaluacion = async (ejercicioId: string, habilitado: boolean) => {
    console.log('Toggle habilitación evaluación:', ejercicioId, habilitado)
    // TODO: API call
  }

  // Simular contenidos completados (estudiantes)
  const completedContentIds = progreso
    ? ['cont-001', 'cont-002', 'cont-005', 'cont-009']
    : []

  // ==========================================
  // 🎨 RENDER
  // ==========================================

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
    >
      {/* Header del Capítulo */}
      <ChapterHeader
        capitulo={capitulo}
        courseId={courseId}
        permisos={permisos}
        progreso={progreso}
        onEdit={() => console.log('Editar capítulo')}
        onSettings={() => console.log('Configurar capítulo')}
        onViewStats={() => console.log('Ver estadísticas')}
        onToggleVisibility={() => console.log('Toggle visibilidad')}
      />

      {/* Tabs Navigation - STICKY EN LA PARTE SUPERIOR */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-[73px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1">
            <TabButton
              active={activeTab === 'clase'}
              onClick={() => setActiveTab('clase')}
              icon={<BookOpen className="w-5 h-5" />}
              label="Clase"
              count={capitulo.temas.length}
            />
            <TabButton
              active={activeTab === 'ayudantia'}
              onClick={() => setActiveTab('ayudantia')}
              icon={<GraduationCap className="w-5 h-5" />}
              label="Ayudantía"
              count={ejerciciosAyudantia.length}
            />
            <TabButton
              active={activeTab === 'evaluacion'}
              onClick={() => setActiveTab('evaluacion')}
              icon={<ClipboardCheck className="w-5 h-5" />}
              label="Evaluación"
              count={ejerciciosEvaluacion.length}
            />
          </div>
        </div>
      </div>

      {/* Contenido de los tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeTab === 'clase' && (
              <ClassTab
                temas={capitulo.temas}
                permisos={permisos}
                completedContentIds={completedContentIds}
                onContenidoClick={handleContenidoClick}
                onToggleHabilitacion={handleToggleHabilitacion}
              />
            )}
            {activeTab === 'ayudantia' && (
              <WorkshopTab
                ejercicios={ejerciciosAyudantia}
                permisos={permisos}
                onEjercicioClick={handleEjercicioAyudantiaClick}
                onToggleHabilitacion={handleToggleHabilitacionAyudantia}
              />
            )}
            {activeTab === 'evaluacion' && (
              <EvaluationTab
                ejercicios={ejerciciosEvaluacion}
                permisos={permisos}
                onEjercicioClick={handleEjercicioEvaluacionClick}
                onIniciarEvaluacion={handleIniciarEvaluacion}
                onToggleHabilitacion={handleToggleHabilitacionEvaluacion}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ==========================================
// 🎨 COMPONENTE: TAB BUTTON
// ==========================================

interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all
        ${active
          ? 'text-uc-azul bg-uc-azul/5'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      <span
        className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${active ? 'bg-uc-azul text-white' : 'bg-gray-200 text-gray-700'}
      `}
      >
        {count}
      </span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-uc-azul rounded-t-lg"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}