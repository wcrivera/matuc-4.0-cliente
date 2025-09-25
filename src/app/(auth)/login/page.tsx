// src/app/(auth)/login/page.tsx - Login MATUC v4 ARREGLADO
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles, Shield, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/stores/auth.store'
import Link from 'next/link'

// Componente de partículas de fondo más sutil
function LoginParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-uc-amarillo/30 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'outlook' | 'google' | 'credentials' | null>(null)
  const { login, loginGoogle, loginOutlook, isLoading, error, clearError } = useAuth()

  const handleOAuthLogin = async (provider: 'google' | 'outlook') => {
    clearError()
    
    // TODO: Implementar OAuth real
    try {
      if (provider === 'outlook') {
        // await loginOutlook('mock_outlook_token')
        console.log('OAuth Outlook iniciado')
      } else {
        // await loginGoogle('mock_google_token')
        console.log('OAuth Google iniciado')
      }
    } catch (error) {
      console.error(`Error con ${provider}:`, error)
    }
  }

  if (loginMethod === 'credentials') {
    return <CredentialsForm onBack={() => setLoginMethod(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/95 to-uc-celeste flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Partículas de fondo */}
      <LoginParticles />

      {/* Container principal - UNA SOLA COLUMNA para evitar problemas responsive */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Logo y título principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-white">MATUC</span>
              <div className="text-xs text-uc-amarillo font-semibold">v4.0</div>
            </div>
          </Link>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Bienvenido de <span className="text-uc-amarillo">Vuelta</span>
          </h1>
          
          <p className="text-white/80 mb-6 leading-relaxed">
            Tu aula virtual de matemáticas te está esperando
          </p>
        </motion.div>

        {/* Formulario de login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          {/* Header del formulario */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-uc-amarillo/20 rounded-full mb-3">
              <Shield className="w-4 h-4 text-uc-amarillo" />
              <span className="text-uc-amarillo text-sm font-semibold">Login Seguro UC</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">Elige tu método de acceso</h2>
            <p className="text-white/60 text-sm">Rápido, seguro y sin complicaciones</p>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {/* Outlook Login - Opción Principal */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuthLogin('outlook')}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                       border border-blue-500/30 hover:border-blue-400/50 
                       rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold text-base truncate">Outlook UC</div>
                  <div className="text-sm text-blue-200 truncate">Método recomendado</div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </motion.button>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 
                       rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg p-2 flex-shrink-0">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-base truncate">Google</div>
                  <div className="text-sm text-white/60 truncate">Cuenta personal</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
            </motion.button>

            {/* Separador */}
            <div className="relative flex items-center my-4">
              <div className="flex-1 border-t border-white/20"></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-3 text-white/60 font-medium">o continúa con</span>
              </div>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Traditional Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLoginMethod('credentials')}
              disabled={isLoading}
              className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
                       rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-600/80 group-hover:bg-uc-amarillo/20 rounded-lg p-2 transition-colors flex-shrink-0">
                  <Lock className="h-5 w-5 group-hover:text-uc-amarillo transition-colors" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-base group-hover:text-uc-amarillo transition-colors truncate">
                    Usuario y contraseña
                  </div>
                  <div className="text-sm text-white/60 truncate">Método tradicional</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-hover:text-uc-amarillo transition-all flex-shrink-0 ml-2" />
            </motion.button>
          </div>

          {/* Footer del formulario */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center space-y-2"
          >
            <p className="text-white/50 text-xs leading-relaxed">
              ¿Primera vez? Tu cuenta se creará automáticamente
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-white/40">
              <span>🔒 Seguro</span>
              <span>•</span>
              <span>⚡ Rápido</span>
              <span>•</span>
              <span>🎓 Solo UC</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Beneficios debajo del formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          {[
            { icon: Sparkles, text: "Experiencia mágica e intuitiva" },
            { icon: Shield, text: "Seguridad UC de nivel empresarial" },
            { icon: CheckCircle, text: "Acceso instantáneo sin instalación" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center space-x-3 text-white/70 text-sm"
            >
              <div className="bg-uc-amarillo/20 rounded-lg p-2 flex-shrink-0">
                <benefit.icon className="w-4 h-4 text-uc-amarillo" />
              </div>
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Componente para formulario de credenciales ARREGLADO
function CredentialsForm({ onBack }: { onBack: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    
    const success = await login(formData.email, formData.password)
    
    if (success) {
      console.log('Login exitoso')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/95 to-uc-celeste flex items-center justify-center p-4 relative overflow-hidden">
      
      <LoginParticles />

      <div className="w-full max-w-md relative z-10">
        {/* Logo y navegación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </motion.div>
            <div>
              <span className="text-xl font-bold text-white">MATUC</span>
              <div className="text-xs text-uc-amarillo font-semibold">v4.0</div>
            </div>
          </Link>

          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group mx-auto"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a métodos de acceso</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-uc-amarillo/20 rounded-full mb-3">
              <Lock className="w-3 h-3 text-uc-amarillo" />
              <span className="text-uc-amarillo text-xs font-semibold">Login Tradicional</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-1">Iniciar Sesión</h1>
            <p className="text-white/70 text-sm">Ingresa tus credenciales UC</p>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-white font-medium mb-2 text-sm">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-uc-amarillo transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white text-sm
                           placeholder-white/50 focus:outline-none focus:border-uc-amarillo focus:bg-white/15 
                           transition-all duration-300"
                  placeholder="tu.email@uc.cl"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-white font-medium mb-2 text-sm">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-uc-amarillo transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-10 text-white text-sm
                           placeholder-white/50 focus:outline-none focus:border-uc-amarillo focus:bg-white/15 
                           transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-uc-amarillo to-yellow-400 text-uc-azul font-bold py-3 px-6 rounded-lg
                       hover:shadow-lg hover:shadow-uc-amarillo/25 transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-uc-azul/30 border-t-uc-azul rounded-full"
                  />
                  <span>Iniciando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center space-y-3"
          >
            <p className="text-white/50 text-xs">
              ¿Olvidaste tu contraseña?{' '}
              <button className="text-uc-amarillo hover:underline font-semibold">
                Recupérala aquí
              </button>
            </p>
            
            <div className="pt-3 border-t border-white/20">
              <p className="text-white/40 text-xs">
                🔒 Conexión segura • 🛡️ Datos protegidos
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}


// // src/app/(auth)/login/page.tsx - Página de Login
// 'use client'

// import { motion } from 'framer-motion'
// import { Mail, Lock, ArrowRight } from 'lucide-react'
// import { useState } from 'react'

// export default function LoginPage() {
//     const [loginMethod, setLoginMethod] = useState<'outlook' | 'google' | 'credentials' | null>(null)

//     if (loginMethod === 'credentials') {
//         return <CredentialsForm onBack={() => setLoginMethod(null)} />
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
//         >
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a MATUC</h1>
//                 <p className="text-white/70">Elige tu método de acceso</p>
//             </div>

//             <div className="space-y-4">
//                 {/* Outlook Login - Opción Principal */}
//                 <motion.button
//                     whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                         // TODO: Implementar OAuth con Outlook
//                         console.log('Login with Outlook UC')
//                     }}
//                     className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
//                    rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
//                 >
//                     <div className="flex items-center space-x-3">
//                         <div className="bg-blue-500 rounded-lg p-3">
//                             <Mail className="h-6 w-6 text-white" />
//                         </div>
//                         <div className="text-left">
//                             <div className="font-semibold text-lg">Continuar con Outlook</div>
//                             <div className="text-sm text-white/60">Cuenta institucional UC</div>
//                         </div>
//                     </div>
//                     <ArrowRight className="h-5 w-5" />
//                 </motion.button>

//                 {/* Google Login - Opción Secundaria */}
//                 <motion.button
//                     whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                         // TODO: Implementar OAuth con Google
//                         console.log('Login with Google')
//                     }}
//                     className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
//                    rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
//                 >
//                     <div className="flex items-center space-x-3">
//                         <div className="bg-red-500 rounded-lg p-3">
//                             <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
//                                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                             </svg>
//                         </div>
//                         <div className="text-left">
//                             <div className="font-semibold text-lg">Continuar con Google</div>
//                             <div className="text-sm text-white/60">Cuenta personal</div>
//                         </div>
//                     </div>
//                     <ArrowRight className="h-5 w-5" />
//                 </motion.button>

//                 {/* Divider */}
//                 <div className="relative my-6">
//                     <div className="absolute inset-0 flex items-center">
//                         <div className="w-full border-t border-white/20"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                         <span className="bg-transparent px-2 text-white/60">o</span>
//                     </div>
//                 </div>

//                 {/* Traditional Login */}
//                 <motion.button
//                     whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => setLoginMethod('credentials')}
//                     className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
//                    rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
//                 >
//                     <div className="flex items-center space-x-3">
//                         <div className="bg-gray-600 rounded-lg p-3">
//                             <Lock className="h-6 w-6 text-white" />
//                         </div>
//                         <div className="text-left">
//                             <div className="font-semibold text-lg">Usuario y contraseña</div>
//                             <div className="text-sm text-white/60">Método tradicional</div>
//                         </div>
//                     </div>
//                     <ArrowRight className="h-5 w-5" />
//                 </motion.button>
//             </div>

//             {/* Footer Info */}
//             <div className="mt-8 text-center text-white/50 text-sm">
//                 <p>¿Primera vez? Tu cuenta se creará automáticamente</p>
//             </div>
//         </motion.div>
//     )
// }

// // Componente para formulario de credenciales
// function CredentialsForm({ onBack }: { onBack: () => void }) {
//     const [loading, setLoading] = useState(false)

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         setLoading(true)

//         // TODO: Implementar lógica de login
//         await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
//         console.log('Login with credentials')

//         setLoading(false)
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
//         >
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
//                 <p className="text-white/70">Ingresa tus credenciales UC</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block text-white font-medium mb-2">Email Institucional</label>
//                     <input
//                         type="email"
//                         required
//                         className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 
//                      text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
//                      focus:ring-uc-amarillo focus:border-transparent transition-all duration-200"
//                         placeholder="tu.email@uc.cl"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-white font-medium mb-2">Contraseña</label>
//                     <input
//                         type="password"
//                         required
//                         className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 
//                      text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
//                      focus:ring-uc-amarillo focus:border-transparent transition-all duration-200"
//                         placeholder="••••••••"
//                     />
//                 </div>

//                 <div className="flex items-center justify-between">
//                     <label className="flex items-center">
//                         <input
//                             type="checkbox"
//                             className="mr-2 rounded border-white/20 bg-white/10 text-uc-amarillo 
//                        focus:ring-uc-amarillo focus:ring-2"
//                         />
//                         <span className="text-white/70 text-sm">Recordarme</span>
//                     </label>
//                     <button
//                         type="button"
//                         className="text-uc-amarillo hover:text-uc-amarillo/80 text-sm transition-colors"
//                     >
//                         ¿Olvidaste tu contraseña?
//                     </button>
//                 </div>

//                 <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-uc-amarillo text-uc-azul font-semibold py-3 rounded-xl 
//                    hover:shadow-lg transition-all duration-300 disabled:opacity-50 
//                    disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                 >
//                     {loading ? (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-uc-azul"></div>
//                     ) : (
//                         <>
//                             <span>Ingresar</span>
//                             <ArrowRight className="h-4 w-4" />
//                         </>
//                     )}
//                 </motion.button>

//                 <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="button"
//                     onClick={onBack}
//                     className="w-full bg-white/10 text-white border border-white/20 font-medium py-3 rounded-xl 
//                    hover:bg-white/20 transition-all duration-300"
//                 >
//                     ← Volver a opciones
//                 </motion.button>
//             </form>
//         </motion.div>
//     )
// }