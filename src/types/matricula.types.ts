// src/types/matricula.types.ts

export interface CursoInfo {
    cid: string;
    nombre: string;
    sigla: string;
    categoria: string;
    semestre: string;
    año: number;
    descripcion: string;
    activo: boolean;
}

export interface GrupoInfo {
    gid: string;
    numero: number;
    nombre: string;
}

export interface MatriculaInfo {
    mid: string;
    uid: string;
    cid: string;
    gid: string;
    rol: 'estudiante' | 'ayudante' | 'profesor' | 'profesor_editor';
    activo: boolean;
    fechaMatricula: string | Date;
    fechaBaja?: string | Date | null;
    matriculadoPor?: string;
    notas?: string;
}

// Estructura completa de un curso con matrícula
export interface CursoConMatricula {
    curso: CursoInfo;
    grupo?: GrupoInfo;  // Opcional porque puede no tener grupo
    matricula: MatriculaInfo;
}

// Respuesta del endpoint /mis-cursos (ARRAY DIRECTO)
export interface MisCursosResponse {
    ok: boolean;
    cursos: CursoConMatricula[];  // ← Array directo, no categorizado
    total: number;
}