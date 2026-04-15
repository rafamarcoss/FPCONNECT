// Ejemplo de AlumnoApp.jsx integrado con API
// Este archivo muestra cómo usar todos los hooks y servicios

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFeed, useConnections, useUserSearch } from '../hooks';
import Feed from '../components/Feed';
import UserCard from '../components/UserCard';

export default function AlumnoApp({ user, onLogout }) {
  const { user: authUser, logout } = useAuthStore();
  
  // Estado de sección activa
  const [activeTab, setActiveTab] = useState('feed'); // feed | followers | search

  // Hooks
  const { posts, loadFeed } = useFeed();
  const {
    connections,
    loading: connectionsLoading,
    loadFollowers,
    loadFollowing,
    loadRecommendations,
    followUser,
    unfollowUser,
  } = useConnections();
  const { results: searchResults, search } = useUserSearch();

  // Cargar datos iniciales
  useEffect(() => {
    if (activeTab === 'feed') {
      loadFeed();
    } else if (activeTab === 'followers') {
      loadFollowers();
      loadFollowing();
    } else if (activeTab === 'search') {
      loadRecommendations();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
      console.log('Usuario seguido');
    } catch (err) {
      alert('Error al seguir usuario: ' + err.message);
    }
  };

  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(userId);
      console.log('Se dejó de seguir al usuario');
    } catch (err) {
      alert('Error al dejar de seguir: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0c1a14 0%, #0f1f2e 50%, #14101f 100%)', color: '#fff' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            FP<span style={{ color: '#00A878' }}>Connect</span>
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['feed', 'followers', 'search'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, #00A878, #007A57)'
                    : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                }}
              >
                {tab === 'feed' && '📝 Feed'}
                {tab === 'followers' && '🔗 Conexiones'}
                {tab === 'search' && '🔍 Buscar'}
              </button>
            ))}
          </div>
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {authUser?.firstName} {authUser?.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#ffffff66' }}>
              {authUser?.role === 'ALUMNO' && '👨‍🎓 Alumno'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,0,0,0.2)',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            <Feed />

            {/* Sidebar - Recomendaciones */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 20,
              height: 'fit-content',
              position: 'sticky',
              top: 80,
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700 }}>
                👥 Sugerencias
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {connections.recommendations?.slice(0, 5).map(recommendedUser => (
                  <div
                    key={recommendedUser.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: 10,
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00A878, #007A57)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {recommendedUser.firstName?.[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>
                          {recommendedUser.firstName}
                        </div>
                        <div style={{ fontSize: 11, color: '#ffffff66' }}>
                          Suggerençia
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowUser(recommendedUser.id)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'linear-gradient(135deg, #00A878, #007A57)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      + Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOLLOWERS TAB */}
        {activeTab === 'followers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Followers */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                👥 Mis Seguidores ({connections.followers?.length || 0})
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {connections.followers?.length === 0 && (
                  <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                    📭 Aún no tienes seguidores. ¡Comparte contenido genial! 🚀
                  </p>
                )}

                {connections.followers?.map(follower => (
                  <UserCard
                    key={follower.id}
                    user={follower}
                    actions={false}
                  />
                ))}
              </div>
            </div>

            {/* Following */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                ⭐ Siguiendo ({connections.following?.length || 0})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {connections.following?.length === 0 && (
                  <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                    🔍 No sigues a nadie aún. Encuentra personas interesantes.
                  </p>
                )}

                {connections.following?.map(followedUser => (
                  <UserCard
                    key={followedUser.id}
                    user={followedUser}
                    isFollowing={true}
                    onUnfollow={() => handleUnfollowUser(followedUser.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <input
                type="text"
                placeholder="Busca usuarios, centros, empresas..."
                onChange={(e) => search(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: 500,
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {searchResults.length === 0 && (
                <p style={{ color: '#ffffff66', gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
                  🔍 Escribe para buscar usuarios
                </p>
              )}

              {searchResults.map(searchUser => (
                <UserCard
                  key={searchUser.id}
                  user={searchUser}
                  onFollow={() => handleFollowUser(searchUser.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * EJEMPLO DE USO
 * 
 * Para usar en main.jsx:
 * 
 * import AlumnoApp from './pages/AlumnoApp';
 * 
 * <AlumnoApp 
 *   user={authUser} 
 *   onLogout={() => { /* redirigir a login */ }}
 * />
 * 
 * 
 * NOTAS:
 * - Este es un ejemplo básico. Puede adaptarse según tus necesidades
 * - Feed.jsx ya tiene la funcionalidad de crear/ver posts
 * - UserCard.jsx es reutilizable para diferentes contextos
 * - Todos los hooks manejan loading, error y datos automáticamente
 * - Los items están pegados a la API real del backend
 */
