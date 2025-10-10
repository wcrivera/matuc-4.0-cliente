// src/types/grupo.types.ts
// ==========================================
// 🎯 TIPOS DE DATOS PARA GRUPOS
// ==========================================

// ==========================================
// 📊 INTERFACE PRINCIPAL: GRUPO
// ==========================================

export interface Grupo {
    gid: string;                    // ID del grupo
    curso: string;                  // ID del curso (referencia)
    nombre: string;                 // Nombre del grupo (ej: "Grupo 1", "Sección A")
    descripcion?: string;           // Descripción opcional
    activo: boolean;                // Si el grupo está activo
    configuracion: {
        permitirAutoEnroll: boolean;    // Si estudiantes pueden auto-inscribirse
        capacidadMaxima?: number;       // Capacidad máxima de estudiantes
    };
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// 📋 INTERFACE: GRUPO CON DATOS DEL CURSO
// ==========================================

export interface GrupoConCurso extends Omit<Grupo, 'curso'> {
    curso: {
        cid: string;
        nombre: string;
        sigla: string;
        categoria: string;
        semestre: string;
    };
}

// ==========================================
// 👥 INTERFACE: GRUPO CON ESTADÍSTICAS
// ==========================================

export interface GrupoConEstadisticas extends Grupo {
    estadisticas: {
        totalEstudiantes: number;
        totalProfesores: number;
        totalAyudantes: number;
        capacidadUsada: number;         // Porcentaje de capacidad usada
    };
}

// ==========================================
// 📝 TIPOS PARA REQUESTS (CREATE/UPDATE)
// ==========================================

export interface CrearGrupoRequest {
    curso: string;                      // ID del curso (requerido)
    nombre: string;                     // Nombre del grupo (requerido)
    descripcion?: string;               // Descripción opcional
    configuracion?: {
        permitirAutoEnroll?: boolean;   // Default: false
        capacidadMaxima?: number;       // Default: sin límite
    };
}

export interface ActualizarGrupoRequest {
    nombre?: string;                    // Actualizar nombre
    descripcion?: string;               // Actualizar descripción
    activo?: boolean;                   // Activar/desactivar grupo
    configuracion?: {
        permitirAutoEnroll?: boolean;
        capacidadMaxima?: number;
    };
}

// ==========================================
// 🔍 TIPOS PARA FILTROS Y QUERIES
// ==========================================

export interface GrupoFiltros {
    curso?: string;                     // Filtrar por curso
    activo?: boolean;                   // Solo activos o inactivos
    permitirAutoEnroll?: boolean;       // Solo grupos con auto-enroll
    nombre?: string;                    // Buscar por nombre
}

export interface GrupoQuery extends GrupoFiltros {
    page?: number;
    limit?: number;
}

// ==========================================
// 📊 TIPOS PARA RESPUESTAS DE API
// ==========================================

export interface GrupoResponse {
    ok: boolean;
    grupo?: Grupo;
    message?: string;
    error?: string;
}

export interface GruposResponse {
    ok: boolean;
    grupos: Grupo[];
    total?: number;
    message?: string;
    error?: string;
}

export interface GruposConEstadisticasResponse {
    ok: boolean;
    grupos: GrupoConEstadisticas[];
    total?: number;
    message?: string;
}

// ==========================================
// 🎯 TIPOS PARA ASIGNACIÓN DE ESTUDIANTES
// ==========================================

export interface AsignarEstudianteGrupoRequest {
    mid: string;                        // ID de la matrícula
    gid: string;                        // ID del grupo
}

export interface MoverEstudianteGrupoRequest {
    mid: string;                        // ID de la matrícula
    grupoOrigenId: string;              // Grupo actual
    grupoDestinoId: string;             // Grupo nuevo
}

export interface RemoverEstudianteGrupoRequest {
    mid: string;                        // ID de la matrícula
}

// ==========================================
// 📈 TIPOS PARA ESTADÍSTICAS DE GRUPOS
// ==========================================

export interface EstadisticasGrupo {
    gid: string;
    nombre: string;
    totalEstudiantes: number;
    totalProfesores: number;
    totalAyudantes: number;
    capacidadMaxima?: number;
    capacidadUsada: number;             // Porcentaje
    distribucionRoles: {
        estudiante: number;
        ayudante: number;
        profesor: number;
        profesor_editor: number;
    };
}

export interface EstadisticasGruposCurso {
    cursoId: string;
    cursoNombre: string;
    totalGrupos: number;
    gruposActivos: number;
    totalEstudiantesMatriculados: number;
    estudiantesSinGrupo: number;
    grupos: EstadisticasGrupo[];
}

// ==========================================
// 🔄 TIPOS PARA STORE (SI SE USA ZUSTAND)
// ==========================================

export interface GrupoStore {
    // Estado
    grupos: Grupo[];
    grupoActual: Grupo | null;
    gruposCurso: Grupo[];               // Grupos de un curso específico
    isLoading: boolean;
    error: string | null;

    // Acciones - CRUD
    obtenerGruposCurso: (cursoId: string) => Promise<void>;
    obtenerGrupo: (gid: string) => Promise<void>;
    crearGrupo: (data: CrearGrupoRequest) => Promise<boolean>;
    actualizarGrupo: (gid: string, data: ActualizarGrupoRequest) => Promise<boolean>;
    eliminarGrupo: (gid: string) => Promise<boolean>;

    // Acciones - Asignación de estudiantes
    asignarEstudiante: (mid: string, gid: string) => Promise<boolean>;
    moverEstudiante: (mid: string, grupoOrigenId: string, grupoDestinoId: string) => Promise<boolean>;
    removerEstudiante: (mid: string) => Promise<boolean>;

    // Utilidades
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    clearGrupoActual: () => void;
}

// ==========================================
// 🎨 TIPOS AUXILIARES
// ==========================================

// Estado de carga de un grupo
export type GrupoLoadingState = 'idle' | 'loading' | 'success' | 'error';

// Acción permitida sobre un grupo
export type GrupoAccion =
    | 'crear'
    | 'editar'
    | 'eliminar'
    | 'asignar_estudiantes'
    | 'ver_estadisticas';

// Capacidad de un grupo
export interface GrupoCapacidad {
    actual: number;
    maxima?: number;
    porcentaje: number;
    disponible: number | 'ilimitado';
}