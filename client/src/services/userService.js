import api from "./api";
import CONFIG from "../config";

const userService = {
    getMe: () => api.get("/users/me"),
    list: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/users?page=${page}&limit=${limit}`),
    get: (id) => api.get(`/users/${id}`),
    create: (data) => api.post("/users", data),
    update: (id, data) => api.patch(`/users/${id}`, data),
    updateMe: (data) => api.patch("/users/me", data),
    del: (id) => api.del(`/users/${id}`),
    groupedByInterest: () => api.get("/users/interests/grouped"),
};

export default userService;
