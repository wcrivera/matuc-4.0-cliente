// src/lib/hooks/useCourseContent.ts
// ==========================================
// 🎓 HOOK PARA CONTENIDO DE CURSO CON FILTRADO POR ROL
// ==========================================

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/lib/stores/auth.store'
import type {
    CursoConContenido,
    CapituloFiltrado,
    TemaFiltrado,
    ContenidoFiltrado,
    Capitulo,
    Tema,
    Contenido
} from '@/types/course-content.types'

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
// 🔧 TIPOS DEL HOOK
// ==========================================

interface CourseContentPermissions {
    puedeHabilitar: boolean      // Puede habilitar/deshabilitar contenido
    puedeEditar: boolean          // Puede editar contenido
    puedeVerTodo: boolean         // Puede ver contenido deshabilitado
    puedeVerEstadisticas: boolean // Puede ver estadísticas del curso
    puedeGestionarGrupos: boolean // Puede gestionar grupos
}

interface UseCourseContentReturn {
    // Datos
    curso: CursoConContenido | null
    capitulosFiltrados: CapituloFiltrado[]
    grupoUsuario: string | null

    // Permisos
    permisos: CourseContentPermissions

    // Estados
    isLoading: boolean
    isError: boolean
    error: Error | null

    // Acciones
    refetch: () => void
}

// ==========================================
// 🎯 HOOK PRINCIPAL
// ==========================================

