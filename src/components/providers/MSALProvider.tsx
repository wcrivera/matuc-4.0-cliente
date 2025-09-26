// src/components/providers/MSALProvider.tsx - Provider MSAL para la aplicación
'use client'

import React, { useEffect } from 'react'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance, initializeMsal } from '../../lib/config/msal.config'

interface MSALProviderWrapperProps {
    children: React.ReactNode
}

export function MSALProviderWrapper({ children }: MSALProviderWrapperProps) {
    useEffect(() => {
        // Inicializar MSAL cuando se monta el componente
        const initMsal = async () => {
            try {
                await initializeMsal()
                console.log('🔐 MSAL Provider inicializado')
            } catch (error) {
                console.error('❌ Error inicializando MSAL Provider:', error)
            }
        }

        initMsal()
    }, [])

    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    )
}