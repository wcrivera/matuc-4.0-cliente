// src/app/(auth)/login/page.tsx - Página de Login
'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'outlook' | 'google' | 'credentials' | null>(null)

    if (loginMethod === 'credentials') {
        return <CredentialsForm onBack={() => setLoginMethod(null)} />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a MATUC</h1>
                <p className="text-white/70">Elige tu método de acceso</p>
            </div>

            <div className="space-y-4">
                {/* Outlook Login - Opción Principal */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        // TODO: Implementar OAuth con Outlook
                        console.log('Login with Outlook UC')
                    }}
                    className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
                   rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-lg p-3">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-lg">Continuar con Outlook</div>
                            <div className="text-sm text-white/60">Cuenta institucional UC</div>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                </motion.button>

                {/* Google Login - Opción Secundaria */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        // TODO: Implementar OAuth con Google
                        console.log('Login with Google')
                    }}
                    className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
                   rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-500 rounded-lg p-3">
                            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-lg">Continuar con Google</div>
                            <div className="text-sm text-white/60">Cuenta personal</div>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-transparent px-2 text-white/60">o</span>
                    </div>
                </div>

                {/* Traditional Login */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 199, 44, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLoginMethod('credentials')}
                    className="w-full bg-white/10 hover:bg-uc-amarillo/10 border border-white/20 hover:border-uc-amarillo/30 
                   rounded-xl p-4 flex items-center justify-between text-white transition-all duration-300"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-600 rounded-lg p-3">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-lg">Usuario y contraseña</div>
                            <div className="text-sm text-white/60">Método tradicional</div>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-white/50 text-sm">
                <p>¿Primera vez? Tu cuenta se creará automáticamente</p>
            </div>
        </motion.div>
    )
}

// Componente para formulario de credenciales
function CredentialsForm({ onBack }: { onBack: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // TODO: Implementar lógica de login
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
        console.log('Login with credentials')

        setLoading(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
                <p className="text-white/70">Ingresa tus credenciales UC</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-white font-medium mb-2">Email Institucional</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 
                     text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
                     focus:ring-uc-amarillo focus:border-transparent transition-all duration-200"
                        placeholder="tu.email@uc.cl"
                    />
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">Contraseña</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 
                     text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
                     focus:ring-uc-amarillo focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 rounded border-white/20 bg-white/10 text-uc-amarillo 
                       focus:ring-uc-amarillo focus:ring-2"
                        />
                        <span className="text-white/70 text-sm">Recordarme</span>
                    </label>
                    <button
                        type="button"
                        className="text-uc-amarillo hover:text-uc-amarillo/80 text-sm transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-uc-amarillo text-uc-azul font-semibold py-3 rounded-xl 
                   hover:shadow-lg transition-all duration-300 disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-uc-azul"></div>
                    ) : (
                        <>
                            <span>Ingresar</span>
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onBack}
                    className="w-full bg-white/10 text-white border border-white/20 font-medium py-3 rounded-xl 
                   hover:bg-white/20 transition-all duration-300"
                >
                    ← Volver a opciones
                </motion.button>
            </form>
        </motion.div>
    )
}