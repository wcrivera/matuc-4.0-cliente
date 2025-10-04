// src/app/courses/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { CourseForm } from '@/components/forms/CourseForm';
import type { CourseFormData } from '@/components/forms/CourseForm';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useCourseStore } from '@/lib/stores/course.store';

export default function CreateCoursePage() {
    const router = useRouter();
    const { toast } = useToast();

    // === OBTENER ACCIONES DEL STORE ===
    const crearCurso = useCourseStore(state => state.crearCurso);
    const isLoading = useCourseStore(state => state.isLoading);
    const error = useCourseStore(state => state.error);

    // ==========================================
    // 🎯 HANDLER PARA CREAR CURSO
    // ==========================================

    const handleCreateCourse = async (data: CourseFormData) => {
        try {
            // Construir el formato de semestre esperado por el backend: "2024-1"
            const semestreFormateado = `${data.año}-${data.semestre}` as `${number}-${1 | 2}`;

            // Preparar datos según el tipo CrearCursoRequest
            const cursoData = {
                nombre: data.nombre,
                sigla: data.sigla.toUpperCase(),
                descripcion: data.descripcion,
                categoria: data.categoria,
                creditos: data.creditos,
                semestre: semestreFormateado,
                año: data.año,
                configuracion: {
                    notaAprobacion: 4.0,
                    requiereAprobacion: false,
                }
            };

            // Llamar al store para crear el curso
            const cursoCreado = await crearCurso(cursoData);

            if (cursoCreado) {
                // Mostrar notificación de éxito
                toast({
                    variant: 'success',
                    title: 'Curso creado exitosamente',
                    description: `El curso ${data.sigla} ha sido creado correctamente`,
                });

                // Redirigir a la lista de cursos después de 1 segundo
                setTimeout(() => {
                    router.push('/courses');
                }, 1000);
            } else {
                // Si el store devolvió null, hubo un error
                toast({
                    variant: 'error',
                    title: 'Error al crear curso',
                    description: error || 'Ocurrió un error inesperado',
                });
            }

        } catch (err) {
            console.error('Error al crear curso:', err);

            toast({
                variant: 'error',
                title: 'Error al crear curso',
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
    // 🎯 RENDER
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
                            Crear Nuevo Curso
                        </h1>
                        <p className="text-gray-600">
                            Completa el formulario para agregar un nuevo curso a la plataforma MATUC
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <CourseForm
                    mode="create"
                    onSubmit={handleCreateCourse}
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
                        Información Importante
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong>Sigla del curso:</strong> Debe seguir el formato estándar UC (3 letras + 4 números).
                                Ejemplo: MAT1610, FIS1503, etc.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong>Créditos:</strong> Los créditos deben estar entre 1 y 20, siendo típicamente 10 créditos
                                para cursos regulares.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong>Estado del curso:</strong> Un curso activo estará disponible para los estudiantes.
                                Puedes crear el curso como inactivo y activarlo cuando esté listo.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong>Curso público:</strong> Los cursos públicos aparecen en el catálogo general.
                                Los cursos privados solo son visibles para usuarios autorizados.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p>
                                <strong>Nota:</strong> Una vez creado el curso, podrás agregar módulos, contenido y
                                ejercicios desde la página de gestión del curso.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}