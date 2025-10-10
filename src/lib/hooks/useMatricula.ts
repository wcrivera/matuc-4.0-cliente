// src/lib/hooks/useMatricula.ts
// ==========================================
// 🎓 HOOK DE MATRÍCULA - FRONTEND (FETCH NATIVO)
// ==========================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
    Matricula,
    MatriculaConUsuario,
    CrearMatriculaRequest,
    ActualizarMatriculaRequest,
} from '@/types/matricula.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ==========================================
// 🎯 TIPOS PARA HOOKS (ALIAS MEJORADOS)
// ==========================================

// MiCurso: Curso completo con datos de matrícula
export interface MiCurso {
    curso: {
        cid: string;
        nombre: string;
        sigla: string;
        categoria: string;
        semestre: string;
        descripcion?: string;
        activo: boolean;
        creditos: number;
        estadisticas?: {
            totalEstudiantes: number;
            totalProfesores: number;
            totalCapitulos: number;
        };
    };
    matricula: {
        mid: string;
        rol: 'estudiante' | 'ayudante' | 'profesor' | 'profesor_editor';
        grupo?: string;
        activo: boolean;
    };
}

// EstudianteCurso: Usuario con datos de matrícula (alias de MatriculaConUsuario)
export type EstudianteCurso = MatriculaConUsuario;

// ==========================================
// 🔧 UTILIDADES (mismo patrón que course.store.ts)
// ==========================================

const cookieUtils = {
    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        return cookies[name] || null;
    }
};

function getAuthHeaders(): HeadersInit {
    const token = cookieUtils.get('matuc_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
}

async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ==========================================
// 🌐 FUNCIONES DE API
// ==========================================

const matriculaAPI = {
    // Obtener mis cursos
    obtenerMisCursos: async () => {
        const response = await fetch(`${API_URL}/api/matricula/mis-cursos`, {
            headers: getAuthHeaders()
        });

        console.log(response)
        return handleApiResponse<{ ok: boolean; cursos: MiCurso[] }>(response);
    },

    // Verificar si estoy matriculado
    verificarMatricula: async (cursoId: string) => {
        const response = await fetch(`${API_URL}/matricula/verificar/${cursoId}`, {
            headers: getAuthHeaders()
        });
        return handleApiResponse<{
            ok: boolean;
            matriculado: boolean;
            rol?: string
        }>(response);
    },

    // Obtener estudiantes de un curso
    obtenerEstudiantesDeCurso: async (cursoId: string, rol?: string) => {
        const params = new URLSearchParams();
        if (rol) params.append('rol', rol);

        const url = `${API_URL}/matricula/curso/${cursoId}/estudiantes${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; estudiantes: EstudianteCurso[] }>(response);
    },

    // Crear matrícula
    crear: async (matricula: CrearMatriculaRequest) => {
        const response = await fetch(`${API_URL}/matricula`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(matricula)
        });
        return handleApiResponse<{ ok: boolean; matricula: Matricula; message: string }>(response);
    },

    // Actualizar matrícula
    actualizar: async (mid: string, updates: Partial<ActualizarMatriculaRequest>) => {
        const response = await fetch(`${API_URL}/matricula/${mid}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        return handleApiResponse<{ ok: boolean; matricula: Matricula; message: string }>(response);
    },

    // Eliminar matrícula
    eliminar: async (mid: string) => {
        const response = await fetch(`${API_URL}/matricula/${mid}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; message: string }>(response);
    }
};

// ==========================================
// 📚 HOOK: OBTENER MIS CURSOS
// ==========================================

export function useMisCursos() {
    return useQuery({
        queryKey: ['mis-cursos'],
        queryFn: matriculaAPI.obtenerMisCursos,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

// ==========================================
// 🔍 HOOK: VERIFICAR MATRÍCULA EN CURSO
// ==========================================

export function useVerificarMatricula(cursoId: string) {
    return useQuery({
        queryKey: ['verificar-matricula', cursoId],
        queryFn: () => matriculaAPI.verificarMatricula(cursoId),
        enabled: !!cursoId,
        staleTime: 1000 * 60 * 5,
    });
}

// ==========================================
// 👥 HOOK: OBTENER ESTUDIANTES DE UN CURSO
// ==========================================

export function useEstudiantesCurso(cursoId: string, rol?: string) {
    return useQuery({
        queryKey: ['estudiantes-curso', cursoId, rol],
        queryFn: () => matriculaAPI.obtenerEstudiantesDeCurso(cursoId, rol),
        enabled: !!cursoId,
        staleTime: 1000 * 60 * 2, // 2 minutos
    });
}

// ==========================================
// ➕ HOOK: CREAR MATRÍCULA
// ==========================================

export function useCrearMatricula() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: matriculaAPI.crear,
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['mis-cursos'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
        },
    });
}

// ==========================================
// ✏️ HOOK: ACTUALIZAR MATRÍCULA
// ==========================================

export function useActualizarMatricula() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mid, updates }: { mid: string; updates: Partial<ActualizarMatriculaRequest> }) =>
            matriculaAPI.actualizar(mid, updates),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['mis-cursos'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
            queryClient.invalidateQueries({ queryKey: ['verificar-matricula'] });
        },
    });
}

// ==========================================
// 🗑️ HOOK: ELIMINAR MATRÍCULA
// ==========================================

export function useEliminarMatricula() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: matriculaAPI.eliminar,
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['mis-cursos'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
            queryClient.invalidateQueries({ queryKey: ['verificar-matricula'] });
        },
    });
}

// ==========================================
// 🎯 HOOK COMBINADO: TODO EN UNO
// ==========================================

export function useMatricula(cursoId?: string) {
    const misCursos = useMisCursos();
    const verificacion = useVerificarMatricula(cursoId || '');
    const crearMatricula = useCrearMatricula();
    const actualizarMatricula = useActualizarMatricula();
    const eliminarMatricula = useEliminarMatricula();

    return {
        // Queries
        misCursos: misCursos.data?.cursos || [],
        isLoadingCursos: misCursos.isLoading,
        errorCursos: misCursos.error,

        // Verificación
        estaMatriculado: verificacion.data?.matriculado || false,
        rolEnCurso: verificacion.data?.rol || null,
        isLoadingVerificacion: verificacion.isLoading,

        // Mutations
        matricular: crearMatricula.mutate,
        isMatriculando: crearMatricula.isPending,

        actualizar: actualizarMatricula.mutate,
        isActualizando: actualizarMatricula.isPending,

        eliminar: eliminarMatricula.mutate,
        isEliminando: eliminarMatricula.isPending,

        // Refetch
        refetchMisCursos: misCursos.refetch,
        refetchVerificacion: verificacion.refetch,
    };
}