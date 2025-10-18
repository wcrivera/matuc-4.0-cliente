// src/lib/hooks/useGrupo.ts
// ==========================================
// 🎯 HOOK DE GRUPOS - FRONTEND (FETCH NATIVO)
// ==========================================

import { CapituloFiltrado } from '@/types/course-content.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import type {
//     Grupo,
//     GrupoConEstadisticas,
//     CrearGrupoRequest,
//     ActualizarGrupoRequest,
// } from '@/types/grupo.types';

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

const capituloAPI = {
    // Obtener capítulos de un curso
    obtenerCapitulosCurso: async (cursoId: string) => {
        const response = await fetch(`${API_URL}/api/capitulo/curso/${cursoId}`, {
            headers: getAuthHeaders()
        });
        // console.log(response)
        return handleApiResponse<{ ok: boolean; capitulos: CapituloFiltrado[] }>(response);
    },


};

// ==========================================
// 📚 HOOK: OBTENER GRUPOS DE UN CURSO
// ==========================================

export function useCapitulosCurso(cursoId: string) {
    return useQuery({
        queryKey: ['capitulos-curso', cursoId],
        queryFn: () => capituloAPI.obtenerCapitulosCurso(cursoId),
        enabled: !!cursoId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}