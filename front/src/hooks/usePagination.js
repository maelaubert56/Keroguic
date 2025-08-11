import { useState } from "react";

export function usePagination(initialPage = 1, totalPages = 1) {
    const [page, setPage] = useState(initialPage);

    const nextPage = () => {
        setPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const prevPage = () => {
        setPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setPage(p);
    };

    return { page, setPage, nextPage, prevPage, goToPage };
}
