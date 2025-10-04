import { CURSO_CATEGORIAS } from "@/types/course.types";

type FiltrosProps = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categoriaSeleccionada: string;
    setCategoriaSeleccionada: (categoria: string) => void;
    soloActivos: boolean;
    setSoloActivos: (activo: boolean) => void;
    soloPublicos: boolean;
    setSoloPublicos: (publico: boolean) => void;
    handleLimpiarFiltros: () => void;
};

export const Filtros: React.FC<FiltrosProps> = ({
    searchTerm,
    setSearchTerm,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    soloActivos,
    setSoloActivos,
    soloPublicos,
    setSoloPublicos,
    handleLimpiarFiltros
}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
            {/* Búsqueda */}
            <div className="flex-1 min-w-[200px]">
                <input
                    type="text"
                    placeholder="Buscar cursos por nombre o sigla..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Categoría */}
            <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Todas las categorías</option>
                {CURSO_CATEGORIAS.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                ))}
            </select>

            {/* Filtros de estado */}
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={soloActivos}
                        onChange={(e) => setSoloActivos(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Solo activos</span>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={soloPublicos}
                        onChange={(e) => setSoloPublicos(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Solo públicos</span>
                </label>
            </div>

            {/* Limpiar filtros */}
            <button
                onClick={handleLimpiarFiltros}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Limpiar filtros
            </button>
        </div>
    </div>
);