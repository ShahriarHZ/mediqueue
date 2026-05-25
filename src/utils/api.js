import axios from 'axios';

const api = axios.create({
    // Dynamically hooks into your root environment variables
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true
});

export default api;