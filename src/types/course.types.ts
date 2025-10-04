// ==========================================
// 🎯 TIPOS DE CURSO - MATUC V4
// ==========================================

// Tipos base del schema
export type CursoCategoria =
    | 'Cálculo'
    | 'Álgebra'
    | 'Estadística'
    | 'Geometría'
    | 'Análisis'
    | 'Matemática Aplicada'
    | 'Otros';

export type CursoSemestre = `${number}-${1 | 2}`; // "2024-1" | "2024-2"

// ==========================================
// 📚 INTERFACE PRINCIPAL DEL CURSO
// ==========================================

export interface Curso {
    // === IDENTIFICACIÓN ===
    cid: string;                    // ID del curso (viene como cid del backend)
    sigla: string;                  // "MAT1610"
    nombre: string;                 // "Cálculo I"
    descripcion: string;            // Descripción completa

    // === ACADÉMICO ===
    categoria: CursoCategoria;      // Categoría del curso
    creditos: number;               // Créditos académicos (1-12)
    semestre: CursoSemestre;        // "2024-1", "2024-2"
    año: number;                    // 2024

    // === ESTADO ===
    activo: boolean;                // Si está activo
    publico: boolean;               // Si es público

    // === CONFIGURACIÓN ===
    configuracion: {
        notaAprobacion: number;       // 4.0, 3.0, etc.
        limitePlazas?: number;        // Límite de estudiantes (opcional)
        requiereAprobacion: boolean;  // Si requiere aprobación para matricularse
        codigoAcceso?: string;        // Código para auto-matricula (opcional)
    };

    // === METADATA ===
    fechaCreacion: string;          // ISO string
    fechaModificacion: string;      // ISO string
    creadoPor: string;              // ID del usuario creador

    // === ESTADÍSTICAS ===
    estadisticas: {
        totalEstudiantes: number;
        totalProfesores: number;
        totalModulos: number;
        ultimaActividad: string;      // ISO string
    };
}

// ==========================================
// 📝 TIPOS PARA FORMULARIOS
// ==========================================

// Para crear curso (campos requeridos)
export interface CrearCursoRequest {
    sigla: string;
    nombre: string;
    descripcion: string;
    categoria: CursoCategoria;
    creditos: number;
    semestre: CursoSemestre;
    año: number;
    configuracion?: {
        notaAprobacion?: number;
        limitePlazas?: number;
        requiereAprobacion?: boolean;
        codigoAcceso?: string;
    };
}

// Para actualizar curso (todos opcionales excepto cid)
export interface ActualizarCursoRequest {
    cid: string;
    sigla?: string;
    nombre?: string;
    descripcion?: string;
    categoria?: CursoCategoria;
    creditos?: number;
    semestre?: CursoSemestre;
    año?: number;
    activo?: boolean;
    publico?: boolean;
    configuracion?: {
        notaAprobacion?: number;
        limitePlazas?: number;
        requiereAprobacion?: boolean;
        codigoAcceso?: string;
    };
}

// ==========================================
// 🔍 TIPOS PARA CONSULTAS Y FILTROS
// ==========================================

export interface CursoFiltros {
    categoria?: CursoCategoria;
    activo?: boolean;
    publico?: boolean;
    semestre?: CursoSemestre;
    año?: number;
    search?: string;               // Búsqueda por texto
}

export interface CursoPaginacion {
    page: number;                  // Página actual (1-based)
    limit: number;                 // Elementos por página
    totalPages: number;            // Total de páginas
    totalItems: number;            // Total de elementos
    itemsPerPage: number;          // Elementos por página (confirmación)
}

export interface CursosQuery extends CursoFiltros {
    page?: number;
    limit?: number;
}

// ==========================================
// 📊 TIPOS PARA RESPUESTAS DE API
// ==========================================

// Respuesta estándar del backend
export interface ApiResponse<T> {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
}

// Respuesta para listar cursos
export interface CursosResponse {
    ok: boolean;
    cursos: Curso[];
    pagination: CursoPaginacion;
    message?: string;
}

// Respuesta para un curso específico
export interface CursoResponse {
    ok: boolean;
    curso: Curso;
    message?: string;
}

// Respuesta para estadísticas
export interface EstadisticasCursosResponse {
    ok: boolean;
    estadisticas: {
        general: {
            _id: null;
            totalCursos: number;
            cursosActivos: number;
            cursosPublicos: number;
            totalEstudiantes: number;
            totalProfesores: number;
            promedioCreditos: number;
        };
        porCategoria: {
            _id: CursoCategoria;
            totalCursos: number;
            cursosActivos: number;
            cursosPublicos: number;
            totalEstudiantes: number;
            promedioCreditos: number;
        }[];
    };
}

// ==========================================
// 🎯 TIPOS PARA STORE (ZUSTAND)
// ==========================================

export interface CursoStore {
    // === ESTADO ===
    cursos: Curso[];
    cursoActual: Curso | null;
    isLoading: boolean;
    error: string | null;

