import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // gửi cookie kèm request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
