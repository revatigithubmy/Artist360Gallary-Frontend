import api from './api';

const interactionService = {  
  likeArtwork: (artworkId) => {
    return api.post('/likes', { artworkId }).then(response => response.data);
  },
  addComment: (artworkId, commentText, userId) => {
    return api.post('/comments', {
      content: commentText,     
      artwork: { id: artworkId },
      user: { id: userId }      
    });
  },
  getComments: (artworkId) => {
    return api.post('/comments/artwork', { id: artworkId });
  },
  followArtist: (artistId) => {
    return api.post(`/users/follow`, { followingId: artistId }).then(response => response.data);
  },
  unfollowArtist: (artistId) => {
    return api.post(`/users/unfollow`, { followingId: artistId }).then(response => response.data);
  }
};

export default interactionService;