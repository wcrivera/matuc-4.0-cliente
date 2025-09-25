// src/lib/stores/course.store.ts - Store Zustand para Gestión de Cursos
'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Tipos
export interface Course {
    id: string
    title: string
    code: string
    description: string
    semester: string
    year: number
    professorId: string
    professorName: string
    studentsCount: number
    status: 'active' | 'inactive' | 'archived'
    createdAt: string
    updatedAt: string
}

export interface CourseSection {
    id: string
    courseId: string
    title: string
    description: string
    order: number
    isPublished: boolean
    exercises: Exercise[]
}

export interface Exercise {
    id: string
    sectionId: string
    title: string
    description: string
    type: 'multiple_choice' | 'latex_input' | 'numerical' | 'proof'
    latex: string
    points: number
    order: number
    isPublished: boolean
    createdAt: string
}

export interface CourseStats {
    totalCourses: number
    activeCourses: number
    totalStudents: number
    totalExercises: number
    avgProgress: number
}

export interface CourseState {
    // Estado
    courses: Course[]
    currentCourse: Course | null
    sections: CourseSection[]
    currentSection: CourseSection | null
    exercises: Exercise[]
    isLoading: boolean
    error: string | null
    stats: CourseStats | null

    // Filtros
    filters: {
        search: string
        semester: string
        status: Course['status'] | 'all'
    }

    // Acciones de cursos
    setCourses: (courses: Course[]) => void
    addCourse: (course: Course) => void
    updateCourse: (id: string, updates: Partial<Course>) => void
    removeCourse: (id: string) => void
    setCurrentCourse: (course: Course | null) => void

    // Acciones de secciones
    setSections: (sections: CourseSection[]) => void
    addSection: (section: CourseSection) => void
    updateSection: (id: string, updates: Partial<CourseSection>) => void
    removeSection: (id: string) => void
    setCurrentSection: (section: CourseSection | null) => void
    reorderSections: (sectionIds: string[]) => void

    // Acciones de ejercicios
    setExercises: (exercises: Exercise[]) => void
    addExercise: (exercise: Exercise) => void
    updateExercise: (id: string, updates: Partial<Exercise>) => void
    removeExercise: (id: string) => void
    reorderExercises: (exerciseIds: string[]) => void

    // Acciones de estado
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setStats: (stats: CourseStats) => void

    // Acciones de filtros
    setSearch: (search: string) => void
    setSemesterFilter: (semester: string) => void
    setStatusFilter: (status: Course['status'] | 'all') => void
    clearFilters: () => void

    // Selectores computados
    getFilteredCourses: () => Course[]
    getCourseById: (id: string) => Course | undefined
    getSectionsByCourse: (courseId: string) => CourseSection[]
    getExercisesBySection: (sectionId: string) => Exercise[]
    getPublishedSections: (courseId: string) => CourseSection[]
    getTotalExercises: (courseId: string) => number
}

