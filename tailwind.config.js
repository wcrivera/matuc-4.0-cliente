import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Colores UC Oficiales
                uc: {
                    amarillo: "#ffc72c",
                    gris: "#666666",
                    // Variaciones para diferentes estados
                    azul: {
                        DEFAULT: "#003f7f", // Color principal UC
                        50: "#f0f7ff",
                        100: "#e0efff",
                        200: "#b9dcff",
                        300: "#7cc2ff",
                        400: "#36a5ff",
                        500: "#0088ff",
                        600: "#0070f3",
                        700: "#005bd3",
                        800: "#003f7f", // Color principal UC
                        900: "#002d5a",
                        950: "#001a33"
                    },
                    celeste: {
                        DEFAULT: "#00a0d1", // Color principal UC
                        50: "#f0fcff",
                        100: "#e0f8ff",
                        200: "#b8f0ff",
                        300: "#78e5ff",
                        400: "#00a0d1", // Color principal UC
                        500: "#0094c6",
                        600: "#0077a3",
                        700: "#005f82",
                        800: "#004862",
                        900: "#003142"
                    }
                },
                // Sistema de colores moderno
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#003f7f", // UC Azul
                    foreground: "hsl(var(--primary-foreground))",
                    50: "#f0f7ff",
                    100: "#e0efff",
                    200: "#b9dcff",
                    300: "#7cc2ff",
                    400: "#36a5ff",
                    500: "#0088ff",
                    600: "#0070f3",
                    700: "#005bd3",
                    800: "#003f7f",
                    900: "#002d5a"
                },
                secondary: {
                    DEFAULT: "#00a0d1", // UC Celeste
                    foreground: "hsl(var(--secondary-foreground))",
                    50: "#f0fcff",
                    100: "#e0f8ff",
                    200: "#b8f0ff",
                    300: "#78e5ff",
                    400: "#00a0d1",
                    500: "#0094c6",
                    600: "#0077a3"
                },
                accent: {
                    DEFAULT: "#ffc72c", // UC Amarillo
                    foreground: "hsl(var(--accent-foreground))",
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#ffc72c",
                    500: "#f59e0b",
                    600: "#d97706"
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem"
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
                math: ['KaTeX_Main', 'Times New Roman', 'serif']
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }]
            },
            animation: {
                // Animaciones básicas mejoradas
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-out': 'fadeOut 0.5s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-subtle': 'bounceSubtle 0.6s ease-out',

                // Animaciones avanzadas
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'rubber': 'rubber 0.8s ease-out',

                // Animaciones matemáticas
                'math-appear': 'mathAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'latex-render': 'latexRender 0.4s ease-out',
                'equation-solve': 'equationSolve 1.2s ease-in-out',

                // Animaciones de feedback
                'success-bounce': 'successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'error-shake': 'errorShake 0.5s ease-in-out',
                'loading-dots': 'loadingDots 1.4s ease-in-out infinite',

                // Animaciones de glassmorphism
                'glass-float': 'glassFloat 6s ease-in-out infinite',
                'backdrop-blur-in': 'backdropBlurIn 0.3s ease-out'
            },
            keyframes: {
                // Básicas
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                bounceSubtle: {
                    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
                    '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
                    '70%': { transform: 'translate3d(0, -4px, 0)' },
                    '90%': { transform: 'translate3d(0, -2px, 0)' }
                },

                // Avanzadas
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 63, 127, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 160, 209, 0.8)' }
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' }
                },

                // Matemáticas
                mathAppear: {
                    '0%': {
                        transform: 'scale(0.8) translateY(10px)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'scale(1) translateY(0)',
                        opacity: '1'
                    }
                },

                // Feedback
                successBounce: {
                    '0%': { transform: 'scale(0.3)' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' }
                },
                errorShake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
                }
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                'glow': '0 0 20px rgba(0, 160, 209, 0.3)',
                'glow-strong': '0 0 30px rgba(0, 160, 209, 0.6)',
                'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
                'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
            }
        },
    },
    plugins: [tailwindcssAnimate],
}

export default config