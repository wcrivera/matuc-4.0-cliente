// src/types/course-content.types.ts
// ==========================================
// 📚 TIPOS DE CONTENIDO EDUCATIVO - MATUC v4.0
// ==========================================

// ==========================================
// 🎯 ENUMS Y TIPOS BASE
// ==========================================

export type TipoTema = 'teorico' | 'practico' | 'evaluativo' | 'mixto'

export type TipoContenido =
    | 'teoria'
    | 'ejemplo'
    | 'ejercicio'
    | 'video'
    | 'latex'
    | 'simulacion'

export type DiaSemana =
    | 'lunes'
    | 'martes'
    | 'miércoles'
    | 'jueves'
    | 'viernes'
    | 'sábado'

export type ModalidadClase = 'presencial' | 'virtual' | 'hibrida'

export type RolAcademico = 'profesor' | 'profesor_editor'

export type TipoEjercicio = 'individual' | 'grupal' | 'evaluado'

export type TipoEvaluacion = 'parcial' | 'final' | 'tarea' | 'proyecto'

// ==========================================
// 📖 ESTRUCTURA DE CONTENIDO
// ==========================================

/**
 * Habilitación de contenido por grupo
 * Permite al profesor controlar qué grupos ven qué contenido
 */
export interface HabilitacionGrupo {
    grupoId: string
    habilitado: boolean
    fechaHabilitacion?: string
    fechaDeshabilitacion?: string
    habilitadoPor: string // UID del profesor
    notas?: string
}

/**
 * Contenido individual (unidad mínima de aprendizaje)
 * Puede ser una diapositiva, video, ejercicio, etc.
 */
export interface Contenido {
    id: string
    titulo: string
    tipo: TipoContenido
    contenido: string // HTML, LaTeX, URL, etc.
    orden: number

    // Visibilidad y obligatoriedad
    visible: boolean // Si existe y está disponible globalmente
    obligatorio: boolean
    completable: boolean // Si se puede marcar como completado

    // Control por grupo
    habilitacionPorGrupo: HabilitacionGrupo[]
}

/**
 * Tema (agrupación de contenidos relacionados)
 */
export interface Tema {
    id: string
    titulo: string
    descripcion: string
    orden: number
    visible: boolean
    tipo: TipoTema
    estimacionMinutos: number
    contenidos: Contenido[]
}

/**
 * Capítulo (agrupación de temas)
 */
export interface Capitulo {
    id: string
    titulo: string
    descripcion: string
    orden: number
    visible: boolean
    fechaPublicacion?: string
    objetivos: string[]
    temas: Tema[]
}

// ==========================================
// 👥 PERSONAL ACADÉMICO Y GRUPOS
// ==========================================

/**
 * Horario de clase
 */
export interface Horario {
    dia: DiaSemana
    horaInicio: string // "10:00"
    horaFin: string // "11:30"
    sala: string
    tipo: 'catedra' | 'ayudantia' | 'laboratorio'
    modalidad: ModalidadClase
}

/**
 * Profesor asignado a un grupo
 */
export interface ProfesorGrupo {
    uid: string
    nombre: string
    apellido: string
    rol: RolAcademico
    principal: boolean // Si es el profesor principal
}

/**
 * Ayudante asignado a un grupo
 */
export interface AyudanteGrupo {
    uid: string
    nombre: string
    apellido: string
}

/**
 * Estudiante en un grupo
 */
export interface EstudianteGrupo {
    uid: string
    fechaMatricula: string
    activo: boolean
    progreso: number // 0-100
}

/**
 * Configuración específica de un grupo
 */
export interface ConfiguracionGrupo {
    // Habilitaciones personalizadas por contenido
    habilitacionesPorContenido: {
        contenidoId: string
        habilitado: boolean
        fechaHabilitacion?: string
        fechaDeshabilitacion?: string
        habilitadoPor: string
    }[]

    // Horarios del grupo
    horarios: Horario[]

    // Evaluaciones personalizadas
    evaluacionesPersonalizadas: {
        evaluacionId: string
        fechaModificada?: string
        pesoModificado?: number
        visible: boolean
    }[]
}

