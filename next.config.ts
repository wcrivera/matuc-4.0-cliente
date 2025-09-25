/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar características experimentales de Next.js 15
  experimental: {
    // Turbopack para desarrollo ultra-rápido
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    },
    // Optimizaciones de imports para librerías grandes
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      'framer-motion',
      'katex'
    ],
    // Typed routes estables en Next.js 15
    typedRoutes: true
  },

  // Configuración de imágenes optimizada para contenido educativo
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuración de headers de seguridad para plataforma educativa
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Permitir conexiones WebSocket para tiempo real
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''
          }
        ],
      },
    ]
  },

  // Redirecciones para mejor UX
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/courses',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin/users',
        permanent: false,
      }
    ]
  },

  // Configuración del compilador para producción
  compiler: {
    // Remover console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuración específica para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Strict mode para desarrollo
    reactStrictMode: true,
  }),

  // Configuración específica para producción  
  ...(process.env.NODE_ENV === 'production' && {
    // Optimizaciones de producción
    swcMinify: true,
    compress: true,
  }),
}

export default nextConfig