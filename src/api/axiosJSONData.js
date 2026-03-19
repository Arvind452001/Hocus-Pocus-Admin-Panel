import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';


const axiosJSONData = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor → token auto attach
axiosJSONData.interceptors.request.use(
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

export default axiosJSONData;
