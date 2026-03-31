import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  Menu, X, User, LogOut, PlusSquare, 
  Palette, LayoutDashboard, ShieldCheck, Settings 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user && user.role === 'ADMIN';
  const isArtist = user && user.role === 'ARTIST';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-violet-600 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-violet-600/20">
            <Palette size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            Artist<span className="text-violet-500">360</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
          
          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />
         
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all"
                >
                  <ShieldCheck size={18} /> Admin Panel
                </Link>
              )}

              {isArtist && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  
                  <Link to="/upload" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1">
                    <PlusSquare size={16} /> Upload
                  </Link>
                </>
              )}
              
              <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1">
                <User size={16} /> Profile
              </Link>

              <button 
                onClick={handleLogout}
                className="ml-4 text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Login</Link>
              <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-violet-500/20">
                Join
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0F172A] p-4 space-y-4 border-b border-white/5">
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-rose-400 font-bold border-b border-white/5">
               🛡️ Admin Panel
            </Link>
          )}
          {isArtist && (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-slate-300">Dashboard</Link>
              <Link to="/upload" onClick={() => setIsOpen(false)} className="block py-2 text-slate-300">Upload Art</Link>
            </>
          )}
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-slate-300">Profile</Link>
          <button onClick={handleLogout} className="w-full text-left py-2 text-red-400 font-bold">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;