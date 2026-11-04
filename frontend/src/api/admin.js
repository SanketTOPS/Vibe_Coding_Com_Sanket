import api from './axios';

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  listUsers: (params) => api.get('/admin/users', { params }),
  verifyProvider: (providerId) => api.patch(`/admin/providers/${providerId}/verify`),
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
};

