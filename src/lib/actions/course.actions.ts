'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type {
    Curso,
    CrearCursoRequest,
    ActualizarCursoRequest,
    ServerActionResult,
    CursosQuery,
    CursoCategoria,
    CursoSemestre
} from '@/types/course.types';

// ==========================================
// 🌐 CONFIGURACIÓN DE API
// ==========================================

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';

// Interfaces tipadas para respuestas de API
interface CursosApiResponse {
    ok: boolean;
    cursos: Curso[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

interface CursoApiResponse {
    ok: boolean;
    curso: Curso;
}

interface CursoCreateUpdateResponse {
    ok: boolean;
    curso: Curso;
    message: string;
}

interface CursoDeleteResponse {
    ok: boolean;
    message: string;
}

interface EstadisticasApiResponse {
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
        porCategoria: Array<{
            _id: string;
            totalCursos: number;
            cursosActivos: number;
            cursosPublicos: number;
            totalEstudiantes: number;
            promedioCreditos: number;
        }>;
    };
}

// Helper para obtener headers con autenticación
async function getAuthHeaders(): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
}

// Helper para manejo de errores de API
async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ==========================================
// 📋 OBTENER CURSOS (SERVER ACTION)
// ==========================================

export async function obtenerCursosAction(
    query?: CursosQuery
): Promise<ServerActionResult<{ cursos: Curso[]; pagination: CursosApiResponse['pagination'] }>> {
    try {
        // Construir query params
        const params = new URLSearchParams();

        if (query?.categoria) params.append('categoria', query.categoria);
        if (query?.activo !== undefined) params.append('activo', query.activo.toString());
        if (query?.publico !== undefined) params.append('publico', query.publico.toString());
        if (query?.semestre) params.append('semestre', query.semestre);
        if (query?.año) params.append('año', query.año.toString());
        if (query?.search) params.append('search', query.search);
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());

        const response = await fetch(`${API_BASE_URL}/curso?${params}`, {
            headers: await getAuthHeaders(),
            next: {
                tags: ['cursos'],
                revalidate: 60 // Cache por 1 minuto
            }
        });

        const data = await handleApiResponse<CursosApiResponse>(response);

        return {
            success: true,
            data: {
                cursos: data.cursos,
                pagination: data.pagination
            }
        };

    } catch (error) {
        console.error('Error al obtener cursos:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener cursos'
        };
    }
}

// ==========================================
// 📄 OBTENER CURSO ESPECÍFICO (SERVER ACTION)
// ==========================================

export async function obtenerCursoAction(cid: string): Promise<ServerActionResult<Curso>> {
    try {
        const response = await fetch(`${API_BASE_URL}/curso/${cid}`, {
            headers: await getAuthHeaders(),
            next: {
                tags: [`curso-${cid}`],
                revalidate: 60
            }
        });

        const data = await handleApiResponse<CursoApiResponse>(response);

        return {
            success: true,
            data: data.curso
        };

    } catch (error) {
        console.error('Error al obtener curso:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener curso'
        };
    }
}

// ==========================================
// ➕ CREAR CURSO (SERVER ACTION)
// ==========================================

export async function crearCursoAction(
    formData: FormData
): Promise<ServerActionResult<Curso>> {
    try {
        // Extraer datos del FormData
        const datos: CrearCursoRequest = {
            sigla: formData.get('sigla') as string,
            nombre: formData.get('nombre') as string,
            descripcion: formData.get('descripcion') as string,
            categoria: formData.get('categoria') as CursoCategoria,
            creditos: parseInt(formData.get('creditos') as string),
            semestre: formData.get('semestre') as CursoSemestre,
            año: parseInt(formData.get('año') as string),
            configuracion: {
                notaAprobacion: parseFloat(formData.get('notaAprobacion') as string) || 4.0,
                requiereAprobacion: formData.get('requiereAprobacion') === 'true',
                limitePlazas: formData.get('limitePlazas')
                    ? parseInt(formData.get('limitePlazas') as string)
                    : undefined,
                codigoAcceso: formData.get('codigoAcceso') as string || undefined
            }
        };

        // Validaciones básicas
        if (!datos.sigla || !datos.nombre || !datos.descripcion) {
            return {
                success: false,
                error: 'Faltan campos requeridos'
            };
        }

        const response = await fetch(`${API_BASE_URL}/curso`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(datos),
        });

        const result = await handleApiResponse<CursoCreateUpdateResponse>(response);

        // Revalidar caché y rutas
        revalidateTag('cursos');
        revalidatePath('/dashboard/courses');

        return {
            success: true,
            data: result.curso,
            message: result.message
        };

    } catch (error) {
        console.error('Error al crear curso:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear curso'
        };
    }
}

// ==========================================
// ✏️ ACTUALIZAR CURSO (SERVER ACTION)
// ==========================================

export async function actualizarCursoAction(
    cid: string,
    formData: FormData
): Promise<ServerActionResult<Curso>> {
    try {
        // Extraer datos del FormData (solo campos presentes)
        const datos: Partial<ActualizarCursoRequest> = {};

        // Solo agregar campos que estén presentes en el FormData
        const sigla = formData.get('sigla') as string;
        if (sigla) datos.sigla = sigla;

        const nombre = formData.get('nombre') as string;
        if (nombre) datos.nombre = nombre;

        const descripcion = formData.get('descripcion') as string;
        if (descripcion) datos.descripcion = descripcion;

        const categoria = formData.get('categoria') as string;
        if (categoria) datos.categoria = categoria as CursoCategoria;

        const creditos = formData.get('creditos') as string;
        if (creditos) datos.creditos = parseInt(creditos);

        const semestre = formData.get('semestre') as string;
        if (semestre) datos.semestre = semestre as CursoSemestre;

        const año = formData.get('año') as string;
        if (año) datos.año = parseInt(año);

        const activo = formData.get('activo');
        if (activo !== null) datos.activo = activo === 'true';

        const publico = formData.get('publico');
        if (publico !== null) datos.publico = publico === 'true';

        // Configuración (si existe)
        const configuracion: Record<string, unknown> = {};
        const notaAprobacion = formData.get('notaAprobacion') as string;
        if (notaAprobacion) configuracion.notaAprobacion = parseFloat(notaAprobacion);

        const requiereAprobacion = formData.get('requiereAprobacion');
        if (requiereAprobacion !== null) configuracion.requiereAprobacion = requiereAprobacion === 'true';

        const limitePlazas = formData.get('limitePlazas') as string;
        if (limitePlazas) configuracion.limitePlazas = parseInt(limitePlazas);

        const codigoAcceso = formData.get('codigoAcceso') as string;
        if (codigoAcceso) configuracion.codigoAcceso = codigoAcceso;

        if (Object.keys(configuracion).length > 0) {
            datos.configuracion = configuracion;
        }

        const response = await fetch(`${API_BASE_URL}/curso/${cid}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(datos),
        });

        const result = await handleApiResponse<CursoCreateUpdateResponse>(response);

        // Revalidar caché específico y general
        revalidateTag(`curso-${cid}`);
        revalidateTag('cursos');
        revalidatePath('/dashboard/courses');
        revalidatePath(`/dashboard/courses/${cid}`);

        return {
            success: true,
            data: result.curso,
            message: result.message
        };

    } catch (error) {
        console.error('Error al actualizar curso:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar curso'
        };
    }
}

// ==========================================
// 🗑️ ELIMINAR CURSO (SERVER ACTION)
// ==========================================

export async function eliminarCursoAction(cid: string): Promise<ServerActionResult<void>> {
    try {
        const response = await fetch(`${API_BASE_URL}/curso/${cid}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(),
        });

        const result = await handleApiResponse<CursoDeleteResponse>(response);

        // Revalidar caché y redireccionar
        revalidateTag('cursos');
        revalidateTag(`curso-${cid}`);
        revalidatePath('/dashboard/courses');

        return {
            success: true,
            message: result.message
        };

    } catch (error) {
        console.error('Error al eliminar curso:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al eliminar curso'
        };
    }
}

// ==========================================
// 🔄 ACCIONES DE ESTADO (TOGGLE)
// ==========================================

export async function toggleCursoActivoAction(
    cid: string,
    activo: boolean
): Promise<ServerActionResult<Curso>> {
    try {
        const formData = new FormData();
        formData.append('activo', activo.toString());

        return await actualizarCursoAction(cid, formData);

    } catch (error) {
        console.error('Error al cambiar estado activo:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al cambiar estado'
        };
    }
}

export async function toggleCursoPublicoAction(
    cid: string,
    publico: boolean
): Promise<ServerActionResult<Curso>> {
    try {
        const formData = new FormData();
        formData.append('publico', publico.toString());

        return await actualizarCursoAction(cid, formData);

    } catch (error) {
        console.error('Error al cambiar estado público:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al cambiar estado'
        };
    }
}

// ==========================================
// 📊 OBTENER ESTADÍSTICAS (SERVER ACTION)
// ==========================================

export async function obtenerEstadisticasCursosAction(): Promise<ServerActionResult<EstadisticasApiResponse['estadisticas']>> {
    try {
        const response = await fetch(`${API_BASE_URL}/curso/admin/stats`, {
            headers: await getAuthHeaders(),
            next: {
                tags: ['estadisticas-cursos'],
                revalidate: 300 // Cache por 5 minutos
            }
        });

        const data = await handleApiResponse<EstadisticasApiResponse>(response);

        return {
            success: true,
            data: data.estadisticas
        };

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener estadísticas'
        };
    }
}

// ==========================================
// 🌱 SEED DE DATOS (SERVER ACTION)
// ==========================================

export async function seedCursosAction(): Promise<ServerActionResult<void>> {
    try {
        // Solo en desarrollo
        if (process.env.NODE_ENV === 'production') {
            return {
                success: false,
                error: 'Seed no disponible en producción'
            };
        }

        const response = await fetch(`${API_BASE_URL}/curso/dev/seed`, {
            method: 'POST',
            headers: await getAuthHeaders(),
        });

        const result = await handleApiResponse<CursoDeleteResponse>(response);

        // Revalidar todo el caché de cursos
        revalidateTag('cursos');
        revalidatePath('/dashboard/courses');

        return {
            success: true,
            message: result.message
        };

    } catch (error) {
        console.error('Error en seed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error en seed'
        };
    }
}

// ==========================================
// 🎯 ACCIONES CON REDIRECCIÓN
// ==========================================

export async function crearCursoYRedirigirAction(
    formData: FormData
): Promise<never> {
    const result = await crearCursoAction(formData);

    if (result.success && result.data) {
        redirect(`/dashboard/courses/${result.data.cid}` as never);
    } else {
        // En caso de error, redirigir de vuelta al formulario con error
        redirect(`/dashboard/courses/new?error=${encodeURIComponent(result.error || 'Error desconocido')}` as never);
    }
}

export async function eliminarCursoYRedirigirAction(cid: string): Promise<never> {
    const result = await eliminarCursoAction(cid);

    if (result.success) {
        redirect('/dashboard/courses?message=Curso eliminado exitosamente' as never);
    } else {
        redirect(`/dashboard/courses/${cid}?error=${encodeURIComponent(result.error || 'Error al eliminar')}` as never);
    }
}

// ==========================================
// 🔄 ACCIONES OPTIMISTAS HELPERS
// ==========================================

// Helper para generar estado optimista temporal
export function generarCursoOptimista(datos: CrearCursoRequest): Curso {
    return {
        cid: `temp-${Date.now()}`, // ID temporal
        ...datos,
        activo: false,
        publico: false,
        configuracion: {
            notaAprobacion: datos.configuracion?.notaAprobacion || 4.0,
            requiereAprobacion: datos.configuracion?.requiereAprobacion || false,
            limitePlazas: datos.configuracion?.limitePlazas,
            codigoAcceso: datos.configuracion?.codigoAcceso
        },
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        creadoPor: 'temp-user',
        estadisticas: {
            totalEstudiantes: 0,
            totalProfesores: 1,
            totalModulos: 0,
            ultimaActividad: new Date().toISOString()
        }
    };
}

// ==========================================
// 🎨 ACCIONES DE VALIDACIÓN
// ==========================================

export async function validarSiglaUnicaAction(
    sigla: string,
    cursoIdExcluir?: string
): Promise<ServerActionResult<boolean>> {
    try {
        // Obtener todos los cursos y verificar
        const result = await obtenerCursosAction({ search: sigla });

        if (!result.success || !result.data) {
            return { success: false, error: 'Error al validar sigla' };
        }

        const siglaExiste = result.data.cursos.some(curso =>
            curso.sigla.toUpperCase() === sigla.toUpperCase() &&
            curso.cid !== cursoIdExcluir
        );

        return {
            success: true,
            data: !siglaExiste // true si NO existe (es única)
        };

    } catch {
        return {
            success: false,
            error: 'Error al validar sigla'
        };
    }
}