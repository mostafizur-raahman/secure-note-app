import CONFIG from "../config";

function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY) || "";
}

function authHeaders() {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiRequest(method, url, body) {
    const headers = { "Content-Type": "application/json", ...authHeaders() };
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(CONFIG.API_BASE + url, opts);
    const json = await res.json();
    if (!res.ok) {
        throw new Error(
            json.message || json.error || `Request failed (${res.status})`,
        );
    }
    return json;
}

const api = {
    get: (url) => apiRequest("GET", url),
    post: (url, data) => apiRequest("POST", url, data),
    put: (url, data) => apiRequest("PUT", url, data),
    del: (url) => apiRequest("DELETE", url),
};

export default api;