// Store principal de cursos
export const useCourseStore = create<CourseState>()(
    devtools(
        (set, get) => ({
            // Estado inicial
            courses: [],
            currentCourse: null,
            sections: [],
            currentSection: null,
            exercises: [],
            isLoading: false,
            error: null,
            stats: null,

            filters: {
                search: '',
                semester: '',
                status: 'all'
            },

            // Acciones de cursos
            setCourses: (courses) =>
                set({ courses }, false, 'setCourses'),

            addCourse: (course) =>
                set(
                    (state) => ({
                        courses: [...state.courses, course]
                    }),
                    false,
                    'addCourse'
                ),

            updateCourse: (id, updates) =>
                set(
                    (state) => ({
                        courses: state.courses.map(course =>
                            course.id === id ? { ...course, ...updates } : course
                        ),
                        currentCourse: state.currentCourse?.id === id
                            ? { ...state.currentCourse, ...updates }
                            : state.currentCourse
                    }),
                    false,
                    'updateCourse'
                ),

            removeCourse: (id) =>
                set(
                    (state) => ({
                        courses: state.courses.filter(course => course.id !== id),
                        currentCourse: state.currentCourse?.id === id ? null : state.currentCourse
                    }),
                    false,
                    'removeCourse'
                ),

            setCurrentCourse: (course) =>
                set({ currentCourse: course }, false, 'setCurrentCourse'),

            // Acciones de secciones
            setSections: (sections) =>
                set({ sections }, false, 'setSections'),

            addSection: (section) =>
                set(
                    (state) => ({
                        sections: [...state.sections, section]
                    }),
                    false,
                    'addSection'
                ),

            updateSection: (id, updates) =>
                set(
                    (state) => ({
                        sections: state.sections.map(section =>
                            section.id === id ? { ...section, ...updates } : section
                        ),
                        currentSection: state.currentSection?.id === id
                            ? { ...state.currentSection, ...updates }
                            : state.currentSection
                    }),
                    false,
                    'updateSection'
                ),

            removeSection: (id) =>
                set(
                    (state) => ({
                        sections: state.sections.filter(section => section.id !== id),
                        currentSection: state.currentSection?.id === id ? null : state.currentSection
                    }),
                    false,
                    'removeSection'
                ),

            setCurrentSection: (section) =>
                set({ currentSection: section }, false, 'setCurrentSection'),

            reorderSections: (sectionIds) =>
                set(
                    (state) => ({
                        sections: sectionIds.map((id, index) => {
                            const section = state.sections.find(s => s.id === id)
                            return section ? { ...section, order: index } : null
                        }).filter(Boolean) as CourseSection[]
                    }),
                    false,
                    'reorderSections'
                ),

            // Acciones de ejercicios
            setExercises: (exercises) =>
                set({ exercises }, false, 'setExercises'),

            addExercise: (exercise) =>
                set(
                    (state) => ({
                        exercises: [...state.exercises, exercise]
                    }),
                    false,
                    'addExercise'
                ),

            updateExercise: (id, updates) =>
                set(
                    (state) => ({
                        exercises: state.exercises.map(exercise =>
                            exercise.id === id ? { ...exercise, ...updates } : exercise
                        )
                    }),
                    false,
                    'updateExercise'
                ),

            removeExercise: (id) =>
                set(
                    (state) => ({
                        exercises: state.exercises.filter(exercise => exercise.id !== id)
                    }),
                    false,
                    'removeExercise'
                ),

            reorderExercises: (exerciseIds) =>
                set(
                    (state) => ({
                        exercises: exerciseIds.map((id, index) => {
                            const exercise = state.exercises.find(e => e.id === id)
                            return exercise ? { ...exercise, order: index } : null
                        }).filter(Boolean) as Exercise[]
                    }),
                    false,
                    'reorderExercises'
                ),

            // Acciones de estado
            setLoading: (isLoading) =>
                set({ isLoading }, false, 'setLoading'),

            setError: (error) =>
                set({ error }, false, 'setError'),

            setStats: (stats) =>
                set({ stats }, false, 'setStats'),

            // Acciones de filtros
            setSearch: (search) =>
                set(
                    (state) => ({
                        filters: { ...state.filters, search }
                    }),
                    false,
                    'setSearch'
                ),

            setSemesterFilter: (semester) =>
                set(
                    (state) => ({
                        filters: { ...state.filters, semester }
                    }),
                    false,
                    'setSemesterFilter'
                ),

            setStatusFilter: (status) =>
                set(
                    (state) => ({
                        filters: { ...state.filters, status }
                    }),
                    false,
                    'setStatusFilter'
                ),

            clearFilters: () =>
                set(
                    {
                        filters: {
                            search: '',
                            semester: '',
                            status: 'all'
                        }
                    },
                    false,
                    'clearFilters'
                ),

            // Selectores computados
            getFilteredCourses: () => {
                const { courses, filters } = get()

                return courses.filter(course => {
                    const matchesSearch = !filters.search ||
                        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                        course.code.toLowerCase().includes(filters.search.toLowerCase())

                    const matchesSemester = !filters.semester ||
                        course.semester === filters.semester

                    const matchesStatus = filters.status === 'all' ||
                        course.status === filters.status

                    return matchesSearch && matchesSemester && matchesStatus
                })
            },

            getCourseById: (id) => {
                const { courses } = get()
                return courses.find(course => course.id === id)
            },

            getSectionsByCourse: (courseId) => {
                const { sections } = get()
                return sections
                    .filter(section => section.courseId === courseId)
                    .sort((a, b) => a.order - b.order)
            },

            getExercisesBySection: (sectionId) => {
                const { exercises } = get()
                return exercises
                    .filter(exercise => exercise.sectionId === sectionId)
                    .sort((a, b) => a.order - b.order)
            },

            getPublishedSections: (courseId) => {
                const { sections } = get()
                return sections
                    .filter(section => section.courseId === courseId && section.isPublished)
                    .sort((a, b) => a.order - b.order)
            },

            getTotalExercises: (courseId) => {
                const { sections, exercises } = get()
                const courseSections = sections.filter(s => s.courseId === courseId)
                const sectionIds = courseSections.map(s => s.id)
                return exercises.filter(e => sectionIds.includes(e.sectionId)).length
            }
        }),
        {
            name: 'course-store',
            enabled: process.env.NODE_ENV === 'development'
        }
    )
)

// Selectores optimizados
export const useCourses = () => useCourseStore(state => state.courses)
export const useCurrentCourse = () => useCourseStore(state => state.currentCourse)
export const useSections = () => useCourseStore(state => state.sections)
export const useExercises = () => useCourseStore(state => state.exercises)
export const useCourseLoading = () => useCourseStore(state => state.isLoading)
export const useCourseError = () => useCourseStore(state => state.error)
export const useCourseFilters = () => useCourseStore(state => state.filters)

// Hook completo de cursos
export const useCourse = () => {
    const store = useCourseStore()

    return {
        // Estado
        courses: store.courses,
        currentCourse: store.currentCourse,
        sections: store.sections,
        exercises: store.exercises,
        isLoading: store.isLoading,
        error: store.error,
        stats: store.stats,
        filters: store.filters,

        // Acciones
        setCourses: store.setCourses,
        addCourse: store.addCourse,
        updateCourse: store.updateCourse,
        removeCourse: store.removeCourse,
        setCurrentCourse: store.setCurrentCourse,

        // Selectores
        filteredCourses: store.getFilteredCourses(),
        getCourseById: store.getCourseById,
        getSectionsByCourse: store.getSectionsByCourse,
        getExercisesBySection: store.getExercisesBySection,

        // Utilidades
        setLoading: store.setLoading,
        setError: store.setError,
        clearFilters: store.clearFilters
    }
}