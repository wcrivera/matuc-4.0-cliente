// src/components/auth/PermissionGate.tsx
// ==========================================
// 🛡️ COMPONENTE DE CONTROL DE PERMISOS
// ==========================================

'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/stores/auth.store'
import type { User } from '@/types/user.types'

// ==========================================
// 🎯 TIPOS DE PERMISOS DISPONIBLES
// ==========================================

export type PermissionType =
    // Permisos generales
    | 'isAuthenticated'
    | 'isAdmin'

    // Permisos de contenido
    | 'canEditContent'
    | 'canCreateContent'
    | 'canDeleteContent'
    | 'canEnableContent'

    // Permisos de cursos
    | 'canCreateCourse'
    | 'canEditCourse'
    | 'canDeleteCourse'
    | 'canViewAllCourses'

    // Permisos de matrícula
    | 'canManageEnrollments'
    | 'canCreateEnrollment'
    | 'canEditEnrollment'
    | 'canDeleteEnrollment'
    | 'canViewStudents'

    // Permisos de grupos
    | 'canManageGroups'
    | 'canCreateGroup'
    | 'canEditGroup'
    | 'canDeleteGroup'
    | 'canAssignStudents'

    // Permisos de estadísticas
    | 'canViewStatistics'
    | 'canViewGlobalStatistics'
    | 'canExportData'

    // Permisos de usuarios
    | 'canManageUsers'
    | 'canViewUsers'
    | 'canEditUsers'

// ==========================================
// 🔍 FUNCIÓN DE VERIFICACIÓN DE PERMISOS
// ==========================================

function checkPermission(user: User | null, permission: PermissionType): boolean {
    if (!user) return false

    // Administradores tienen todos los permisos
    if (user.admin) return true

    switch (permission) {
        // Permisos generales
        case 'isAuthenticated':
            return true // Si llegó aquí, está autenticado

        case 'isAdmin':
            return user.admin

        // Permisos de contenido
        case 'canEditContent':
            return user.role === 'profesor_editor' || user.admin

        case 'canCreateContent':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canDeleteContent':
            return user.admin

        case 'canEnableContent':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        // Permisos de cursos
        case 'canCreateCourse':
            return user.admin

        case 'canEditCourse':
            return user.role === 'profesor_editor' || user.admin

        case 'canDeleteCourse':
            return user.admin

        case 'canViewAllCourses':
            return user.admin

        // Permisos de matrícula
        case 'canManageEnrollments':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canCreateEnrollment':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canEditEnrollment':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canDeleteEnrollment':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canViewStudents':
            return user.role !== 'estudiante' || user.admin

        // Permisos de grupos
        case 'canManageGroups':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canCreateGroup':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canEditGroup':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canDeleteGroup':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        case 'canAssignStudents':
            return ['profesor', 'profesor_editor', 'ayudante'].includes(user.role) || user.admin

        // Permisos de estadísticas
        case 'canViewStatistics':
            return user.role !== 'estudiante' || user.admin

        case 'canViewGlobalStatistics':
            return user.admin

        case 'canExportData':
            return ['profesor', 'profesor_editor'].includes(user.role) || user.admin

        // Permisos de usuarios
        case 'canManageUsers':
            return user.admin

        case 'canViewUsers':
            return ['profesor', 'profesor_editor', 'ayudante'].includes(user.role) || user.admin

        case 'canEditUsers':
            return user.admin

        default:
            return false
    }
}

// ==========================================
// 🎨 PROPS DEL COMPONENTE
// ==========================================

interface PermissionGateProps {
    children: ReactNode
    permission: PermissionType
    fallback?: ReactNode
    showUnauthorized?: boolean
}

// ==========================================
// 🛡️ COMPONENTE PRINCIPAL
// ==========================================

export function PermissionGate({
    children,
    permission,
    fallback = null,
    showUnauthorized = false
}: PermissionGateProps) {
    const { user } = useAuth()

    const hasPermission = checkPermission(user, permission)

    // Si no tiene permiso
    if (!hasPermission) {
        // Mostrar mensaje de no autorizado si está habilitado
        if (showUnauthorized) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                        No tienes permisos para ver este contenido
                    </p>
                </div>
            )
        }

        // O mostrar el fallback personalizado
        return <>{fallback}</>
    }

    // Si tiene permiso, mostrar el contenido
    return <>{children}</>
}

// ==========================================
// 🎯 VARIANTES DEL COMPONENTE
// ==========================================

// Gate específico para administradores
export function AdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <PermissionGate permission="isAdmin" fallback={fallback}>
            {children}
        </PermissionGate>
    )
}

// Gate específico para profesores (profesor + profesor_editor)
export function TeacherGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    const { user } = useAuth()
    const isTeacher = user && ['profesor', 'profesor_editor'].includes(user.role)

    if (!isTeacher) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

// Gate específico para editores
export function EditorGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <PermissionGate permission="canEditContent" fallback={fallback}>
            {children}
        </PermissionGate>
    )
}

// Gate que muestra diferentes contenidos según el rol
interface RoleBasedContentProps {
    estudiante?: ReactNode
    ayudante?: ReactNode
    profesor?: ReactNode
    profesor_editor?: ReactNode
    administrador?: ReactNode
    fallback?: ReactNode
}

export function RoleBasedContent({
    estudiante,
    ayudante,
    profesor,
    profesor_editor,
    administrador,
    fallback
}: RoleBasedContentProps) {
    const { user } = useAuth()

    if (!user) return <>{fallback}</>

    // Administrador tiene prioridad
    if (user.admin && administrador) {
        return <>{administrador}</>
    }

    // Luego por rol específico
    switch (user.role) {
        case 'estudiante':
            return <>{estudiante || fallback}</>
        case 'ayudante':
            return <>{ayudante || fallback}</>
        case 'profesor':
            return <>{profesor || fallback}</>
        case 'profesor_editor':
            return <>{profesor_editor || fallback}</>
        default:
            return <>{fallback}</>
    }
}

// ==========================================
// 🎣 HOOK PERSONALIZADO PARA PERMISOS
// ==========================================

export function usePermissions() {
    const { user } = useAuth()

    return {
        // Verificar permiso específico
        can: (permission: PermissionType) => checkPermission(user, permission),

        // Verificar múltiples permisos (todos deben cumplirse)
        canAll: (...permissions: PermissionType[]) =>
            permissions.every(p => checkPermission(user, p)),

        // Verificar múltiples permisos (al menos uno debe cumplirse)
        canAny: (...permissions: PermissionType[]) =>
            permissions.some(p => checkPermission(user, p)),

        // Información del usuario
        isAdmin: user?.admin || false,
        isTeacher: user ? ['profesor', 'profesor_editor'].includes(user.role) : false,
        isEditor: user?.role === 'profesor_editor' || false,
        isStudent: user?.role === 'estudiante',
        isHelper: user?.role === 'ayudante',

        // Rol actual
        role: user?.role,
    }
}