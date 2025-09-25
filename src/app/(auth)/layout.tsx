// src/app/(auth)/layout.tsx - Layout para Autenticación
import { Calculator } from 'lucide-react'
import Link from 'next/link'

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-uc-azul via-uc-azul/90 to-uc-celeste">
            {/* Header minimalista */}
            <header className="p-6">
                <Link href="/" className="flex items-center space-x-3 w-fit group">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 
                        group-hover:bg-white/30 transition-all duration-300">
                        <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-uc-amarillo 
                         transition-colors duration-300">
                        MATUC
                    </span>
                </Link>
            </header>

            {/* Contenedor principal centrado */}
            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Background decorativo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-12 w-96 h-96 bg-white/5 rounded-full blur-3xl 
                      animate-pulse" />
                <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-uc-amarillo/10 rounded-full blur-3xl 
                      animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Partículas matemáticas flotantes */}
                <div className="absolute top-1/3 left-1/4 text-white/5 text-6xl font-mono 
                      animate-bounce">
                    ∫
                </div>
                <div className="absolute bottom-1/3 right-1/4 text-white/5 text-4xl font-mono 
                      animate-pulse">
                    π
                </div>
                <div className="absolute top-1/2 right-1/3 text-white/5 text-5xl font-mono 
                      animate-bounce" style={{ animationDelay: '1s' }}>
                    Σ
                </div>
            </div>


        </div>
    )
}