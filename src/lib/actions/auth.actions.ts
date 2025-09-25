// src/lib/actions/auth.actions.ts - Server Actions para Autenticación
'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Schemas de validación
const loginSchema = z.object({
    email: z.string()
        .min(1, 'El email es requerido')
        .email('Formato de email inválido')
        .refine((email) => email.endsWith('@uc.cl'), {
            message: 'Debe usar un email institucional UC (@uc.cl)'
        }),
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña es demasiado larga')
})

const registerSchema = z.object({
    firstName: z.string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre es demasiado largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
    lastName: z.string()
        .min(1, 'El apellido es requerido')
        .max(50, 'El apellido es demasiado largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
    email: z.string()
        .email('Formato de email inválido')
        .refine((email) => email.endsWith('@uc.cl'), {
            message: 'Debe usar un email institucional UC (@uc.cl)'
        }),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

// Tipos de respuesta
interface AuthResponse {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'estudiante' | 'ayudante' | 'profesor' | 'profesor_editor' | 'administrador'
}

// Simulación de API - En producción conectar con backend real
const mockUsers: (User & { password: string })[] = [
    {
        id: '1',
        email: 'profesor@uc.cl',
        password: 'Password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'profesor'
    },
    {
        id: '2',
        email: 'estudiante@uc.cl',
        password: 'Password123',
        firstName: 'María',
        lastName: 'González',
        role: 'estudiante'
    }
]

// Funciones de utilidad para manejo de sesión
async function createSession(user: User) {
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días

    // En producción, usar JWT o session tokens seguros
    cookieStore.set('session', JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        expiresAt: expiresAt.toISOString()
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    })
}

async function getSession(): Promise<User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) return null

    try {
        const session = JSON.parse(sessionCookie.value)

        // Verificar expiración
        if (new Date() > new Date(session.expiresAt)) {
            await destroySession()
            return null
        }

        // En producción, validar el token con el backend
        return {
            id: session.userId,
            email: session.email,
            firstName: '', // Obtener del backend
            lastName: '',
            role: session.role
        }
    } catch {
        await destroySession()
        return null
    }
}

async function destroySession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

// Server Actions

/**
 * Acción para login con email y contraseña
 */
export async function loginAction(formData: FormData): Promise<AuthResponse> {
    try {
        // Extraer datos del formulario
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // Validar datos
        const validation = loginSchema.safeParse({ email, password })

        if (!validation.success) {
            return {
                success: false,
                message: 'Datos de entrada inválidos',
                errors: validation.error.flatten().fieldErrors
            }
        }

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Buscar usuario en mock database
        const user = mockUsers.find(u => u.email === validation.data.email)

        if (!user || user.password !== validation.data.password) {
            return {
                success: false,
                message: 'Credenciales incorrectas'
            }
        }

        // Crear sesión
        await createSession({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        })

        return {
            success: true,
            message: 'Inicio de sesión exitoso'
        }

    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            message: 'Error interno del servidor'
        }
    }
}

/**
 * Acción para registro de nuevos usuarios
 */
export async function registerAction(formData: FormData): Promise<AuthResponse> {
    try {
        // Extraer datos del formulario
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Validar datos
        const validation = registerSchema.safeParse({
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        })

        if (!validation.success) {
            return {
                success: false,
                message: 'Datos de entrada inválidos',
                errors: validation.error.flatten().fieldErrors
            }
        }

        // Verificar si el usuario ya existe
        const existingUser = mockUsers.find(u => u.email === validation.data.email)
        if (existingUser) {
            return {
                success: false,
                message: 'Ya existe una cuenta con este email'
            }
        }

        // Simular delay de registro
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Crear nuevo usuario (en producción: enviar al backend)
        const newUser: User = {
            id: String(Date.now()),
            email: validation.data.email,
            firstName: validation.data.firstName,
            lastName: validation.data.lastName,
            role: 'estudiante' // Por defecto
        }

        // Agregar a mock database
        mockUsers.push({ ...newUser, password: validation.data.password })

        // Crear sesión automáticamente
        await createSession(newUser)

        return {
            success: true,
            message: 'Registro exitoso'
        }

    } catch (error) {
        console.error('Register error:', error)
        return {
            success: false,
            message: 'Error interno del servidor'
        }
    }
}

/**
 * Acción para logout
 */
export async function logoutAction(): Promise<void> {
    await destroySession()
    redirect('/login')
}

/**
 * Acción para obtener el usuario actual
 */
export async function getCurrentUser(): Promise<User | null> {
    return await getSession()
}

/**
 * Acción para verificar si el usuario está autenticado
 */
export async function requireAuth(): Promise<User> {
    const user = await getSession()

    if (!user) {
        redirect('/login')
    }

    return user
}

/**
 * Acción para verificar permisos específicos
 */
export async function requireRole(requiredRole: User['role']): Promise<User> {
    const user = await requireAuth()

    if (user.role !== requiredRole && user.role !== 'administrador') {
        redirect('/unauthorized')
    }

    return user
}

/**
 * Middleware para login exitoso - redirige según rol
 */
export async function redirectAfterLogin(): Promise<never> {
    const user = await getSession()

    if (!user) {
        redirect('/login')
    }

    // Redirigir según el rol del usuario
    switch (user.role) {
        case 'administrador':
            redirect('/admin')
        case 'profesor':
        case 'profesor_editor':
            redirect('/courses')
        case 'ayudante':
            redirect('/classroom')
        case 'estudiante':
        default:
            redirect('/dashboard')
    }
}