// src/types/matricula.types.ts
// ==========================================
// 🎓 TIPOS DE MATRÍCULA - MATUC V4
// ==========================================

import type { UserRole } from './user.types';

// ==========================================
// 📚 INTERFACE PRINCIPAL DE MATRÍCULA
// ==========================================

export interface Matricula {
    // === IDENTIFICACIÓN ===
    mid: string;                    // ID de la matrícula
    uid: string;                    // ID del usuario matriculado
    cid: string;                    // ID del curso

    // === ROL EN EL CURSO ===
    rol: MatriculaRol;              // Rol específico en este curso

    // === ESTADO ===
    activo: boolean;                // Si la matrícula está activa
    fechaMatricula: string;         // ISO string de fecha de matrícula
    fechaBaja?: string;             // ISO string si se dio de baja

    // === METADATA ===
    matriculadoPor?: string;        // UID de quien matriculó (si fue manual)
    notas?: string;                 // Notas adicionales sobre la matrícula
}

// ==========================================
// 🎭 ROLES EN MATRÍCULA
// ==========================================

export type MatriculaRol =
    | 'estudiante'
    | 'ayudante'
    | 'profesor'
    | 'profesor_editor';

// ==========================================
// 📝 TIPOS PARA FORMULARIOS
// ==========================================

// Para crear matrícula
export interface CrearMatriculaRequest {
    uid: string;                    // Usuario a matricular
    cid: string;                    // Curso
    rol: MatriculaRol;              // Rol en el curso
    notas?: string;                 // Notas opcionales
}

// Para actualizar matrícula
export interface ActualizarMatriculaRequest {
    mid: string;                    // ID de matrícula
    rol?: MatriculaRol;             // Cambiar rol
    activo?: boolean;               // Activar/desactivar
    notas?: string;                 // Actualizar notas
}

// ==========================================
// 🔍 TIPOS PARA CONSULTAS
// ==========================================

export interface MatriculaFiltros {
    uid?: string;                   // Filtrar por usuario
    cid?: string;                   // Filtrar por curso
    rol?: MatriculaRol;             // Filtrar por rol
    activo?: boolean;               // Solo activas o inactivas
}

export interface MatriculaQuery extends MatriculaFiltros {
    page?: number;
    limit?: number;
}

// ==========================================
// 📊 TIPOS PARA RESPUESTAS DE API
// ==========================================

export interface MatriculaResponse {
    ok: boolean;
    matricula?: Matricula;
    message?: string;
    error?: string;
}

export interface MatriculasResponse {
    ok: boolean;
    matriculas: Matricula[];
    total?: number;
    message?: string;
    error?: string;
}

// ==========================================
// 🎯 TIPOS EXTENDIDOS CON RELACIONES
// ==========================================

// Matrícula con datos del usuario
export interface MatriculaConUsuario extends Matricula {
    usuario: {
        uid: string;
        nombre: string;
        apellido: string;
        email: string;
        avatar?: string;
    };
}

// Matrícula con datos del curso
export interface MatriculaConCurso extends Matricula {
    curso: {
        cid: string;
        nombre: string;
        sigla: string;
        categoria: string;
        semestre: string;
    };
}

// Matrícula completa (usuario + curso)
export interface MatriculaCompleta extends Matricula {
    usuario: {
        uid: string;
        nombre: string;
        apellido: string;
        email: string;
        avatar?: string;
    };
    curso: {
        cid: string;
        nombre: string;
        sigla: string;
        categoria: string;
        semestre: string;
    };
}

// ==========================================
// 🛡️ TIPOS DE PERMISOS
// ==========================================

export interface PermisosMatricula {
    puedeMatricularse: boolean;
    puedeMatricularOtros: boolean;
    puedeDesmatricular: boolean;
    puedeCambiarRol: boolean;
    puedeVerMatriculas: boolean;
}

// ==========================================
// 📋 CONSTANTES
// ==========================================

export const ROLES_MATRICULA: MatriculaRol[] = [
    'estudiante',
    'ayudante',
    'profesor',
    'profesor_editor'
];

export const ROLES_MATRICULA_LABELS: Record<MatriculaRol, string> = {
    'estudiante': 'Estudiante',
    'ayudante': 'Ayudante',
    'profesor': 'Profesor',
    'profesor_editor': 'Profesor Editor'
};

// ==========================================
// 🛡️ TYPE GUARDS
// ==========================================

export function isMatriculaRol(value: unknown): value is MatriculaRol {
    return typeof value === 'string' && ROLES_MATRICULA.includes(value as MatriculaRol);
}

export function isMatricula(obj: unknown): obj is Matricula {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'mid' in obj &&
        'uid' in obj &&
        'cid' in obj &&
        'rol' in obj &&
        typeof (obj as Record<string, unknown>).mid === 'string' &&
        typeof (obj as Record<string, unknown>).uid === 'string' &&
        typeof (obj as Record<string, unknown>).cid === 'string' &&
        isMatriculaRol((obj as Record<string, unknown>).rol)
    );
}