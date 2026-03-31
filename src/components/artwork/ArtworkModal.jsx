import { X, Heart, MessageCircle, Share2, Users, UserPlus, UserCheck } from 'lucide-react';
import CommentSection from './CommentSection';
import { useState } from 'react';

const ArtworkModal = ({ artwork, isOpen, onClose, onLike, isLiked, onFollowToggle, isFollowing, followers }) => {
  const [showComments, setShowComments] = useState(false);

  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      {/* Modal Container */}
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white truncate">{artwork.title}</h2>
            <p className="text-slate-400 text-sm">
              by <span className="font-semibold text-white">{artwork.artist?.name || 'Unknown Artist'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Section */}
            <div className="lg:flex-1 bg-black/30 flex items-center justify-center p-4">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="lg:w-96 p-6 space-y-6 flex flex-col">
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Description</h3>
                <p className="text-white text-sm leading-relaxed">{artwork.description}</p>
              </div>

              {/* Tags */}
              {artwork.tags && (
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-violet-600/30 text-violet-300 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Likes</span>
                  <span className="text-white font-bold">{artwork.likesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Artist Followers</span>
                  <span className="text-white font-bold flex items-center gap-1"><Users size={14} className="text-blue-400" /> {followers || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Artist</span>
                  <span className="text-white font-semibold">{artwork.artist?.name || 'Unknown'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <div className="flex gap-3">
                  <button
                    onClick={onLike}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-colors ${
                      isLiked
                        ? 'bg-red-600/30 text-red-400 hover:bg-red-600/50'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    Like
                  </button>
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                    <MessageCircle size={18} />
                    Comment
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
                
                {/* Follow Artist Button */}
                <button
                  onClick={onFollowToggle}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-colors ${
                    isFollowing
                      ? 'bg-blue-600/30 text-blue-400 hover:bg-blue-600/50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={18} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Follow Artist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-white/10 p-6 bg-slate-900/50 max-h-64 overflow-y-auto">
            <CommentSection artworkId={artwork.id} />
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div className="fixed inset-0 z-40 -z-10" onClick={onClose} />
    </div>
  );
};

export default ArtworkModal;
