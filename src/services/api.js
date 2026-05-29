import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    // JANGAN taruh Content-Type di sini, biar axios set otomatis
    // sesuai jenis request (json atau multipart)
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Kalau data adalah FormData, hapus Content-Type biar browser set boundary-nya sendiri
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan';
    return Promise.reject(new Error(message));
  }
);

export default api;