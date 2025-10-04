// src/lib/validations/course.schemas.ts
import { z } from 'zod';

// ==========================================
// 📝 LISTA DE CATEGORÍAS VÁLIDAS (del proyecto)
// ==========================================

const categoriasValidas = [
    'Cálculo',
    'Álgebra',
    'Estadística',
    'Geometría',
    'Análisis',
    'Matemática Aplicada',
    'Otros'
] as const;

// ==========================================
// 📝 ESQUEMA BASE DE CURSO
// ==========================================

export const cursoBaseSchema = z.object({
    nombre: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),

    sigla: z
        .string()
        .min(2, 'La sigla debe tener al menos 2 caracteres')
        .max(20, 'La sigla no puede exceder 20 caracteres')
        .regex(/^[A-Z0-9-]+$/, 'La sigla solo puede contener letras mayúsculas, números y guiones')
        .trim(),

    descripcion: z
        .string()
        .min(20, 'La descripción debe tener al menos 20 caracteres')
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .trim(),

    categoria: z.enum(categoriasValidas),

    creditos: z
        .number()
        .int('Los créditos deben ser un número entero')
        .min(1, 'Debe tener al menos 1 crédito')
        .max(20, 'No puede exceder 20 créditos'),

    semestre: z
        .number()
        .int('El semestre debe ser un número entero')
        .min(1, 'El semestre debe ser entre 1 y 2')
        .max(2, 'El semestre debe ser entre 1 y 2'),

    año: z
        .number()
        .int('El año debe ser un número entero')
        .min(2020, 'El año debe ser posterior a 2020')
        .max(2100, 'El año no puede ser posterior a 2100'),

    activo: z.boolean(),

    publico: z.boolean(),

    color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un color hexadecimal válido')
        .default('#003f7f'),

    icono: z.string().default(''),

    imagenPortada: z.string().default(''),
});

// ==========================================
// ✏️ ESQUEMA PARA CREAR CURSO
// ==========================================

export const crearCursoSchema = cursoBaseSchema.extend({
    prerequisitos: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de curso prerequisito inválido'))
        .default([]),

    profesores: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de profesor inválido'))
        .default([]),
});

// ==========================================
// 🔄 ESQUEMA PARA ACTUALIZAR CURSO
// ==========================================

export const actualizarCursoSchema = cursoBaseSchema.partial().extend({
    cid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de curso inválido'),
});

// ==========================================
// 🗑️ ESQUEMA PARA ELIMINAR CURSO
// ==========================================

export const eliminarCursoSchema = z.object({
    cid: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de curso inválido'),
    confirmarEliminacion: z.boolean().refine((val) => val === true, {
        message: 'Debe confirmar la eliminación',
    }),
});

// ==========================================
// 🔍 ESQUEMA PARA FILTROS DE BÚSQUEDA
// ==========================================

export const cursoBusquedaSchema = z.object({
    busqueda: z.string().optional(),
    categoria: z.enum(categoriasValidas).optional(),
    semestre: z.number().int().min(1).max(2).optional(),
    año: z.number().int().min(2020).optional(),
    activo: z.boolean().optional(),
    publico: z.boolean().optional(),
    ordenarPor: z.enum(['nombre', 'sigla', 'fecha', 'estudiantes']).default('nombre'),
    ordenDireccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.number().int().min(1).default(1),
    limite: z.number().int().min(1).max(100).default(20),
});

// ==========================================
// 📊 ESQUEMA PARA MATRICULAR ESTUDIANTE
// ==========================================

export const matricularEstudianteSchema = z.object({
    cursoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de curso inválido'),
    estudianteId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de estudiante inválido'),
    notificarEstudiante: z.boolean().default(true),
});

// ==========================================
// 🎯 TIPOS INFERIDOS DESDE LOS ESQUEMAS
// ==========================================

export type CrearCursoInput = z.infer<typeof crearCursoSchema>;
export type ActualizarCursoInput = z.infer<typeof actualizarCursoSchema>;
export type EliminarCursoInput = z.infer<typeof eliminarCursoSchema>;
export type CursoBusquedaInput = z.infer<typeof cursoBusquedaSchema>;
export type MatricularEstudianteInput = z.infer<typeof matricularEstudianteSchema>;

// ==========================================
// 🎨 VALIDADORES PERSONALIZADOS
// ==========================================

// Validar que el año/semestre sea futuro o actual
export const validarSemestreActual = (año: number, semestre: number): boolean => {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;
    const semestreActual = mesActual <= 6 ? 1 : 2;

    if (año < añoActual) return false;
    if (año === añoActual && semestre < semestreActual) return false;

    return true;
};

// Validar formato de sigla UC (ejemplo: MAT1610)
export const validarSiglaUC = (sigla: string): boolean => {
    const regex = /^[A-Z]{3}\d{4}$/;
    return regex.test(sigla);
};

// Sanitizar entrada de texto
export const sanitizarTexto = (texto: string): string => {
    return texto
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[<>]/g, '');
};

// Exportar categorías para uso en componentes
export const CATEGORIAS_CURSO = categoriasValidas;