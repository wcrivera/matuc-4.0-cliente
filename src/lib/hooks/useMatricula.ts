// src/lib/hooks/useMatricula.ts (Frontend)
// ==========================================
// 🎓 HOOK DE MATRÍCULA - FRONTEND
// ==========================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
    CrearMatriculaRequest,
    ActualizarMatriculaRequest,
} from '@/types/matricula.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ==========================================
// 🔧 FUNCIONES DE API
// ==========================================

const matriculaAPI = {
    // Obtener mis cursos
    obtenerMisCursos: async () => {
        const { data } = await axios.get(`${API_URL}/matricula/mis-cursos`);
        return data;
    },

    // Verificar si estoy matriculado
    verificarMatricula: async (cursoId: string) => {
        const { data } = await axios.get(`${API_URL}/matricula/verificar/${cursoId}`);
        return data;
    },

    // Obtener estudiantes de un curso
    obtenerEstudiantesDeCurso: async (cursoId: string, rol?: string) => {
        const params = rol ? { rol } : {};
        const { data } = await axios.get(`${API_URL}/matricula/curso/${cursoId}/estudiantes`, { params });
        return data;
    },

    // Crear matrícula
    crear: async (matricula: CrearMatriculaRequest) => {
        const { data } = await axios.post(`${API_URL}/matricula`, matricula);
        return data;
    },

    // Actualizar matrícula
    actualizar: async (mid: string, updates: Partial<ActualizarMatriculaRequest>) => {
        const { data } = await axios.put(`${API_URL}/matricula/${mid}`, updates);
        return data;
    },

    // Eliminar matrícula
    eliminar: async (mid: string) => {
        const { data } = await axios.delete(`${API_URL}/matricula/${mid}`);
        return data;
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
        onSuccess: (data, variables) => {
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