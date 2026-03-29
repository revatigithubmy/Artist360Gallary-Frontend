import api from './api';

const interactionService = {  
  likeArtwork: (artworkId) => api.post('/likes', { artworkId }),
  addComment: (artworkId, commentText, userId) => {
  return api.post('/comments', {
    content: commentText,     
    artwork: { id: artworkId },
    user: { id: userId }      
  });
},
  getComments: (artworkId) => {
    return api.post('/comments/artwork', { id: artworkId });
  }
};

export default interactionService;