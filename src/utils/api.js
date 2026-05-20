import axios from "axios";

// 1. Create a custom Axios instance connected to your backend server
const api = axios.create({
  // Fixed syntax error (replaced '=' with ':') and updated to your active backend URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://mediqueue-server-zeta.vercel.app"
});

// 2. Setup the automated interceptor gatekeeper
api.interceptors.request.use(
  (config) => {
    // Check if we are running in the browser
    if (typeof window !== "undefined") {
      // Fixed: Key changed to 'mq-token' to match exactly what your register/login views save
      const token = localStorage.getItem("mq-token");
      
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