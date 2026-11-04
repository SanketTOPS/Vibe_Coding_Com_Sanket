import api from './axios';

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getByProvider: (providerId, params) => api.get(`/reviews/provider/${providerId}`, { params }),
  getMy: () => api.get('/reviews/my'),
};