    // Paginación
    pagination: CursoPaginacion | null;
    filtros: CursoFiltros;

    // === ACCIONES ===
    // Obtener cursos
    obtenerCursos: (query?: CursosQuery) => Promise<void>;

    // Obtener curso específico
    obtenerCurso: (cid: string) => Promise<void>;

    // Crear curso
    crearCurso: (datos: CrearCursoRequest) => Promise<Curso | null>;

    // Actualizar curso
    actualizarCurso: (datos: ActualizarCursoRequest) => Promise<Curso | null>;

    // Eliminar curso
    eliminarCurso: (cid: string) => Promise<boolean>;

    // Cambiar filtros
    setFiltros: (filtros: Partial<CursoFiltros>) => void;

    // Limpiar estado
    clearError: () => void;
    clearCursoActual: () => void;

    // Estados de loading específicos
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// ==========================================
// 🔧 TIPOS PARA SERVER ACTIONS
// ==========================================

// Estado para useOptimistic en Server Actions
export interface CursoOptimisticState {
    cursos: Curso[];
    isOptimistic: boolean;
}

// Acciones optimistas
export type CursoOptimisticAction =
    | { type: 'ADD_CURSO'; curso: Curso }
    | { type: 'UPDATE_CURSO'; cid: string; datos: Partial<Curso> }
    | { type: 'DELETE_CURSO'; cid: string }
    | { type: 'RESET'; cursos: Curso[] };

// Resultado de Server Actions
export interface ServerActionResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// ==========================================
// 🌐 TIPOS PARA COMPONENTES
// ==========================================

// Props para componente de lista de cursos
export interface CursosListProps {
    cursos: Curso[];
    onCursoClick?: (curso: Curso) => void;
    isLoading?: boolean;
    showActions?: boolean;
    variant?: 'grid' | 'list' | 'card';
}

// Props para componente de curso individual
export interface CursoCardProps {
    curso: Curso;
    onClick?: () => void;
    showActions?: boolean;
    variant?: 'compact' | 'detailed' | 'minimal';
}

// Props para formulario de curso
export interface CursoFormProps {
    curso?: Curso;                 // Para edición (opcional)
    onSubmit: (datos: CrearCursoRequest | ActualizarCursoRequest) => Promise<void>;
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

// Props para filtros de cursos
export interface CursoFiltrosProps {
    filtros: CursoFiltros;
    onFiltrosChange: (filtros: Partial<CursoFiltros>) => void;
    onLimpiarFiltros: () => void;
    isLoading?: boolean;
}

// ==========================================
// 🎨 TIPOS PARA UI/UX
// ==========================================

// Estados de carga para UI
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Tipos de notificaciones
export interface CursoNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

// ==========================================
// 🔄 TIPOS UTILITARIOS
// ==========================================

// Para validaciones
export type CursoValidationErrors = Partial<Record<keyof CrearCursoRequest, string>>;

// Para mapear datos del backend al frontend
export type CursoBackendData = Omit<Curso, 'cid'> & { _id: string };

// Para resumen de curso (datos mínimos)
export interface CursoResumen {
    cid: string;
    sigla: string;
    nombre: string;
    categoria: CursoCategoria;
    creditos: number;
    activo: boolean;
    publico: boolean;
    totalEstudiantes: number;
}

// ==========================================
// 📋 TIPOS DE CONSTANTES
// ==========================================

// Constantes exportables
export const CURSO_CATEGORIAS: CursoCategoria[] = [
    'Cálculo',
    'Álgebra',
    'Estadística',
    'Geometría',
    'Análisis',
    'Matemática Aplicada',
    'Otros'
];

export const CREDITOS_OPCIONES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const AÑOS_DISPONIBLES = [2024, 2025, 2026, 2027] as const;

// ==========================================
// 🛡️ TYPE GUARDS
// ==========================================

// Validar si es una categoría válida
export function isCursoCategoria(value: unknown): value is CursoCategoria {
    return typeof value === 'string' && CURSO_CATEGORIAS.includes(value as CursoCategoria);
}

// Validar si es un semestre válido
export function isCursoSemestre(value: unknown): value is CursoSemestre {
    return typeof value === 'string' && /^20[0-9]{2}-[12]$/.test(value);
}

// Validar si un objeto es un curso válido
export function isCurso(obj: unknown): obj is Curso {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'cid' in obj &&
        'sigla' in obj &&
        'nombre' in obj &&
        'categoria' in obj &&
        'creditos' in obj &&
        typeof (obj as Record<string, unknown>).cid === 'string' &&
        typeof (obj as Record<string, unknown>).sigla === 'string' &&
        typeof (obj as Record<string, unknown>).nombre === 'string' &&
        isCursoCategoria((obj as Record<string, unknown>).categoria) &&
        typeof (obj as Record<string, unknown>).creditos === 'number'
    );
}