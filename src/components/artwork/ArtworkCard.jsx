import { useState } from 'react';
import { Heart, MessageCircle, Tag } from 'lucide-react';
import interactionService from '../../services/interactionService';
import CommentSection from './CommentSection';

const ArtworkCard = ({ artwork }) => {
  const [likes, setLikes] = useState(artwork.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  if (!artwork) return null;

  const handleLike = async (e) => {
  e.stopPropagation();
  try {
    await interactionService.likeArtwork(artwork.id);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert("Session expired. Please login again.");
    } else {
      console.error("Backend Error:", err.response?.data);
      alert("Server error: Check if LikeService is working.");
    }
  }
};
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all duration-300 shadow-lg group">
        
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
             <button 
              onClick={handleLike}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
             >
               <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
             </button>
             <button 
              onClick={() => setShowComments(!showComments)}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
             >
               <MessageCircle size={24} />
             </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold text-lg truncate">{artwork.title}</h3>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Heart size={14} className={isLiked ? "text-red-500" : "text-gray-500"} /> {likes}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            by <span className="text-violet-400">@{artwork.artist?.name || 'Artist'}</span>
          </p>
          
          {artwork.tags && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.split(',').map((tag, index) => (
                <span key={index} className="text-[10px] uppercase bg-violet-500/10 text-violet-400 px-2 py-1 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 animate-in slide-in-from-top-2 duration-300">
          <CommentSection artworkId={artwork.id} />
        </div>
      )}
    </div>
  );
};

export default ArtworkCard;