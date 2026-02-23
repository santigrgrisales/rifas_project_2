import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export const getReporteRifa = async (rifaId, fechaInicio, fechaFin) => {
  const params = {};

  if (fechaInicio && fechaFin) {
    params.fechaInicio = fechaInicio;
    params.fechaFin = fechaFin;
  }

  const token = localStorage.getItem('token');

  const response = await axios.get(
    `${API_BASE_URL}/api/reportes/rifa/${rifaId}`,
    {
      params,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    }
  );

  return response.data;
};
