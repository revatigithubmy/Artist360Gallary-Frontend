import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Users, ShieldAlert, Loader2, AlertTriangle, Trash2, CheckCircle, XCircle, Image, BarChart3, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users
      const usersRes = await adminService.getAllUsers();
      setUsers(usersRes.data || []);
      
      // Fetch artworks
      const artworksRes = await adminService.getAllArtworks();
      let artworksData = Array.isArray(artworksRes.data) ? artworksRes.data : (artworksRes.data?.artworks || []);
      setArtworks(artworksData);
      
      // Fetch stats if available
      try {
        const statsRes = await adminService.getDashboardStats();
        setStats(statsRes.data);
      } catch (e) {
        console.log("Stats endpoint not available");
      }
    } catch (err) {
      setError("Failed to load admin data. Please check if Backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        alert("Failed to delete user: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteArtwork = async (artworkId, artworkTitle) => {
    if (window.confirm(`Are you sure you want to delete artwork "${artworkTitle}"?`)) {
      try {
        await adminService.deleteArtwork(artworkId);
        setArtworks(artworks.filter(a => a.id !== artworkId));
        alert("Artwork deleted successfully");
      } catch (err) {
        alert("Failed to delete artwork: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleApproveArtwork = async (artworkId) => {
    try {
      await adminService.approveArtwork(artworkId);
      fetchData();
      alert("Artwork approved successfully");
    } catch (err) {
      console.error("Approve failed, might not be implemented in backend yet");
    }
  };

  const handleRejectArtwork = async (artworkId) => {
    try {
      await adminService.rejectArtwork(artworkId);
      fetchData();
      alert("Artwork rejected successfully");
    } catch (err) {
      console.error("Reject failed, might not be implemented in backend yet");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center py-20">
      <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
      <p className="text-slate-400">Fetching Admin Dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
      <p className="text-white font-bold">{error}</p>
      <button 
        onClick={fetchData}
        className="mt-6 bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-lg font-semibold transition-all"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-rose-500/20 rounded-2xl">
          <ShieldAlert className="text-rose-500" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, artworks, and content</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" size={28} />
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers || users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Image className="text-violet-400" size={28} />
              <div>
                <p className="text-slate-400 text-sm">Total Artworks</p>
                <p className="text-2xl font-bold text-white">{stats.totalArtworks || artworks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-amber-400" size={28} />
              <div>
                <p className="text-slate-400 text-sm">Total Interactions</p>
                <p className="text-2xl font-bold text-white">{stats.totalLikes || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="hidden md:flex gap-4 border-b border-white/10 flex-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === 'users'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users size={20} className="inline mr-2" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('artworks')}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === 'artworks'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Image size={20} className="inline mr-2" />
            Artworks ({artworks.length})
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition-all"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/50 border border-white/5 rounded-2xl p-4 space-y-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('users');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={20} className="inline mr-2" />
            Users ({users.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('artworks');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              activeTab === 'artworks'
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image size={20} className="inline mr-2" />
            Artworks ({artworks.length})
          </button>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {users.length === 0 ? (
            <div className="bg-slate-900/50 p-10 rounded-3xl border border-dashed border-white/10 text-center">
              <Users className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500">No users found in the database.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-bold">{u.name}</p>
                      <p className="text-slate-500 text-sm">
                        {u.email} • <span className={`${u.role === 'ADMIN' ? 'text-red-400' : 'text-green-400'}`}>{u.role || 'USER'}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Artworks Tab */}
      {activeTab === 'artworks' && (
        <div>
          {artworks.length === 0 ? (
            <div className="bg-slate-900/50 p-10 rounded-3xl border border-dashed border-white/10 text-center">
              <Image className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500">No artworks found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {artworks.map(artwork => (
                <div key={artwork.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Thumbnail */}
                    <div className="md:col-span-1">
                      {artwork.imageUrl && (
                        <img 
                          src={artwork.imageUrl} 
                          alt={artwork.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="md:col-span-2">
                      <p className="text-white font-bold text-lg truncate">{artwork.title}</p>
                      <p className="text-slate-400 text-sm mb-2">
                        by <span className="text-violet-400">{artwork.artist?.name || 'Unknown Artist'}</span>
                      </p>
                      <p className="text-slate-500 text-sm line-clamp-2">{artwork.description}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {artwork.tags && artwork.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="text-[10px] uppercase bg-violet-500/10 text-violet-400 px-2 py-1 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="md:col-span-1 flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => handleApproveArtwork(artwork.id)}
                        className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 hover:text-green-300 transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleRejectArtwork(artwork.id)}
                        className="p-2 hover:bg-yellow-500/20 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteArtwork(artwork.id, artwork.title)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;