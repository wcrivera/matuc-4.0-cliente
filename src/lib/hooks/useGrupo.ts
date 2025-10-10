// src/lib/hooks/useGrupo.ts
// ==========================================
// 🎯 HOOK DE GRUPOS - FRONTEND (FETCH NATIVO)
// ==========================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
    Grupo,
    GrupoConEstadisticas,
    CrearGrupoRequest,
    ActualizarGrupoRequest,
} from '@/types/grupo.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

const grupoAPI = {
    // Obtener grupos de un curso
    obtenerGruposCurso: async (cursoId: string) => {
        const response = await fetch(`${API_URL}/grupo/curso/${cursoId}`, {
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; grupos: Grupo[] }>(response);
    },

    // Obtener grupo específico por ID
    obtenerGrupo: async (gid: string) => {
        const response = await fetch(`${API_URL}/grupo/${gid}`, {
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; grupo: Grupo }>(response);
    },

    // Obtener grupos con estadísticas de un curso
    obtenerGruposConEstadisticas: async (cursoId: string) => {
        const response = await fetch(`${API_URL}/grupo/curso/${cursoId}/estadisticas`, {
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; grupos: GrupoConEstadisticas[] }>(response);
    },

    // Crear grupo
    crear: async (grupo: CrearGrupoRequest) => {
        const response = await fetch(`${API_URL}/grupo`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(grupo)
        });
        return handleApiResponse<{ ok: boolean; grupo: Grupo; message: string }>(response);
    },

    // Actualizar grupo
    actualizar: async (gid: string, updates: ActualizarGrupoRequest) => {
        const response = await fetch(`${API_URL}/grupo/${gid}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        return handleApiResponse<{ ok: boolean; grupo: Grupo; message: string }>(response);
    },

    // Eliminar grupo
    eliminar: async (gid: string) => {
        const response = await fetch(`${API_URL}/grupo/${gid}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; message: string }>(response);
    },

    // Asignar estudiante a grupo
    asignarEstudiante: async (mid: string, gid: string) => {
        const response = await fetch(`${API_URL}/grupo/${gid}/asignar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ mid })
        });
        return handleApiResponse<{ ok: boolean; message: string }>(response);
    },

    // Mover estudiante entre grupos
    moverEstudiante: async (mid: string, grupoOrigenId: string, grupoDestinoId: string) => {
        const response = await fetch(`${API_URL}/grupo/mover-estudiante`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ mid, grupoOrigenId, grupoDestinoId })
        });
        return handleApiResponse<{ ok: boolean; message: string }>(response);
    },

    // Remover estudiante de grupo
    removerEstudiante: async (mid: string) => {
        const response = await fetch(`${API_URL}/grupo/remover-estudiante/${mid}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleApiResponse<{ ok: boolean; message: string }>(response);
    }
};

// ==========================================
// 📚 HOOK: OBTENER GRUPOS DE UN CURSO
// ==========================================

export function useGruposCurso(cursoId: string) {
    return useQuery({
        queryKey: ['grupos-curso', cursoId],
        queryFn: () => grupoAPI.obtenerGruposCurso(cursoId),
        enabled: !!cursoId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

// ==========================================
// 📊 HOOK: OBTENER GRUPOS CON ESTADÍSTICAS
// ==========================================

export function useGruposConEstadisticas(cursoId: string) {
    return useQuery({
        queryKey: ['grupos-estadisticas', cursoId],
        queryFn: () => grupoAPI.obtenerGruposConEstadisticas(cursoId),
        enabled: !!cursoId,
        staleTime: 1000 * 60 * 2, // 2 minutos (más dinámico)
    });
}

// ==========================================
// 🔍 HOOK: OBTENER GRUPO ESPECÍFICO
// ==========================================

export function useGrupo(gid: string) {
    return useQuery({
        queryKey: ['grupo', gid],
        queryFn: () => grupoAPI.obtenerGrupo(gid),
        enabled: !!gid,
        staleTime: 1000 * 60 * 5,
    });
}

// ==========================================
// ➕ HOOK: CREAR GRUPO
// ==========================================

export function useCrearGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: grupoAPI.crear,
        onSuccess: (data) => {
            // Invalidar queries relacionadas
            if (data.grupo?.curso) {
                queryClient.invalidateQueries({ queryKey: ['grupos-curso', data.grupo.curso] });
                queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas', data.grupo.curso] });
            }
        },
    });
}

// ==========================================
// ✏️ HOOK: ACTUALIZAR GRUPO
// ==========================================

export function useActualizarGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ gid, updates }: { gid: string; updates: ActualizarGrupoRequest }) =>
            grupoAPI.actualizar(gid, updates),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['grupo', variables.gid] });
            queryClient.invalidateQueries({ queryKey: ['grupos-curso'] });
            queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas'] });
        },
    });
}

