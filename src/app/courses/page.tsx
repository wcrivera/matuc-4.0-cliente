'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCourseStore } from '@/lib/stores/course.store';
import type { CursosQuery, Curso } from '@/types/course.types';
import CursoCard from '../../components/ui/CursoCard';
import { Pagination } from '@/components/ui/Pagination';
import { Filtros } from '@/components/ui/Filtros';

// ==========================================
// 🎨 COMPONENTE PRINCIPAL DE CURSOS
// ==========================================

export default function CoursesPage() {
    // === ESTADO DEL STORE ===

    const cursos = useCourseStore(state => state.cursos);
    const isLoading = useCourseStore(state => state.isLoading);
    const error = useCourseStore(state => state.error);
    const pagination = useCourseStore(state => state.pagination);
    const filtros = useCourseStore(state => state.filtros);

    // === ACCIONES DEL STORE ===
    const obtenerCursos = useCourseStore(state => state.obtenerCursos);
    const setFiltros = useCourseStore(state => state.setFiltros);
    const clearError = useCourseStore(state => state.clearError);
    const eliminarCurso = useCourseStore(state => state.eliminarCurso);

    // === ESTADO LOCAL PARA FILTROS ===
    const [cursosLocal, setCursosLocal] = useState([] as Curso[]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(filtros.categoria || '');
    const [soloActivos, setSoloActivos] = useState(filtros.activo ?? true);
    const [soloPublicos, setSoloPublicos] = useState(filtros.publico ?? false);
    const [paginaActual, setPaginaActual] = useState(1);


    // ==========================================
    // 🔄 EFECTOS Y CARGA INICIAL
    // ==========================================

    // Cargar cursos al montar el componente
    useEffect(() => {
        const query: CursosQuery = {
            page: 1,
            limit: 12,
            search: '',
            categoria: '',
            activo: true,
            publico: true,
        };

        obtenerCursos(query);
    }, [obtenerCursos]);

    useEffect(() => {
        setCursosLocal(cursos);
    }, [cursos]);

    useEffect(() => {
        const cursosCategoria = cursos.filter(curso =>
            categoriaSeleccionada ? curso.categoria === categoriaSeleccionada : true
        );
        setCursosLocal(cursosCategoria);
    }, [categoriaSeleccionada, cursos]);

    useEffect(() => {
        const cursosActivos = cursos.filter(curso =>
            soloActivos ? curso.activo === true : true
        );
        setCursosLocal(cursosActivos);
    }, [soloActivos, cursos]);

    useEffect(() => {
        const cursosPublicos = cursos.filter(curso =>
            soloPublicos ? curso.publico === true : true
        );
        setCursosLocal(cursosPublicos);
    }, [soloPublicos, cursos]);

    useEffect(() => {
        const cursosSearchTerm = cursos.filter(curso =>
            curso.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCursosLocal(cursosSearchTerm);
    }, [searchTerm, cursos]);






    // useEffect(() => {
    //     const query: CursosQuery = {
    //         page: paginaActual,
    //         limit: 12,
    //         search: searchTerm || '',
    //         categoria: categoriaSeleccionada,
    //         activo: soloActivos,
    //         publico: soloPublicos || '',
    //     };

    //     obtenerCursos(query);
    // }, [paginaActual, soloActivos, soloPublicos, obtenerCursos]);

    // Aplicar filtros con debounce para búsqueda
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         const query: CursosQuery = {
    //             page: 1, // Resetear a página 1 cuando se filtra
    //             limit: 12,
    //             search: searchTerm || undefined,
    //             categoria: categoriaSeleccionada || '',
    //             activo: soloActivos,
    //             publico: soloPublicos || undefined,
    //         };

    //         setFiltros({
    //             search: searchTerm || undefined,
    //             categoria: categoriaSeleccionada || undefined,
    //             activo: soloActivos,
    //             publico: soloPublicos || undefined,
    //         });

    //         obtenerCursos(query);
    //         setPaginaActual(1);
    //     }, 500); // Debounce de 500ms

    //     return () => clearTimeout(timeoutId);
    // }, [searchTerm, categoriaSeleccionada, obtenerCursos, setFiltros, soloActivos, soloPublicos]);

    // ==========================================
    // 🎯 HANDLERS DE EVENTOS
    // ==========================================

    const handleEliminarCurso = async (curso: Curso) => {
        if (!confirm(`¿Estás seguro de eliminar el curso "${curso.nombre}"?`)) {
            return;
        }

        const success = await eliminarCurso(curso.cid);
        if (success) {
            // Recargar la página actual
            const query: CursosQuery = {
                page: paginaActual,
                limit: 12,
                search: searchTerm || undefined,
                categoria: categoriaSeleccionada || undefined,
                activo: soloActivos,
                publico: soloPublicos || undefined,
            };
            obtenerCursos(query);
        }
    };

    const handleLimpiarFiltros = () => {
        setSearchTerm('');
        setCategoriaSeleccionada('');
        setSoloActivos(true);
        setSoloPublicos(false);
        setPaginaActual(1);
    };

    const handleCambiarPagina = (nuevaPagina: number) => {
        setPaginaActual(nuevaPagina);
        // El useEffect se encarga de cargar los datos
    };

    // ==========================================
    // 🎨 RENDER PRINCIPAL
    // ==========================================

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Error al cargar cursos</h2>
                        <p className="text-red-700 mb-4">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    clearError();
                                    obtenerCursos();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={clearError}
                                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Cerrar error
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona todos los cursos de la plataforma
                        </p>
                    </div>
                    <Link
                        href="/courses/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + Nuevo Curso
                    </Link>
                </div>

                {/* Filtros */}
                <Filtros
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    categoriaSeleccionada={categoriaSeleccionada}
                    setCategoriaSeleccionada={setCategoriaSeleccionada}
                    soloActivos={soloActivos}
                    setSoloActivos={setSoloActivos}
                    soloPublicos={soloPublicos}
                    setSoloPublicos={setSoloPublicos}
                    handleLimpiarFiltros={handleLimpiarFiltros}
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resultados */}
                {!isLoading && (
                    <>
                        {/* Stats */}
                        <div className="mt-6 mb-4">
                            <p className="text-sm text-gray-600">
                                {pagination ? `${pagination.totalItems} cursos encontrados` : `${cursos.length} cursos`}
                            </p>
                        </div>

                        {/* Grid de cursos */}
                        {cursosLocal.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {cursosLocal.map(curso => (
                                    <CursoCard key={curso.cid} curso={curso} handleEliminarCurso={handleEliminarCurso} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📚</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || categoriaSeleccionada
                                        ? 'Intenta ajustar los filtros de búsqueda'
                                        : 'Comienza creando tu primer curso'
                                    }
                                </p>
                                <Link
                                    href="/dashboard/courses/new"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Crear primer curso
                                </Link>
                            </div>
                        )}

                        {/* Paginación */}
                        <Pagination pagination={pagination} paginaActual={paginaActual} handleCambiarPagina={handleCambiarPagina} />
                    </>
                )}
            </div>
        </div>
    );
}

// // src/app/courses/page.tsx - Página Principal de Cursos Espectacular
// 'use client'

// import React, { useState, useMemo, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//     Calculator,
//     BookOpen,
//     TrendingUp,
//     Users,
//     Clock,
//     Star,
//     Search,

//     ChevronRight,
//     Sparkles,
//     Brain,

//     Target,

//     Bell,

//     LogOut,

//     Eye,
//     EyeOff,
//     Edit3
// } from 'lucide-react'
// import Link from 'next/link'
// import { useAuth } from '@/lib/stores/auth.store'
// import 'katex/dist/katex.min.css'
// import katex from 'katex'
// import { useCourseStore, useCursoActual, useCursos, useIsLoading } from '@/lib/stores/course.store'

// // Datos simulados de cursos
// const MOCK_COURSES = [
//     {
//         id: 'calc1',
//         titulo: 'Cálculo Diferencial',
//         descripcion: 'Fundamentos del cálculo diferencial con aplicaciones en ingeniería y ciencias',
//         profesor: 'Dr. María González',
//         estudiantes: 156,
//         progreso: 75,
//         color: 'from-blue-500 via-blue-600 to-cyan-500',
//         accentColor: 'from-blue-400 to-cyan-400',
//         icono: Calculator,
//         dificultad: 'Intermedio',
//         duracion: '16 semanas',
//         modulos: 8,
//         rating: 4.8,
//         activo: true,
//         ultimaActividad: '2 horas',
//         categoria: 'Cálculo',
//         nextClass: 'Mañana 10:00',
//         pendingExercises: 3,
//         habilitado: true
//     },
//     {
//         id: 'algebra',
//         titulo: 'Álgebra Lineal Avanzada',
//         descripcion: 'Espacios vectoriales, transformaciones lineales y aplicaciones computacionales',
//         profesor: 'Dr. Carlos Ruiz',
//         estudiantes: 89,
//         progreso: 45,
//         color: 'from-purple-500 via-purple-600 to-pink-500',
//         accentColor: 'from-purple-400 to-pink-400',
//         icono: Brain,
//         dificultad: 'Avanzado',
//         duracion: '14 semanas',
//         modulos: 6,
//         rating: 4.9,
//         activo: true,
//         ultimaActividad: '1 día',
//         categoria: 'Álgebra',
//         nextClass: 'Viernes 14:00',
//         pendingExercises: 1,
//         habilitado: false
//     },
//     {
//         id: 'estadistica',
//         titulo: 'Estadística y Probabilidad',
//         descripcion: 'Análisis estadístico, distribuciones y aplicaciones en ciencia de datos',
//         profesor: 'Dra. Ana Martínez',
//         estudiantes: 134,
//         progreso: 90,
//         color: 'from-green-500 via-emerald-600 to-teal-500',
//         accentColor: 'from-green-400 to-teal-400',
//         icono: TrendingUp,
//         dificultad: 'Intermedio',
//         duracion: '12 semanas',
//         modulos: 5,
//         rating: 4.7,
//         activo: true,
//         ultimaActividad: '3 horas',
//         categoria: 'Estadística',
//         nextClass: 'Hoy 16:30',
//         pendingExercises: 0,
//         habilitado: true
//     }
// ]

// // Fórmulas LaTeX para el hero
// const LATEX_FORMULAS = [
//     '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
//     '\\int_{a}^{b} f(x)dx = F(b) - F(a)',
//     '\\mathbf{A}\\mathbf{x} = \\lambda\\mathbf{x}',
//     'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}'
// ]

// // Componente LaTeX rotativo para hero
// function HeroLatex() {
//     const [currentIndex, setCurrentIndex] = useState(0)

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex((prev) => (prev + 1) % LATEX_FORMULAS.length)
//         }, 3000)
//         return () => clearInterval(interval)
//     }, [])

//     const renderLatex = (formula: string) => {
//         try {
//             return katex.renderToString(formula, {
//                 displayMode: true,
//                 throwOnError: false,
//             })
//         } catch {
//             return formula
//         }
//     }

//     const cursos = useCourseStore(state => state.cursos);

//     const obtenerCursos = useCourseStore(state => state.obtenerCursos);

//     useEffect(() => {
        
//         obtenerCursos();
//     }, [obtenerCursos]);

//     return (
//         <div className="relative h-20 flex items-center justify-center">
//             <AnimatePresence mode="wait">
//                 <motion.div
//                     key={currentIndex}
//                     initial={{ opacity: 0, y: 20, scale: 0.8 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -20, scale: 0.8 }}
//                     transition={{ duration: 0.5 }}
//                     className="absolute"
//                     dangerouslySetInnerHTML={{
//                         __html: renderLatex(LATEX_FORMULAS[currentIndex])
//                     }}
//                 />
//             </AnimatePresence>
//         </div>
//     )
// }

// // Componente tarjeta de curso
// function CourseCard({ course, index, user }) {
//     const [isHovered, setIsHovered] = useState(false)
//     const [isVisible, setIsVisible] = useState(course.habilitado)
//     const IconComponent = course.icono

//     const canEdit = ['profesor', 'profesor_editor', 'administrador'].includes(user?.role)
//     const canToggleVisibility = ['profesor', 'profesor_editor', 'administrador'].includes(user?.role)

//     const cardVariants = {
//         hidden: { opacity: 0, y: 30, scale: 0.9 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             transition: {
//                 delay: index * 0.1,
//                 duration: 0.6,
//                 ease: [0.16, 1, 0.3, 1]
//             }
//         },
//         hover: {
//             y: -12,
//             scale: 1.03,
//             transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
//         }
//     }

//     const handleToggleVisibility = (e) => {
//         e.preventDefault()
//         setIsVisible(!isVisible)
//     }

//     if (user?.role === 'estudiante' && !course.habilitado) {
//         return null
//     }

//     return (
//         <motion.div
//             variants={cardVariants}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//             onHoverStart={() => setIsHovered(true)}
//             onHoverEnd={() => setIsHovered(false)}
//             className="group relative"
//         >
//             <Link href={`/courses/${course.id}`}>
//                 <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ${isVisible ? 'shadow-lg hover:shadow-2xl border border-gray-100' : 'opacity-60 shadow-md border border-gray-200'
//                     }`}>

//                     {/* Header con gradiente dinámico */}
//                     <div className={`relative h-32 bg-gradient-to-br ${course.color} overflow-hidden`}>

//                         {/* Efectos de fondo animados */}
//                         <div className="absolute inset-0">
//                             <motion.div
//                                 animate={{
//                                     scale: isHovered ? 1.1 : 1,
//                                     opacity: isHovered ? 0.3 : 0.2
//                                 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"
//                             />
//                             <motion.div
//                                 animate={{
//                                     scale: isHovered ? 1.2 : 1,
//                                     rotate: isHovered ? 45 : 0
//                                 }}
//                                 transition={{ duration: 0.5 }}
//                                 className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"
//                             />
//                         </div>

//                         <div className="relative z-10 p-6 h-full flex flex-col justify-between">

//                             {/* Top row */}
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <motion.div
//                                         animate={{ rotate: isHovered ? 12 : 0 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
//                                     >
//                                         <IconComponent className="w-6 h-6 text-white" />
//                                     </motion.div>
//                                     <div>
//                                         <h3 className="font-bold text-lg text-white leading-tight">{course.titulo}</h3>
//                                         <p className="text-white/80 text-sm">{course.categoria}</p>
//                                     </div>
//                                 </div>

//                                 {/* Controls para profesores */}
//                                 {canToggleVisibility && (
//                                     <div className="flex gap-2">
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={handleToggleVisibility}
//                                             className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors"
//                                         >
//                                             {isVisible ? (
//                                                 <Eye className="w-4 h-4 text-white" />
//                                             ) : (
//                                                 <EyeOff className="w-4 h-4 text-white" />
//                                             )}
//                                         </motion.button>
//                                         {canEdit && (
//                                             <motion.button
//                                                 whileHover={{ scale: 1.1 }}
//                                                 whileTap={{ scale: 0.9 }}
//                                                 className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors"
//                                             >
//                                                 <Edit3 className="w-4 h-4 text-white" />
//                                             </motion.button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Bottom status */}
//                             <div className="flex items-center justify-between">
//                                 <div className={`px-3 py-1 rounded-full text-xs font-medium ${course.activo
//                                     ? 'bg-green-400/90 text-green-900'
//                                     : 'bg-gray-300/90 text-gray-700'
//                                     }`}>
//                                     {course.activo ? 'En Curso' : 'Finalizado'}
//                                 </div>

//                                 {course.nextClass && (
//                                     <div className="text-white/90 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
//                                         {course.nextClass}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Contenido */}
//                     <div className="p-6 space-y-4">

//                         <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
//                             {course.descripcion}
//                         </p>

//                         {/* Métricas principales */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                     <Users className="w-4 h-4" />
//                                     <span>{course.estudiantes} estudiantes</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                                     <span>{course.rating}</span>
//                                 </div>
//                             </div>

//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                     <BookOpen className="w-4 h-4" />
//                                     <span>{course.modulos} módulos</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                     <Clock className="w-4 h-4" />
//                                     <span>{course.duracion}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Progreso con animación */}
//                         <div className="space-y-2">
//                             <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-600">Tu progreso</span>
//                                 <span className="font-semibold text-gray-900">{course.progreso}%</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                                 <motion.div
//                                     className={`h-full bg-gradient-to-r ${course.accentColor} rounded-full`}
//                                     initial={{ width: 0 }}
//                                     animate={{ width: `${course.progreso}%` }}
//                                     transition={{ delay: index * 0.1 + 0.8, duration: 1.2, ease: "easeOut" }}
//                                 />
//                             </div>
//                         </div>

//                         {/* Footer con acciones */}
//                         <div className="flex items-center justify-between pt-2">
//                             <div className="flex items-center gap-2">
//                                 {course.pendingExercises > 0 && (
//                                     <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
//                                         <Target className="w-3 h-3" />
//                                         {course.pendingExercises} pendientes
//                                     </div>
//                                 )}
//                             </div>

//                             <motion.div
//                                 animate={{ x: isHovered ? 6 : 0 }}
//                                 className="flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors"
//                             >
//                                 <span>Ingresar</span>
//                                 <ChevronRight className="w-4 h-4" />
//                             </motion.div>
//                         </div>
//                     </div>
//                 </div>
//             </Link>
//         </motion.div>
//     )
// }

// // Componente principal
// export default function CoursesPage() {

//     const cursos = useCursos();
//     const isLoading = useIsLoading();
//     const cursoActual = useCursoActual();

//     const obtenerCursos = useCourseStore(state => state.obtenerCursos);

//     useEffect(() => {
//         console.log("Obtener cursos")
//         obtenerCursos();
//     }, [obtenerCursos]);

//     console.log(cursos, isLoading, cursoActual);



//     const { user, logout } = useAuth()
//     const [searchTerm, setSearchTerm] = useState('')
//     const [filterCategory, setFilterCategory] = useState('todos')

//     const filteredCourses = useMemo(() => {
//         return MOCK_COURSES.filter(course => {
//             const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 course.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
//             const matchesCategory = filterCategory === 'todos' || course.categoria === filterCategory
//             return matchesSearch && matchesCategory
//         })
//     }, [searchTerm, filterCategory])

//     const getGreeting = () => {
//         const hour = new Date().getHours()
//         if (hour < 12) return 'Buenos días'
//         if (hour < 18) return 'Buenas tardes'
//         return 'Buenas noches'
//     }

//     const categories = ['todos', ...new Set(MOCK_COURSES.map(c => c.categoria))]

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">

//             {/* Navigation Header */}
//             <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
//                 <div className="max-w-7xl mx-auto px-6">
//                     <div className="flex items-center justify-between h-16">

//                         {/* Logo */}
//                         <div className="flex items-center gap-3">
//                             <motion.div
//                                 whileHover={{ rotate: 360 }}
//                                 transition={{ duration: 0.7 }}
//                                 className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2"
//                             >
//                                 <Calculator className="w-6 h-6 text-white" />
//                             </motion.div>
//                             <div>
//                                 <span className="text-xl font-bold text-gray-900">MATUC</span>
//                                 <div className="text-xs text-blue-600 font-semibold">v4.0</div>
//                             </div>
//                         </div>

//                         {/* User menu */}
//                         <div className="flex items-center gap-4">
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <Bell className="w-5 h-5" />
//                             </motion.button>

//                             <div className="flex items-center gap-3">
//                                 <div className="text-right">
//                                     <div className="text-sm font-medium text-gray-900">
//                                         {user?.nombre} {user?.apellido}
//                                     </div>
//                                     <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
//                                 </div>
//                                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                                     {user?.nombre?.[0]}{user?.apellido?.[0]}
//                                 </div>
//                             </div>

//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 onClick={logout}
//                                 className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                                 <LogOut className="w-5 h-5" />
//                             </motion.button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>

//             <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

//                 {/* Hero Section */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white"
//                 >

//                     {/* Efectos de fondo */}
//                     <div className="absolute inset-0">
//                         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
//                         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/10 rounded-full translate-y-32 -translate-x-32" />
//                         <motion.div
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//                             className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/20 rounded-full"
//                         />
//                     </div>

//                     <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
//                         <div className="space-y-6">
//                             <motion.div
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: 0.2 }}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
//                             >
//                                 <Sparkles className="w-4 h-4" />
//                                 {getGreeting()}, {user?.nombre}
//                             </motion.div>

