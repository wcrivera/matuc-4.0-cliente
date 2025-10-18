// src/types/chapter.types.ts
// ==========================================
// 📚 TIPOS DEL SISTEMA DE CAPÍTULOS - MATUC v4
// ==========================================

// ==========================================
// 🎯 ENUMS Y TIPOS BASE
// ==========================================

/**
 * Tipos de contenido disponibles
 */
export type TipoContenido =
    | 'teoria'
    | 'ejemplo'
    | 'ejercicio'
    | 'video'
    | 'latex'
    | 'simulacion'

/**
 * Tipos de tema según su naturaleza
 */
export type TipoTema = 'teorico' | 'practico' | 'evaluativo' | 'mixto'

/**
 * Estados de habilitación de contenido
 */
export type EstadoHabilitacion = 'habilitado' | 'deshabilitado' | 'programado'

/**
 * Estados de progreso individual
 */
export type EstadoProgreso = 'no_iniciado' | 'en_progreso' | 'completado'

// ==========================================
// 📖 CONTENIDO
// ==========================================

/**
 * Habilitación de contenido por grupo
 */
export interface HabilitacionGrupo {
    grupoId: string
    habilitado: boolean
    fechaHabilitacion?: string
    fechaDeshabilitacion?: string
    habilitadoPor: string
    notas?: string
}

/**
 * Contenido individual (unidad mínima de aprendizaje)
 */
export interface Contenido {
    id: string
    titulo: string
    tipo: TipoContenido
    contenido: string // HTML, LaTeX, URL del video, etc.
    orden: number

    // Configuración
    visible: boolean
    obligatorio: boolean
    completable: boolean
    duracionEstimadaMinutos?: number

    // Control por grupo (profesores)
    habilitacionPorGrupo: HabilitacionGrupo[]

    // Metadata
    createdAt: string
    updatedAt: string
}

/**
 * Contenido filtrado según permisos del usuario
 */
export interface ContenidoFiltrado extends Omit<Contenido, 'habilitacionPorGrupo'> {
    // Estado para el usuario actual
    habilitado: boolean
    completado?: boolean // Solo para estudiantes
    fechaCompletado?: string
}

// ==========================================
// 📝 TEMAS
// ==========================================

/**
 * Tema (agrupación de contenidos)
 */
export interface Tema {
    id: string
    titulo: string
    descripcion: string
    orden: number
    tipo: TipoTema

    // Configuración
    visible: boolean
    estimacionMinutos: number

    // Contenidos del tema
    contenidos: Contenido[]

    // Metadata
    createdAt: string
    updatedAt: string
}

/**
 * Tema filtrado con estadísticas
 */
export interface TemaFiltrado extends Omit<Tema, 'contenidos'> {
    contenidos: ContenidoFiltrado[]

    // Estadísticas calculadas
    contenidosTotales: number
    contenidosHabilitados: number
    contenidosCompletados?: number // Solo para estudiantes
    porcentajeProgreso?: number
}

// ==========================================
// 📚 CAPÍTULOS
// ==========================================

/**
 * Capítulo (agrupación de temas)
 */
export interface Capitulo {
    id: string
    titulo: string
    descripcion: string
    orden: number

    // Configuración
    visible: boolean
    fechaPublicacion?: string
    objetivos: string[]

    // Relaciones
    cursoId: string
    temas: Tema[]

    // Metadata
    createdAt: string
    updatedAt: string
}

/**
 * Capítulo filtrado con estadísticas completas
 */
export interface CapituloFiltrado extends Omit<Capitulo, 'temas'> {
    temas: TemaFiltrado[]

    // Estadísticas calculadas
    temasTotales: number
    temasVisibles: number
    contenidosTotales: number
    contenidosHabilitados: number
    contenidosCompletados?: number // Solo para estudiantes
    porcentajeProgreso?: number
    duracionTotalMinutos: number
}

// ==========================================
// 🎓 EJERCICIOS DE AYUDANTÍA
// ==========================================

/**
 * Ejercicio de ayudantía (práctica guiada)
 */
export interface EjercicioAyudantia {
    id: string
    titulo: string
    enunciado: string // Texto + LaTeX
    solucion: string // Paso a paso con LaTeX

    // Media opcional
    videoUrl?: string
    imagenUrl?: string

