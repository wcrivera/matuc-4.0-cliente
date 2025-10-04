// src/components/forms/CourseForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    BookOpen,
    Users,
    Calendar,
    Image as ImageIcon,
    Palette,
    Check,
    X,
    Loader2,
    AlertCircle,
    Sparkles,
    ArrowLeft,
    Plus

} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { crearCursoSchema } from '@/lib/validations/course.schemas';
import { Curso, CursoCategoria } from '@/types/course.types';
import Step1BasicInfo from './Step1BasicInfo';

// ==========================================
// 📝 TIPOS DEL COMPONENTE
// ==========================================

// Tipo explícito para el formulario
export type CourseFormData = {
    nombre: string;
    sigla: string;
    descripcion: string;
    categoria: CursoCategoria;
    creditos: number;
    semestre: number;
    año: number;
    activo: boolean;
    publico: boolean;
    color?: string;
    icono?: string;
    imagenPortada?: string;
    prerequisitos?: string[];
    profesores?: string[];
};

interface CourseFormProps {
    mode: 'create' | 'edit';
    curso?: Curso;
    onSubmit: (data: CourseFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

// ==========================================
// 🎨 COLORES PREDEFINIDOS UC
// ==========================================

const COLORES_UC = [
    { nombre: 'UC Azul', hex: '#003f7f' },
    { nombre: 'UC Celeste', hex: '#00a0d1' },
    { nombre: 'UC Amarillo', hex: '#ffc72c' },
    { nombre: 'Verde', hex: '#10b981' },
    { nombre: 'Morado', hex: '#8b5cf6' },
    { nombre: 'Naranja', hex: '#f97316' },
    { nombre: 'Rosa', hex: '#ec4899' },
    { nombre: 'Índigo', hex: '#6366f1' },
];

// ==========================================
// 📝 COMPONENTE PRINCIPAL
// ==========================================

export function CourseForm({ mode, curso, onSubmit, onCancel, isLoading = false }: CourseFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedColor, setSelectedColor] = useState('#003f7f');
    const [previewImage, setPreviewImage] = useState('');

    // Extraer semestre como número del formato "2024-1"
    const getSemestreNumber = (semestreStr?: string): number => {
        if (!semestreStr) return 1;
        const parts = semestreStr.split('-');
        return parseInt(parts[1]) || 1;
    };

    // Extraer año del formato "2024-1"
    const getAñoNumber = (semestreStr?: string): number => {
        if (!semestreStr) return new Date().getFullYear();
        const parts = semestreStr.split('-');
        return parseInt(parts[0]) || new Date().getFullYear();
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm<CourseFormData>({
        resolver: zodResolver(crearCursoSchema),
        mode: 'onChange',
        defaultValues: curso ? {
            nombre: curso.nombre,
            sigla: curso.sigla,
            descripcion: curso.descripcion,
            categoria: curso.categoria,
            creditos: curso.creditos,
            semestre: getSemestreNumber(curso.semestre),
            año: getAñoNumber(curso.semestre),
            activo: curso.activo,
            publico: curso.publico,
            color: '#003f7f',
            imagenPortada: '',
            prerequisitos: [],
            icono: '',
            profesores: [],
        } : {
            nombre: '',
            sigla: '',
            descripcion: '',
            categoria: 'Cálculo',
            activo: true,
            publico: true,
            color: '#003f7f',
            semestre: 1,
            año: new Date().getFullYear(),
            creditos: 10,
            prerequisitos: [],
            imagenPortada: '',
            icono: '',
            profesores: [],
        }
    });

    const watchedValues = watch();

    // ==========================================
    // 🎯 HANDLERS
    // ==========================================

    const handleFormSubmit = (data: CourseFormData) => {
        const formData: CourseFormData = {
            ...data,
            color: selectedColor
        };
        return onSubmit(formData);
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setValue('color', color, { shouldValidate: true, shouldDirty: true });
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // ==========================================
    // 🎨 ANIMACIONES
    // ==========================================

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    // ==========================================
    // 📊 PROGRESO DEL FORMULARIO
    // ==========================================

    const StepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                        <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-500'
                                }`}
                            animate={{ scale: currentStep === step ? 1.1 : 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {currentStep > step ? <Check className="w-5 h-5" /> : step}
                        </motion.div>
                        {step < 3 && (
                            <div
                                className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-sm font-medium text-gray-600">Información Básica</span>
                <span className="text-sm font-medium text-gray-600">Configuración</span>
                <span className="text-sm font-medium text-gray-600">Personalización</span>
            </div>
        </div>
    );

    // ==========================================
    // ⚙️ PASO 2: CONFIGURACIÓN
    // ==========================================

    const Step2Configuration = () => (
        <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Créditos */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Créditos *
                    </label>
                    <Input
                        type="number"
                        {...register('creditos', { valueAsNumber: true })}
                        min={1}
                        max={20}
                        className={errors.creditos ? 'border-red-500' : ''}
                    />
                    {errors.creditos && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.creditos.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Semestre */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Semestre *
                    </label>
                    <select
                        {...register('semestre', { valueAsNumber: true })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.semestre ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value={1}>Primer Semestre</option>
                        <option value={2}>Segundo Semestre</option>
                    </select>
                    {errors.semestre && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.semestre.message}
                        </motion.p>
                    )}
                </motion.div>

                {/* Año */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Año *
                    </label>
                    <Input
                        type="number"
                        {...register('año', { valueAsNumber: true })}
                        min={2020}
                        max={2100}
                        className={errors.año ? 'border-red-500' : ''}
                    />
                    {errors.año && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.año.message}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Switches de Estado */}
            <motion.div variants={itemVariants} className="space-y-4">
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Curso Activo</h4>
                                <p className="text-sm text-gray-600">El curso estará visible y accesible</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('activo')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Curso Público</h4>
                                <p className="text-sm text-gray-600">Visible en el catálogo general</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('publico')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );

    // ==========================================
    // 🎨 PASO 3: PERSONALIZACIÓN
    // ==========================================

    const Step3Personalization = () => (
        <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            {/* Selector de Color */}
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Color del Curso
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {COLORES_UC.map((color) => (
                        <motion.button
                            key={color.hex}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleColorSelect(color.hex)}
                            className={`relative w-12 h-12 rounded-lg transition-all ${selectedColor === color.hex
                                ? 'ring-4 ring-blue-500 ring-offset-2'
                                : 'ring-2 ring-gray-200'
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.nombre}
                        >
                            {selectedColor === color.hex && (
                                <Check className="w-6 h-6 text-white absolute inset-0 m-auto drop-shadow-lg" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* URL de Imagen de Portada */}
            <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Imagen de Portada (Opcional)
                </label>
                <Input
                    {...register('imagenPortada')}
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    onChange={(e) => setPreviewImage(e.target.value)}
                    className={errors.imagenPortada ? 'border-red-500' : ''}
                />
                {errors.imagenPortada && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {errors.imagenPortada.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Vista Previa */}
            {previewImage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <p className="text-sm font-semibold text-gray-700 mb-2">Vista Previa:</p>
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <div className="relative w-full h-48">
                            <Image
                                src={previewImage}
                                alt="Preview"
                                fill
                                className="object-cover"
                                onError={() => setPreviewImage('')}
                            />
                        </div>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
                            style={{ borderTop: `4px solid ${selectedColor}` }}
                        >
                            <div>
                                <h3 className="text-white font-bold text-lg">
                                    {watchedValues.nombre || 'Nombre del Curso'}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    {watchedValues.sigla || 'SIGLA'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );

    // ==========================================
    // 🎯 RENDER PRINCIPAL
    // ==========================================

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
        >
            <Card className="p-8 shadow-xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        {mode === 'create' ? 'Crear Nuevo Curso' : 'Editar Curso'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {mode === 'create'
                            ? 'Completa la información para crear un nuevo curso en la plataforma'
                            : 'Actualiza la información del curso'}
                    </p>
                </div>

                <StepIndicator />

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && <Step1BasicInfo register={register} errors={errors} watch={watch} />}
                        {currentStep === 2 && <Step2Configuration />}
                        {currentStep === 3 && <Step3Personalization />}
                    </AnimatePresence>

                    {/* Botones de Navegación */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            leftIcon={currentStep === 1 ? <X /> : <ArrowLeft />}
                            onClick={currentStep === 1 ? onCancel : prevStep}
                            disabled={isLoading}
                        >
                            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                        </Button>

                        <div className="flex gap-3">
                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    rightIcon={<Check />}
                                    onClick={nextStep}
                                >
                                    Siguiente
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    leftIcon={isLoading ? <Loader2 className="animate-spin" /> : <Check />}
                                    disabled={!isValid || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            {mode === 'create' ? 'Creando...' : 'Guardando...'}
                                        </>
                                    ) : (
                                        <>
                                            {mode === 'create' ? 'Crear Curso' : 'Guardar Cambios'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Card>
        </motion.div>
    );
}