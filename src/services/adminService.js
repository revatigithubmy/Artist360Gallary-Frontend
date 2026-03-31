import api from './api';

const adminService = {
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  
  // Artwork Management
  getAllArtworks: () => api.get('/artworks'),
  approveArtwork: (id) => api.put(`/admin/artworks/${id}/approve`),
  rejectArtwork: (id) => api.put(`/admin/artworks/${id}/reject`),
  deleteArtwork: (id) => api.delete(`/admin/artworks/${id}`),
  
  // Statistics
  getDashboardStats: () => api.get('/admin/stats'),
  
  // Get pending artworks
  getPendingArtworks: () => api.get('/admin/artworks/pending'),
  
  // Get approved artworks
  getApprovedArtworks: () => api.get('/admin/artworks/approved'),
};

export default adminService;