import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const moviesApi = {
  getAll: () => api.get('/movies'),
  getById: (id: string) => api.get(`/movies/${id}`),
  create: (data: any) => api.post('/movies', data),
  update: (id: string, data: any) => api.put(`/movies/${id}`, data),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

// Sessions API
export const sessionsApi = {
  getAll: () => api.get('/sessions'),
  getById: (id: string) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  update: (id: string, data: any) => api.put(`/sessions/${id}`, data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

// Reservations API
export const reservationsApi = {
  getAll: () => api.get('/reservations'),
  getById: (id: string) => api.get(`/reservations/${id}`),
  create: (data: any) => api.post('/reservations', data),
  update: (id: string, data: any) => api.put(`/reservations/${id}`, data),
  delete: (id: string) => api.delete(`/reservations/${id}`),
};

// Customers API
export const customersApi = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Halls API
export const hallsApi = {
  getAll: () => api.get('/halls'),
  getById: (id: string) => api.get(`/halls/${id}`),
  create: (data: any) => api.post('/halls', data),
  update: (id: string, data: any) => api.put(`/halls/${id}`, data),
  delete: (id: string) => api.delete(`/halls/${id}`),
};

// Seats API
export const seatsApi = {
  getAll: (hallId?: string) => api.get('/seats', { params: { hallId } }),
  getById: (id: string) => api.get(`/seats/${id}`),
  create: (data: any) => api.post('/seats', data),
  update: (id: string, data: any) => api.put(`/seats/${id}`, data),
  delete: (id: string) => api.delete(`/seats/${id}`),
};

// Payments API
export const paymentsApi = {
  getAll: () => api.get('/payments'),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

// Tickets API
export const ticketsApi = {
  getAll: () => api.get('/tickets'),
  getById: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: string, data: any) => api.put(`/tickets/${id}`, data),
  delete: (id: string) => api.delete(`/tickets/${id}`),
};

export default api;

