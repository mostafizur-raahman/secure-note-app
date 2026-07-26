import api from "./api";
import CONFIG from "../config";

const noteService = {
    list: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/notes?page=${page}&limit=${limit}`),
    get: (id) => api.get(`/notes/${id}`),
    create: (data) => api.post("/notes", data),
    update: (id, data) => api.put(`/notes/${id}`, data),
    del: (id) => api.del(`/notes/${id}`),
};

export default noteService;