    // Configuración
    orden: number
    dificultad: 'facil' | 'medio' | 'dificil'
    duracionEstimadaMinutos: number
    tags: string[]

    // Relaciones
    capituloId: string
    temaRelacionado?: string

    // Habilitación
    habilitacionPorGrupo: HabilitacionGrupo[]

    // Metadata
    createdAt: string
    updatedAt: string
}

/**
 * Ejercicio de ayudantía filtrado
 */
export interface EjercicioAyudantiaFiltrado extends Omit<EjercicioAyudantia, 'habilitacionPorGrupo'> {
    habilitado: boolean
    intentos?: number // Cuántas veces lo ha abierto el estudiante
    tiempoInvertido?: number // Minutos invertidos
}

// ==========================================
// ✅ EJERCICIOS DE EVALUACIÓN
// ==========================================

/**
 * Alternativa de pregunta múltiple selección
 */
export interface Alternativa {
    id: string
    texto: string // Puede contener LaTeX
    esCorrecta: boolean
    explicacion?: string
    orden: number
}

/**
 * Pregunta de evaluación
 */
export interface PreguntaEvaluacion {
    id: string
    enunciado: string // LaTeX permitido
    tipo: 'multiple_choice' | 'verdadero_falso' | 'desarrollo'
    alternativas: Alternativa[]

    // Configuración
    puntaje: number
    orden: number
    obligatoria: boolean

    // Hints opcionales
    ayuda?: string
    tiempoSugeridoSegundos?: number

    // Metadata
    temaRelacionado?: string
}

/**
 * Ejercicio de evaluación (autoevaluación o evaluado)
 */
export interface EjercicioEvaluacion {
    id: string
    titulo: string
    descripcion: string
    tipo: 'autoevaluacion' | 'evaluado'

    // Configuración
    duracionMinutos?: number
    intentosPermitidos: number
    mostrarSolucion: boolean
    notaAprobacion?: number

    // Preguntas
    preguntas: PreguntaEvaluacion[]

    // Configuración de visualización
    ordenAleatorio: boolean
    alternativasAleatorias: boolean

    // Relaciones
    capituloId: string

    // Habilitación
    habilitacionPorGrupo: HabilitacionGrupo[]
    fechaInicio?: string
    fechaTermino?: string

    // Metadata
    createdAt: string
    updatedAt: string
}

/**
 * Respuesta de estudiante a pregunta
 */
export interface RespuestaEstudiante {
    preguntaId: string
    alternativaSeleccionada: string
    esCorrecta: boolean
    tiempoRespuestaSegundos: number
    timestamp: string
}

/**
 * Intento de evaluación del estudiante
 */
export interface IntentoEvaluacion {
    id: string
    ejercicioId: string
    estudianteId: string
    numeroIntento: number

    // Respuestas
    respuestas: RespuestaEstudiante[]

    // Resultados
    puntajeObtenido: number
    puntajeTotal: number
    porcentaje: number
    nota?: number
    aprobado: boolean

    // Tiempos
    fechaInicio: string
    fechaTermino?: string
    duracionSegundos: number

    // Estado
    completado: boolean
}

/**
 * Ejercicio de evaluación con estado del estudiante
 */
export interface EjercicioEvaluacionEstudiante extends Omit<EjercicioEvaluacion, 'habilitacionPorGrupo'> {
    habilitado: boolean
    intentosRealizados: number
    intentosRestantes: number
    mejorIntento?: IntentoEvaluacion
    ultimoIntento?: IntentoEvaluacion
    promedioIntentos?: number
}

// ==========================================
// 📊 PROGRESO Y ESTADÍSTICAS
// ==========================================

/**
 * Progreso de un estudiante en un contenido
 */
export interface ProgresoContenido {
    contenidoId: string
    completado: boolean
    fechaCompletado?: string
    tiempoInvertidoMinutos: number
    vistas: number
}

/**
 * Progreso de un estudiante en un tema
 */
export interface ProgresoTema {
    temaId: string
    contenidosCompletados: number
    contenidosTotales: number
    porcentajeProgreso: number
    tiempoTotalMinutos: number
}

/**
 * Progreso de un estudiante en un capítulo
 */
export interface ProgresoCapitulo {
    capituloId: string
    temasCompletados: number
    temasTotales: number
    contenidosCompletados: number
    contenidosTotales: number
    porcentajeProgreso: number
    tiempoTotalMinutos: number
    ultimaVisita: string
}

