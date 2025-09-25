// src/app/page.tsx - Homepage Principal MATUC v4
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calculator, ArrowRight, BookOpen, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
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
    }, 4000) // Cambiar cada 4 segundos

    return () => clearInterval(interval)
  })

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
      {/* Contenedor con altura fija para mantener layout estable */}
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

      {/* Indicador de progreso y nombre */}
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
            <span className="text-2xl font-bold text-white">MATUC</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/login"
              className="bg-uc-amarillo text-uc-azul font-semibold px-6 py-3 rounded-xl 
                       hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="h-4 w-4" />
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

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              La plataforma educativa más avanzada para el aprendizaje de matemáticas
              en tiempo real. Diseñada para la excelencia académica UC.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-uc-amarillo text-uc-azul font-bold px-8 py-4 rounded-xl 
                           flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl 
                           transition-all duration-300"
                >
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Visual Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">

              {/* Mock Browser */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>

                {/* LaTeX Rotativo */}
                <div className="text-center py-6">
                  <RotatingLatex />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-uc-amarillo text-2xl font-bold">1,247</div>
                  <div className="text-white/60 text-sm">Estudiantes UC</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-uc-amarillo text-2xl font-bold">98%</div>
                  <div className="text-white/60 text-sm">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Floating Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 bg-uc-amarillo/20 backdrop-blur-sm 
                       rounded-full p-4 border border-uc-amarillo/30"
            >
              <Zap className="h-6 w-6 text-uc-amarillo" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Herramientas de Vanguardia
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Todo lo que necesitas para enseñar y aprender matemáticas del siglo XXI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Editor LaTeX",
                description: "Renderizado matemático instantáneo con KaTeX optimizado"
              },
              {
                icon: Users,
                title: "Aulas En Vivo",
                description: "Interacción tiempo real con feedback inmediato"
              },
              {
                icon: Calculator,
                title: "Validación Auto",
                description: "Corrección inteligente de ejercicios matemáticos"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 
                         hover:border-uc-amarillo/30 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-uc-amarillo/20 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-uc-amarillo" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Comenzar es Fácil
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Accede con tu cuenta UC y descubre por qué MATUC es la plataforma
              preferida por profesores y estudiantes.
            </p>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-uc-amarillo text-uc-azul font-bold px-10 py-5 rounded-xl 
                         text-lg shadow-lg hover:shadow-2xl transition-all duration-300 
                         inline-flex items-center space-x-3"
              >
                <Calculator className="h-6 w-6" />
                <span>Iniciar Sesión</span>
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-uc-amarillo/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  )
}