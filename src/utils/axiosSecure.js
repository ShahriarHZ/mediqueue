import axios from "axios";

// Automatically falls back to localhost if the Vercel environment variable isn't active
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://mediqueue-server.vercel.app";

const axiosSecure = axios.create({
  baseURL: baseURL,
});

// Automatically injects your local storage pass token into every outgoing request header
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mq-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;