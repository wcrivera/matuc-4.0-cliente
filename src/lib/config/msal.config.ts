// src/lib/config/msal.config.ts - Configuración MSAL para UC
import { Configuration, PublicClientApplication, LogLevel, AccountInfo } from '@azure/msal-browser'

// Configuración MSAL para Universidad Católica
export const msalConfig: Configuration = {
    auth: {
        // TODO: Reemplazar con los valores reales de la UC
        clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'your-client-id-here',
        authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
        postLogoutRedirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: 'sessionStorage', // Usar sessionStorage para mayor seguridad
        storeAuthStateInCookie: false, // No necesario en navegadores modernos
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error('MSAL Error:', message)
                        return
                    case LogLevel.Info:
                        console.info('MSAL Info:', message)
                        return
                    case LogLevel.Verbose:
                        console.debug('MSAL Verbose:', message)
                        return
                    case LogLevel.Warning:
                        console.warn('MSAL Warning:', message)
                        return
                    default:
                        return
                }
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Warning // Solo warnings y errores en producción
        }
    }
}

// Request de login - scopes que necesitamos
export const loginRequest = {
    scopes: [
        'openid',           // Información básica del usuario
        'profile',          // Perfil del usuario
        'email',            // Email del usuario
        'User.Read'         // Leer perfil del usuario de Microsoft Graph
    ],
    prompt: 'select_account' as const // Permitir selección de cuenta
}

// Request para obtener token silencioso
export const silentRequest = {
    scopes: ['openid', 'profile', 'email', 'User.Read'],
    account: null as AccountInfo | null // Se seteará dinámicamente
}

// Instancia principal de MSAL
export const msalInstance = new PublicClientApplication(msalConfig)

// Inicializar MSAL de forma asíncrona
export const initializeMsal = async (): Promise<void> => {
    try {
        await msalInstance.initialize()
        console.log('✅ MSAL inicializado correctamente')
    } catch (error) {
        console.error('❌ Error inicializando MSAL:', error)
        throw error
    }
}

// Función helper para obtener cuenta activa
export const getActiveAccount = () => {
    return msalInstance.getActiveAccount()
}

// Función helper para obtener todas las cuentas
export const getAllAccounts = () => {
    return msalInstance.getAllAccounts()
}