/**
 * Grupo completo del curso
 */
export interface GrupoCurso {
    id: string
    numero: number
    nombre?: string

    // Personal académico
    profesores: ProfesorGrupo[]
    ayudantes: AyudanteGrupo[]
    estudiantes: EstudianteGrupo[]

    // Configuración
    configuracion: ConfiguracionGrupo
    capacidadMaxima: number
    fechaCreacion: string
    activo: boolean
}

// ==========================================
// 📝 EJERCICIOS Y EVALUACIONES
// ==========================================

/**
 * Ejercicio del curso
 */
export interface Ejercicio {
    id: string
    titulo: string
    tipo: TipoEjercicio
    capitulo: string // ID del capítulo
    tema?: string // ID del tema (opcional)
    fechaApertura: string
    fechaCierre?: string
    intentosPermitidos: number
    visible: boolean
    calificado: boolean
}

/**
 * Evaluación del curso
 */
export interface Evaluacion {
    id: string
    titulo: string
    tipo: TipoEvaluacion
    fecha: string
    peso: number // % de la nota final
    publicada: boolean
}

// ==========================================
// 🎓 CURSO COMPLETO CON CONTENIDO
// ==========================================

/**
 * Curso con toda su estructura de contenido
 * Extiende la interface básica de Curso
 */
export interface CursoConContenido {
    // Campos básicos (del course.types.ts)
    cid: string
    sigla: string
    nombre: string
    descripcion: string
    categoria: string
    nivel: string
    creditos: number
    semestre: string
    año: number
    activo: boolean
    visible: boolean
    publicado: boolean
    destacado: boolean

    // Grupos con personal académico
    grupos: GrupoCurso[]

    // Estructura de contenido
    capitulos: Capitulo[]

    // Ejercicios y evaluaciones
    ejercicios: Ejercicio[]
    evaluaciones: Evaluacion[]

    // Configuración académica
    configuracion: {
        notaAprobacion: number
        limitePlazas?: number
        requiereAprobacion: boolean
        codigoAcceso?: string
    }

    // Estadísticas
    estadisticas: {
        totalEstudiantes: number
        totalProfesores: number
        totalCapitulos: number
        ultimaActividad: string
    }
}

// ==========================================
// 📊 PROGRESO Y ESTADÍSTICAS DE ESTUDIANTE
// ==========================================

/**
 * Progreso de un estudiante en un contenido
 */
export interface ProgresoContenido {
    contenidoId: string
    completado: boolean
    fechaCompletado?: string
    tiempoEstudio: number // minutos
}

/**
 * Progreso de un estudiante en un tema
 */
export interface ProgresoTema {
    temaId: string
    contenidos: ProgresoContenido[]
    porcentajeCompletado: number
    tiempoTotal: number
}

/**
 * Progreso de un estudiante en un capítulo
 */
export interface ProgresoCapitulo {
    capituloId: string
    temas: ProgresoTema[]
    porcentajeCompletado: number
    tiempoTotal: number
}

/**
 * Progreso completo de un estudiante en el curso
 */
export interface ProgresoCurso {
    uid: string
    cid: string
    capitulos: ProgresoCapitulo[]
    porcentajeGlobal: number
    tiempoTotalEstudio: number
    ultimaActividad: string
    contenidosCompletados: number
    contenidosTotales: number
}

// ==========================================
// 🎯 TIPOS PARA VISTAS FILTRADAS
// ==========================================

/**
 * Contenido filtrado según permisos del usuario
 * Solo muestra lo que el usuario tiene permitido ver
 */
export interface ContenidoFiltrado extends Omit<Contenido, 'habilitacionPorGrupo'> {
    habilitado: boolean // Si está habilitado para MI grupo
    puedeEditar: boolean // Si el usuario puede editar
    puedeHabilitar: boolean // Si el usuario puede habilitar/deshabilitar
}

/**
 * Tema filtrado según permisos
 */
export interface TemaFiltrado extends Omit<Tema, 'contenidos'> {
    contenidos: ContenidoFiltrado[]
    contenidosVisibles: number
    contenidosHabilitados: number
}

