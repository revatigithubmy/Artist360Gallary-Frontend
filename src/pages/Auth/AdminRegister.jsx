import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserPlus, Mail, Lock, Loader2, ShieldAlert, User, AlertCircle } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.adminSecretKey.trim()) {
      setError('Admin secret key is required');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/admin/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        adminSecretKey: formData.adminSecretKey
      });

      setSuccess(true);
      
      // Auto-login
      if (response.data) {
        const loginResponse = await api.post('/auth/login', {
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });
        login(loginResponse.data.user, loginResponse.data.token);
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please check your details.');
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
          <h2 className="text-3xl font-bold text-white">Admin Registration</h2>
          <p className="text-gray-400 mt-2">Create a new admin account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg mb-6 text-sm text-center">
            ✅ Admin account created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="text" 
              name="name"
              placeholder="Full Name"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="email" 
              name="email"
              placeholder="Admin Email"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="password" 
              name="password"
              placeholder="Password (min 6 characters)"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 transition-all"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-yellow-400 text-xs mb-2">🔑 Admin Secret Key Required</p>
            <input 
              type="password" 
              name="adminSecretKey"
              placeholder="Enter admin secret key"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-rose-500 transition-all text-sm"
              value={formData.adminSecretKey}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an admin account? 
            <Link to="/admin/login" className="text-rose-400 hover:underline ml-1">Login here</Link>
          </p>
        </div>

        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-xs text-center">
            ⚠️ This is a restricted area. Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
