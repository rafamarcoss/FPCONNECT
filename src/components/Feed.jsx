import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useFeed, useCreatePost, useLike } from '../hooks';
import { commentsService, postsService } from '../services';
import UserCard from './UserCard';

/**
 * Componente Feed
 * Muestra posts del usuario y sus conexiones
 */
export default function Feed({ recommendations = [], following = [], onFollow, onUnfollow, onOpenProfile }) {
  const { user: authUser } = useAuthStore();
  const { showToast } = useUIStore();
  const { posts, loading, error, loadFeed, addPost, removePost, updatePost } = useFeed();
  const { createPost, loading: creatingPost } = useCreatePost();
  const { likePost, unlikePost } = useLike();

  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoadingByPost, setCommentLoadingByPost] = useState({});
  const [likeLoadingByPost, setLikeLoadingByPost] = useState({});

  // Cargar feed al montar
  useEffect(() => {
    loadFeed();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      const newPost = await createPost(postContent, visibility);
      addPost(newPost);
      setPostContent('');
      showToast('Post publicado correctamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error al crear post', 'error');
    }
  };

  const handleLike = async (postId, isLiked) => {
    if (likeLoadingByPost[postId]) return;

    setLikeLoadingByPost((prev) => ({ ...prev, [postId]: true }));
    try {
      if (isLiked) {
        await unlikePost(postId);
        updatePost(postId, (prevPost) => ({
          ...prevPost,
          isLiked: false,
          likeCount: Math.max(0, (prevPost.likeCount || 0) - 1),
        }));
      } else {
        await likePost(postId);
        updatePost(postId, (prevPost) => ({
          ...prevPost,
          isLiked: true,
          likeCount: (prevPost.likeCount || 0) + 1,
        }));
      }
    } catch (err) {
      // Like/unlike should be visually silent for UX consistency.
    } finally {
      setLikeLoadingByPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleChangeComment = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCreateComment = async (postId) => {
    const content = (commentInputs[postId] || '').trim();
    if (!content) {
      showToast('Escribe un comentario antes de enviar', 'error');
      return;
    }

    if (commentLoadingByPost[postId]) return;

    setCommentLoadingByPost((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await commentsService.createComment(postId, content);
      const newComment = response.data;

      updatePost(postId, (prevPost) => ({
        ...prevPost,
        comments: [newComment, ...(prevPost.comments || [])].slice(0, 3),
        commentCount: (prevPost.commentCount || 0) + 1,
      }));

      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      showToast('Comentario publicado', 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo publicar el comentario', 'error');
    } finally {
      setCommentLoadingByPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsService.deletePost(postId);
      removePost(postId);
      showToast('Post eliminado correctamente', 'success');
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el post', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      {/* Create Post Card */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 20,
          marginBottom: 20,
        }}
      >
        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="¿Qué tenéis en mente? 💭"
            style={{
              width: '100%',
              minHeight: 100,
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              marginBottom: 12,
            }}
          />

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="PUBLIC" style={{ color: '#fff', backgroundColor: '#1f2937' }}>🌍 Público</option>
              <option value="PRIVATE" style={{ color: '#fff', backgroundColor: '#1f2937' }}>🔒 Privado</option>
            </select>

            <button
              type="submit"
              disabled={creatingPost || !postContent.trim()}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #00A878, #007A57)',
                color: '#fff',
                fontWeight: 600,
                cursor: creatingPost || !postContent.trim() ? 'not-allowed' : 'pointer',
                opacity: creatingPost || !postContent.trim() ? 0.5 : 1,
              }}
            >
              {creatingPost ? '⏳ Publicando...' : '✨ Publicar'}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: 8,
            padding: 12,
            color: '#fca5a5',
            marginBottom: 20,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#ffffff88' }}>
          ⏳ Cargando posts...
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#ffffff88', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>📭</div>
          <div style={{ marginBottom: 24 }}>No hay posts en tu feed. ¡Sé el primero en compartir algo o conecta con la comunidad!</div>
          
          {recommendations?.length > 0 && (
            <div style={{ textAlign: 'left', marginTop: 32 }}>
              <h3 style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>Sugerencias para ti</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {recommendations.slice(0, 5).map(recommendedUser => {
                  const isFollowing = following?.find(u => u.id === recommendedUser.id);
                  return (
                    <UserCard
                      key={recommendedUser.id}
                      user={recommendedUser}
                      actions={true}
                      isFollowing={!!isFollowing}
                      onFollow={() => onFollow && onFollow(recommendedUser.id)}
                      onUnfollow={() => onUnfollow && onUnfollow(recommendedUser.id)}
                      onOpenProfile={onOpenProfile}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: 20,
            marginBottom: 16,
          }}
        >
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: `linear-gradient(135deg, #00A878, #007A57)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                marginRight: 12,
              }}
            >
              {post.author?.firstName?.[0]?.toUpperCase()}
            </div>

            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
                {post.author?.firstName} {post.author?.lastName}
              </div>
              <div style={{ color: '#ffffff66', fontSize: 12 }}>
                {new Date(post.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <p style={{ color: '#ffffffdd', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px 0' }}>
            {post.content}
          </p>

          {/* Post Footer - Stats */}
          <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ color: '#ffffff66', fontSize: 12 }}>
              ❤️ {post.likeCount} likes
            </div>
            <div style={{ color: '#ffffff66', fontSize: 12 }}>
              💬 {post.commentCount} comentarios
            </div>
          </div>

          {/* Post Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              onClick={() => handleLike(post.id, post.isLiked)}
              disabled={!!likeLoadingByPost[post.id]}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: post.isLiked ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: post.isLiked ? '#ff6b6b' : '#ffffff88',
                cursor: likeLoadingByPost[post.id] ? 'default' : 'pointer',
                transition: 'all 0.2s',
                fontSize: 13,
                fontWeight: 500,
                opacity: likeLoadingByPost[post.id] ? 0.7 : 1,
              }}
            >
              {likeLoadingByPost[post.id] ? '⏳ Procesando...' : (post.isLiked ? '❤️ Me gusta' : '🤍 Me gusta')}
            </button>

            <button
              onClick={() => handleCreateComment(post.id)}
              disabled={!!commentLoadingByPost[post.id]}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff88',
                cursor: commentLoadingByPost[post.id] ? 'default' : 'pointer',
                fontSize: 13,
                fontWeight: 500,
                opacity: commentLoadingByPost[post.id] ? 0.7 : 1,
              }}
            >
              {commentLoadingByPost[post.id] ? '⏳ Enviando...' : '💬 Comentar'}
            </button>

            {post.author?.id === authUser?.id && (
              <button
                onClick={() => handleDeletePost(post.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                🗑️ Eliminar
              </button>
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <input
              type="text"
              value={commentInputs[post.id] || ''}
              onChange={(e) => handleChangeComment(post.id, e.target.value)}
              placeholder="Escribe un comentario y pulsa Comentar"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: 13,
              }}
            />
          </div>

          {post.comments?.length > 0 && (
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {post.comments.slice(0, 3).map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#ffffffaa', marginBottom: 4 }}>
                    {comment.author?.firstName} {comment.author?.lastName}
                  </div>
                  <div style={{ fontSize: 13, color: '#ffffffdd' }}>{comment.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
