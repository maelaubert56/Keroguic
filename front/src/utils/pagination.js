export function getPageParam(defaultValue = 1) {
    const url = new URL(window.location.href);
    let pageParam = url.searchParams.get("page");
    if (pageParam === null || isNaN(Number(pageParam)) || Number(pageParam) < 1) {
        return defaultValue;
    }
    return Number(pageParam);
}

export function getPaginationRange(currentPage, totalPages, maxVisible = 5) {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sideWidth = Math.floor(maxVisible / 2);
    const leftSide = Math.max(currentPage - sideWidth, 1);
    const rightSide = Math.min(currentPage + sideWidth, totalPages);

    const range = [];

    // Toujours afficher la première page
    if (leftSide > 1) {
        range.push(1);
        if (leftSide > 2) {
            range.push('...');
        }
    }

    // Pages autour de la page actuelle
    for (let i = leftSide; i <= rightSide; i++) {
        range.push(i);
    }

    // Toujours afficher la dernière page
    if (rightSide < totalPages) {
        if (rightSide < totalPages - 1) {
            range.push('...');
        }
        range.push(totalPages);
    }

    return range;
}
