// src/app/test-styles/page.tsx - Página para probar globals.css y colores UC
'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function TestStylesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 mb-8">
                <motion.h1
                    className="text-4xl font-bold text-uc-azul mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    🎨 MATUC v4 - Test de Estilos
                </motion.h1>
                <p className="text-gray-600 text-lg">
                    Verificación de globals.css, colores UC y componentes base
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 space-y-12">

                {/* 1. COLORES UC PRINCIPALES */}
                <TestSection title="🎯 Colores Institucionales UC">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        {/* UC Azul */}
                        <motion.div
                            className="group cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="bg-uc-azul h-32 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm text-center">
                                        UC AZUL<br />#003f7f
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                                Azul Principal
                            </p>
                        </motion.div>

                        {/* UC Celeste */}
                        <motion.div
                            className="group cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="bg-uc-celeste h-32 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm text-center">
                                        UC CELESTE<br />#00a0d1
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                                Celeste Secundario
                            </p>
                        </motion.div>

                        {/* UC Amarillo */}
                        <motion.div
                            className="group cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="bg-uc-amarillo h-32 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-uc-azul font-bold text-sm text-center">
                                        UC AMARILLO<br />#ffc72c
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                                Amarillo Acento
                            </p>
                        </motion.div>

                        {/* UC Gris */}
                        <motion.div
                            className="group cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="bg-uc-gris h-32 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm text-center">
                                        UC GRIS<br />#666666
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                                Gris Neutro
                            </p>
                        </motion.div>

                    </div>

                    {/* Test de variantes de color */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-uc-azul/10 rounded-xl border border-uc-azul/20">
                            <h4 className="font-semibold text-uc-azul mb-2">Azul con opacidad</h4>
                            <p className="text-sm text-uc-azul/70">
                                bg-uc-azul/10 + border-uc-azul/20 + text-uc-azul/70
                            </p>
                        </div>
                        <div className="p-4 bg-uc-celeste/10 rounded-xl border border-uc-celeste/20">
                            <h4 className="font-semibold text-uc-celeste mb-2">Celeste con opacidad</h4>
                            <p className="text-sm text-uc-celeste/70">
                                bg-uc-celeste/10 + border-uc-celeste/20 + text-uc-celeste/70
                            </p>
                        </div>
                        <div className="p-4 bg-uc-amarillo/10 rounded-xl border border-uc-amarillo/20">
                            <h4 className="font-semibold text-uc-amarillo mb-2">Amarillo con opacidad</h4>
                            <p className="text-sm text-uc-amarillo/70">
                                bg-uc-amarillo/10 + border-uc-amarillo/20 + text-uc-amarillo/70
                            </p>
                        </div>
                    </div>
                </TestSection>

                {/* 2. GRADIENTES HERMOSOS */}
                <TestSection title="🌈 Gradientes Institucionales">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="h-32 bg-gradient-to-r from-uc-azul to-uc-celeste rounded-xl shadow-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Azul → Celeste</span>
                        </div>

                        <div className="h-32 bg-gradient-to-br from-uc-azul via-uc-celeste to-uc-amarillo rounded-xl shadow-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Triple Gradiente</span>
                        </div>

                        <div className="h-32 bg-gradient-to-t from-uc-azul/90 to-transparent rounded-xl shadow-lg flex items-center justify-center bg-gray-100">
                            <span className="text-uc-azul font-bold text-lg">Fade to Transparent</span>
                        </div>

                        <div className="h-32 bg-gradient-to-r from-uc-amarillo via-uc-celeste to-uc-azul rounded-xl shadow-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Amarillo → Azul</span>
                        </div>

                    </div>
                </TestSection>

                {/* 3. TIPOGRAFÍA */}
                <TestSection title="✏️ Tipografía y Textos">
                    <div className="space-y-6">

                        <div>
                            <h1 className="text-4xl font-bold text-uc-azul mb-2">Heading 1 - UC Azul</h1>
                            <h2 className="text-3xl font-semibold text-uc-celeste mb-2">Heading 2 - UC Celeste</h2>
                            <h3 className="text-2xl font-medium text-uc-gris mb-2">Heading 3 - UC Gris</h3>
                            <h4 className="text-xl font-medium text-gray-700 mb-2">Heading 4 - Gray 700</h4>
                            <h5 className="text-lg font-medium text-gray-600 mb-2">Heading 5 - Gray 600</h5>
                            <h6 className="text-base font-medium text-gray-500">Heading 6 - Gray 500</h6>
                        </div>

                        <div>
                            <p className="text-base text-gray-800 mb-3 leading-relaxed">
                                <strong>Párrafo normal:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                <strong>Párrafo pequeño:</strong> Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                <strong>Texto muy pequeño:</strong> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
                            </p>
                        </div>

                    </div>
                </TestSection>

                {/* 4. BOTONES Y COMPONENTES */}
                <TestSection title="🔘 Botones y Componentes Interactivos">
                    <div className="space-y-6">

                        {/* Botones principales */}
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                className="px-6 py-3 bg-uc-azul text-white rounded-lg font-semibold hover:bg-uc-azul/90 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Botón Principal
                            </motion.button>

                            <motion.button
                                className="px-6 py-3 bg-uc-celeste text-white rounded-lg font-semibold hover:bg-uc-celeste/90 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Botón Secundario
                            </motion.button>

                            <motion.button
                                className="px-6 py-3 bg-uc-amarillo text-uc-azul rounded-lg font-semibold hover:bg-uc-amarillo/90 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Botón Acento
                            </motion.button>

                            <motion.button
                                className="px-6 py-3 border-2 border-uc-azul text-uc-azul rounded-lg font-semibold hover:bg-uc-azul hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Botón Outline
                            </motion.button>
                        </div>

                        {/* Cards de ejemplo */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <motion.div
                                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 bg-uc-azul rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-white text-2xl">📚</span>
                                </div>
                                <h3 className="text-lg font-semibold text-uc-azul mb-2">Card Estándar</h3>
                                <p className="text-gray-600 text-sm">
                                    Esta es una card con el estilo base que usaremos en MATUC v4.
                                </p>
                            </motion.div>

                            <motion.div
                                className="p-6 bg-gradient-to-br from-uc-azul to-uc-celeste rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-white"
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Card con Gradiente</h3>
                                <p className="text-white/90 text-sm">
                                    Card con fondo de gradiente institucional UC.
                                </p>
                            </motion.div>

                            <motion.div
                                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-uc-amarillo"
                                whileHover={{ y: -5, borderLeftWidth: '6px' }}
                            >
                                <div className="w-12 h-12 bg-uc-amarillo/20 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-uc-amarillo text-2xl">⚡</span>
                                </div>
                                <h3 className="text-lg font-semibold text-uc-azul mb-2">Card con Acento</h3>
                                <p className="text-gray-600 text-sm">
                                    Card con borde de acento amarillo UC.
                                </p>
                            </motion.div>

                        </div>

                    </div>
                </TestSection>

                {/* 5. ELEMENTOS MATEMÁTICOS */}
                <TestSection title="🧮 Elementos Matemáticos">
                    <div className="space-y-4">

                        {/* Placeholder para LaTeX - se verá cuando integremos KaTeX */}
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-uc-azul mb-2">LaTeX Math Rendering</h4>
                            <div className="p-3 bg-white rounded border font-mono text-sm">
                                $$ \int_0^1 x^2 \, dx = \frac{1}{3} $$
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Placeholder - KaTeX se renderizará aquí
                            </p>
                        </div>

                        {/* Símbolos matemáticos */}
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {['∑', '∏', '∫', '∞', 'α', 'β', 'γ', 'π', 'θ', 'λ', 'μ', '≤', '≥', '≠', '±', '√'].map((symbol, index) => (
                                <motion.div
                                    key={index}
                                    className="aspect-square bg-uc-azul/10 rounded-lg flex items-center justify-center text-uc-azul text-xl font-bold cursor-pointer hover:bg-uc-azul/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {symbol}
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </TestSection>

                {/* 6. ESTADOS Y FEEDBACK */}
                <TestSection title="💫 Estados y Feedback Visual">
                    <div className="space-y-6">

                        {/* Estados de carga */}
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-uc-azul border-t-transparent"></div>
                                <span className="text-sm text-gray-600">Loading Azul</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-uc-celeste border-t-transparent"></div>
                                <span className="text-sm text-gray-600">Loading Celeste</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="animate-pulse w-6 h-6 bg-uc-amarillo rounded-full"></div>
                                <span className="text-sm text-gray-600">Pulse Amarillo</span>
                            </div>
                        </div>

                        {/* Alerts/Notifications */}
                        <div className="space-y-3">

                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">✅</span>
                                    <span className="text-green-800 font-medium">¡Éxito!</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">Los estilos están funcionando correctamente.</p>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-blue-600 mr-2">ℹ️</span>
                                    <span className="text-blue-800 font-medium">Información</span>
                                </div>
                                <p className="text-blue-700 text-sm mt-1">Este es un mensaje informativo.</p>
                            </div>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-yellow-600 mr-2">⚠️</span>
                                    <span className="text-yellow-800 font-medium">Advertencia</span>
                                </div>
                                <p className="text-yellow-700 text-sm mt-1">Este es un mensaje de advertencia.</p>
                            </div>

                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-red-600 mr-2">❌</span>
                                    <span className="text-red-800 font-medium">Error</span>
                                </div>
                                <p className="text-red-700 text-sm mt-1">Este es un mensaje de error.</p>
                            </div>

                        </div>

                    </div>
                </TestSection>

                {/* Footer con información */}
                <div className="mt-16 p-6 bg-gradient-to-r from-uc-azul to-uc-celeste rounded-xl text-white">
                    <h3 className="text-xl font-bold mb-2">🎉 Test Completado</h3>
                    <p className="mb-4">
                        Si puedes ver todos los colores y animaciones correctamente, ¡globals.css está funcionando perfectamente!
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-3 py-1 bg-white/20 rounded-full">Next.js 15 ✅</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full">Tailwind CSS ✅</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full">Framer Motion ✅</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full">Colores UC ✅</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

// Componente helper para las secciones
function TestSection({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <motion.section
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold text-uc-azul mb-6">{title}</h2>
            {children}
        </motion.section>
    )
}