import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFeed, useConnections, useUserSearch } from '../hooks';
import UserCard from '../components/UserCard';

export default function CentroApp() {
  const { user: authUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { posts, loadFeed, loading: feedLoading } = useFeed();
  const {
    followers,
    following,
    followUser,
    unfollowUser,
    loading: connectionsLoading,
  } = useConnections();
  const { results: searchResults, search, loading: searchLoading } = useUserSearch();

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadFeed();
    } else if (activeTab === 'network') {
      loadFeed();
    }
  }, [activeTab, loadFeed]);

  const handleLogout = async () => {
    await logout();
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(userId);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0c1a2e 0%, #0f152e 50%, #14101f 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* TOP NAV */}
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
            FP<span style={{ color: '#2563EB' }}>Connect</span>
          </h1>

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'dashboard', label: '📊 Panel' },
              { id: 'students', label: '🎓 Alumnos' },
              { id: 'network', label: '🤝 Red' },
              { id: 'profile', label: '🏫 Centro' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #2563EB, #1d4ed8)'
                    : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  fontSize: 14,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right', fontSize: 12 }}>
            <div style={{ fontWeight: 600 }}>
              {authUser?.firstName} {authUser?.lastName}
            </div>
            <div style={{ color: '#ffffff66' }}>🏫 Centro FP</div>
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,0,0,0.2)'}
          >
            🚪 Salir
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              borderRadius: 16,
              padding: 32,
              marginBottom: 32,
              color: '#fff',
            }}>
              <h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 800 }}>
                Bienvenido, {authUser?.firstName}
              </h1>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
                Centro FP para formación y desarrollo de talento
              </p>
            </div>

            {feedLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ffffff66' }}>
                ⏳ Cargando actividad...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {posts?.slice(0, 3).map(post => (
                  <div
                    key={post.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 12,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: 20,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {post.author?.firstName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {post.author?.firstName} {post.author?.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: '#ffffff66' }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#ffffff99' }}>
                      {post.content?.slice(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB - Search for students */}
        {activeTab === 'students' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
              🎓 Busca Alumnos
            </h2>

            <div style={{ marginBottom: 32 }}>
              <input
                type="text"
                placeholder="Busca alumnos disponibles..."
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
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                  e.target.style.background = 'rgba(37, 99, 235, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {searchLoading ? (
              <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                ⏳ Buscando...
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {searchResults.length === 0 ? (
                  <p style={{ color: '#ffffff66', gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
                    🔍 Escribe para buscar alumnos
                  </p>
                ) : (
                  searchResults.map(student => (
                    <UserCard
                      key={student.id}
                      user={student}
                      onFollow={() => handleFollowUser(student.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* NETWORK TAB */}
        {activeTab === 'network' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                👥 Seguidores ({followers?.length || 0})
              </h2>

              {connectionsLoading ? (
                <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                  ⏳ Cargando...
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {followers?.length === 0 && (
                    <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                      📭 Sin seguidores aún
                    </p>
                  )}

                  {followers?.map(follower => (
                    <UserCard
                      key={follower.id}
                      user={follower}
                      actions={false}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                ⭐ Siguiendo ({following?.length || 0})
              </h2>

              {connectionsLoading ? (
                <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                  ⏳ Cargando...
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {following?.length === 0 && (
                    <p style={{ color: '#ffffff66', textAlign: 'center', padding: 40 }}>
                      🔍 No sigues a nadie aún
                    </p>
                  )}

                  {following?.map(followedUser => (
                    <UserCard
                      key={followedUser.id}
                      user={followedUser}
                      isFollowing={true}
                      onUnfollow={() => handleUnfollowUser(followedUser.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 32,
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
              🏫 Información del Centro
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#ffffff99' }}>
                  Centro
                </label>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}>
                  {authUser?.firstName}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#ffffff99' }}>
                  Correo
                </label>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}>
                  {authUser?.email}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#ffffff99' }}>
                  Rol
                </label>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}>
                  Centro FP
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#ffffff99' }}>
                  Desde
                </label>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                }}>
                  {new Date(authUser?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📊 Estadísticas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{
                  background: 'rgba(0, 168, 120, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                    {followers?.length || 0}
                  </div>
                  <div style={{ fontSize: 12, color: '#ffffff99' }}>Seguidores</div>
                </div>

                <div style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                    {following?.length || 0}
                  </div>
                  <div style={{ fontSize: 12, color: '#ffffff99' }}>Siguiendo</div>
                </div>

                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                    {posts?.length || 0}
                  </div>
                  <div style={{ fontSize: 12, color: '#ffffff99' }}>Actividad</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
