import { Curso } from '@/types/course.types';
import React from 'react'

type Props = {
    curso: Curso;
    handleEliminarCurso: (curso: Curso) => void;
};

import Link from 'next/link';


const CursoCard = ({ curso, handleEliminarCurso }: Props) => (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {curso.nombre}
                    </h3>
                    <p className="text-sm font-medium text-blue-600">{curso.sigla}</p>
                </div>
                <div className="flex gap-2">
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
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {curso.descripcion}
            </p>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <span className="text-gray-500">Categoría:</span>
                    <p className="font-medium">{curso.categoria}</p>
                </div>
                <div>
                    <span className="text-gray-500">Créditos:</span>
                    <p className="font-medium">{curso.creditos}</p>
                </div>
                <div>
                    <span className="text-gray-500">Semestre:</span>
                    <p className="font-medium">{curso.semestre} - {curso.año}</p>
                </div>
                <div>
                    <span className="text-gray-500">Estudiantes:</span>
                    <p className="font-medium">{curso.estadisticas.totalEstudiantes}</p>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                    href={`/courses/${curso.cid}`}
                    // className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                    {/* Ver detalles → */}
                    Ingresar
                </Link>

                <div className="flex gap-2">
                    <Link
                        href={`/courses/${curso.cid}/edit`}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => handleEliminarCurso(curso)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default CursoCard