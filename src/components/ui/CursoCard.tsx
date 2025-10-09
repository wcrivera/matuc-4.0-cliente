// src/components/ui/CursoCard.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Edit3,
    Trash2,
    ArrowRight,
    Clock,
    Award,
    Target
} from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import type { Curso } from '@/types/course.types';

interface CursoCardProps {
    curso: Curso;
    onDelete?: (cursoId: string) => void;
    userProgress?: {
        porcentajeCompletado: number;
        modulosCompletados: number;
        totalModulos: number;
        ultimaActividad?: string;
        promedioNotas?: number;
    };
}

export function CursoCard({ curso, onDelete, userProgress }: CursoCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete?.(curso.cid);
        } catch (error) {
            console.error('Error al eliminar curso:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calcular progreso (puede venir del prop o ser 0)
    const progreso = userProgress?.porcentajeCompletado || 0;

    // Determinar color del progreso
    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-blue-500';
        if (percentage >= 25) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getProgressTextColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-700';
        if (percentage >= 50) return 'text-blue-700';
        if (percentage >= 25) return 'text-yellow-700';
        return 'text-gray-700';
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group relative h-full"
            >
                {/* Card simple y limpio con flex para alinear footer */}
                <div className="relative h-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

                    {/* Barra de progreso en el top - MUY SUTIL */}
                    {userProgress && (
                        <div className="h-1 bg-gray-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progreso}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full ${getProgressColor(progreso)} transition-all duration-300`}
                            />
                        </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {curso.nombre}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-blue-600">{curso.sigla}</p>
                                    <span className="text-gray-300">•</span>
                                    <p className="text-sm text-gray-500">{curso.semestre}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                {curso.activo && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Activo
                                    </span>
                                )}
                                {curso.publico && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Público
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                            {curso.descripcion || 'Sin descripción disponible'}
                        </p>

                        {/* Progreso del estudiante - DESTACADO */}
                        {userProgress && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-gray-700">Tu Progreso</span>
                                    </div>
                                    <span className={`text-sm font-bold ${getProgressTextColor(progreso)}`}>
                                        {progreso}%
                                    </span>
                                </div>

                                {/* Barra de progreso más grande */}
                                <div className="h-2 bg-white/80 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progreso}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className={`h-full ${getProgressColor(progreso)} rounded-full`}
                                    />
                                </div>

                                {/* Stats del progreso */}
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{userProgress.modulosCompletados}/{userProgress.totalModulos} módulos</span>
                                    </div>

                                    {userProgress.promedioNotas !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5 text-yellow-600" />
                                            <span className="font-semibold">{userProgress.promedioNotas.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Última actividad */}
                                {userProgress.ultimaActividad && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>Última vez: {formatFecha(userProgress.ultimaActividad)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Metadata simple del curso */}
                        <div className="grid grid-cols-2 gap-4 text-sm flex-grow">
                            <div>
                                <span className="text-gray-500">Categoría:</span>
                                <p className="font-medium text-gray-900">{curso.categoria}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Créditos:</span>
                                <p className="font-medium text-gray-900">{curso.creditos}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Estudiantes:</span>
                                <p className="font-medium text-gray-900">{curso.estadisticas?.totalEstudiantes || 0}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Módulos:</span>
                                <p className="font-medium text-gray-900">{curso.estadisticas?.totalCapitulos || 0}</p>
                            </div>
                        </div>

                        {/* Acciones - siempre al final con mt-auto */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                            <Link href={`/courses/${curso.cid}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Ingresar
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>

                            <div className="flex gap-2">
                                <Link href={`/courses/${curso.cid}/edit`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </motion.button>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeleteClick}
                                    className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar curso?"
                message="Esta acción eliminará permanentemente el curso y todo su contenido asociado."
                itemName={curso.nombre}
                isLoading={isDeleting}
                variant="danger"
            />
        </>
    );
}

export default CursoCard;