import axios from "axios";

// 1. Create a custom Axios instance connected to your backend server
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 2. Setup the automated interceptor gatekeeper
api.interceptors.request.use(
  (config) => {
    // Check if we are running in the browser
    if (typeof window !== "undefined") {
      // Pull your JWT token string out of localStorage
      const token = localStorage.getItem("token");
      
      // If a token exists, automatically inject it into the request headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;