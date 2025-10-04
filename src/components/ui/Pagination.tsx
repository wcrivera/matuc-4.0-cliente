type PaginationProps = {
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    } | null;
    paginaActual: number;
    handleCambiarPagina: (page: number) => void;
};

export const Pagination = ({ pagination, paginaActual, handleCambiarPagina }: PaginationProps) => {

    if (!pagination || pagination.totalPages <= 1) return null;

    const startPage = Math.max(1, paginaActual - 2);
    const endPage = Math.min(pagination.totalPages, paginaActual + 2);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-700">
                Mostrando {((paginaActual - 1) * (pagination.itemsPerPage || 12)) + 1} a{' '}
                {Math.min(paginaActual * (pagination.itemsPerPage || 12), pagination.totalItems)} de{' '}
                {pagination.totalItems} cursos
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => handleCambiarPagina(paginaActual - 1)}
                    disabled={paginaActual <= 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Anterior
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handleCambiarPagina(page)}
                        className={`px-3 py-2 text-sm border rounded-lg ${page === paginaActual
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => handleCambiarPagina(paginaActual + 1)}
                    disabled={paginaActual >= pagination.totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};