export function useCourseContent(courseId: string): UseCourseContentReturn {
    const { user } = useAuth()

    // ==========================================
    // 📊 FETCH DEL CURSO CON REACT QUERY
    // ==========================================

    const {
        data: curso,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<CursoConContenido>({
        queryKey: ['course-content', courseId],
        queryFn: async () => {
            // TODO: Por ahora retornamos datos mock para visualizar
            // Descomentar cuando el endpoint esté listo:
            const response = await fetch(`${API_URL}/api/curso/${courseId}/contenido`, {
                headers: getAuthHeaders()
            })

            const data = await response.json()

            return data.curso

        },
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    })

    // ==========================================
    // 👤 DETERMINAR GRUPO DEL USUARIO
    // ==========================================

    const grupoUsuario = useMemo(() => {
        // TODO: Implementar cuando tengamos sistema de grupos
        // Por ahora retornamos null para que funcione la visualización
        return null
    }, [user, curso])

    // ==========================================
    // 🔐 CALCULAR PERMISOS SEGÚN ROL
    // ==========================================

    const permisos = useMemo<CourseContentPermissions>(() => {
        if (!user) {
            return {
                puedeHabilitar: false,
                puedeEditar: false,
                puedeVerTodo: false,
                puedeVerEstadisticas: false,
                puedeGestionarGrupos: false
            }
        }

        const role = user.role
        const isAdmin = user.admin

        return {
            // Habilitar contenido: Profesor, Profesor Editor, Admin
            puedeHabilitar: isAdmin || ['profesor', 'profesor_editor'].includes(role),

            // Editar contenido: Solo Profesor Editor y Admin
            puedeEditar: isAdmin || role === 'profesor_editor',

            // Ver todo (incluido deshabilitado): Todos excepto Estudiante
            puedeVerTodo: isAdmin || role !== 'estudiante',

            // Ver estadísticas: Profesor, Profesor Editor, Admin
            puedeVerEstadisticas: isAdmin || ['profesor', 'profesor_editor'].includes(role),

            // Gestionar grupos: Solo Admin
            puedeGestionarGrupos: isAdmin
        }
    }, [user])

    // ==========================================
    // 🔍 FILTRAR CONTENIDO SEGÚN ROL Y GRUPO
    // ==========================================

    const capitulosFiltrados = useMemo<CapituloFiltrado[]>(() => {
        if (!curso || !user) return []

        return curso.capitulos
            .filter(capitulo => {
                // Admin y no-estudiantes ven todos los capítulos
                if (permisos.puedeVerTodo) return true

                // Estudiantes solo ven capítulos visibles
                return capitulo.visible
            })
            .map(capitulo => filtrarCapitulo(
                capitulo,
                grupoUsuario,
                permisos.puedeVerTodo
            ))
    }, [curso, user, grupoUsuario, permisos.puedeVerTodo])

    // ==========================================
    // 📤 RETURN
    // ==========================================

    return {
        curso: curso ?? null,
        capitulosFiltrados,
        grupoUsuario,
        permisos,
        isLoading,
        isError,
        error: error as Error | null,
        refetch
    }
}

// ==========================================
// 🔧 FUNCIONES AUXILIARES DE FILTRADO
// ==========================================

/**
 * Filtra un capítulo según permisos y grupo del usuario
 */
function filtrarCapitulo(
    capitulo: Capitulo,
    grupoId: string | null,
    puedeVerTodo: boolean
): CapituloFiltrado {
    const temasFiltrados = capitulo.temas
        .filter(tema => {
            if (puedeVerTodo) return true
            return tema.visible
        })
        .map(tema => filtrarTema(tema, grupoId, puedeVerTodo))

    const temasVisibles = temasFiltrados.filter(t => t.visible).length
    const contenidosTotales = temasFiltrados.reduce(
        (acc, tema) => acc + tema.contenidos.length,
        0
    )
    const contenidosHabilitados = temasFiltrados.reduce(
        (acc, tema) => acc + tema.contenidos.filter(c => c.habilitado).length,
        0
    )

    return {
        ...capitulo,
        temas: temasFiltrados,
        temasVisibles,
        contenidosTotales,
        contenidosHabilitados
    }
}

/**
 * Filtra un tema según permisos y grupo del usuario
 */
function filtrarTema(
    tema: Tema,
    grupoId: string | null,
    puedeVerTodo: boolean
): TemaFiltrado {
    const contenidosFiltrados = tema.contenidos
        .map(contenido => filtrarContenido(contenido, grupoId, puedeVerTodo))
        .filter(contenido => {
            // Si puede ver todo, mostrar todos
            if (puedeVerTodo) return true

            // Si es estudiante, solo mostrar habilitados
            return contenido.habilitado && contenido.visible
        })

    const contenidosVisibles = contenidosFiltrados.filter(c => c.visible).length
    const contenidosHabilitados = contenidosFiltrados.filter(c => c.habilitado).length

    return {
        ...tema,
        contenidos: contenidosFiltrados,
        contenidosVisibles,
        contenidosHabilitados
    }
}

/**
 * Filtra un contenido individual
 * Determina si está habilitado para el grupo del usuario
 */
function filtrarContenido(
    contenido: Contenido,
    grupoId: string | null,
    puedeVerTodo: boolean
): ContenidoFiltrado {
    // Verificar si está habilitado para el grupo del usuario
    const habilitacion = grupoId
        ? contenido.habilitacionPorGrupo.find(h => h.grupoId === grupoId)
        : null

    const estaHabilitado = habilitacion?.habilitado ?? false

    // Determinar permisos
    const puedeEditar = puedeVerTodo // Solo no-estudiantes pueden editar
    const puedeHabilitar = puedeVerTodo // Solo no-estudiantes pueden habilitar

    return {
        id: contenido.id,
        titulo: contenido.titulo,
        tipo: contenido.tipo,
        contenido: contenido.contenido,
        orden: contenido.orden,
        visible: contenido.visible,
        obligatorio: contenido.obligatorio,
        completable: contenido.completable,
        habilitado: estaHabilitado,
        puedeEditar,
        puedeHabilitar
    }
}

// ==========================================
// 🎯 HOOK AUXILIAR: SOLO PERMISOS
// ==========================================

/**
 * Hook ligero que solo retorna los permisos del usuario
 * Útil para componentes que no necesitan el contenido completo
 */
export function useCoursePermissions(): CourseContentPermissions {
    const { user } = useAuth()

    return useMemo<CourseContentPermissions>(() => {
        if (!user) {
            return {
                puedeHabilitar: false,
                puedeEditar: false,
                puedeVerTodo: false,
                puedeVerEstadisticas: false,
                puedeGestionarGrupos: false
            }
        }

        const role = user.role
        const isAdmin = user.admin

        return {
            puedeHabilitar: isAdmin || ['profesor', 'profesor_editor'].includes(role),
            puedeEditar: isAdmin || role === 'profesor_editor',
            puedeVerTodo: isAdmin || role !== 'estudiante',
            puedeVerEstadisticas: isAdmin || ['profesor', 'profesor_editor'].includes(role),
            puedeGestionarGrupos: isAdmin
        }
    }, [user])
}

// ==========================================
// 🎨 DATOS MOCK TEMPORALES (PARA VISUALIZACIÓN)
// ==========================================

function getMockCourseData(courseId: string): CursoConContenido {
    return {
        cid: courseId,
        sigla: 'MAT1610',
        nombre: 'Cálculo I',
        descripcion: 'Introducción al cálculo diferencial e integral',
        categoria: 'Cálculo',
        nivel: 'Básico',
        creditos: 10,
        semestre: '2024-2',
        año: 2024,
        activo: true,
        visible: true,
        publicado: true,
        destacado: false,

        grupos: [],

        capitulos: [
            {
                id: 'cap1',
                titulo: 'Límites y Continuidad',
                descripcion: 'Introducción al concepto de límite y funciones continuas',
                orden: 1,
                visible: true,
                objetivos: [
                    'Comprender el concepto de límite',
                    'Calcular límites usando técnicas algebraicas',
                    'Identificar discontinuidades en funciones'
                ],
                temas: [
                    {
                        id: 'tema1',
                        titulo: 'Introducción a los Límites',
                        descripcion: 'Definición intuitiva y formal de límite',
                        orden: 1,
                        visible: true,
                        tipo: 'teorico',
                        estimacionMinutos: 45,
                        contenidos: [
                            {
                                id: 'cont1',
                                titulo: 'Definición de Límite',
                                tipo: 'teoria',
                                contenido: 'El límite de una función f(x) cuando x tiende a a...',
                                orden: 1,
                                visible: true,
                                obligatorio: true,
                                completable: true,
                                habilitacionPorGrupo: []
                            },
                            {
                                id: 'cont2',
                                titulo: 'Ejemplos Básicos',
                                tipo: 'ejemplo',
                                contenido: 'Calculemos el límite de f(x) = 2x + 1 cuando x → 3',
                                orden: 2,
                                visible: true,
                                obligatorio: false,
                                completable: true,
                                habilitacionPorGrupo: []
                            },
                            {
                                id: 'cont3',
                                titulo: 'Video: Límites Visualizados',
                                tipo: 'video',
                                contenido: 'https://youtube.com/watch?v=example',
                                orden: 3,
                                visible: true,
                                obligatorio: false,
                                completable: true,
                                habilitacionPorGrupo: []
                            }
                        ]
                    },
                    {
                        id: 'tema2',
                        titulo: 'Propiedades de los Límites',
                        descripcion: 'Teoremas y propiedades algebraicas',
                        orden: 2,
                        visible: true,
                        tipo: 'practico',
                        estimacionMinutos: 60,
                        contenidos: [
                            {
                                id: 'cont4',
                                titulo: 'Teorema del Límite de una Suma',
                                tipo: 'teoria',
                                contenido: 'El límite de una suma es la suma de los límites...',
                                orden: 1,
                                visible: true,
                                obligatorio: true,
                                completable: true,
                                habilitacionPorGrupo: []
                            },
                            {
                                id: 'cont5',
                                titulo: 'Ejercicios Guiados',
                                tipo: 'ejercicio',
                                contenido: 'Resuelve los siguientes límites aplicando las propiedades',
                                orden: 2,
                                visible: true,
                                obligatorio: true,
                                completable: true,
                                habilitacionPorGrupo: []
                            }
                        ]
                    }
                ]
            },
            {
                id: 'cap2',
                titulo: 'Derivadas',
                descripcion: 'Introducción al cálculo diferencial',
                orden: 2,
                visible: true,
                objetivos: [
                    'Comprender el concepto de derivada',
                    'Aplicar reglas de derivación',
                    'Resolver problemas de tasas de cambio'
                ],
                temas: [
                    {
                        id: 'tema3',
                        titulo: 'Definición de Derivada',
                        descripcion: 'Concepto geométrico y algebraico',
                        orden: 1,
                        visible: true,
                        tipo: 'teorico',
                        estimacionMinutos: 50,
                        contenidos: [
                            {
                                id: 'cont6',
                                titulo: 'La Derivada como Tasa de Cambio',
                                tipo: 'teoria',
                                contenido: 'La derivada representa la tasa instantánea de cambio...',
                                orden: 1,
                                visible: true,
                                obligatorio: true,
                                completable: true,
                                habilitacionPorGrupo: []
                            }
                        ]
                    }
                ]
            }
        ],

        ejercicios: [],
        evaluaciones: [],

        configuracion: {
            notaAprobacion: 4.0,
            limitePlazas: 50,
            requiereAprobacion: false
        },

        estadisticas: {
            totalEstudiantes: 45,
            totalProfesores: 2,
            totalCapitulos: 2,
            ultimaActividad: new Date().toISOString()
        }
    }
}


// // src/lib/hooks/useCourseContent.ts
// // ==========================================
// // 🎓 HOOK PARA CONTENIDO DE CURSO CON FILTRADO POR ROL
// // ==========================================

// import { useQuery } from '@tanstack/react-query'
// import { useMemo } from 'react'
// import { useAuth } from '@/lib/stores/auth.store'
// import type {
//     CursoConContenido,
//     CapituloFiltrado,
//     TemaFiltrado,
//     ContenidoFiltrado,
//     Capitulo,
//     Tema,
//     Contenido
// } from '@/types/course-content.types'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// // ==========================================
// // 🔧 TIPOS DEL HOOK
// // ==========================================

// interface CourseContentPermissions {
//     puedeHabilitar: boolean      // Puede habilitar/deshabilitar contenido
//     puedeEditar: boolean          // Puede editar contenido
//     puedeVerTodo: boolean         // Puede ver contenido deshabilitado
//     puedeVerEstadisticas: boolean // Puede ver estadísticas del curso
//     puedeGestionarGrupos: boolean // Puede gestionar grupos
// }

// interface UseCourseContentReturn {
//     // Datos
//     curso: CursoConContenido | null
//     capitulosFiltrados: CapituloFiltrado[]
//     grupoUsuario: string | null

//     // Permisos
//     permisos: CourseContentPermissions

//     // Estados
//     isLoading: boolean
//     isError: boolean
//     error: Error | null

//     // Acciones
//     refetch: () => void
// }

// // ==========================================
// // 🔧 UTILIDADES (mismo patrón que course.store.ts)
// // ==========================================

// const cookieUtils = {
//     get: (name: string): string | null => {
//         if (typeof document === 'undefined') return null;
//         const cookies = document.cookie.split(';').reduce((acc, cookie) => {
//             const [key, value] = cookie.trim().split('=');
//             acc[key] = value;
//             return acc;
//         }, {} as Record<string, string>);
//         return cookies[name] || null;
//     }
// };

// function getAuthHeaders(): HeadersInit {
//     const token = cookieUtils.get('matuc_token');
//     return {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` })
//     };
// }

// // ==========================================
// // 🎯 HOOK PRINCIPAL
// // ==========================================

// export function useCourseContent(courseId: string): UseCourseContentReturn {
//     const { user } = useAuth()

//     // ==========================================
//     // 📊 FETCH DEL CURSO CON REACT QUERY
//     // ==========================================

//     const {
//         data: curso,
//         isLoading,
//         isError,
//         error,
//         refetch
//     } = useQuery<CursoConContenido>({
//         queryKey: ['course-content', courseId],
//         queryFn: async () => {
//             const response = await fetch(`${API_URL}/api/curso/${courseId}`, {
//                 headers: getAuthHeaders()
//             })

//             console.log(response)

//             if (!response.ok) {
//                 throw new Error('Error al cargar el contenido del curso')
//             }

//             return response.json()
//         },
//         enabled: !!courseId,
//         staleTime: 5 * 60 * 1000, // 5 minutos
//         gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
//     })

//     // ==========================================
//     // 👤 DETERMINAR GRUPO DEL USUARIO
//     // ==========================================

//     const grupoUsuario = useMemo(() => {
//         if (!user || !curso) return null

//         // Buscar en qué grupo está matriculado el usuario
//         for (const grupo of curso.grupos) {
//             // Verificar en estudiantes
//             const esEstudiante = grupo.estudiantes.some(e => e.uid === user.uid)
//             if (esEstudiante) return grupo.id

//             // Verificar en ayudantes
//             const esAyudante = grupo.ayudantes.some(a => a.uid === user.uid)
//             if (esAyudante) return grupo.id

//             // Verificar en profesores
//             const esProfesor = grupo.profesores.some(p => p.uid === user.uid)
//             if (esProfesor) return grupo.id
//         }

//         return null
//     }, [user, curso])

//     // ==========================================
//     // 🔐 CALCULAR PERMISOS SEGÚN ROL
//     // ==========================================

//     const permisos = useMemo<CourseContentPermissions>(() => {
//         if (!user) {
//             return {
//                 puedeHabilitar: false,
//                 puedeEditar: false,
//                 puedeVerTodo: false,
//                 puedeVerEstadisticas: false,
//                 puedeGestionarGrupos: false
//             }
//         }

//         const role = user.role
//         const isAdmin = user.admin

//         return {
//             // Habilitar contenido: Profesor, Profesor Editor, Admin
//             puedeHabilitar: isAdmin || ['profesor', 'profesor_editor'].includes(role),

//             // Editar contenido: Solo Profesor Editor y Admin
//             puedeEditar: isAdmin || role === 'profesor_editor',

//             // Ver todo (incluido deshabilitado): Todos excepto Estudiante
//             puedeVerTodo: isAdmin || role !== 'estudiante',

//             // Ver estadísticas: Profesor, Profesor Editor, Admin
//             puedeVerEstadisticas: isAdmin || ['profesor', 'profesor_editor'].includes(role),

//             // Gestionar grupos: Solo Admin
//             puedeGestionarGrupos: isAdmin
//         }
//     }, [user])

//     // ==========================================
//     // 🔍 FILTRAR CONTENIDO SEGÚN ROL Y GRUPO
//     // ==========================================

//     const capitulosFiltrados = useMemo<CapituloFiltrado[]>(() => {
//         if (!curso || !user) return []

//         return curso.capitulos
//             .filter(capitulo => {
//                 // Admin y no-estudiantes ven todos los capítulos
//                 if (permisos.puedeVerTodo) return true

//                 // Estudiantes solo ven capítulos visibles
//                 return capitulo.visible
//             })
//             .map(capitulo => filtrarCapitulo(
//                 capitulo,
//                 grupoUsuario,
//                 permisos.puedeVerTodo
//             ))
//     }, [curso, user, grupoUsuario, permisos.puedeVerTodo])

//     // ==========================================
//     // 📤 RETURN
//     // ==========================================

//     return {
//         curso: curso ?? null,
//         capitulosFiltrados,
//         grupoUsuario,
//         permisos,
//         isLoading,
//         isError,
//         error: error as Error | null,
//         refetch
//     }
// }

// // ==========================================
// // 🔧 FUNCIONES AUXILIARES DE FILTRADO
// // ==========================================

// /**
//  * Filtra un capítulo según permisos y grupo del usuario
//  */
// function filtrarCapitulo(
//     capitulo: Capitulo,
//     grupoId: string | null,
//     puedeVerTodo: boolean
// ): CapituloFiltrado {
//     const temasFiltrados = capitulo.temas
//         .filter(tema => {
//             if (puedeVerTodo) return true
//             return tema.visible
//         })
//         .map(tema => filtrarTema(tema, grupoId, puedeVerTodo))

//     const temasVisibles = temasFiltrados.filter(t => t.visible).length
//     const contenidosTotales = temasFiltrados.reduce(
//         (acc, tema) => acc + tema.contenidos.length,
//         0
//     )
//     const contenidosHabilitados = temasFiltrados.reduce(
//         (acc, tema) => acc + tema.contenidos.filter(c => c.habilitado).length,
//         0
//     )

//     return {
//         ...capitulo,
//         temas: temasFiltrados,
//         temasVisibles,
//         contenidosTotales,
//         contenidosHabilitados
//     }
// }

// /**
//  * Filtra un tema según permisos y grupo del usuario
//  */
// function filtrarTema(
//     tema: Tema,
//     grupoId: string | null,
//     puedeVerTodo: boolean
// ): TemaFiltrado {
//     const contenidosFiltrados = tema.contenidos
//         .map(contenido => filtrarContenido(contenido, grupoId, puedeVerTodo))
//         .filter(contenido => {
//             // Si puede ver todo, mostrar todos
//             if (puedeVerTodo) return true

//             // Si es estudiante, solo mostrar habilitados
//             return contenido.habilitado && contenido.visible
//         })

//     const contenidosVisibles = contenidosFiltrados.filter(c => c.visible).length
//     const contenidosHabilitados = contenidosFiltrados.filter(c => c.habilitado).length

//     return {
//         ...tema,
//         contenidos: contenidosFiltrados,
//         contenidosVisibles,
//         contenidosHabilitados
//     }
// }

// /**
//  * Filtra un contenido individual
//  * Determina si está habilitado para el grupo del usuario
//  */
// function filtrarContenido(
//     contenido: Contenido,
//     grupoId: string | null,
//     puedeVerTodo: boolean
// ): ContenidoFiltrado {
//     // Verificar si está habilitado para el grupo del usuario
//     const habilitacion = grupoId
//         ? contenido.habilitacionPorGrupo.find(h => h.grupoId === grupoId)
//         : null

//     const estaHabilitado = habilitacion?.habilitado ?? false

//     // Determinar permisos
//     const puedeEditar = puedeVerTodo // Solo no-estudiantes pueden editar
//     const puedeHabilitar = puedeVerTodo // Solo no-estudiantes pueden habilitar

//     return {
//         id: contenido.id,
//         titulo: contenido.titulo,
//         tipo: contenido.tipo,
//         contenido: contenido.contenido,
//         orden: contenido.orden,
//         visible: contenido.visible,
//         obligatorio: contenido.obligatorio,
//         completable: contenido.completable,
//         habilitado: estaHabilitado,
//         puedeEditar,
//         puedeHabilitar
//     }
// }

// // ==========================================
// // 🎯 HOOK AUXILIAR: SOLO PERMISOS
// // ==========================================

// /**
//  * Hook ligero que solo retorna los permisos del usuario
//  * Útil para componentes que no necesitan el contenido completo
//  */
// export function useCoursePermissions(): CourseContentPermissions {
//     const { user } = useAuth()

//     return useMemo<CourseContentPermissions>(() => {
//         if (!user) {
//             return {
//                 puedeHabilitar: false,
//                 puedeEditar: false,
//                 puedeVerTodo: false,
//                 puedeVerEstadisticas: false,
//                 puedeGestionarGrupos: false
//             }
//         }

//         const role = user.role
//         const isAdmin = user.admin

//         return {
//             puedeHabilitar: isAdmin || ['profesor', 'profesor_editor'].includes(role),
//             puedeEditar: isAdmin || role === 'profesor_editor',
//             puedeVerTodo: isAdmin || role !== 'estudiante',
//             puedeVerEstadisticas: isAdmin || ['profesor', 'profesor_editor'].includes(role),
//             puedeGestionarGrupos: isAdmin
//         }
//     }, [user])
// }