import api from "./api";
import CONFIG from "../config";

const noteService = {
    list: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/notes/my-notes?page=${page}&limit=${limit}`),
    getAll: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/notes/all?page=${page}&limit=${limit}`),
    get: (id) => api.get(`/notes/${id}`),
    create: (data) => api.post("/notes/create", data),
    update: (id, data) => api.patch(`/notes/${id}`, data),
    del: (id) => api.del(`/notes/${id}`),
};

export default noteService;
