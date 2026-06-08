import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchBrands() {
  const { data } = await api.get('/brands');
  return data;
}

export async function fetchBrand(id) {
  const { data } = await api.get(`/brands/${id}`);
  return data;
}

export async function createBrand(name) {
  const { data } = await api.post('/brands', { name });
  return data;
}

export async function sendChatMessage(brandId, message) {
  const { data } = await api.post('/chat', { brandId, message });
  return data;
}

export function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    'An unexpected error occurred'
  );
}

export default api;
