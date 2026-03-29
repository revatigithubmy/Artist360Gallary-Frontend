import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ArtworkCard from '../../components/artwork/ArtworkCard';
import { User, Edit3, ExternalLink, Briefcase, Grid, Loader2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    experience: '',
    portfolioLink: '',
    artistType: ''
  });

  useEffect(() => {
    const fetchProfileAndArt = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const userRes = await api.get(`/users/${user.id}`);
        setProfileData(userRes.data);
        setEditForm({
          bio: userRes.data.bio || '',
          experience: userRes.data.experience || '',
          portfolioLink: userRes.data.portfolioLink || '',
          artistType: userRes.data.artistType || ''
        });
        const artRes = await api.get(`/artworks`); 
        const filteredArt = artRes.data.filter(art => art.artist?.id === user.id);
        setUserArtworks(filteredArt);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndArt();
  }, [user?.id]);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/artist-profile/${user.id}`, editForm);
      setProfileData(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile details.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-violet-500" size={48} />
        <p className="text-slate-400 animate-pulse">Loading artist profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-violet-600 px-6 py-2 rounded-lg font-bold">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 mb-10 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600/20 to-indigo-600/20"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="w-32 h-32 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center shadow-2xl overflow-hidden">
            <User size={64} className="text-violet-500/50" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white">{profileData?.name || "Artist Name"}</h1>
            <p className="text-violet-400 font-medium tracking-wide uppercase text-sm">
              {profileData?.role || "User"}
            </p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2 rounded-full border border-white/10 transition-all text-sm font-medium"
          >
            <Edit3 size={18} /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Briefcase size={20} className="text-violet-400" /> About Artist
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <textarea 
                  placeholder="Tell your story..."
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-violet-500 outline-none transition-all min-h-[120px]"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                />
                <input 
                  type="text" placeholder="Experience (e.g. 5 Years)"
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-violet-500 outline-none transition-all"
                  value={editForm.experience}
                  onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                />
                <input 
                  type="url" placeholder="Portfolio Link (https://...)"
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-violet-500 outline-none transition-all"
                  value={editForm.portfolioLink}
                  onChange={(e) => setEditForm({...editForm, portfolioLink: e.target.value})}
                />
                <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 py-3 rounded-lg font-bold transition-all shadow-lg shadow-violet-600/20">
                  Update Profile
                </button>
              </form>
            ) : (
              <div className="text-slate-400 space-y-4">
                <p className="leading-relaxed italic">
                  "{profileData?.bio || "No biography added yet. Share your journey with the world!"}"
                </p>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase size={16} className="text-slate-500" /> 
                  <span>{profileData?.experience || "Experience not listed"}</span>
                </div>
                {profileData?.portfolioLink && (
                  <a href={profileData.portfolioLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    <ExternalLink size={16} /> Visit External Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Grid size={24} className="text-amber-400" /> My Creations
            </h3>
            <span className="bg-white/5 px-3 py-1 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest border border-white/5">
              {userArtworks.length} Artifacts
            </span>
          </div>

          {userArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userArtworks.map(art => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-900/30 rounded-3xl border-2 border-dashed border-white/5">
              <Grid className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Your gallery is empty.</p>
              <p className="text-slate-600 text-sm">Start by uploading your first masterpiece!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;