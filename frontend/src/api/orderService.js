import axios from "axios";

const orderService = axios.create({
    baseURL: "http://localhost:8086/api",
    headers: {
        "Content-Type": "application/json",
    },
});

orderService.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("vinylr_jwt");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default orderService;