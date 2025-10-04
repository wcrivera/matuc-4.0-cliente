import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import React from 'react';
import type {
    CursoStore,
    Curso,
    CursosQuery,
    CursoFiltros,
    CrearCursoRequest,
    ActualizarCursoRequest,
    CursoPaginacion
} from '@/types/course.types';
import { string } from 'zod';

// ==========================================
// 🌐 API CLIENT FUNCTIONS
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const cookieUtils = {
    set: (name: string, value: string, days = 7) => {
        if (typeof document !== 'undefined') {
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
            document.cookie = `${name}=${value}; expires=${expires}; path=/; samesite=strict`
        }
    },
    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = value
            return acc
        }, {} as Record<string, string>)
        return cookies[name] || null
    },
    remove: (name: string) => {
        if (typeof document !== 'undefined') {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
        }
    }
}

// Helper para headers con auth
function getAuthHeaders(): HeadersInit {
    const token = cookieUtils.get('matuc_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
}

// Helper para manejo de errores de API
async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ==========================================
// 🎯 ZUSTAND STORE CON IMMER
// ==========================================

export const useCourseStore = create<CursoStore>()(
    devtools(
        (set) => ({
            // === ESTADO INICIAL ===
            cursos: [],
            cursoActual: null,
            isLoading: false,
            error: null,
            pagination: null,
            filtros: {},

            // ==========================================
            // 📋 OBTENER CURSOS CON FILTROS Y PAGINACIÓN
            // ==========================================
            obtenerCursos: async (query?: CursosQuery) => {
                set({ isLoading: true, error: null });

                try {
                    // Construir query params
                    const params = new URLSearchParams();

                    if (query?.categoria) params.append('categoria', query.categoria);
                    if (query?.activo !== undefined) params.append('activo', query.activo.toString());
                    if (query?.publico !== undefined) params.append('publico', query.publico.toString());
                    if (query?.semestre) params.append('semestre', query.semestre);
                    if (query?.año) params.append('año', query.año.toString());
                    if (query?.search) params.append('search', query.search);
                    if (query?.page) params.append('page', query.page.toString());
                    if (query?.limit) params.append('limit', query.limit.toString());


                    // const response = await fetch(`${API_BASE_URL}/api/curso`, {
                    //     headers: getAuthHeaders(),
                    // });

                    const token = cookieUtils.get('matuc_token') || '';

                    const response = await fetch(`${API_BASE_URL}/api/curso`, {
                        method: 'GET',
                        headers: { 'x-token': token },
                    });

                    const data = await handleApiResponse<{
                        ok: boolean;
                        cursos: Curso[];
                        pagination: CursoPaginacion;
                    }>(response);

                    set((state) => ({
                        cursos: data.cursos,
                        pagination: data.pagination,
                        isLoading: false,
                        // Actualizar filtros aplicados
                        filtros: query ? {
                            categoria: query.categoria,
                            activo: query.activo,
                            publico: query.publico,
                            semestre: query.semestre,
                            año: query.año,
                            search: query.search,
                        } : state.filtros
                    }));

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al obtener cursos',
                        isLoading: false
                    });
                    console.error('Error al obtener cursos:', error);
                }
            },

            // ==========================================
            // 📄 OBTENER CURSO ESPECÍFICO
            // ==========================================
            obtenerCurso: async (cid: string) => {

                // console.log(cid)
                
                set({ isLoading: true, error: null });

                try {


                    const token = cookieUtils.get('matuc_token') || '';

                    const response = await fetch(`${API_BASE_URL}/api/curso/${cid}`, {
                        method: 'GET',
                        headers: { 'x-token': token },
                    });

                    const data = await handleApiResponse<{
                        ok: boolean;
                        curso: Curso;
                    }>(response);

                    set({
                        cursoActual: data.curso,
                        isLoading: false
                    });

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al obtener curso',
                        isLoading: false
                    });
                    console.error('Error al obtener curso:', error);
                }
            },

            // ==========================================
            // ➕ CREAR CURSO
            // ==========================================
            crearCurso: async (datos: CrearCursoRequest): Promise<Curso | null> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/curso`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(datos),
                    });

                    console.log(response)

                    const result = await handleApiResponse<{
                        ok: boolean;
                        curso: Curso;
                        message: string;
                    }>(response);

                    set((state) => ({
                        // Agregar el nuevo curso al inicio de la lista
                        cursos: [result.curso, ...state.cursos],
                        cursoActual: result.curso,
                        isLoading: false
                    }));

                    return result.curso;

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al crear curso',
                        isLoading: false
                    });
                    console.error('Error al crear curso:', error);
                    return null;
                }
            },

            // ==========================================
            // ✏️ ACTUALIZAR CURSO
            // ==========================================
            actualizarCurso: async (datos: ActualizarCursoRequest): Promise<Curso | null> => {
                set({ isLoading: true, error: null });

                try {
                    const { cid, ...datosActualizar } = datos;

                    const response = await fetch(`${API_BASE_URL}/api/curso/${cid}`, {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(datosActualizar),
                    });

                    const result = await handleApiResponse<{
                        ok: boolean;
                        curso: Curso;
                        message: string;
                    }>(response);

                    set((state) => ({
                        // Actualizar en la lista
                        cursos: state.cursos.map(curso =>
                            curso.cid === cid ? result.curso : curso
                        ),
                        // Actualizar curso actual si coincide
                        cursoActual: state.cursoActual?.cid === cid ? result.curso : state.cursoActual,
                        isLoading: false
                    }));

                    return result.curso;

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al actualizar curso',
                        isLoading: false
                    });
                    console.error('Error al actualizar curso:', error);
                    return null;
                }
            },

            // ==========================================
            // 🗑️ ELIMINAR CURSO
            // ==========================================
            eliminarCurso: async (cid: string): Promise<boolean> => {
                set({ isLoading: true, error: null });

                console.log(cid)

                try {

                    const token = cookieUtils.get('matuc_token') || '';

                    console.log(token)

                    const response = await fetch(`${API_BASE_URL}/api/curso/${cid}`, {
                        method: 'DELETE',
                        headers: { 'x-token': token },
                    });

                    console.log(response)

                    await handleApiResponse<{
                        ok: boolean;
                        message: string;
                    }>(response);

                    set((state) => ({
                        // Remover de la lista
                        cursos: state.cursos.filter(curso => curso.cid !== cid),
                        // Limpiar curso actual si coincide
                        cursoActual: state.cursoActual?.cid === cid ? null : state.cursoActual,
                        isLoading: false
                    }));

                    return true;

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al eliminar curso',
                        isLoading: false
                    });
                    console.error('Error al eliminar curso:', error);
                    return false;
                }
            },

            // ==========================================
            // 🔧 MÉTODOS DE ESTADO
            // ==========================================

            // Actualizar filtros (sin hacer petición)
            setFiltros: (nuevosFiltros: Partial<CursoFiltros>) => {
                set((state) => ({
                    filtros: { ...state.filtros, ...nuevosFiltros }
                }));
            },

            // Limpiar error
            clearError: () => {
                set({ error: null });
            },

            // Limpiar curso actual
            clearCursoActual: () => {
                set({ cursoActual: null });
            },

            // Establecer loading manualmente
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            // Establecer error manualmente
            setError: (error: string | null) => {
                set({ error });
            },
        }),
        {
            name: 'course-store', // Para DevTools
        }
    )
);

// ==========================================
// 🎯 SELECTORES ÚTILES (COMPUTED VALUES)
// ==========================================

// Selectores para componentes que necesiten datos específicos
export const useCursos = () => useCourseStore((state) => state.cursos);
export const useCursoActual = () => useCourseStore((state) => state.cursoActual);
export const useIsLoading = () => useCourseStore((state) => state.isLoading);
export const useError = () => useCourseStore((state) => state.error);
export const usePagination = () => useCourseStore((state) => state.pagination);
export const useFiltros = () => useCourseStore((state) => state.filtros);

// Selectores computados más complejos
export const useCursosActivos = () =>
    useCourseStore((state: CursoStore) => state.cursos.filter((curso: Curso) => curso.activo));

export const useCursosPublicos = () =>
    useCourseStore((state: CursoStore) => state.cursos.filter((curso: Curso) => curso.publico));

export const useCursosPorCategoria = (categoria: string) =>
    useCourseStore((state: CursoStore) => state.cursos.filter((curso: Curso) => curso.categoria === categoria));

export const useEstadisticasCursos = () =>
    useCourseStore((state: CursoStore) => {
        const cursos = state.cursos;
        return {
            total: cursos.length,
            activos: cursos.filter((c: Curso) => c.activo).length,
            publicos: cursos.filter((c: Curso) => c.publico).length,
            totalEstudiantes: cursos.reduce((sum: number, c: Curso) => sum + c.estadisticas.totalEstudiantes, 0),
            promedioCreditos: cursos.length > 0
                ? cursos.reduce((sum: number, c: Curso) => sum + c.creditos, 0) / cursos.length
                : 0,
        };
    });

// ==========================================
// 🛠️ HOOKS COMPUESTOS PARA CASOS COMUNES
// ==========================================

// Hook para manejar la carga inicial de cursos
export function useCursosIniciales(filtros?: CursosQuery) {
    const { obtenerCursos, cursos, isLoading, error } = useCourseStore();

    React.useEffect(() => {
        if (cursos.length === 0) {
            obtenerCursos(filtros);
        }
    }, [obtenerCursos, cursos.length, filtros]);

    return { cursos, isLoading, error, refetch: () => obtenerCursos(filtros) };
}

// Hook para manejar un curso específico
export function useCurso(cid: string) {
    const { obtenerCurso, cursoActual, isLoading, error, clearCursoActual } = useCourseStore();

    React.useEffect(() => {
        if (cid) {
            obtenerCurso(cid);
        }

        return () => clearCursoActual();
    }, [cid, obtenerCurso, clearCursoActual]);

    return { curso: cursoActual, isLoading, error };
}

// Hook para operaciones CRUD con feedback
export function useCursoOperaciones() {
    const { crearCurso, actualizarCurso, eliminarCurso, isLoading, error, clearError } = useCourseStore();

    return {
        crear: crearCurso,
        actualizar: actualizarCurso,
        eliminar: eliminarCurso,
        isLoading,
        error,
        clearError,
    };
}