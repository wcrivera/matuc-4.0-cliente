// src/app/layout.tsx - Root Layout de la aplicación
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://matuc.uc.cl'),
  title: 'MATUC v4 - Plataforma Educativa Matemática',
  description: 'La plataforma educativa más avanzada para el aprendizaje de matemáticas en tiempo real. Diseñada para la excelencia académica UC.',
  keywords: ['matemáticas', 'educación', 'universidad', 'LaTeX', 'UC', 'Chile'],
  authors: [{ name: 'Universidad Católica de Chile' }],
  creator: 'UC - Pontificia Universidad Católica de Chile',
  publisher: 'Universidad Católica',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'MATUC v4 - Matemáticas del Futuro',
    description: 'Plataforma educativa avanzada para matemáticas universitarias con LaTeX en tiempo real',
    url: 'https://matuc.uc.cl',
    siteName: 'MATUC',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MATUC - Plataforma Educativa Matemática',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATUC v4 - Matemáticas del Futuro',
    description: 'La plataforma educativa más avanzada para matemáticas universitarias',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es-CL"
      className={`${inter.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch para assets UC */}
        <link rel="dns-prefetch" href="//cdn.uc.cl" />

        {/* Viewport optimizado */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Theme color UC */}
        <meta name="theme-color" content="#003f7f" />
        <meta name="msapplication-TileColor" content="#003f7f" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>

      <body
        className={`${inter.className} antialiased bg-gray-50 text-gray-900 min-h-screen`}
        suppressHydrationWarning
      >
        {/* Skip to main content para accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-uc-azul text-white px-4 py-2 rounded-lg z-50 transition-all duration-200"
        >
          Saltar al contenido principal
        </a>

        {/* Providers que envuelven toda la aplicación */}
        <AppProviders>
          {/* Main content */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </AppProviders>

        {/* Performance monitoring script placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Web Vitals monitoring
                if ('performance' in window && 'PerformanceObserver' in window) {
                  console.log('🚀 MATUC v4 Performance Monitoring Active');
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}