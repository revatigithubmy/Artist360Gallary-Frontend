import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { UserPlus, Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Join the Artist360 community</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex gap-4 p-1 bg-[#0F172A] rounded-lg border border-white/10">
            <button 
              type="button"
              className={`flex-1 py-2 rounded-md text-sm transition-all ${formData.role === 'USER' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}
              onClick={() => setFormData({...formData, role: 'USER'})}
            >
              User
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 rounded-md text-sm transition-all ${formData.role === 'ARTIST' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}
              onClick={() => setFormData({...formData, role: 'ARTIST'})}
            >
              Artist
            </button>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:opacity-90 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;