//                             <motion.h1
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: 0.3 }}
//                                 className="text-4xl lg:text-5xl font-bold leading-tight"
//                             >
//                                 Tus Cursos de
//                                 <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
//                                     Matemáticas
//                                 </span>
//                             </motion.h1>

//                             <motion.p
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: 0.4 }}
//                                 className="text-xl text-white/90 leading-relaxed"
//                             >
//                                 Continúa tu viaje de aprendizaje. {MOCK_COURSES.filter(c => c.activo).length} cursos activos te esperan.
//                             </motion.p>
//                         </div>

//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ delay: 0.6 }}
//                             className="relative"
//                         >
//                             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                                 <div className="text-center mb-4">
//                                     <div className="text-sm text-white/80 mb-2">Fórmula del día</div>
//                                 </div>
//                                 <HeroLatex />
//                             </div>
//                         </motion.div>
//                     </div>
//                 </motion.div>

//                 {/* Barra de búsqueda */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50"
//                 >
//                     <div className="flex flex-col lg:flex-row gap-4 items-center">
//                         <div className="relative flex-1 max-w-md">
//                             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Buscar cursos..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"
//                             />
//                         </div>

//                         <div className="flex items-center gap-3">
//                             {categories.map((category) => (
//                                 <motion.button
//                                     key={category}
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     onClick={() => setFilterCategory(category)}
//                                     className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === category
//                                         ? 'bg-blue-600 text-white shadow-lg'
//                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {category === 'todos' ? 'Todos' : category}
//                                 </motion.button>
//                             ))}
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Grid de cursos */}
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                     className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
//                 >
//                     {filteredCourses.map((course, index) => (
//                         <CourseCard
//                             key={course.id}
//                             course={course}
//                             index={index}
//                             user={user}
//                         />
//                     ))}
//                 </motion.div>

//                 {/* Empty state */}
//                 {filteredCourses.length === 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-center py-16"
//                     >
//                         <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Search className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
//                         <p className="text-gray-600">Intenta ajustar tus filtros o términos de búsqueda</p>
//                     </motion.div>
//                 )}
//             </div>
//         </div>
//     )
// }