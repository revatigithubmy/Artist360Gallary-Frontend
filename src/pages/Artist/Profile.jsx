import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import userService from '../../services/userService';
import ArtworkCard from '../../components/artwork/ArtworkCard';
import { User, Edit3, ExternalLink, Briefcase, Grid, Loader2, AlertCircle, Heart, Users } from 'lucide-react';

const safeArray = (data) => Array.isArray(data) ? data : [];

const Profile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('creations');
  const [isEditing, setIsEditing] = useState(false);

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersActiveTab, setFollowersActiveTab] = useState('followers');

  const [editForm, setEditForm] = useState({
    bio: '',
    experience: '',
    portfolioLink: '',
    artistType: ''
  });

  const currentUserId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        setError(null);

        const [userRes, artRes, likedRes] = await Promise.all([
          api.get(`/users/${currentUserId}`),
          api.get(`/artworks/artist/${currentUserId}`),
          api.get(`/likes/user/${currentUserId}`)
        ]);

        const profile = userRes.data;
        setProfileData(profile);

        setEditForm({
          bio: profile.bio || '',
          experience: profile.experience || '',
          portfolioLink: profile.portfolioLink || '',
          artistType: profile.artistType || ''
        });

        setUserArtworks(safeArray(artRes.data));
        setLikedArtworks(safeArray(likedRes.data));

        // Followers & Following
        try {
          const followersRes = await userService.getFollowers(currentUserId);
          setFollowers(safeArray(followersRes.data));
        } catch {}

        try {
          const followingRes = await userService.getFollowing(currentUserId);
          setFollowing(safeArray(followingRes.data));
        } catch {}

        // Check follow status (important when viewing other profiles later)
        try {
          const res = await userService.checkIfFollowing(currentUserId, profile.id);
          setIsFollowing(res.data?.isFollowing || false);
        } catch {}

      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const handleFollowToggle = async () => {
    if (!profileData) return;

    try {
      const profileUserId = profileData.id;

      if (isFollowing) {
        await userService.unfollowUser(currentUserId, profileUserId);
        setFollowers(prev => prev.filter(f => f.id !== currentUserId));
        setIsFollowing(false);
      } else {
        await userService.followUser(currentUserId, profileUserId);
        setFollowers(prev => [...prev, { id: currentUserId, name: user.name, email: user.email }]);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update follow status");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/artist-profile/${currentUserId}`, editForm);
      setProfileData(res.data);
      setIsEditing(false);
    } catch {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-violet-500" size={48} />
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-40">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <p className="text-white">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-violet-600 px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">

      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-3xl mb-10">

        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="w-32 h-32 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
            {profileData?.avatar ? (
              <img src={profileData.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={60} className="text-violet-400" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl text-white font-bold">{profileData?.name}</h1>
            <p className="text-violet-400">{profileData?.role}</p>
          </div>

          {/* Edit Button (only own profile) */}
          {currentUserId === profileData?.id && (
            <button onClick={() => setIsEditing(!isEditing)} className="flex gap-2 bg-white/10 px-4 py-2 rounded">
              <Edit3 size={16} /> Edit
            </button>
          )}

          {/* Follow Button */}
          {currentUserId !== profileData?.id && (
            <button onClick={handleFollowToggle} className="flex gap-2 bg-violet-600 px-4 py-2 rounded">
              <Heart size={16} fill={isFollowing ? 'white' : 'none'} />
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6">
          <div>
            <p className="text-white text-xl">{followers.length}</p>
            <p className="text-slate-400 text-sm">Followers</p>
          </div>
          <div>
            <p className="text-white text-xl">{following.length}</p>
            <p className="text-slate-400 text-sm">Following</p>
          </div>
          <div>
            <p className="text-white text-xl">{userArtworks.length}</p>
            <p className="text-slate-400 text-sm">Artworks</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mb-10 bg-slate-900 p-6 rounded-2xl">
        <h3 className="text-white font-bold mb-4 flex gap-2 items-center">
          <Briefcase size={18}/> About
        </h3>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <textarea
              value={editForm.bio}
              onChange={(e)=>setEditForm({...editForm, bio:e.target.value})}
              className="w-full p-3 bg-black border rounded"
            />
            <input
              value={editForm.experience}
              onChange={(e)=>setEditForm({...editForm, experience:e.target.value})}
              className="w-full p-2 bg-black border rounded"
            />
            <input
              value={editForm.portfolioLink}
              onChange={(e)=>setEditForm({...editForm, portfolioLink:e.target.value})}
              className="w-full p-2 bg-black border rounded"
            />
            <button className="bg-violet-600 px-4 py-2 rounded">Save</button>
          </form>
        ) : (
          <>
            <p className="text-slate-400 italic">{profileData?.bio || "No bio yet"}</p>
            <p className="text-slate-400 mt-2">{profileData?.experience}</p>
            {profileData?.portfolioLink && (
              <a href={profileData.portfolioLink} target="_blank" rel="noreferrer" className="text-violet-400 flex gap-2 mt-2">
                <ExternalLink size={14}/> Portfolio
              </a>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={()=>setActiveTab('creations')} className="text-white">Creations</button>
        <button onClick={()=>setActiveTab('liked')} className="text-white">Liked</button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeTab === 'creations' ? userArtworks : likedArtworks).map(art => (
          <ArtworkCard key={art.id} artwork={art}/>
        ))}
      </div>

    </div>
  );
};

export default Profile;
