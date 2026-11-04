import api from './axios';

export const providersAPI = {
  list: (params) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
  createProfile: (data) => api.post('/providers/profile', data),
  getMyProfile: () => api.get('/providers/profile/me'),
  updateMyProfile: (data) => api.put('/providers/profile/me', data),
  getMyTechnicians: () => api.get('/providers/technicians/my'),
  addTechnician: (data) => api.post('/providers/technicians', data),
};

