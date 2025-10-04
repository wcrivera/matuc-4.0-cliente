// src/app/courses/[id]/edit/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CourseForm } from '@/components/forms/CourseForm';
import type { CourseFormData } from '@/components/forms/CourseForm';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useCourseStore } from '@/lib/stores/course.store';

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    // Obtener el ID del curso desde los parámetros
    const cursoId = params.id as string;

    // === OBTENER DATOS Y ACCIONES DEL STORE ===
    const cursoActual = useCourseStore(state => state.cursoActual);
    const obtenerCurso = useCourseStore(state => state.obtenerCurso);
    const actualizarCurso = useCourseStore(state => state.actualizarCurso);
    const isLoading = useCourseStore(state => state.isLoading);
    const error = useCourseStore(state => state.error);
    const clearCursoActual = useCourseStore(state => state.clearCursoActual);

    // ==========================================
    // 🔄 CARGAR CURSO AL MONTAR
    // ==========================================

    useEffect(() => {
        if (cursoId) {
            obtenerCurso(cursoId);
        }

        // Limpiar al desmontar
        return () => {
            clearCursoActual();
        };
    }, [cursoId, obtenerCurso, clearCursoActual]);

    // ==========================================
    // 🎯 HANDLER PARA ACTUALIZAR CURSO
    // ==========================================

    const handleUpdateCourse = async (data: CourseFormData) => {
        try {
            // Construir el formato de semestre esperado por el backend: "2024-1"
            const semestreFormateado = `${data.año}-${data.semestre}` as `${number}-${1 | 2}`;

            // Preparar datos según el tipo ActualizarCursoRequest
            const cursoData = {
                cid: cursoId,
                nombre: data.nombre,
                sigla: data.sigla.toUpperCase(),
                descripcion: data.descripcion,
                categoria: data.categoria,
                creditos: data.creditos,
                semestre: semestreFormateado,
                año: data.año,
                activo: data.activo,
                publico: data.publico,
            };

            // Llamar al store para actualizar el curso
            const cursoActualizado = await actualizarCurso(cursoData);

            if (cursoActualizado) {
                // Mostrar notificación de éxito
                toast({
                    variant: 'success',
                    title: 'Curso actualizado exitosamente',
                    description: `Los cambios en ${data.sigla} se guardaron correctamente`,
                });

                // Redirigir a la lista de cursos después de 1 segundo
                setTimeout(() => {
                    router.push('/courses');
                }, 1000);
            } else {
                // Si el store devolvió null, hubo un error
                toast({
                    variant: 'error',
                    title: 'Error al actualizar curso',
                    description: error || 'Ocurrió un error inesperado',
                });
            }

        } catch (err) {
            console.error('Error al actualizar curso:', err);

            toast({
                variant: 'error',
                title: 'Error al actualizar curso',
                description: err instanceof Error ? err.message : 'Ocurrió un error inesperado',
            });
        }
    };

    // ==========================================
    // 🎯 HANDLER PARA CANCELAR
    // ==========================================

    const handleCancel = () => {
        router.push('/courses');
    };

    // ==========================================
    // 🎨 ANIMACIONES
    // ==========================================

    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1] as const
            }
        }
    };

    // ==========================================
    // 🎯 ESTADOS DE CARGA
    // ==========================================

    // Estado de carga inicial
    if (isLoading && !cursoActual) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Cargando curso...</p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error && !cursoActual) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                        <p className="text-red-800 font-medium mb-2">Error al cargar el curso</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                    <Button
                        leftIcon={<ArrowLeft />}
                        onClick={() => router.push('/courses')}
                    >
                        Volver a Cursos
                    </Button>
                </div>
            </div>
        );
    }

    // Estado sin curso
    if (!cursoActual) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Curso no encontrado</p>
                    <Button
                        leftIcon={<ArrowLeft />}
                        onClick={() => router.push('/courses')}
                    >
                        Volver a Cursos
                    </Button>
                </div>
            </div>
        );
    }

    // ==========================================
    // 🎯 RENDER PRINCIPAL
    // ==========================================

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        leftIcon={<ArrowLeft />}
                        onClick={() => router.push('/courses')}
                        className="mb-4"
                    >
                        Volver a Cursos
                    </Button>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Editar Curso: {cursoActual.sigla}
                        </h1>
                        <p className="text-gray-600">
                            Actualiza la información del curso {cursoActual.nombre}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <CourseForm
                    mode="edit"
                    curso={cursoActual}
                    onSubmit={handleUpdateCourse}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />

                {/* Información adicional */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-lg shadow-sm p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Información del Curso
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">ID del Curso</p>
                            <p className="font-mono text-gray-900">{cursoActual.cid}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">Creado por</p>
                            <p className="text-gray-900">{cursoActual.creadoPor || 'No disponible'}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">Fecha de Creación</p>
                            <p className="text-gray-900">
                                {new Date(cursoActual.fechaCreacion).toLocaleDateString('es-CL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">Última Modificación</p>
                            <p className="text-gray-900">
                                {new Date(cursoActual.fechaModificacion).toLocaleDateString('es-CL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">Estudiantes Matriculados</p>
                            <p className="text-gray-900 font-semibold text-lg">
                                {cursoActual.estadisticas.totalEstudiantes}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 mb-1">Total de Módulos</p>
                            <p className="text-gray-900 font-semibold text-lg">
                                {cursoActual.estadisticas.totalModulos}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}