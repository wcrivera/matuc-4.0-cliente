// src/types/user.types.ts - Tipos centralizados de usuario CONSOLIDADOS
export type UserRole =
    | 'estudiante'
    | 'ayudante'
    | 'profesor'
    | 'profesor_editor'
    | 'administrador'

export interface User {
    uid: string
    nombre: string
    apellido: string
    email: string
    admin: boolean
    role: UserRole
    ultimaConexion?: Date
    conectado: boolean
    avatar?: string
    // Campos adicionales opcionales
    telefono?: string
    rut?: string
    carrera?: string
    cohorte?: string
    activo?: boolean
}

// ==========================================
// INTERFACES OUTLOOK (mantener compatibilidad)
// ==========================================
export interface UserOutlook {
    id: string,
    mail: string,
    givenName: string,
    surname: string,
    userPrincipalName: string,
    jobTitle: string,
}

// ==========================================
// INTERFACES BACKEND LEGACY (compatibilidad)
// ==========================================
export interface Usuario {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    admin: boolean;
    rol: UserRole;  // Usar el tipo unificado
    createdAt: Date;
    ultimaConexion?: Date;
    conectado?: boolean;
    // Campos adicionales opcionales
    telefono?: string;
    foto?: string;
    departamento?: string;
    cargo?: string;
}

export interface UserResponse {
    uid: string;
    nombre: string;
    apellido: string;
    email: string;
    admin: boolean;
    rol: UserRole;  // Usar el tipo unificado
    createdAt?: Date;
    ultimaConexion?: Date;
}

export interface CreateUserRequest {
    email: string;
    nombre: string;
    apellido: string;
    admin?: boolean;
    rol?: UserRole;  // Usar el tipo unificado
}

// ==========================================
// ESTADOS DE AUTENTICACIÓN
// ==========================================
export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

// Respuestas del backend
export interface AuthResponse {
    ok: boolean
    message: string
    usuario?: BackendUser
    token?: string
}

// Formato de usuario que viene del backend (para mapear)
export interface BackendUser {
    uid: string
    nombre: string
    apellido: string
    email: string
    admin: boolean
    ultimaConexion?: string | Date
    conectado?: boolean
    activo?: boolean
    // Otros campos que pueda tener el backend
}

// ==========================================
// PERMISOS Y ROLES
// ==========================================
export interface Permission {
    id: string
    name: string
    description: string
}

export interface RolePermissions {
    role: UserRole
    permissions: Permission[]
    canAccess: string[] // Rutas que puede acceder
    redirectTo: string  // Ruta por defecto tras login
}

// Configuración de roles COMPLETA con administrador
export const ROLE_CONFIG: Record<UserRole, RolePermissions> = {
    estudiante: {
        role: 'estudiante',
        permissions: [
            { id: 'view_courses', name: 'Ver cursos', description: 'Puede ver cursos asignados' },
            { id: 'submit_exercises', name: 'Enviar ejercicios', description: 'Puede resolver ejercicios' },
            { id: 'view_progress', name: 'Ver progreso', description: 'Puede ver su progreso' }
        ],
        canAccess: ['/dashboard', '/courses', '/exercises', '/progress'],
        redirectTo: '/dashboard'
    },
    ayudante: {
        role: 'ayudante',
        permissions: [
            { id: 'view_courses', name: 'Ver cursos', description: 'Puede ver cursos asignados' },
            { id: 'moderate_classroom', name: 'Moderar aula', description: 'Puede moderar aula virtual' },
            { id: 'help_students', name: 'Ayudar estudiantes', description: 'Puede responder consultas' },
            { id: 'view_basic_analytics', name: 'Analytics básicas', description: 'Puede ver estadísticas básicas' }
        ],
        canAccess: ['/dashboard', '/courses', '/classroom', '/analytics'],
        redirectTo: '/dashboard'
    },
    profesor: {
        role: 'profesor',
        permissions: [
            { id: 'create_courses', name: 'Crear cursos', description: 'Puede crear cursos' },
            { id: 'manage_exercises', name: 'Gestionar ejercicios', description: 'Puede crear y editar ejercicios' },
            { id: 'view_analytics', name: 'Ver analytics', description: 'Puede ver todas las métricas' },
            { id: 'manage_students', name: 'Gestionar estudiantes', description: 'Puede gestionar estudiantes' }
        ],
        canAccess: ['/dashboard', '/courses', '/exercises', '/analytics', '/classroom'],
        redirectTo: '/dashboard'
    },
    profesor_editor: {
        role: 'profesor_editor',
        permissions: [
            { id: 'create_courses', name: 'Crear cursos', description: 'Puede crear cursos' },
            { id: 'edit_any_course', name: 'Editar cualquier curso', description: 'Puede editar cursos de otros' },
            { id: 'manage_exercises', name: 'Gestionar ejercicios', description: 'Puede crear y editar ejercicios' },
            { id: 'view_analytics', name: 'Ver analytics', description: 'Puede ver todas las métricas' },
            { id: 'manage_students', name: 'Gestionar estudiantes', description: 'Puede gestionar estudiantes' }
        ],
        canAccess: ['/dashboard', '/courses', '/exercises', '/analytics', '/classroom'],
        redirectTo: '/dashboard'
    },
    administrador: {
        role: 'administrador',
        permissions: [
            { id: 'manage_users', name: 'Gestionar usuarios', description: 'Puede crear, editar y eliminar usuarios' },
            { id: 'manage_system', name: 'Gestionar sistema', description: 'Puede configurar el sistema' },
            { id: 'view_all_analytics', name: 'Ver todas las analytics', description: 'Acceso completo a métricas' },
            { id: 'manage_permissions', name: 'Gestionar permisos', description: 'Puede asignar roles y permisos' }
        ],
        canAccess: ['/admin', '/dashboard', '/courses', '/exercises', '/analytics', '/classroom'],
        redirectTo: '/admin'
    }
}

// ==========================================
// UTILIDADES DE TIPOS
// ==========================================
export function mapBackendUserToUser(backendUser: BackendUser): User {
    return {
        uid: backendUser.uid,
        nombre: backendUser.nombre,
        apellido: backendUser.apellido,
        email: backendUser.email,
        admin: backendUser.admin,
        role: backendUser.admin ? 'administrador' : 'estudiante', // Por defecto, se puede mejorar
        conectado: backendUser.conectado ?? true,
        ultimaConexion: backendUser.ultimaConexion
            ? new Date(backendUser.ultimaConexion)
            : new Date(),
        activo: backendUser.activo ?? true
    }
}

export function getUserDisplayName(user: User): string {
    return `${user.nombre} ${user.apellido}`
}

export function getUserPermissions(role: UserRole): Permission[] {
    return ROLE_CONFIG[role]?.permissions ?? []
}

export function getUserAccessibleRoutes(role: UserRole): string[] {
    return ROLE_CONFIG[role]?.canAccess ?? []
}

export function getUserDefaultRoute(role: UserRole): string {
    return ROLE_CONFIG[role]?.redirectTo ?? '/dashboard'
}

export function canUserAccessRoute(user: User, route: string): boolean {
    const accessibleRoutes = getUserAccessibleRoutes(user.role)
    return accessibleRoutes.some(allowedRoute => route.startsWith(allowedRoute))
}

export function hasPermission(user: User, permissionId: string): boolean {
    const userPermissions = getUserPermissions(user.role)
    return userPermissions.some(permission => permission.id === permissionId)
}