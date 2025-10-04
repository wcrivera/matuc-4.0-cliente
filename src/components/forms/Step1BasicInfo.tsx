// src/components/forms/CourseForm.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    BookOpen,
    Tag,
    Hash,
    FileText,
    Image as ImageIcon,
    AlertCircle,
    Info,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Curso, CursoCategoria } from '@/types/course.types';
import { CourseFormData } from './CourseForm';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

type Props = {
    register: UseFormRegister<CourseFormData>;
    watch: () => CourseFormData;
    errors: FieldErrors<CourseFormData>;
};

const Step1BasicInfo = ({ register, errors, watch }: Props) => {

    const watchedValues = watch();

    const CATEGORIAS_UC: CursoCategoria[] = [
        'Cálculo',
        'Álgebra',
        'Estadística',
        'Geometría',
        'Análisis',
        'Matemática Aplicada',
        'Otros'
    ];

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };


    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del Curso */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Nombre del Curso *
                    </label>
                    <Input
                        {...register('nombre')}
                        placeholder="ej. Cálculo Diferencial e Integral"
                        className={errors.nombre ? 'border-red-500' : ''}
                    />
                    {errors.nombre && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.nombre.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Sigla */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Hash className="w-4 h-4 inline mr-2" />
                        Sigla del Curso *
                    </label>
                    <Input
                        {...register('sigla')}
                        placeholder="ej. MAT1610"
                        className={`uppercase ${errors.sigla ? 'border-red-500' : ''}`}
                        maxLength={20}
                    />
                    {errors.sigla && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.sigla.message}
                        </motion.p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Formato: 3 letras + 4 números (MAT1610)
                    </p>
                </motion.div>

                {/* Categoría */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Tag className="w-4 h-4 inline mr-2" />
                        Categoría *
                    </label>
                    <select
                        {...register('categoria')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.categoria ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Seleccionar categoría</option>
                        {CATEGORIAS_UC.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.categoria && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.categoria.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Descripción */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Descripción del Curso *
                    </label>
                    <textarea
                        {...register('descripcion')}
                        rows={4}
                        placeholder="Describe los objetivos y contenidos principales del curso..."
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.descripcion && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.descripcion.message}
                        </motion.p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {watchedValues.descripcion?.length || 0} / 1000 caracteres
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Step1BasicInfo