/**
 * Progreso completo de un estudiante en el curso
 */
export interface ProgresoCurso {
    cursoId: string
    estudianteId: string
    capitulosProgreso: ProgresoCapitulo[]
    temasProgreso: ProgresoTema[]
    contenidosProgreso: ProgresoContenido[]

    // Resumen global
    porcentajeGlobal: number
    tiempoTotalInvertido: number
    ultimaActividad: string
}

// ==========================================
// 🔐 PERMISOS Y VISTA CONTEXTUAL
// ==========================================

/**
 * Permisos del usuario actual sobre el capítulo
 */
export interface PermisosCapitulo {
    puedeVer: boolean
    puedeEditar: boolean
    puedeEliminar: boolean
    puedeHabilitarContenido: boolean
    puedeVerEstadisticas: boolean
    puedeCrearContenido: boolean
    rol: 'estudiante' | 'ayudante' | 'profesor' | 'profesor_editor' | 'administrador'
}

/**
 * Vista completa del capítulo con contexto del usuario
 */
export interface CapituloVistaCompleta {
    capitulo: CapituloFiltrado
    ejerciciosAyudantia: EjercicioAyudantiaFiltrado[]
    ejerciciosEvaluacion: EjercicioEvaluacionEstudiante[]
    permisos: PermisosCapitulo
    progreso?: ProgresoCapitulo
}

// ==========================================
// 📱 PROPS PARA COMPONENTES UI
// ==========================================

/**
 * Props para componente de capítulo
 */
export interface ChapterPageProps {
    capituloId: string
    cursoId: string
}

/**
 * Props para tabs del capítulo
 */
export interface ChapterTabsProps {
    activeTab: 'clase' | 'ayudantia' | 'evaluacion'
    onTabChange: (tab: 'clase' | 'ayudantia' | 'evaluacion') => void
    counts: {
        temas: number
        ejerciciosAyudantia: number
        ejerciciosEvaluacion: number
    }
}

/**
 * Props para tab de clase
 */
export interface ClassTabProps {
    temas: TemaFiltrado[]
    permisos: PermisosCapitulo
    onContenidoClick: (contenido: ContenidoFiltrado) => void
    completedContentIds?: string[]
}

/**
 * Props para tab de ayudantía
 */
export interface WorkshopTabProps {
    ejercicios: EjercicioAyudantiaFiltrado[]
    permisos: PermisosCapitulo
    onEjercicioClick: (ejercicio: EjercicioAyudantiaFiltrado) => void
}

/**
 * Props para tab de evaluación
 */
export interface EvaluationTabProps {
    ejercicios: EjercicioEvaluacionEstudiante[]
    permisos: PermisosCapitulo
    onEjercicioClick: (ejercicio: EjercicioEvaluacionEstudiante) => void
    onIniciarEvaluacion: (ejercicioId: string) => void
}

// ==========================================
// 🔄 REQUESTS Y RESPONSES API
// ==========================================

/**
 * Request para obtener capítulo completo
 */
export interface GetCapituloRequest {
    capituloId: string
    cursoId: string
    grupoId?: string // Si el usuario es estudiante
}

/**
 * Response del backend para capítulo
 */
export interface GetCapituloResponse {
    ok: boolean
    data: CapituloVistaCompleta
    message?: string
}

/**
 * Request para marcar contenido como completado
 */
export interface MarcarCompletadoRequest {
    contenidoId: string
    completado: boolean
    tiempoInvertidoMinutos?: number
}

/**
 * Request para habilitar/deshabilitar contenido
 */
export interface ToggleHabilitacionRequest {
    contenidoId: string
    grupoId: string
    habilitado: boolean
    fechaHabilitacion?: string
    fechaDeshabilitacion?: string
    notas?: string
}

/**
 * Request para iniciar evaluación
 */
export interface IniciarEvaluacionRequest {
    ejercicioId: string
    estudianteId: string
}

/**
 * Request para enviar respuestas de evaluación
 */
export interface EnviarRespuestasRequest {
    intentoId: string
    respuestas: RespuestaEstudiante[]
}

/**
 * Response para resultado de evaluación
 */
export interface ResultadoEvaluacionResponse {
    ok: boolean
    intento: IntentoEvaluacion
    retroalimentacion: {
        preguntaId: string
        esCorrecta: boolean
        explicacion?: string
    }[]
}