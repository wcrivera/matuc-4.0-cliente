// src/app/page.tsx - Homepage MATUC v4 con Redirect Inteligente
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calculator, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/stores/auth.store'
import { getUserDefaultRoute } from '@/types/user.types'
import type { Route } from 'next'
import 'katex/dist/katex.min.css'
import katex from 'katex'

// Componente para LaTeX rotativo
function RotatingLatex() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const formulas = [
    {
      latex: 'e^{i\\pi} + 1 = 0',
      name: 'Identidad de Euler'
    },
    {
      latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
      name: 'Serie de Basel'
    },
    {
      latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
      name: 'Integral Gaussiana'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % formulas.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [formulas.length])

  // Renderizar LaTeX real
  const renderLatex = (formula: string) => {
    try {
      return katex.renderToString(formula, {
        displayMode: true,
        throwOnError: false,
      })
    } catch {
      return formula
    }
  }

  return (
    <div className="relative">
      {/* Contenedor con altura fija */}
      <div className="h-24 flex items-center justify-center relative overflow-hidden">
        {formulas.map((formula, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentIndex === index ? 1 : 0,
              scale: currentIndex === index ? 1 : 0.95
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="text-uc-amarillo text-xl lg:text-2xl"
              dangerouslySetInnerHTML={{
                __html: renderLatex(formula.latex)
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Indicador y nombre */}
      <div className="text-center mt-3">
        <div className="text-white/60 text-sm mb-2">
          {formulas[currentIndex].name}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center space-x-2">
          {formulas.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                backgroundColor: currentIndex === index ? '#ffc72c' : 'rgba(255, 255, 255, 0.3)'
              }}
              className="w-2 h-2 rounded-full transition-colors duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirección automática para usuarios autenticados
  useEffect(() => {
    // Solo redirigir si el usuario YA está autenticado y la app terminó de cargar
    if (!isLoading && isAuthenticated && user) {
      const destination = getUserDefaultRoute(user.role) as Route
      console.log(`Usuario autenticado detectado (${user.role}), redirigiendo a: ${destination}`)

      // Delay pequeño para que no se vea abrupto
      setTimeout(() => {
        router.replace(destination)
      }, 1000)
    }
  }, [isAuthenticated, user, isLoading, router])

  // Mostrar landing page si NO está autenticado o está cargando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uc-azul to-uc-celeste flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">MATUC v4.0</h2>
          <p className="text-white/80">Cargando...</p>
        </motion.div>
      </div>
    )
  }

  // Mostrar mensaje de redirección si está autenticado
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uc-azul to-uc-celeste flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-white/80">Redirigiendo a tu dashboard...</p>
        </motion.div>
      </div>
    )
  }

  // Landing page completa para usuarios NO autenticados
  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/90 to-uc-celeste overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MATUC</span>
              <div className="text-xs text-uc-amarillo font-semibold">v4.0</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/login"
              className="group bg-uc-amarillo text-uc-azul font-semibold px-8 py-4 rounded-xl 
                       hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Matemáticas del
              <span className="text-uc-amarillo block">Futuro</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
              La plataforma educativa más avanzada para el aprendizaje de matemáticas
              en tiempo real. Diseñada para la <strong className="text-uc-amarillo">excelencia académica UC</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/login"
                className="group bg-uc-amarillo text-uc-azul font-bold px-8 py-4 rounded-xl 
                         hover:shadow-lg transition-all duration-300 
                         flex items-center justify-center space-x-2"
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl 
                               hover:border-uc-amarillo hover:text-uc-amarillo transition-all duration-300">
                Ver Demo
              </button>
            </div>
          </motion.div>

          {/* LaTeX Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-uc-amarillo/20 rounded-full mb-3">
                <span className="text-uc-amarillo text-sm font-semibold">LaTeX en Tiempo Real</span>

              </div>
            </div>

            <RotatingLatex />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Características <span className="text-uc-amarillo">Revolucionarias</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Tecnología de vanguardia que transforma la experiencia educativa matemática
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Tiempo Real Ultra-Rápido"
              description="Sincronización instantánea entre profesor y estudiantes con latencia sub-100ms"
              delay={0}
            />
            <FeatureCard
              title="LaTeX Perfecto"
              description="Renderizado matemático impecable con validación automática y sugerencias inteligentes"
              delay={0.1}
            />
            <FeatureCard
              title="Aula Virtual Avanzada"
              description="Interacción inmersiva con herramientas colaborativas y feedback instantáneo"
              delay={0.2}
            />
            <FeatureCard
              title="Analytics Inteligentes"
              description="Métricas de aprendizaje en tiempo real con insights personalizados"
              delay={0.3}
            />
            <FeatureCard
              title="Colaboración Fluida"
              description="Trabajo en equipo con sincronización perfecta y comunicación integrada"
              delay={0.4}
            />
            <FeatureCard
              title="Experiencia Mágica"
              description="Interfaz que maravilla con animaciones fluidas y micro-interacciones deliciosas"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Únete a la <span className="text-uc-amarillo">Revolución</span>
            </h2>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Más de 2,000 estudiantes y 100 profesores ya están transformando
              su experiencia educativa con MATUC v4.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-uc-amarillo to-yellow-300 
                       text-uc-azul font-bold px-10 py-5 rounded-xl text-lg
                       hover:shadow-xl transition-all duration-300 group"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-white/50 text-sm mt-6">
              Acceso con tu cuenta UC • Sin instalación • Resultados inmediatos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white/60 text-sm">
          <div>© 2024 MATUC v4 • Universidad Católica de Chile</div>
          <div className="flex items-center space-x-2">
            <span>Hecho con</span>
            <span className="text-red-400">♥</span>
            <span>para la educación</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente FeatureCard simplificado
function FeatureCard({
  title,
  description,
  delay = 0
}: {
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 
               hover:border-uc-amarillo/30 transition-all duration-300 cursor-pointer"
    >
      <div className="bg-uc-amarillo/20 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
        <div className="text-2xl">⚡</div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  )
}