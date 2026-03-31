import { useEffect, useState } from 'react';
import api from '../services/api';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { Sparkles, Loader2, ImageOff, AlertCircle, RefreshCw } from 'lucide-react';

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtworks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching artworks from: /artworks");
      const res = await api.get('/artworks');
      console.log("Artworks response received:", res.data);
      
      // Handle various response structure formats
      let artworksData = [];
      if (Array.isArray(res.data)) {
        artworksData = res.data;
      } else if (res.data?.artworks && Array.isArray(res.data.artworks)) {
        artworksData = res.data.artworks;
      } else if (typeof res.data === 'object') {
        // Try to extract array from response object
        artworksData = Object.values(res.data).find(val => Array.isArray(val)) || [];
      }
      
      console.log("Processed artworks:", artworksData);
      setArtworks(artworksData);
    } catch (err) {
      console.error("Error fetching artworks:", err);
      setError(err.response?.data?.message || "Failed to load artworks. Please check if backend is running.");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return (
    <div className="space-y-12">
     
      <section className="relative overflow-hidden text-center py-20 px-6 rounded-[2rem] bg-slate-900/50 border border-white/5 shadow-2xl">
       
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">Extraordinary</span> Art
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore a curated 360-degree gallery of the world's finest digital and physical creations. 
            Built for artists, by artists.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Sparkles size={24} className="text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Trending Artworks</h2>
        </div>
        <div className="hidden md:block text-sm text-slate-500 bg-slate-800/50 px-4 py-1 rounded-full border border-white/5">
          {artworks.length} Masterpieces Found
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 gap-4">
          <Loader2 className="animate-spin text-violet-500" size={48} />
          <p className="text-slate-500 animate-pulse">Loading Gallery...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-900/20 rounded-3xl border-2 border-red-500/50">
          <AlertCircle size={64} className="text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h3>
          <p className="text-red-300 mb-6 text-center max-w-md">{error}</p>
          <button 
            onClick={fetchArtworks}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-lg font-semibold transition-all"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      ) : (
       
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border-2 border-dashed border-white/5">
          <ImageOff size={64} className="text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-slate-400">No artwork found</h3>
          <p className="text-slate-500 mt-2">Be the first to upload a masterpiece!</p>
        </div>
      )}
    </div>
  );
};

export default Home;