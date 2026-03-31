import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LogIn, Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', formData);
      
      // Check if user is admin
      if (response.data.user.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      
      login(response.data.user, response.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl p-8 rounded-2xl border border-rose-500/20 w-full max-w-md shadow-2xl shadow-rose-500/10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-rose-500/20 rounded-xl">
              <ShieldAlert className="text-rose-500" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
          <p className="text-gray-400 mt-2">Administrators only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="email" 
              placeholder="Admin Email"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
            {loading ? 'Verifying...' : 'Admin Access'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an admin account? 
            <Link to="/admin/register" className="text-rose-400 hover:underline ml-1">Register here</Link>
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-xs text-center">
            ⚠️ Unauthorized access attempts are logged
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
