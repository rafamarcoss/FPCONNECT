import { useState, useCallback } from 'react';
import { postsService, commentsService, connectionsService, usersService } from '../services';

/**
 * Hook para cargar posts del feed
 */
export const useFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const loadFeed = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsService.getFeed(page, limit);
      const normalizedPosts = (response.data.posts || []).map((post) => ({
        ...post,
        isLiked: Array.isArray(post.likes) && post.likes.length > 0,
      }));
      setPosts(normalizedPosts);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message || 'Error al cargar el feed');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const updatePost = useCallback((postId, updates) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const resolvedUpdates = typeof updates === 'function' ? updates(p) : updates;
        return { ...p, ...resolvedUpdates };
      })
    );
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    loadFeed,
    addPost,
    removePost,
    updatePost,
  };
};

/**
 * Hook para crear y manejar posts
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = useCallback(async (content, visibility = 'PUBLIC') => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsService.createPost(content, visibility);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al crear post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPost, loading, error };
};

/**
 * Hook para like en posts y comentarios
 */
export const useLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const likePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      await postsService.likePost(postId);
    } catch (err) {
      setError(err.message || 'Error al hacer like');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    try {
      await postsService.unlikePost(postId);
    } catch (err) {
      setError(err.message || 'Error al quitar like');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (postId, commentId) => {
    setLoading(true);
    setError(null);
    try {
      await commentsService.likeComment(postId, commentId);
    } catch (err) {
      setError(err.message || 'Error al hacer like');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeComment = useCallback(async (postId, commentId) => {
    setLoading(true);
    setError(null);
    try {
      await commentsService.unlikeComment(postId, commentId);
    } catch (err) {
      setError(err.message || 'Error al quitar like');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
  };
};

/**
 * Hook para comentarios
 */
export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsService.getComments(postId, page, limit);
      setComments(response.data.comments);
    } catch (err) {
      setError(err.message || 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content) => {
    try {
      const response = await commentsService.createComment(postId, content);
      setComments((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al crear comentario');
      throw err;
    }
  }, [postId]);

  const deleteComment = useCallback(async (commentId) => {
    try {
      await commentsService.deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message || 'Error al eliminar comentario');
      throw err;
    }
  }, [postId]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    deleteComment,
  };
};

/**
 * Hook para conexiones/follows
 */
export const useConnections = () => {
  const [connections, setConnections] = useState({
    followers: [],
    following: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFollowers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await connectionsService.getFollowers(page, limit);
      setConnections((prev) => ({
        ...prev,
        followers: response.data,
      }));
    } catch (err) {
      setError(err.message || 'Error al cargar seguidores');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFollowing = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await connectionsService.getFollowing(page, limit);
      setConnections((prev) => ({
        ...prev,
        following: response.data,
      }));
    } catch (err) {
      setError(err.message || 'Error al cargar seguidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecommendations = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const response = await connectionsService.getRecommendations(limit);
      setConnections((prev) => ({
        ...prev,
        recommendations: response.data,
      }));
    } catch (err) {
      setError(err.message || 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const followUser = useCallback(async (userId) => {
    try {
      await connectionsService.followUser(userId);
      // Actualizar el estado local para reflejar que ahora seguimos a la persona
      setConnections(prev => {
        // En lugar de una llamada a red extra, insertamos un objeto con el ID temporal.
        // Si el usuario vuelve a recargar, obtendrá el perfil completo.
        const alreadyFollowing = prev.following.some(u => u.id === userId);
        if (alreadyFollowing) return prev;
        
        return {
          ...prev,
          following: [{ id: userId }, ...prev.following]
        };
      });
    } catch (err) {
      setError(err.message || 'Error al seguir usuário');
      throw err;
    }
  }, []);

  const unfollowUser = useCallback(async (userId) => {
    try {
      await connectionsService.unfollowUser(userId);
      // Eliminar del estado local de seguidos
      setConnections(prev => ({
        ...prev,
        following: prev.following.filter(u => u.id !== userId)
      }));
    } catch (err) {
      setError(err.message || 'Error al dejar de seguir');
      throw err;
    }
  }, []);

  return {
    connections,
    followers: connections.followers,
    following: connections.following,
    recommendations: connections.recommendations,
    loading,
    error,
    loadFollowers,
    loadFollowing,
    loadRecommendations,
    followUser,
    unfollowUser,
  };
};

/**
 * Hook para búsqueda de usuarios
 */
export const useUserSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, page = 1, limit = 10, role = null) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await usersService.searchUsers(query, page, limit, role);
      setResults(response.data?.users || []);
    } catch (err) {
      setError(err.message || 'Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
