// src/lib/mock/chapter-mock-data.ts
// ==========================================
// 🎨 DATOS MOCK HERMOSOS - CAPÍTULO MATEMÁTICO
// ==========================================

import type {
    CapituloVistaCompleta,
    CapituloFiltrado,
    TemaFiltrado,
    
    EjercicioAyudantiaFiltrado,
    EjercicioEvaluacionEstudiante,
    PreguntaEvaluacion,
    PermisosCapitulo,
    ProgresoCapitulo,
    
} from '@/types/chapter.types'

// ==========================================
// 📚 CAPÍTULO: ECUACIONES DE LA RECTA
// ==========================================

const MOCK_CAPITULO: CapituloFiltrado = {
    id: 'cap-001',
    titulo: 'Ecuaciones de la Recta y Parábola',
    descripcion:
        'Estudio completo de ecuaciones lineales, sistemas de ecuaciones y sus aplicaciones en geometría analítica. Incluye análisis de pendientes, intersecciones y modelos lineales.',
    orden: 1,
    visible: true,
    objetivos: [
        'Dominar las diferentes formas de la ecuación de la recta',
        'Resolver sistemas de ecuaciones lineales',
        'Aplicar ecuaciones lineales en problemas del mundo real',
        'Analizar gráficamente ecuaciones y sistemas',
    ],
    cursoId: 'curso-mat1610',
    temas: [], // Se llena abajo
    temasTotales: 4,
    temasVisibles: 4,
    contenidosTotales: 12,
    contenidosHabilitados: 12,
    contenidosCompletados: 5,
    porcentajeProgreso: 41.67,
    duracionTotalMinutos: 180,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
}

// ==========================================
// 📝 TEMA 1: PLANO CARTESIANO
// ==========================================

