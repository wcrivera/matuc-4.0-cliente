// src/app/dashboard/courses/page.tsx
'use client'

import { useState, useMemo } from 'react';
import { useMisCursos } from '@/lib/hooks/useMatricula';
import { CourseCard } from './_components/CourseCard';
import { Search, BookOpen } from 'lucide-react';

export default function CoursesPage() {
    const { data, isLoading, error } = useMisCursos();
    const [filtroRol, setFiltroRol] = useState<'todos' | 'estudiante' | 'ayudante' | 'profesor'>('todos');
    const [busqueda, setBusqueda] = useState('');

    // Los cursos ya vienen en array directo desde el backend
    const todosLosCursos = useMemo(() => {
        if (!data?.cursos) return [];
        return data.cursos; // Ya es un array de CursoConMatricula[]
    }, [data]);

    // Filtrar cursos por rol y búsqueda
    const cursosFiltrados = useMemo(() => {
        let resultado = todosLosCursos;

        // Filtrar por rol
        if (filtroRol !== 'todos') {
            resultado = resultado.filter(c => {
                if (filtroRol === 'profesor') {
                    return c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor';
                }
                return c.matricula.rol === filtroRol;
            });
        }

        // Filtrar por búsqueda
        if (busqueda) {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(c =>
                c.curso.nombre.toLowerCase().includes(termino) ||
                c.curso.sigla.toLowerCase().includes(termino) ||
                c.curso.descripcion.toLowerCase().includes(termino)
            );
        }

        return resultado;
    }, [todosLosCursos, filtroRol, busqueda]);

    // Contar cursos por rol
    const contadores = useMemo(() => {
        if (!data?.cursos) return { estudiante: 0, ayudante: 0, profesor: 0, total: 0 };

        const cursos = data.cursos;
        return {
            estudiante: cursos.filter(c => c.matricula.rol === 'estudiante').length,
            ayudante: cursos.filter(c => c.matricula.rol === 'ayudante').length,
            profesor: cursos.filter(c =>
                c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor'
            ).length,
            total: cursos.length
        };
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando cursos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Error al cargar cursos
                    </h3>
                    <p className="text-gray-500">
                        {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header con gradiente */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-10 h-10" />
                        <h1 className="text-4xl font-bold">Mis Cursos</h1>
                    </div>
                    <p className="text-blue-100 text-lg">
                        Tienes acceso a {contadores.total} curso{contadores.total !== 1 ? 's' : ''} en diferentes roles
                    </p>
                </div>

                {/* Efectos decorativos */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-24 -translate-x-24" />
            </div>

            {/* Tabs de filtro por rol */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFiltroRol('todos')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filtroRol === 'todos'
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    📚 Todos ({contadores.total})
                </button>

                {contadores.estudiante > 0 && (
                    <button
                        onClick={() => setFiltroRol('estudiante')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filtroRol === 'estudiante'
                                ? 'bg-blue-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        👨‍🎓 Estudiante ({contadores.estudiante})
                    </button>
                )}

                {contadores.ayudante > 0 && (
                    <button
                        onClick={() => setFiltroRol('ayudante')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filtroRol === 'ayudante'
                                ? 'bg-yellow-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        🤝 Ayudante ({contadores.ayudante})
                    </button>
                )}

                {contadores.profesor > 0 && (
                    <button
                        onClick={() => setFiltroRol('profesor')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filtroRol === 'profesor'
                                ? 'bg-purple-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        👨‍🏫 Profesor ({contadores.profesor})
                    </button>
                )}
            </div>

            {/* Barra de búsqueda */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, sigla o descripción..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Grid de cursos */}
            {cursosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursosFiltrados.map((cursoData) => (
                        <CourseCard key={cursoData.matricula.mid} data={cursoData} />
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No se encontraron cursos
                    </h3>
                    <p className="text-gray-500">
                        {busqueda
                            ? 'Intenta con otros términos de búsqueda'
                            : 'No tienes cursos en esta categoría'}
                    </p>
                </div>
            )}
        </div>
    );
}