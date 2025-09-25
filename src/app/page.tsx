import { Button } from '@/components/ui/Button'
import {
  PlusIcon,
  BookOpenIcon,
  CalculatorIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
  DownloadIcon,
  ShieldCheckIcon,
  ZapIcon
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

      <div className='dark'>
        Hola mundo
      </div>
      <div className='primary'>
        Hola mundo
      </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-uc-azul-100 to-uc-celeste-100 rounded-full text-uc-azul-700 text-sm font-medium border border-uc-azul-200/50">
            <SparklesIcon className="h-4 w-4" />
            Next.js 15 + React 19 + Tailwind CSS
          </div>

          <h1 className="text-7xl font-bold bg-gradient-to-r from-uc-azul-700 via-uc-celeste-500 to-uc-amarillo-500 bg-clip-text text-transparent">
            MATUC v4
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sistema de componentes espectacular para la plataforma educativa más avanzada de Chile
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button variant="gradient" size="lg" leftIcon={<ZapIcon className="h-5 w-5" />}>
              Comenzar Demo
            </Button>
            <Button variant="glass" size="lg" rightIcon={<ArrowRightIcon className="h-5 w-5" />}>
              Ver Documentación
            </Button>
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="space-y-16">

          {/* Variantes Principales */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Variantes Principales</h2>
              <p className="text-gray-600">Colores institucionales UC en todo su esplendor</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Button variant="default" size="lg" fullWidth>
                  Azul UC Principal
                </Button>
                <p className="text-sm text-gray-600">Variante por defecto con gradiente azul UC</p>
              </div>

              <div className="text-center space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Button variant="secondary" size="lg" fullWidth>
                  Celeste UC Vibrante
                </Button>
                <p className="text-sm text-gray-600">Celeste institucional con efectos</p>
              </div>

              <div className="text-center space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Button variant="accent" size="lg" fullWidth>
                  Amarillo UC Brillante
                </Button>
                <p className="text-sm text-gray-600">Color de acento con máximo contraste</p>
              </div>

              <div className="text-center space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <Button variant="gradient" size="lg" fullWidth>
                  Gradiente UC Triple
                </Button>
                <p className="text-sm text-gray-600">Todos los colores UC en armonía</p>
              </div>
            </div>
          </section>

          {/* Variantes Especiales */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Variantes Especiales</h2>
              <p className="text-gray-600">Efectos avanzados y estados únicos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button variant="outline" size="lg">
                Outline
              </Button>
              <Button variant="ghost" size="lg">
                Ghost
              </Button>
              <Button variant="glass" size="lg">
                Glassmorphism
              </Button>
              <Button variant="destructive" size="lg">
                Destructivo
              </Button>
              <Button variant="success" size="lg">
                Éxito
              </Button>
            </div>
          </section>

          {/* Tamaños */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tamaños Disponibles</h2>
              <p className="text-gray-600">Desde micro-interacciones hasta call-to-actions</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="xs" variant="secondary">Extra Small</Button>
              <Button size="sm" variant="secondary">Small</Button>
              <Button size="default" variant="secondary">Default</Button>
              <Button size="lg" variant="secondary">Large</Button>
              <Button size="xl" variant="secondary">Extra Large</Button>
              <Button size="2xl" variant="secondary">2XL Heroico</Button>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="icon" variant="accent" tooltip="Crear"><PlusIcon className="h-4 w-4" /></Button>
              <Button size="icon" variant="glass" tooltip="Favorito"><HeartIcon className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" tooltip="Destacar"><StarIcon className="h-4 w-4" /></Button>
            </div>
          </section>

          {/* Con Iconos */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Con Iconos Espectaculares</h2>
              <p className="text-gray-600">Micro-animaciones en iconos que deleitan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button variant="default" leftIcon={<PlusIcon className="h-5 w-5" />} size="lg">
                Crear Nuevo Curso
              </Button>
              <Button variant="secondary" rightIcon={<BookOpenIcon className="h-5 w-5" />} size="lg">
                Abrir Biblioteca
              </Button>
              <Button variant="accent" leftIcon={<CalculatorIcon className="h-5 w-5" />} size="lg">
                Resolver Ejercicio
              </Button>
              <Button variant="glass" rightIcon={<DownloadIcon className="h-5 w-5" />} size="lg">
                Descargar PDF
              </Button>
              <Button variant="gradient" leftIcon={<ShieldCheckIcon className="h-5 w-5" />} size="lg">
                Validar Respuesta
              </Button>
              <Button variant="outline" rightIcon={<ArrowRightIcon className="h-5 w-5" />} size="lg">
                Continuar
              </Button>
            </div>
          </section>

          {/* Estados y Animaciones */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Estados y Animaciones</h2>
              <p className="text-gray-600">Feedback visual inmediato y delicioso</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="default" loading size="lg">
                Cargando...
              </Button>
              <Button variant="secondary" disabled size="lg">
                Deshabilitado
              </Button>
              <Button variant="gradient" animated="glow" size="lg">
                Con Brillo
              </Button>
              <Button variant="glass" animated="float" size="lg">
                Flotando
              </Button>
            </div>
          </section>

          {/* Framer Motion */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Framer Motion Avanzado</h2>
              <p className="text-gray-600">Animaciones de alta gama que maravillan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button
                asMotion
                variant="gradient"
                size="lg"
                motionProps={{
                  whileHover: { scale: 1.05, rotateZ: 3 },
                  whileTap: { scale: 0.95, rotateZ: -3 }
                }}
              >
                Rotación Sutil
              </Button>

              <Button
                asMotion
                variant="glass"
                size="lg"
                motionProps={{
                  whileHover: {
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                    transition: { duration: 0.3 }
                  },
                }}
              >
                Elevación Elegante
              </Button>

              <Button
                asMotion
                variant="accent"
                size="lg"
                motionProps={{
                  whileHover: {
                    scale: 1.1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  },
                  whileTap: { scale: 0.9 }
                }}
              >
                Spring Physics
              </Button>
            </div>
          </section>

          {/* Full Width */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Call-to-Actions Épicos</h2>
              <p className="text-gray-600">Botones de ancho completo para máximo impacto</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <Button
                fullWidth
                variant="gradient"
                size="xl"
                leftIcon={<SparklesIcon className="h-6 w-6" />}
              >
                Comenzar Experiencia MATUC v4
              </Button>

              <Button
                fullWidth
                variant="glass"
                size="lg"
                rightIcon={<ArrowRightIcon className="h-5 w-5" />}
              >
                Explorar Componentes del Design System
              </Button>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center pt-16 border-t border-gray-200/50 mt-16">
          <p className="text-gray-500 mb-4">
            Button Component - MATUC v4 Design System
          </p>
          <p className="text-sm text-gray-400">
            Universidad Católica de Chile - Creado con Next.js 15, React 19 y Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}