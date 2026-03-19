import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';

const axiosFormData = axios.create({
  baseURL: BASE_URL, // 👈 apna backend URL
 headers: {
  "Content-Type": "multipart/form-data",
}
});

// Request interceptor → token auto attach
axiosFormData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // console.log("token",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosFormData;
