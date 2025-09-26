// middleware.ts - Colócalo en la RAÍZ del proyecto (mismo nivel que package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuración de rutas
const PUBLIC_ROUTES = ['/', '/about', '/contact']
const AUTH_ROUTES = ['/login', '/register', '/auth']
const PROTECTED_ROUTES = ['/dashboard', '/courses', '/exercises', '/analytics', '/classroom']
const ADMIN_ROUTES = ['/admin']

// Función para verificar si una ruta coincide con algún patrón
function matchesRoute(pathname: string, routes: string[]): boolean {
    return routes.some(route => pathname.startsWith(route))
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Obtener token de las cookies (más seguro que localStorage)
    const token = request.cookies.get('matuc_token')?.value
    const userRole = request.cookies.get('matuc_role')?.value

    console.log('🛡️ Middleware - Ruta:', pathname, 'Token:', token ? '✅' : '❌')

    // 1. Rutas públicas - siempre permitidas
    if (matchesRoute(pathname, PUBLIC_ROUTES)) {
        return NextResponse.next()
    }

    // 2. Rutas de autenticación
    if (matchesRoute(pathname, AUTH_ROUTES)) {
        if (token) {
            // Usuario ya autenticado, redirigir al dashboard apropiado
            const dashboardUrl = userRole === 'administrador' ? '/admin' : '/dashboard'
            console.log('🔄 Redirigiendo usuario autenticado a:', dashboardUrl)
            return NextResponse.redirect(new URL(dashboardUrl, request.url))
        }
        // Usuario no autenticado, permitir acceso a login
        return NextResponse.next()
    }

    // 3. Rutas de administrador
    if (matchesRoute(pathname, ADMIN_ROUTES)) {
        if (!token) {
            console.log('❌ Acceso denegado a admin - sin token')
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (userRole !== 'administrador') {
            console.log('❌ Acceso denegado a admin - sin permisos')
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // 4. Rutas protegidas generales
    if (matchesRoute(pathname, PROTECTED_ROUTES)) {
        if (!token) {
            console.log('❌ Acceso denegado - sin token, redirigiendo a login')
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    // 5. Cualquier otra ruta - permitir por defecto
    return NextResponse.next()
}

// Configurar en qué rutas ejecutar el middleware
export const config = {
    // Ejecutar en todas las rutas excepto archivos estáticos y API routes
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}