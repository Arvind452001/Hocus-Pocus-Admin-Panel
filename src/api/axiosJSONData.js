import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';

const axiosJSONData = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor → token attach
axiosJSONData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang") || "en"; // 👈 ADD THIS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ language भेजो
    config.headers["Accept-Language"] = lang;

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR ADD KARO 👇
axiosJSONData.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔥 Token expired ya invalid

      localStorage.removeItem("token");

      // Optional: user data bhi clear karo
      localStorage.removeItem("user");

      // Message show karo
      alert("Session expired. Please login again.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosJSONData;