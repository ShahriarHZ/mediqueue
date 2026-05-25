import axios from 'axios';

const axiosSecure = axios.create({
    // Dynamically reads the variable from your root .env file
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true
});

export default axiosSecure;