/**
 * Capítulo filtrado según permisos
 */
export interface CapituloFiltrado extends Omit<Capitulo, 'temas'> {
    temas: TemaFiltrado[]
    temasVisibles: number
    contenidosTotales: number
    contenidosHabilitados: number
}

/**
 * Curso completo con contenido filtrado según rol del usuario
 */
export interface CursoFiltrado {
    curso: CursoConContenido
    capitulos: CapituloFiltrado[]
    miGrupo?: GrupoCurso // Si soy estudiante/ayudante
    misPermisos: {
        puedeEditarContenido: boolean
        puedeHabilitarContenido: boolean
        puedeVerEstadisticas: boolean
        puedeGestionarGrupos: boolean
    }
    progreso?: ProgresoCurso // Si soy estudiante
}

// ==========================================
// 🔧 TIPOS PARA ACCIONES
// ==========================================

/**
 * Request para crear/actualizar capítulo
 */
export interface CapituloRequest {
    titulo: string
    descripcion: string
    orden: number
    visible: boolean
    objetivos: string[]
}

/**
 * Request para crear/actualizar tema
 */
export interface TemaRequest {
    titulo: string
    descripcion: string
    orden: number
    visible: boolean
    tipo: TipoTema
    estimacionMinutos: number
}

/**
 * Request para crear/actualizar contenido
 */
export interface ContenidoRequest {
    titulo: string
    tipo: TipoContenido
    contenido: string
    orden: number
    visible: boolean
    obligatorio: boolean
    completable: boolean
}

/**
 * Request para habilitar/deshabilitar contenido para un grupo
 */
export interface HabilitarContenidoRequest {
    contenidoId: string
    grupoId: string
    habilitado: boolean
    notas?: string
}

// ==========================================
// 📱 TIPOS PARA COMPONENTES UI
// ==========================================

/**
 * Props para componente de capítulo expandible
 */
export interface ChapterCardProps {
    capitulo: CapituloFiltrado
    expanded: boolean
    onToggle: () => void
    puedeEditar: boolean
    puedeHabilitar: boolean
    onEditarCapitulo?: (capitulo: CapituloFiltrado) => void
    onEliminarCapitulo?: (capituloId: string) => void
}

/**
 * Props para lista de contenidos de un tema
 */
export interface ContentListProps {
    contenidos: ContenidoFiltrado[]
    puedeEditar: boolean
    puedeHabilitar: boolean
    onContenidoClick: (contenido: ContenidoFiltrado) => void
    onHabilitarContenido?: (contenidoId: string, habilitado: boolean) => void
}

/**
 * Props para indicador de progreso
 */
export interface ProgressIndicatorProps {
    progreso: ProgresoCapitulo | ProgresoTema
    variant: 'capitulo' | 'tema'
    showDetails?: boolean
}

// ==========================================
// 🎨 TIPOS PARA ESTADOS DE UI
// ==========================================

export type ContentLoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ContentUIState {
    expandedChapters: Set<string>
    expandedTopics: Set<string>
    selectedContent: string | null
    isLoading: boolean
    error: string | null
}

// ==========================================
// 🔍 TYPE GUARDS
// ==========================================

export function isCapitulo(obj: unknown): obj is Capitulo {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'titulo' in obj &&
        'temas' in obj &&
        Array.isArray((obj as Capitulo).temas)
    )
}

export function isTema(obj: unknown): obj is Tema {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'titulo' in obj &&
        'contenidos' in obj &&
        Array.isArray((obj as Tema).contenidos)
    )
}

export function isContenido(obj: unknown): obj is Contenido {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'titulo' in obj &&
        'tipo' in obj &&
        'contenido' in obj
    )
}

// ==========================================
// 📤 EXPORTS PRINCIPALES
// ==========================================

export type {
    // Re-exportar tipos principales para fácil importación
    Capitulo as Chapter,
    Tema as Topic,
    Contenido as Content,
    GrupoCurso as CourseGroup,
    CursoConContenido as CourseWithContent,
    CursoFiltrado as FilteredCourse
}