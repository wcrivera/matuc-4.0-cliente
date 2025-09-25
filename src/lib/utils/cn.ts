import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function para combinar class names de Tailwind CSS
 * Combina clsx con twMerge para mejor handling de clases conflictivas
 * 
 * @param inputs - Class names a combinar
 * @returns String con las clases finales
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4', { 'bg-red-500': isError }) 
 * // Result: "py-1 px-4 bg-red-500" (px-2 es reemplazado por px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}