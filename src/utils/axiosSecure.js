import axios from "axios";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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