// ==========================================
// 🗑️ HOOK: ELIMINAR GRUPO
// ==========================================

export function useEliminarGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: grupoAPI.eliminar,
        onSuccess: () => {
            // Invalidar todas las queries de grupos
            queryClient.invalidateQueries({ queryKey: ['grupos-curso'] });
            queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas'] });
            queryClient.invalidateQueries({ queryKey: ['grupo'] });
        },
    });
}

// ==========================================
// 👥 HOOK: ASIGNAR ESTUDIANTE A GRUPO
// ==========================================

export function useAsignarEstudianteGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mid, gid }: { mid: string; gid: string }) =>
            grupoAPI.asignarEstudiante(mid, gid),
        onSuccess: () => {
            // Invalidar queries de grupos y matrículas
            queryClient.invalidateQueries({ queryKey: ['grupos-curso'] });
            queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
            queryClient.invalidateQueries({ queryKey: ['mis-cursos'] });
        },
    });
}

// ==========================================
// 🔄 HOOK: MOVER ESTUDIANTE ENTRE GRUPOS
// ==========================================

export function useMoverEstudianteGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mid, grupoOrigenId, grupoDestinoId }: {
            mid: string;
            grupoOrigenId: string;
            grupoDestinoId: string;
        }) => grupoAPI.moverEstudiante(mid, grupoOrigenId, grupoDestinoId),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['grupos-curso'] });
            queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
        },
    });
}

// ==========================================
// ❌ HOOK: REMOVER ESTUDIANTE DE GRUPO
// ==========================================

export function useRemoverEstudianteGrupo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: grupoAPI.removerEstudiante,
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['grupos-curso'] });
            queryClient.invalidateQueries({ queryKey: ['grupos-estadisticas'] });
            queryClient.invalidateQueries({ queryKey: ['estudiantes-curso'] });
        },
    });
}

// ==========================================
// 🎯 HOOK COMBINADO: TODO EN UNO
// ==========================================

export function useGrupos(cursoId?: string) {
    const gruposCurso = useGruposCurso(cursoId || '');
    const gruposEstadisticas = useGruposConEstadisticas(cursoId || '');

    const crearGrupo = useCrearGrupo();
    const actualizarGrupo = useActualizarGrupo();
    const eliminarGrupo = useEliminarGrupo();

    const asignarEstudiante = useAsignarEstudianteGrupo();
    const moverEstudiante = useMoverEstudianteGrupo();
    const removerEstudiante = useRemoverEstudianteGrupo();

    return {
        // Queries
        grupos: gruposCurso.data?.grupos || [],
        gruposConEstadisticas: gruposEstadisticas.data?.grupos || [],
        isLoadingGrupos: gruposCurso.isLoading,
        isLoadingEstadisticas: gruposEstadisticas.isLoading,
        errorGrupos: gruposCurso.error,

        // Mutations - CRUD
        crear: crearGrupo.mutate,
        isCreando: crearGrupo.isPending,
        errorCrear: crearGrupo.error,

        actualizar: actualizarGrupo.mutate,
        isActualizando: actualizarGrupo.isPending,
        errorActualizar: actualizarGrupo.error,

        eliminar: eliminarGrupo.mutate,
        isEliminando: eliminarGrupo.isPending,
        errorEliminar: eliminarGrupo.error,

        // Mutations - Asignación
        asignar: asignarEstudiante.mutate,
        isAsignando: asignarEstudiante.isPending,
        errorAsignar: asignarEstudiante.error,

        mover: moverEstudiante.mutate,
        isMoviendo: moverEstudiante.isPending,
        errorMover: moverEstudiante.error,

        remover: removerEstudiante.mutate,
        isRemoviendo: removerEstudiante.isPending,
        errorRemover: removerEstudiante.error,

        // Refetch
        refetchGrupos: gruposCurso.refetch,
        refetchEstadisticas: gruposEstadisticas.refetch,
    };
}