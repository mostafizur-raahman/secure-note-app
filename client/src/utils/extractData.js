export function extractList(data) {
    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data && data.data.posts && Array.isArray(data.data.posts))
        return data.data.posts;

    if (data.data && data.data.notes && Array.isArray(data.data.notes))
        return data.data.notes;

    if (data.data && data.data.users && Array.isArray(data.data.users))
        return data.data.users;

    if (data.posts && Array.isArray(data.posts)) return data.posts;
    if (data.notes && Array.isArray(data.notes)) return data.notes;
    if (data.users && Array.isArray(data.users)) return data.users;
    if (Array.isArray(data)) return data;
    return [];
}

export function extractTotalPages(data, listLength, currentPage) {
    if (data.data && !Array.isArray(data.data) && data.data.totalPages)
        return data.data.totalPages;
    if (data.data && !Array.isArray(data.data) && data.data.total)
        return Math.ceil(data.data.total / 10);

    if (data.totalPages) return data.totalPages;
    if (data.total) return Math.ceil(data.total / 10);

    if (currentPage && currentPage > 1) return currentPage;

    if (listLength >= 10) return 2;

    return 1;
}
