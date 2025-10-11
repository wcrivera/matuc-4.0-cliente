// src/app/courses/_components/CourseCard.tsx
'use client'

import { CursoConMatricula } from '@/types/matricula.types'
import { Users, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
    data: CursoConMatricula
}

export function CourseCard({ data }: CourseCardProps) {
    const { curso, matricula, grupo } = data

    // Determinar color según rol - COLORES UC
    const getRolColor = () => {
        switch (matricula.rol) {
            case 'estudiante': return 'from-uc-celeste to-uc-celeste-600'
            case 'ayudante': return 'from-uc-amarillo to-yellow-500'
            case 'profesor': return 'from-uc-azul to-uc-azul-700'
            case 'profesor_editor': return 'from-uc-azul-700 to-uc-celeste-700'
            default: return 'from-uc-gris to-gray-700'
        }
    }

    const getRolLabel = () => {
        switch (matricula.rol) {
            case 'estudiante': return '👨‍🎓 Estudiante'
            case 'ayudante': return '🤝 Ayudante'
            case 'profesor': return '👨‍🏫 Profesor'
            case 'profesor_editor': return '✏️ Profesor Editor'
            default: return matricula.rol
        }
    }

    const getRolIcon = () => {
        switch (matricula.rol) {
            case 'estudiante': return '👨‍🎓'
            case 'ayudante': return '🤝'
            case 'profesor': return '👨‍🏫'
            case 'profesor_editor': return '✏️'
            default: return '📚'
        }
    }

    return (
        <Link href={`/courses/${curso.cid}`}>
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-uc-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-uc-azul/20">
                {/* Header con gradiente UC */}
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
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                            {getRolLabel()}
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                    {/* Descripción */}
                    <p className="text-sm text-uc-gris line-clamp-2 min-h-[2.5rem]">
                        {curso.descripcion}
                    </p>

                    {/* Info del curso */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-uc-gris">
                            <Calendar className="w-4 h-4 text-uc-celeste" />
                            <span>{curso.semestre} - {curso.año}</span>
                        </div>

                        {grupo && (
                            <div className="flex items-center gap-2 text-sm text-uc-gris">
                                <Users className="w-4 h-4 text-uc-celeste" />
                                <span>Grupo {grupo.numero} - {grupo.nombre}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-uc-gris">
                            <Clock className="w-4 h-4 text-uc-celeste" />
                            <span>
                                Matriculado: {new Date(matricula.fechaMatricula).toLocaleDateString('es-CL')}
                            </span>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${curso.activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-uc-gris'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${curso.activo ? 'bg-green-500' : 'bg-gray-500'
                                }`} />
                            {curso.activo ? 'Activo' : 'Inactivo'}
                        </span>

                        <span className="text-xs text-uc-gris/70">
                            {curso.categoria}
                        </span>
                    </div>
                </div>

                {/* Hover effect con color UC */}
                <div className="absolute inset-0 bg-gradient-to-t from-uc-azul/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </Link>
    )
}