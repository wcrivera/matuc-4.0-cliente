// src/components/courses/RoleBadge.tsx
// ==========================================
// 🎯 BADGE DE ROL DE USUARIO EN CURSO
// ==========================================

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
    GraduationCap,
    Users,
    Award,
    Edit,
} from 'lucide-react'

// ==========================================
// 🎨 CONFIGURACIÓN DE ROLES
// ==========================================

interface RoleConfig {
    label: string
    color: string
    icon: LucideIcon
}

const ROLE_CONFIG: Record<string, RoleConfig> = {
    'estudiante': {
        label: 'Estudiante',
        color: 'bg-blue-100 text-blue-700',
        icon: GraduationCap
    },
    'ayudante': {
        label: 'Ayudante',
        color: 'bg-purple-100 text-purple-700',
        icon: Users
    },
    'profesor': {
        label: 'Profesor',
        color: 'bg-green-100 text-green-700',
        icon: Award
    },
    'profesor_editor': {
        label: 'Editor',
        color: 'bg-orange-100 text-orange-700',
        icon: Edit
    },
}

// ==========================================
// 🎯 PROPS
// ==========================================

interface RoleBadgeProps {
    rol: string
    className?: string
}

// ==========================================
// 🎨 COMPONENTE
// ==========================================

export function RoleBadge({ rol, className = '' }: RoleBadgeProps) {
    const config = ROLE_CONFIG[rol] || ROLE_CONFIG['estudiante']
    const Icon = config.icon

    return (
        <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{config.label}</span>
        </div>
    )
}