// middleware.ts - Protección de rutas a nivel de Next.js 15
import { NextRequest, NextResponse } from 'next/server'
import type { User, UserRole } from '@/types/user.types'

// Configuración de rutas protegidas y públicas
const AUTH_ROUTES = ['/login', '/register']
const PUBLIC_ROUTES = ['/', '/about', '/contact', '/demo']
const PROTECTED_ROUTES = {
    // Rutas que requieren autenticación básica
    AUTHENTICATED: ['/dashboard', '/courses', '/exercises', '/analytics', '/classroom'],
    // Rutas que requieren rol específico
    ADMIN_ONLY: ['/admin'],
    // Rutas de profesores
    TEACHER_ROUTES: ['/courses/create', '/courses/edit', '/analytics/advanced'],
    // Rutas de API protegidas
    API_PROTECTED: ['/api/courses', '/api/exercises', '/api/users', '/api/analytics']
}

// Función para verificar si una ruta coincide con algún patrón
function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some(route => pathname.startsWith(route))
}

// Función para obtener datos del usuario desde cookies/headers
async function getUserFromRequest(request: NextRequest): Promise<User | null> {
    try {
        // Intentar obtener token de las cookies
        const token = request.cookies.get('auth-token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) {
            return null
        }

        // En un escenario real, aquí verificarías el JWT
        // Por ahora, simulamos la verificación
        // TODO: Implementar verificación real de JWT

        // Simular extracción de datos del token
        // En producción esto debe usar jsonwebtoken.verify()
        const userData = await verifyAuthToken(token)
        return userData

    } catch (error) {
        console.error('Error verificando usuario en middleware:', error)
        return null
    }
}

// Función placeholder para verificación de token
// TODO: Implementar verificación real
async function verifyAuthToken(token: string): Promise<User | null> {
    // Placeholder - en producción debe verificar JWT real
    // y obtener datos del usuario de la base de datos
    try {
        // Simular verificación (reemplazar con lógica real)
        if (token === 'invalid') {
            return null
        }

        // Retornar datos simulados por ahora
        // En producción, decodificar JWT y obtener usuario real
        return null
    } catch {
        return null
    }
}

// Función para verificar permisos de rol
function hasRolePermission(user: User, pathname: string): boolean {
    const role = user.role as UserRole  // Forzar tipo explícito

    // Administradores tienen acceso a todo
    if (role === 'administrador') {
        return true
    }

    // Verificar rutas específicas de admin
    if (matchesRoute(pathname, PROTECTED_ROUTES.ADMIN_ONLY)) {
        return role === 'administrador'
    }

    // Verificar rutas de profesores
    if (matchesRoute(pathname, PROTECTED_ROUTES.TEACHER_ROUTES)) {
        const allowedRoles: UserRole[] = ['profesor', 'profesor_editor', 'administrador']
        return allowedRoles.includes(role)
    }

    // Para otras rutas protegidas, solo requiere estar autenticado
    return true
}

// Middleware principal
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES)
    const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES)
    const isProtectedRoute = matchesRoute(pathname, [
        ...PROTECTED_ROUTES.AUTHENTICATED,
        ...PROTECTED_ROUTES.ADMIN_ONLY,
        ...PROTECTED_ROUTES.TEACHER_ROUTES
    ])
    const isApiRoute = matchesRoute(pathname, PROTECTED_ROUTES.API_PROTECTED)

    console.log('Middleware ejecutando:', {
        pathname,
        isAuthRoute,
        isPublicRoute,
        isProtectedRoute,
        isApiRoute
    })

    // Obtener información del usuario
    const user = await getUserFromRequest(request)
    const isAuthenticated = !!user

    // === MANEJO DE RUTAS DE AUTENTICACIÓN ===
    if (isAuthRoute) {
        if (isAuthenticated && user) {
            // Usuario ya autenticado visitando login -> redirigir a dashboard
            const redirectUrl = getUserRedirectUrl(user.role)
            console.log(`Usuario autenticado en auth route, redirigiendo a: ${redirectUrl}`)
            return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
        // Usuario no autenticado en ruta de auth -> permitir acceso
        return NextResponse.next()
    }

    // === MANEJO DE RUTAS PÚBLICAS ===
    if (isPublicRoute) {
        // Rutas públicas siempre permitidas
        return NextResponse.next()
    }

    // === MANEJO DE RUTAS PROTEGIDAS ===
    if (isProtectedRoute || isApiRoute) {
        if (!isAuthenticated) {
            // Usuario no autenticado intentando acceder a ruta protegida
            console.log('Usuario no autenticado en ruta protegida, redirigiendo a login')

            if (isApiRoute) {
                // Para rutas de API, retornar 401
                return NextResponse.json(
                    { error: 'No autorizado' },
                    { status: 401 }
                )
            }

            // Para rutas web, redirigir a login
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Usuario autenticado - verificar permisos de rol
        if (!hasRolePermission(user, pathname)) {
            console.log(`Usuario ${user.role} sin permisos para: ${pathname}`)

            if (isApiRoute) {
                // Para rutas de API, retornar 403
                return NextResponse.json(
                    { error: 'Acceso denegado' },
                    { status: 403 }
                )
            }

            // Para rutas web, redirigir a página de error
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Usuario autenticado con permisos correctos
        return NextResponse.next()
    }

    // Otras rutas no manejadas - permitir acceso
    return NextResponse.next()
}

// Función para determinar URL de redirección según rol
function getUserRedirectUrl(role: UserRole): string {
    const userRole = role as UserRole  // Asegurar tipo correcto

    switch (userRole) {
        case 'administrador':
            return '/admin'
        case 'profesor':
        case 'profesor_editor':
            return '/dashboard'
        case 'ayudante':
            return '/dashboard'
        case 'estudiante':
        default:
            return '/dashboard'
    }
}

// Configuración de Next.js - especifica qué rutas debe procesar el middleware
export const config = {
    matcher: [
        /*
         * Procesar todas las rutas excepto:
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (favicon)
         * - archivos estáticos en public/ (*.png, *.jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
    ],
}