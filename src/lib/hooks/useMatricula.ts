// src/lib/hooks/useMatricula.ts

import { useQuery } from '@tanstack/react-query';
import { MisCursosResponse } from '@/types/matricula.types';
import { useMemo } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper para obtener token
function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies['matuc_token'] || null;
}

// API Call
async function obtenerMisCursos(): Promise<MisCursosResponse> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/api/matricula/mis-cursos`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener cursos');
  }

  return response.json();
}

// Hook principal
export function useMisCursos() {
  return useQuery({
    queryKey: ['mis-cursos'],
    queryFn: obtenerMisCursos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook con vista específica (estudiante, profesor, etc.)
export function useMisCursosPorRol(rol?: 'estudiante' | 'ayudante' | 'profesor' | 'todos') {
  const { data, ...rest } = useMisCursos();

  const cursosFiltrados = useMemo(() => {
    if (!data?.cursos) return [];

    if (rol === 'todos' || !rol) {
      return data.cursos;
    }

    return data.cursos.filter(c => {
      if (rol === 'profesor') {
        return c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor';
      }
      return c.matricula.rol === rol;
    });
  }, [data, rol]);

  // Calcular contadores
  const contadores = useMemo(() => {
    if (!data?.cursos) return { estudiante: 0, ayudante: 0, profesor: 0, total: 0 };
    
    return {
      estudiante: data.cursos.filter(c => c.matricula.rol === 'estudiante').length,
      ayudante: data.cursos.filter(c => c.matricula.rol === 'ayudante').length,
      profesor: data.cursos.filter(c => 
        c.matricula.rol === 'profesor' || c.matricula.rol === 'profesor_editor'
      ).length,
      total: data.cursos.length
    };
  }, [data]);

  return {
    cursos: cursosFiltrados,
    contadores,
    total: data?.total || 0,
    ...rest
  };
}