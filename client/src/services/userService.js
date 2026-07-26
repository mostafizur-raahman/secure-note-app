import api from "./api";
import CONFIG from "../config";

const userService = {
    list: (page = 1, limit = CONFIG.PAGE_SIZE) =>
        api.get(`/users?page=${page}&limit=${limit}`),
    get: (id) => api.get(`/users/${id}`),
    create: (data) => api.post("/users", data),
    update: (id, data) => api.put(`/users/${id}`, data),
    del: (id) => api.del(`/users/${id}`),
    groupedByInterest: () => api.get("/users/grouped-by-interests"),
};

export default userService;
