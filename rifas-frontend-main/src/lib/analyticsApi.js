import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const analyticsApi = axios.create({
  baseURL: API_BASE_URL,
});

// ⚠️ SOLO para analytics (no afecta otros módulos)
analyticsApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default analyticsApi;
