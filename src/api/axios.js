import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Public API instance for unauthenticated requests
export const PublicAPI = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Authenticated API instance for requests that require authentication
export const AuthAPI = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((req) => {
    // Don't add token for login or register
    if (!req.url.endsWith("/login") && !req.url.endsWith("/register")) {
        const token = localStorage.getItem("token");
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
            console.log("[DEBUG] Axios: Added Authorization header for URL:", req.url);
        } else {
            console.log("[DEBUG] Axios: No token found in localStorage for URL:", req.url);
        }
    } else {
        console.log("[DEBUG] Axios: Skipping token for auth endpoint:", req.url);
    }
    return req;
});

// Add the same interceptor to AuthAPI
AuthAPI.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        console.log("[DEBUG] AuthAPI: Added Authorization header for URL:", req.url);
        console.log("[DEBUG] AuthAPI: Token:", token.substring(0, 20) + "...");
    } else {
        console.log("[DEBUG] AuthAPI: No token found in localStorage for URL:", req.url);
    }
    return req;
});

export default API;
