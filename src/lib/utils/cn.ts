// src/lib/utils/cn.ts - Utilidad para combinar clases CSS
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases CSS de forma inteligente
 * - Utiliza clsx para conditional classes
 * - Utiliza tailwind-merge para resolver conflictos de Tailwind
 * - Optimiza el resultado final eliminando duplicados
 * 
 * @param inputs - Array de clases CSS, objetos condicionales o strings
 * @returns String con clases CSS optimizadas
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': true })
 * // Result: "px-2 py-1 bg-red-500 text-white"
 * 
 * @example
 * cn('px-2 py-1 px-4') // Conflicto resuelto
 * // Result: "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}