import axios from "axios";

// ✅ Check if window is available to avoid server-side errors
const isBrowser = typeof window !== "undefined";
console.log(window.location.origin , "window.location.origin ");

// const baseURL = isBrowser ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || "";

const baseURL = isBrowser ? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_BASE_URL || "";

const apiURL = `${baseURL}/api`;

const api = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
    },
});

const multipartApi = axios.create({
    baseURL: apiURL,
    headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
    },
});

// ✅ Use function for safe redirection
function redirectToLogin() {
    if (isBrowser) {
        window.location.href = "/login";
    }
}

const getAuthHeader = () => {
    try {
        const jwtToken = localStorage.getItem("jwtToken") || "";
        const userId = localStorage.getItem("userId") || "";
        const planId = localStorage.getItem("planId") || "";
        return JSON.stringify({ jwtToken, userId, planId });
    } catch (error) {
        console.error("Error:", error);
        localStorage.clear();
        redirectToLogin();
    }
};

// ✅ Axios request interceptor
api.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = getAuthHeader();
        return config;
    },
    (error) => {
        console.error("💡 ~ error:", error);
        localStorage.clear();
        redirectToLogin();
    }
);

// ✅ Axios response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

// ✅ Export
export { api, multipartApi,  getAuthHeader };
