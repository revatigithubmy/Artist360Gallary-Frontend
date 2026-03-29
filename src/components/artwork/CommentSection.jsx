import { useState, useEffect } from 'react';
import interactionService from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext'; 
import { Send, MessageSquare, User } from 'lucide-react';

const CommentSection = ({ artworkId }) => {
  const { user } = useAuth(); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (artworkId) {
      loadComments();
    }
  }, [artworkId]);

  const loadComments = async () => {
    try {
      const res = await interactionService.getComments(artworkId);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to join the conversation!");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await interactionService.addComment(artworkId, newComment, user.id);
      setNewComment('');
      await loadComments(); 
    } catch (err) {
      console.error("Comment Error:", err.response?.data);
      alert("Failed to post comment. Make sure you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t border-white/5 pt-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare size={20} className="text-violet-400" /> 
        Comments ({comments.length})
      </h3>
      
     
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Write a comment..." : "Login to comment"}
          disabled={!user || isSubmitting}
          className="flex-grow bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <button 
          type="submit"
          disabled={!user || isSubmitting || !newComment.trim()}
          className="bg-violet-600 p-3 rounded-xl hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 transition-all shadow-lg shadow-violet-600/20"
        >
          <Send size={20} className={isSubmitting ? "animate-pulse" : ""} />
        </button>
      </form>

      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User size={12} className="text-violet-400" />
                </div>
                <p className="text-violet-400 text-xs font-bold">
                  @{c.user?.name || c.userName || 'Anonymous'}
                </p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
               
                {c.content || c.text}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-slate-500 text-sm italic">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;