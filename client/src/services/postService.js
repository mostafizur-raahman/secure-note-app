import api from "./api";
import CONFIG from "../config";

const postService = {
    list: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/posts?page=${page}&limit=${limit}`),
    get: (id) => api.get(`/posts/${id}`),
    getByUser: (userId) => api.get(`/posts/user/${userId}`),
    create: (data) => api.post("/posts/create", data),
    update: (id, data) => api.patch(`/posts/${id}`, data),
    del: (id) => api.del(`/posts/${id}`),
};

export default postService;
