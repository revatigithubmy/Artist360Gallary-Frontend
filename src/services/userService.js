import api from './api';

const userService = {
  getFollowers: async (userId) => {
    return await api.get(`/users/${userId}/followers`);
  },

  getFollowing: async (userId) => {
    return await api.get(`/users/${userId}/following`);
  },

  checkIfFollowing: async (followerId, followingId) => {
    return await api.get(`/users/check-follow/${followerId}/${followingId}`);
  },

  followUser: async (followerId, followingId) => {
    return await api.post(`/users/follow`, {
      followerId,
      followingId
    });
  },

  unfollowUser: async (followerId, followingId) => {
    return await api.post(`/users/unfollow`, {
      followerId,
      followingId
    });
  }
};

export default userService;
