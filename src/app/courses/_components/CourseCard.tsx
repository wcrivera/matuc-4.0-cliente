// src/components/courses/CourseCard.tsx
'use client'

import { CursoConMatricula } from '@/types/matricula.types';
import { Users, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
    data: CursoConMatricula;
}

export function CourseCard({ data }: CourseCardProps) {
    const { curso, matricula, grupo } = data;

    // Determinar color según rol
    const getRolColor = () => {
        switch (matricula.rol) {
            case 'estudiante': return 'from-blue-500 to-cyan-500';
            case 'ayudante': return 'from-yellow-500 to-orange-500';
            case 'profesor': return 'from-purple-500 to-pink-500';
            case 'profesor_editor': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getRolLabel = () => {
        switch (matricula.rol) {
            case 'estudiante': return '👨‍🎓 Estudiante';
            case 'ayudante': return '🤝 Ayudante';
            case 'profesor': return '👨‍🏫 Profesor';
            case 'profesor_editor': return '✏️ Profesor Editor';
            default: return matricula.rol;
        }
    };

    const getRolIcon = () => {
        switch (matricula.rol) {
            case 'estudiante': return '👨‍🎓';
            case 'ayudante': return '🤝';
            case 'profesor': return '👨‍🏫';
            case 'profesor_editor': return '✏️';
            default: return '📚';
        }
    };

    return (
        <Link href={`/courses/${curso.cid}`}>
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                {/* Header con gradiente */}
                <div className={`bg-gradient-to-r ${getRolColor()} p-4 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1 line-clamp-1">
                                    {curso.nombre}
                                </h3>
                                <p className="text-sm text-white/90 font-medium">
                                    {curso.sigla}
                                </p>
                            </div>
                            <span className="text-3xl">{getRolIcon()}</span>
                        </div>

                        {/* Badge de rol */}
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {getRolLabel()}
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                    {/* Descripción */}
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                        {curso.descripcion}
                    </p>

                    {/* Info del curso */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{curso.semestre} - {curso.año}</span>
                        </div>

                        {grupo && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>Grupo {grupo.numero} - {grupo.nombre}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                                Matriculado: {new Date(matricula.fechaMatricula).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${curso.activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${curso.activo ? 'bg-green-500' : 'bg-gray-500'
                                }`} />
                            {curso.activo ? 'Activo' : 'Inactivo'}
                        </span>

                        <span className="text-xs text-gray-400">
                            {curso.categoria}
                        </span>
                    </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </Link>
    );
}