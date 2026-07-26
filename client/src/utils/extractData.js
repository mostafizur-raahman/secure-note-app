export function extractList(data) {
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.notes && Array.isArray(data.notes)) return data.notes;
    if (data.posts && Array.isArray(data.posts)) return data.posts;
    if (data.users && Array.isArray(data.users)) return data.users;
    if (data.groups && Array.isArray(data.groups)) return data.groups;
    return [];
}

export function extractTotalPages(data, listLength) {
    if (data.totalPages) return data.totalPages;
    if (data.total) return Math.ceil(data.total / 10);
    if (listLength < 10) return 1;
    return 2;
}