const TEMA_1: TemaFiltrado = {
    id: 'tema-001',
    titulo: 'Plano Cartesiano y Distancia entre Puntos',
    descripcion: 'Fundamentos del plano cartesiano, coordenadas y cálculo de distancias',
    orden: 1,
    tipo: 'teorico',
    visible: true,
    estimacionMinutos: 45,
    contenidos: [
        {
            id: 'cont-001',
            titulo: 'Introducción al Plano Cartesiano',
            tipo: 'teoria',
            contenido: `
        <h3>El Plano Cartesiano</h3>
        <p>El plano cartesiano es un sistema de coordenadas bidimensional que permite representar puntos mediante pares ordenados (x, y).</p>
        <p>Está formado por dos rectas perpendiculares llamadas <strong>ejes coordenados</strong>:</p>
        <ul>
          <li><strong>Eje X</strong> (horizontal): Eje de las abscisas</li>
          <li><strong>Eje Y</strong> (vertical): Eje de las ordenadas</li>
        </ul>
        <p>El punto de intersección de ambos ejes se llama <strong>origen</strong> y se denota como O(0,0).</p>
      `,
            orden: 1,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 10,
            habilitado: true,
            completado: true,
            fechaCompletado: '2024-03-15T10:30:00Z',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-002',
            titulo: 'Video: Visualizando el Plano Cartesiano',
            tipo: 'video',
            contenido: 'https://www.youtube.com/watch?v=example-plano-cartesiano',
            orden: 2,
            visible: true,
            obligatorio: false,
            completable: true,
            duracionEstimadaMinutos: 8,
            habilitado: true,
            completado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-003',
            titulo: 'Fórmula de Distancia entre Puntos',
            tipo: 'latex',
            contenido: `
        <h3>Distancia entre Dos Puntos</h3>
        <p>Dados dos puntos $A(x_1, y_1)$ y $B(x_2, y_2)$ en el plano cartesiano, la distancia entre ellos se calcula mediante:</p>
        <div class="formula-box">
          $$d(A,B) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
        </div>
        <h4>Ejemplo:</h4>
        <p>Calcular la distancia entre $A(-2, 0)$ y $B=(1, -4)$:</p>
        <p>$$d = \\sqrt{(1-(-2))^2 + (-4-0)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$$</p>
      `,
            orden: 3,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 15,
            habilitado: true,
            completado: false,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-004',
            titulo: 'Ejercicio Guiado: Punto Medio',
            tipo: 'ejemplo',
            contenido: `
        <h3>Punto Medio de un Segmento</h3>
        <p>El punto medio M entre $A(x_1, y_1)$ y $B(x_2, y_2)$ es:</p>
        <div class="formula-box">
          $$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$
        </div>
        <h4>Ejercicio:</h4>
        <p>Encuentra el punto medio entre $P(6, -2)$ y $Q=(-4, 8)$</p>
        <details>
          <summary>Ver solución</summary>
          <p>$$M = \\left(\\frac{6 + (-4)}{2}, \\frac{-2 + 8}{2}\\right) = \\left(\\frac{2}{2}, \\frac{6}{2}\\right) = (1, 3)$$</p>
        </details>
      `,
            orden: 4,
            visible: true,
            obligatorio: false,
            completable: true,
            duracionEstimadaMinutos: 12,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
    ],
    contenidosTotales: 4,
    contenidosHabilitados: 4,
    contenidosCompletados: 2,
    porcentajeProgreso: 50,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
}

// ==========================================
// 📝 TEMA 2: ECUACIÓN DE LA RECTA
// ==========================================

const TEMA_2: TemaFiltrado = {
    id: 'tema-002',
    titulo: 'Ecuación Principal de la Recta',
    descripcion: 'Estudio de la pendiente y la ecuación punto-pendiente',
    orden: 2,
    tipo: 'mixto',
    visible: true,
    estimacionMinutos: 50,
    contenidos: [
        {
            id: 'cont-005',
            titulo: 'Concepto de Pendiente',
            tipo: 'teoria',
            contenido: `
        <h3>Pendiente de una Recta</h3>
        <p>La pendiente $m$ de una recta que pasa por dos puntos $P_1(x_1, y_1)$ y $P_2(x_2, y_2)$ se define como:</p>
        <div class="formula-box">
          $$m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}$$
        </div>
        <h4>Interpretación:</h4>
        <ul>
          <li>$m > 0$: La recta es <strong>creciente</strong></li>
          <li>$m < 0$: La recta es <strong>decreciente</strong></li>
          <li>$m = 0$: La recta es <strong>horizontal</strong></li>
          <li>$m$ indefinida: La recta es <strong>vertical</strong></li>
        </ul>
      `,
            orden: 1,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 15,
            habilitado: true,
            completado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-006',
            titulo: 'Ecuación Punto-Pendiente',
            tipo: 'latex',
            contenido: `
        <h3>Forma Punto-Pendiente</h3>
        <p>Si conocemos un punto $(x_1, y_1)$ y la pendiente $m$, la ecuación de la recta es:</p>
        <div class="formula-box">
          $$y - y_1 = m(x - x_1)$$
        </div>
        <h4>Ejemplo:</h4>
        <p>Encuentra la ecuación de la recta que pasa por $(3, -2)$ con pendiente $m = 4$:</p>
        <p>$$y - (-2) = 4(x - 3)$$</p>
        <p>$$y + 2 = 4x - 12$$</p>
        <p>$$y = 4x - 14$$</p>
      `,
            orden: 2,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 20,
            habilitado: true,
            completado: false,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-007',
            titulo: 'Video: Ecuaciones de la Recta',
            tipo: 'video',
            contenido: 'https://www.youtube.com/watch?v=example-ecuacion-recta',
            orden: 3,
            visible: true,
            obligatorio: false,
            completable: true,
            duracionEstimadaMinutos: 15,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
    ],
    contenidosTotales: 3,
    contenidosHabilitados: 3,
    contenidosCompletados: 1,
    porcentajeProgreso: 33.33,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
}

// ==========================================
// 📝 TEMA 3: ECUACIÓN GENERAL
// ==========================================

const TEMA_3: TemaFiltrado = {
    id: 'tema-003',
    titulo: 'Ecuación General de la Recta',
    descripcion: 'Forma general Ax + By + C = 0 y conversiones',
    orden: 3,
    tipo: 'practico',
    visible: true,
    estimacionMinutos: 45,
    contenidos: [
        {
            id: 'cont-008',
            titulo: 'Forma General de la Recta',
            tipo: 'latex',
            contenido: `
        <h3>Ecuación General</h3>
        <p>Toda recta puede expresarse en la forma general:</p>
        <div class="formula-box">
          $$Ax + By + C = 0$$
        </div>
        <p>donde $A$, $B$ y $C$ son constantes reales, y $A$ y $B$ no son simultáneamente cero.</p>
        <h4>Propiedades:</h4>
        <ul>
          <li>Si $B = 0$: La recta es vertical ($x = k$)</li>
          <li>Si $A = 0$: La recta es horizontal ($y = k$)</li>
          <li>Pendiente: $m = -\\frac{A}{B}$ (si $B \\neq 0$)</li>
        </ul>
      `,
            orden: 1,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 15,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-009',
            titulo: 'Conversión de Formas',
            tipo: 'ejemplo',
            contenido: `
        <h3>Convertir entre Formas</h3>
        <h4>De Punto-Pendiente a General:</h4>
        <p>Dada $y - 2 = 3(x - 1)$:</p>
        <p>$$y - 2 = 3x - 3$$</p>
        <p>$$3x - y - 1 = 0$$</p>
        
        <h4>De General a Pendiente-Intersección:</h4>
        <p>Dada $2x + 3y - 6 = 0$:</p>
        <p>$$3y = -2x + 6$$</p>
        <p>$$y = -\\frac{2}{3}x + 2$$</p>
      `,
            orden: 2,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 20,
            habilitado: true,
            completado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-010',
            titulo: 'Simulación Interactiva: Rectas',
            tipo: 'simulacion',
            contenido: 'https://app-simulacion.matuc.cl/rectas-interactivo',
            orden: 3,
            visible: true,
            obligatorio: false,
            completable: true,
            duracionEstimadaMinutos: 10,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
    ],
    contenidosTotales: 3,
    contenidosHabilitados: 3,
    contenidosCompletados: 1,
    porcentajeProgreso: 33.33,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
}

// ==========================================
// 📝 TEMA 4: INTERSECCIONES Y MODELADO
// ==========================================

const TEMA_4: TemaFiltrado = {
    id: 'tema-004',
    titulo: 'Intersección de Rectas y Modelado Lineal',
    descripcion: 'Sistemas de ecuaciones y aplicaciones prácticas',
    orden: 4,
    tipo: 'evaluativo',
    visible: true,
    estimacionMinutos: 40,
    contenidos: [
        {
            id: 'cont-011',
            titulo: 'Intersección de dos Rectas',
            tipo: 'latex',
            contenido: `
        <h3>Punto de Intersección</h3>
        <p>Para encontrar donde se cruzan dos rectas, resolvemos el sistema:</p>
        <div class="formula-box">
          $$\\begin{cases}
          A_1x + B_1y + C_1 = 0 \\\\
          A_2x + B_2y + C_2 = 0
          \\end{cases}$$
        </div>
        <h4>Casos posibles:</h4>
        <ul>
          <li><strong>Única solución</strong>: Las rectas se intersectan en un punto</li>
          <li><strong>Sin solución</strong>: Las rectas son paralelas</li>
          <li><strong>Infinitas soluciones</strong>: Las rectas son coincidentes</li>
        </ul>
      `,
            orden: 1,
            visible: true,
            obligatorio: true,
            completable: true,
            duracionEstimadaMinutos: 20,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'cont-012',
            titulo: 'Aplicación: Problema del Mundo Real',
            tipo: 'ejemplo',
            contenido: `
        <h3>Problema de Aplicación</h3>
        <p>Un joven tiene 16 monedas en su bolsillo, todas de $50 o $100. El total suma $960.</p>
        <p>¿Cuántas monedas de cada tipo tiene?</p>
        
        <h4>Solución:</h4>
        <p>Sea $x$ = monedas de $50, $y$ = monedas de $100</p>
        <p>$$\\begin{cases}
        x + y = 16 \\\\
        50x + 100y = 960
        \\end{cases}$$</p>
        
        <details>
          <summary>Ver desarrollo completo</summary>
          <p>De la primera: $x = 16 - y$</p>
          <p>Sustituimos: $50(16-y) + 100y = 960$</p>
          <p>$800 - 50y + 100y = 960$</p>
          <p>$50y = 160$</p>
          <p>$y = 3.2$ ← <strong>No es entero, revisar datos</strong></p>
        </details>
      `,
            orden: 2,
            visible: true,
            obligatorio: false,
            completable: true,
            duracionEstimadaMinutos: 20,
            habilitado: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
    ],
    contenidosTotales: 2,
    contenidosHabilitados: 2,
    contenidosCompletados: 0,
    porcentajeProgreso: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
}

// Asignar temas al capítulo
MOCK_CAPITULO.temas = [TEMA_1, TEMA_2, TEMA_3, TEMA_4]

// ==========================================
// 🎓 EJERCICIOS DE AYUDANTÍA
// ==========================================

const MOCK_EJERCICIOS_AYUDANTIA: EjercicioAyudantiaFiltrado[] = [
    {
        id: 'ayud-001',
        titulo: 'Ejercicio 1: Cálculo de Distancias',
        enunciado: `
      <p>Los puntos $A = (-2, 0)$, $B = (1, -4)$, $C = (0, 2)$ y $D = (6, 6)$ son los vértices de un rectángulo.</p>
      <ol>
        <li>Dibuje el rectángulo en el plano cartesiano.</li>
        <li>Calcule las medidas de los lados del rectángulo.</li>
        <li>Calcule el área del rectángulo.</li>
      </ol>
    `,
        solucion: `
      <h4>Solución Paso a Paso:</h4>
      
      <h5>1. Dibujar el rectángulo:</h5>
      <p>[Aquí iría una imagen o gráfico del rectángulo trazado]</p>
      
      <h5>2. Calcular las medidas de los lados:</h5>
      <p>Lado $AB$: $$d_{AB} = \\sqrt{(1-(-2))^2 + (-4-0)^2} = \\sqrt{9 + 16} = 5$$</p>
      <p>Lado $BC$: $$d_{BC} = \\sqrt{(0-1)^2 + (2-(-4))^2} = \\sqrt{1 + 36} = \\sqrt{37}$$</p>
      
      <h5>3. Calcular el área:</h5>
      <p>$$\\text{Área} = d_{AB} \\times d_{BC} = 5\\sqrt{37} \\approx 30.41 \\text{ unidades cuadradas}$$</p>
    `,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-ayudantia-1',
        orden: 1,
        dificultad: 'medio',
        duracionEstimadaMinutos: 15,
        tags: ['distancia', 'geometría', 'área'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-001',
        habilitado: true,
        intentos: 2,
        tiempoInvertido: 18,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ayud-002',
        titulo: 'Ejercicio 10: Sistema de Ecuaciones',
        enunciado: `
      <p>Un joven tiene 16 monedas en su bolsillo, todas de $50 o de $100. El joven compra una bebida de $960 y se queda con un total de $40.</p>
      <ol>
        <li>Si $x$ es el número de monedas de $50 y $y$ es el número de monedas de $100, determine un sistema de ecuaciones que relacione estas dos cantidades.</li>
        <li>¿Cuántas monedas de $50 tenía el joven en su bolsillo? ¿cuántas monedas de $100 tenía el joven en su bolsillo?</li>
      </ol>
    `,
        solucion: `
      <h4>Solución Completa:</h4>
      
      <h5>1. Sistema de ecuaciones:</h5>
      <p>Total de monedas: $$x + y = 16$$</p>
      <p>Total de dinero inicial: $50x + 100y$</p>
      <p>Después de comprar: $50x + 100y - 960 = 40$</p>
      <p>Simplificando: $$50x + 100y = 1000$$</p>
      <p>Dividiendo por 50: $$x + 2y = 20$$</p>
      
      <p>Sistema final:</p>
      <div class="formula-box">
        $$\\begin{cases}
        x + y = 16 \\\\
        x + 2y = 20
        \\end{cases}$$
      </div>
      
      <h5>2. Resolución:</h5>
      <p>Restando la primera de la segunda:</p>
      <p>$$(x + 2y) - (x + y) = 20 - 16$$</p>
      <p>$$y = 4$$</p>
      
      <p>Sustituyendo en la primera:</p>
      <p>$$x + 4 = 16$$</p>
      <p>$$x = 12$$</p>
      
      <h5>Respuesta:</h5>
      <p>El joven tenía <strong>12 monedas de $50</strong> y <strong>4 monedas de $100</strong>.</p>
      
      <h5>Verificación:</h5>
      <p>Total monedas: $12 + 4 = 16$ ✓</p>
      <p>Total dinero: $50(12) + 100(4) = 600 + 400 = 1000$</p>
      <p>Después de comprar: $1000 - 960 = 40$ ✓</p>
    `,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-ayudantia-10',
        orden: 2,
        dificultad: 'medio',
        duracionEstimadaMinutos: 20,
        tags: ['sistemas', 'modelado', 'aplicación'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-004',
        habilitado: true,
        intentos: 1,
        tiempoInvertido: 25,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ayud-003',
        titulo: 'Ejercicio 11: Inversión Financiera',
        enunciado: `
      <p>Una mujer invierte un total de $20,000 entre dos cuentas de ahorro: una paga 5% de interés al año y la otra paga 8% de interés al año.</p>
      <p>Al cabo de un año ella recibe $1,180 por concepto de interés entre las dos cuentas.</p>
      <ol>
        <li>Si $x$ es el dinero que invierte al 5% y $y$ es el dinero que invierte al 8%, determine un sistema de ecuaciones que relacione estas dos cantidades.</li>
        <li>¿Cuánto dinero invirtió la mujer en cada cuenta?</li>
      </ol>
    `,
        solucion: `
      <h4>Desarrollo Completo:</h4>
      
      <h5>1. Planteo del sistema:</h5>
      <p>Total invertido: $$x + y = 20000$$</p>
      <p>Intereses generados:</p>
      <ul>
        <li>Cuenta al 5%: $0.05x$</li>
        <li>Cuenta al 8%: $0.08y$</li>
        <li>Total intereses: $0.05x + 0.08y = 1180$</li>
      </ul>
      
      <p>Sistema:</p>
      <div class="formula-box">
        $$\\begin{cases}
        x + y = 20000 \\\\
        0.05x + 0.08y = 1180
        \\end{cases}$$
      </div>
      
      <h5>2. Resolución:</h5>
      <p>Multiplicamos la segunda ecuación por 100:</p>
      <p>$$5x + 8y = 118000$$</p>
      
      <p>De la primera: $x = 20000 - y$</p>
      <p>Sustituimos: $5(20000 - y) + 8y = 118000$</p>
      <p>$100000 - 5y + 8y = 118000$</p>
      <p>$3y = 18000$</p>
      <p>$y = 6000$</p>
      
      <p>Entonces: $x = 20000 - 6000 = 14000$</p>
      
      <h5>Respuesta:</h5>
      <p>La mujer invirtió:</p>
      <ul>
        <li><strong>$14,000 al 5%</strong></li>
        <li><strong>$6,000 al 8%</strong></li>
      </ul>
      
      <h5>Verificación:</h5>
      <p>Intereses: $0.05(14000) + 0.08(6000) = 700 + 480 = 1180$ ✓</p>
    `,
        orden: 3,
        dificultad: 'dificil',
        duracionEstimadaMinutos: 25,
        tags: ['sistemas', 'finanzas', 'porcentajes'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-004',
        habilitado: true,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ayud-004',
        titulo: 'Ejercicio 5: Ecuaciones y Pendientes',
        enunciado: `
      <p>Dada la recta que pasa por los puntos $P(2, -3)$ y $Q(5, 6)$:</p>
      <ol>
        <li>Calcule la pendiente de la recta.</li>
        <li>Determine la ecuación de la recta en forma punto-pendiente.</li>
        <li>Exprese la ecuación en forma general.</li>
        <li>¿En qué punto corta la recta al eje Y?</li>
      </ol>
    `,
        solucion: `
      <h4>Solución Detallada:</h4>
      
      <h5>1. Pendiente:</h5>
      <p>$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{6 - (-3)}{5 - 2} = \\frac{9}{3} = 3$</p>
      
      <h5>2. Forma punto-pendiente (usando P):</h5>
      <p>$y - (-3) = 3(x - 2)$</p>
      <p>$y + 3 = 3x - 6$</p>
      
      <h5>3. Forma general:</h5>
      <p>$y = 3x - 9$</p>
      <p>$3x - y - 9 = 0$</p>
      
      <h5>4. Intersección con eje Y (x = 0):</h5>
      <p>$y = 3(0) - 9 = -9$</p>
      <p>Punto: $(0, -9)$</p>
    `,
        orden: 4,
        dificultad: 'facil',
        duracionEstimadaMinutos: 15,
        tags: ['pendiente', 'ecuaciones', 'intersección'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-002',
        habilitado: true,
        intentos: 3,
        tiempoInvertido: 12,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ayud-005',
        titulo: 'Ejercicio 7: Rectas Paralelas y Perpendiculares',
        enunciado: `
      <p>Considere la recta $L: 2x + 3y - 6 = 0$</p>
      <ol>
        <li>Encuentre la ecuación de la recta paralela a $L$ que pasa por $(4, 1)$.</li>
        <li>Encuentre la ecuación de la recta perpendicular a $L$ que pasa por el origen.</li>
      </ol>
      <p><strong>Recordatorio:</strong> Si dos rectas son paralelas, tienen la misma pendiente. Si son perpendiculares, el producto de sus pendientes es $-1$.</p>
    `,
        solucion: `
      <h4>Desarrollo:</h4>
      
      <h5>Pendiente de L:</h5>
      <p>De $2x + 3y - 6 = 0$:</p>
      <p>$3y = -2x + 6$</p>
      <p>$y = -\\frac{2}{3}x + 2$</p>
      <p>Entonces: $m_L = -\\frac{2}{3}$</p>
      
      <h5>1. Recta paralela (misma pendiente):</h5>
      <p>$m = -\\frac{2}{3}$, punto $(4, 1)$:</p>
      <p>$y - 1 = -\\frac{2}{3}(x - 4)$</p>
      <p>$y - 1 = -\\frac{2}{3}x + \\frac{8}{3}$</p>
      <p>$y = -\\frac{2}{3}x + \\frac{11}{3}$</p>
      <p>En forma general: $2x + 3y - 11 = 0$</p>
      
      <h5>2. Recta perpendicular:</h5>
      <p>Pendiente perpendicular: $m_{\\perp} = \\frac{3}{2}$</p>
      <p>Pasa por $(0, 0)$:</p>
      <p>$y - 0 = \\frac{3}{2}(x - 0)$</p>
      <p>$y = \\frac{3}{2}x$</p>
      <p>En forma general: $3x - 2y = 0$</p>
    `,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-paralelas-perp',
        orden: 5,
        dificultad: 'medio',
        duracionEstimadaMinutos: 20,
        tags: ['paralelas', 'perpendiculares', 'pendiente'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-003',
        habilitado: true,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ayud-006',
        titulo: 'Ejercicio 12: Aplicación Geométrica',
        enunciado: `
      <p>Un triángulo tiene vértices en $A(1, 2)$, $B(5, 4)$ y $C(3, 7)$.</p>
      <ol>
        <li>Encuentre la ecuación de la altura desde el vértice $C$ al lado $AB$.</li>
        <li>Calcule el área del triángulo usando coordenadas.</li>
        <li>Determine las coordenadas del baricentro (centro de gravedad).</li>
      </ol>
      <p><em>Hint:</em> El baricentro es el promedio de las coordenadas de los vértices.</p>
    `,
        solucion: `
      <h4>Solución Completa:</h4>
      
      <h5>1. Altura desde C:</h5>
      <p>Pendiente de $AB$: $m_{AB} = \\frac{4-2}{5-1} = \\frac{1}{2}$</p>
      <p>Pendiente de la altura (perpendicular): $m_h = -2$</p>
      <p>Ecuación pasando por $C(3, 7)$:</p>
      <p>$y - 7 = -2(x - 3)$</p>
      <p>$y = -2x + 13$</p>
      
      <h5>2. Área del triángulo:</h5>
      <p>Fórmula: $\\text{Área} = \\frac{1}{2}|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)|$</p>
      <p>$= \\frac{1}{2}|1(4-7) + 5(7-2) + 3(2-4)|$</p>
      <p>$= \\frac{1}{2}|-3 + 25 - 6| = \\frac{1}{2}(16) = 8 \\text{ unidades cuadradas}$</p>
      
      <h5>3. Baricentro:</h5>
      <p>$G = \\left(\\frac{x_1+x_2+x_3}{3}, \\frac{y_1+y_2+y_3}{3}\\right)$</p>
      <p>$G = \\left(\\frac{1+5+3}{3}, \\frac{2+4+7}{3}\\right) = \\left(3, \\frac{13}{3}\\right)$</p>
    `,
        orden: 6,
        dificultad: 'dificil',
        duracionEstimadaMinutos: 30,
        tags: ['geometría', 'triángulos', 'áreas', 'aplicación'],
        capituloId: 'cap-001',
        temaRelacionado: 'tema-003',
        habilitado: true,
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
]

// ==========================================
// ✅ EJERCICIOS DE EVALUACIÓN
// ==========================================

const PREGUNTAS_EVALUACION: PreguntaEvaluacion[] = [
    {
        id: 'preg-001',
        enunciado: 'La distancia entre los puntos $P(-3, 4)$ y $Q(5, -2)$ es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-001-a', texto: '$10$', esCorrecta: true, orden: 1 },
            { id: 'alt-001-b', texto: '$8$', esCorrecta: false, orden: 2 },
            { id: 'alt-001-c', texto: '$\\sqrt{28}$', esCorrecta: false, orden: 3 },
            { id: 'alt-001-d', texto: '$\\sqrt{100}$', esCorrecta: false, explicacion: 'No olvides sacar la raíz al final', orden: 4 },
        ],
        puntaje: 10,
        orden: 1,
        obligatoria: true,
        ayuda: 'Recuerda: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$',
        tiempoSugeridoSegundos: 120,
        temaRelacionado: 'tema-001',
    },
    {
        id: 'preg-002',
        enunciado: 'El punto medio entre $A(6, -2)$ y $B(-4, 8)$ es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-002-a', texto: '$(1, 3)$', esCorrecta: true, orden: 1 },
            { id: 'alt-002-b', texto: '$(5, 5)$', esCorrecta: false, orden: 2 },
            { id: 'alt-002-c', texto: '$(2, 6)$', esCorrecta: false, orden: 3 },
            { id: 'alt-002-d', texto: '$(1, -3)$', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 2,
        obligatoria: true,
        tiempoSugeridoSegundos: 90,
        temaRelacionado: 'tema-001',
    },
    {
        id: 'preg-003',
        enunciado: 'La pendiente de la recta que pasa por $(2, 5)$ y $(6, 13)$ es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-003-a', texto: '$2$', esCorrecta: true, orden: 1 },
            { id: 'alt-003-b', texto: '$\\frac{1}{2}$', esCorrecta: false, orden: 2 },
            { id: 'alt-003-c', texto: '$4$', esCorrecta: false, orden: 3 },
            { id: 'alt-003-d', texto: '$8$', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 3,
        obligatoria: true,
        ayuda: '$m = \\frac{\\Delta y}{\\Delta x}$',
        tiempoSugeridoSegundos: 90,
        temaRelacionado: 'tema-002',
    },
    {
        id: 'preg-004',
        enunciado: 'La ecuación de la recta con pendiente $m=3$ que pasa por $(1, -2)$ es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-004-a', texto: '$y = 3x - 5$', esCorrecta: true, orden: 1 },
            { id: 'alt-004-b', texto: '$y = 3x + 1$', esCorrecta: false, orden: 2 },
            { id: 'alt-004-c', texto: '$y = 3x - 2$', esCorrecta: false, orden: 3 },
            { id: 'alt-004-d', texto: '$y = 3x + 5$', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 4,
        obligatoria: true,
        ayuda: 'Usa $y - y_1 = m(x - x_1)$',
        tiempoSugeridoSegundos: 120,
        temaRelacionado: 'tema-002',
    },
    {
        id: 'preg-005',
        enunciado: 'Considere la función: $f(x) = \\begin{cases} (z + 1)^2 & z < 1 \\\\ x + 3 & x \\geq 1 \\end{cases}$ ¿Cuál(es) de las siguientes afirmaciones es (son) verdadera(s)?',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-005-a', texto: 'Sólo I.', esCorrecta: false, orden: 1 },
            { id: 'alt-005-b', texto: 'Sólo II.', esCorrecta: false, orden: 2 },
            { id: 'alt-005-c', texto: 'Ambas, I y II.', esCorrecta: false, orden: 3 },
            { id: 'alt-005-d', texto: 'Ninguna de ellas.', esCorrecta: true, orden: 4 },
        ],
        puntaje: 15,
        orden: 5,
        obligatoria: true,
        tiempoSugeridoSegundos: 180,
        temaRelacionado: 'tema-004',
    },
    {
        id: 'preg-006',
        enunciado: 'La ecuación $2x + 3y - 6 = 0$ en forma pendiente-intersección es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-006-a', texto: '$y = -\\frac{2}{3}x + 2$', esCorrecta: true, orden: 1 },
            { id: 'alt-006-b', texto: '$y = \\frac{2}{3}x + 2$', esCorrecta: false, orden: 2 },
            { id: 'alt-006-c', texto: '$y = -\\frac{3}{2}x + 2$', esCorrecta: false, orden: 3 },
            { id: 'alt-006-d', texto: '$y = -\\frac{2}{3}x - 2$', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 6,
        obligatoria: true,
        tiempoSugeridoSegundos: 120,
        temaRelacionado: 'tema-003',
    },
    {
        id: 'preg-007',
        enunciado: 'Dos rectas son perpendiculares si el producto de sus pendientes es:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-007-a', texto: '$-1$', esCorrecta: true, orden: 1 },
            { id: 'alt-007-b', texto: '$0$', esCorrecta: false, orden: 2 },
            { id: 'alt-007-c', texto: '$1$', esCorrecta: false, orden: 3 },
            { id: 'alt-007-d', texto: 'Indefinido', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 7,
        obligatoria: true,
        tiempoSugeridoSegundos: 60,
        temaRelacionado: 'tema-003',
    },
    {
        id: 'preg-008',
        enunciado: 'Considere la función: $f(x) = \\frac{x^2 + x - 6}{|x - 2|}$ ¿Cuál(es) de las siguientes afirmaciones es (son) verdadera(s)? I. $\\lim_{x \\to 1^+} f(x) + \\lim_{x \\to 1^-} f(x) = 8$ II. $\\lim_{x \\to 2^+} f(x)$ existe y es igual a cero.',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-008-a', texto: 'Sólo I.', esCorrecta: true, orden: 1 },
            { id: 'alt-008-b', texto: 'Sólo II.', esCorrecta: false, orden: 2 },
            { id: 'alt-008-c', texto: 'Ambas, I y II.', esCorrecta: false, orden: 3 },
            { id: 'alt-008-d', texto: 'Ninguna de ellas.', esCorrecta: false, orden: 4 },
        ],
        puntaje: 15,
        orden: 8,
        obligatoria: true,
        tiempoSugeridoSegundos: 240,
        temaRelacionado: 'tema-004',
    },
    {
        id: 'preg-009',
        enunciado: 'Un sistema de ecuaciones $2x + 3y = 6$ y $4x + 6y = 12$ tiene:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-009-a', texto: 'Infinitas soluciones (rectas coincidentes)', esCorrecta: true, orden: 1 },
            { id: 'alt-009-b', texto: 'Una única solución', esCorrecta: false, orden: 2 },
            { id: 'alt-009-c', texto: 'Sin solución (rectas paralelas)', esCorrecta: false, orden: 3 },
            { id: 'alt-009-d', texto: 'Dos soluciones', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 9,
        obligatoria: true,
        ayuda: 'Observa la relación entre los coeficientes',
        tiempoSugeridoSegundos: 150,
        temaRelacionado: 'tema-004',
    },
    {
        id: 'preg-010',
        enunciado: 'La recta paralela al eje X que pasa por $(5, -3)$ tiene ecuación:',
        tipo: 'multiple_choice',
        alternativas: [
            { id: 'alt-010-a', texto: '$y = -3$', esCorrecta: true, orden: 1 },
            { id: 'alt-010-b', texto: '$x = 5$', esCorrecta: false, orden: 2 },
            { id: 'alt-010-c', texto: '$y = 5$', esCorrecta: false, orden: 3 },
            { id: 'alt-010-d', texto: '$x = -3$', esCorrecta: false, orden: 4 },
        ],
        puntaje: 10,
        orden: 10,
        obligatoria: true,
        ayuda: 'Una recta horizontal tiene pendiente cero',
        tiempoSugeridoSegundos: 60,
        temaRelacionado: 'tema-002',
    },
]

const MOCK_EJERCICIO_EVALUACION: EjercicioEvaluacionEstudiante = {
    id: 'eval-001',
    titulo: 'Taller: Ejercicio',
    descripcion: 'Evaluación de comprensión sobre ecuaciones de la recta, distancias y sistemas lineales',
    tipo: 'autoevaluacion',
    duracionMinutos: 30,
    intentosPermitidos: 3,
    mostrarSolucion: true,
    notaAprobacion: 4.0,
    preguntas: PREGUNTAS_EVALUACION,
    ordenAleatorio: false,
    alternativasAleatorias: true,
    capituloId: 'cap-001',
    fechaInicio: '2024-03-01T00:00:00Z',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    habilitado: true,
    intentosRealizados: 1,
    intentosRestantes: 2,
    mejorIntento: {
        id: 'intento-001',
        ejercicioId: 'eval-001',
        estudianteId: 'user-123',
        numeroIntento: 1,
        respuestas: [
            {
                preguntaId: 'preg-001',
                alternativaSeleccionada: 'alt-001-a',
                esCorrecta: true,
                tiempoRespuestaSegundos: 95,
                timestamp: '2024-03-15T10:05:00Z',
            },
            {
                preguntaId: 'preg-002',
                alternativaSeleccionada: 'alt-002-b',
                esCorrecta: false,
                tiempoRespuestaSegundos: 120,
                timestamp: '2024-03-15T10:07:00Z',
            },
            {
                preguntaId: 'preg-003',
                alternativaSeleccionada: 'alt-003-a',
                esCorrecta: true,
                tiempoRespuestaSegundos: 80,
                timestamp: '2024-03-15T10:09:00Z',
            },
        ],
        puntajeObtenido: 70,
        puntajeTotal: 100,
        porcentaje: 70,
        nota: 5.2,
        aprobado: true,
        fechaInicio: '2024-03-15T10:00:00Z',
        fechaTermino: '2024-03-15T10:25:00Z',
        duracionSegundos: 1500,
        completado: true,
    },
    ultimoIntento: {
        id: 'intento-001',
        ejercicioId: 'eval-001',
        estudianteId: 'user-123',
        numeroIntento: 1,
        respuestas: [],
        puntajeObtenido: 70,
        puntajeTotal: 100,
        porcentaje: 70,
        nota: 5.2,
        aprobado: true,
        fechaInicio: '2024-03-15T10:00:00Z',
        fechaTermino: '2024-03-15T10:25:00Z',
        duracionSegundos: 1500,
        completado: true,
    },
    promedioIntentos: 5.2,
}

// ==========================================
// 🔐 PERMISOS MOCK
// ==========================================

const MOCK_PERMISOS_ESTUDIANTE: PermisosCapitulo = {
    puedeVer: true,
    puedeEditar: false,
    puedeEliminar: false,
    puedeHabilitarContenido: false,
    puedeVerEstadisticas: false,
    puedeCrearContenido: false,
    rol: 'estudiante',
}

const MOCK_PERMISOS_PROFESOR: PermisosCapitulo = {
    puedeVer: true,
    puedeEditar: true,
    puedeEliminar: true,
    puedeHabilitarContenido: true,
    puedeVerEstadisticas: true,
    puedeCrearContenido: true,
    rol: 'profesor',
}

// ==========================================
// 📊 PROGRESO MOCK
// ==========================================

const MOCK_PROGRESO: ProgresoCapitulo = {
    capituloId: 'cap-001',
    temasCompletados: 1,
    temasTotales: 4,
    contenidosCompletados: 5,
    contenidosTotales: 12,
    porcentajeProgreso: 41.67,
    tiempoTotalMinutos: 95,
    ultimaVisita: '2024-03-20T14:30:00Z',
}

// ==========================================
// 📦 VISTA COMPLETA MOCK
// ==========================================

export const MOCK_CAPITULO_COMPLETO_ESTUDIANTE: CapituloVistaCompleta = {
    capitulo: MOCK_CAPITULO,
    ejerciciosAyudantia: MOCK_EJERCICIOS_AYUDANTIA,
    ejerciciosEvaluacion: [MOCK_EJERCICIO_EVALUACION],
    permisos: MOCK_PERMISOS_ESTUDIANTE,
    progreso: MOCK_PROGRESO,
}

export const MOCK_CAPITULO_COMPLETO_PROFESOR: CapituloVistaCompleta = {
    capitulo: MOCK_CAPITULO,
    ejerciciosAyudantia: MOCK_EJERCICIOS_AYUDANTIA,
    ejerciciosEvaluacion: [MOCK_EJERCICIO_EVALUACION],
    permisos: MOCK_PERMISOS_PROFESOR,
    progreso: undefined, // Profesores no tienen progreso
}

// ==========================================
// 🎯 HELPERS PARA TESTING
// ==========================================

/**
 * Obtiene datos mock según el rol del usuario
 */
export function getMockCapituloByRole(
    role: 'estudiante' | 'profesor' | 'administrador'
): CapituloVistaCompleta {
    if (role === 'estudiante') {
        return MOCK_CAPITULO_COMPLETO_ESTUDIANTE
    }
    return MOCK_CAPITULO_COMPLETO_PROFESOR
}

/**
 * Simula delay de API
 */
export function simulateApiDelay(ms: number = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock de función para obtener capítulo
 */
export async function getMockCapitulo(
    capituloId: string,
    role: 'estudiante' | 'profesor' = 'estudiante'
): Promise<CapituloVistaCompleta> {
    await simulateApiDelay()
    return getMockCapituloByRole(role)
}