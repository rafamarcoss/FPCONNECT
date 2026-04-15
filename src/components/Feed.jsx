import { useEffect, useState } from 'react';
import { useFeed, useCreatePost, useLike } from '../hooks';

/**
 * Componente Feed
 * Muestra posts del usuario y sus conexiones
 */
export default function Feed() {
  const { posts, loading, error, loadFeed, addPost, removePost } = useFeed();
  const { createPost, loading: creatingPost } = useCreatePost();
  const { likePost, unlikePost } = useLike();

  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

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
    } catch (err) {
      alert('Error al crear post');
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (err) {
      alert('Error al procesar like');
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
              <option value="PUBLIC">🌍 Público</option>
              <option value="PRIVATE">🔒 Privado</option>
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
        <div style={{ textAlign: 'center', padding: 40, color: '#ffffff88' }}>
          📭 No hay posts aún. ¡Sé el primero! 🚀
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
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: post.isLiked ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: post.isLiked ? '#ff6b6b' : '#ffffff88',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {post.isLiked ? '❤️ Ya le gusta' : '🤍 Me gusta'}
            </button>

            <button
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff88',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              💬 Comentar
            </button>

            <button
              onClick={() => removePost(post.id)}
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
          </div>
        </div>
      ))}
    </div>
  );
}
