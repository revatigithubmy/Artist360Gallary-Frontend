import api from './api';

const adminService = {
  
  getAllUsers: () => api.get('/admin/users'), 
 
  deleteUser: (id) => api.delete(`/admin/user/${id}`)
};

export default adminService;