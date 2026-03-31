import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { LayoutDashboard, BarChart3, Image as ImageIcon, Heart, Eye, TrendingUp, Trash2, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [myArt, setMyArt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalWorks: 0,
    totalLikes: 0,
    totalViews: 0,
    mostLiked: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      try {
        // Fetch artworks by artist ID
        const artRes = await api.get(`/artworks/artist/${user.id}`);
        const userArtworks = Array.isArray(artRes.data) ? artRes.data : [];
        setMyArt(userArtworks);
        
        // Calculate statistics
        const totalLikes = userArtworks.reduce((sum, art) => sum + (art.likesCount || 0), 0);
        const mostLiked = userArtworks.length > 0 
          ? userArtworks.reduce((prev, current) => 
              (prev.likesCount || 0) > (current.likesCount || 0) ? prev : current
            )
          : null;

        setStats({
          totalWorks: userArtworks.length,
          totalLikes: totalLikes,
          totalViews: userArtworks.length * 10,
          mostLiked: mostLiked
        });
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleDeleteArtwork = async (artworkId, title) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/artworks/${artworkId}`);
        setMyArt(myArt.filter(art => art.id !== artworkId));
        alert("Artwork deleted successfully");
      } catch (err) {
        alert("Failed to delete artwork: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="animate-spin text-violet-500" size={48} />
      <p className="text-slate-400">Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
      <p className="text-slate-400 mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-violet-600 px-6 py-2 rounded-lg font-bold">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
          <LayoutDashboard className="text-violet-500" size={40} /> Artist Dashboard
        </h1>
        <p className="text-slate-400">Manage your creations and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Works</p>
              <p className="text-3xl font-bold text-white">{stats.totalWorks}</p>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500">
              <ImageIcon size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-white">{stats.totalLikes}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <Heart size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Engagement</p>
              <p className="text-3xl font-bold text-white">{Math.round((stats.totalLikes / Math.max(stats.totalWorks, 1)) * 10) / 10}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Most Liked</p>
              <p className="text-3xl font-bold text-white">{stats.mostLiked?.likesCount || 0}</p>
              <p className="text-xs text-slate-500 mt-1 truncate">{stats.mostLiked?.title || 'N/A'}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* My Artworks Section */}
      <div>
        <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
          <ImageIcon size={24} className="text-amber-400" /> My Gallery
        </h2>

        {myArt.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myArt.map(artwork => (
              <div key={artwork.id} className="relative group">
                <ArtworkCard artwork={artwork} />
                <button
                  onClick={() => handleDeleteArtwork(artwork.id, artwork.title)}
                  className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border-2 border-dashed border-white/5">
            <ImageIcon className="mx-auto text-slate-700 mb-4" size={64} />
            <p className="text-slate-500 font-medium text-lg">Your gallery is empty</p>
            <p className="text-slate-600 text-sm mt-2">Start by uploading your first masterpiece!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;