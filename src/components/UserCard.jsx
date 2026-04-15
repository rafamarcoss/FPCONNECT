import { useState } from 'react';
import { usersService } from '../services';

/**
 * Componente UserCard
 * Card reutilizable para mostrar información de usuarios
 */
export default function UserCard({ user, onFollow, onUnfollow, isFollowing, actions = true }) {
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const handleViewProfile = async () => {
    setLoadingProfile(true);
    setProfileError('');
    try {
      const response = await usersService.getProfile(user.id);
      setProfile(response.data);
    } catch (err) {
      setProfileError(err.message || 'No se pudo cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeProfile = () => {
    setProfile(null);
    setProfileError('');
  };

  const parsedCicles = profile?.centerProfile?.cicles
    ? (() => {
        try {
          return JSON.parse(profile.centerProfile.cicles);
        } catch {
          return [];
        }
      })()
    : [];

  const parseJsonArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseJsonObject = (value) => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  };

  const studentSkills = parseJsonArray(profile?.studentProfile?.skills);
  const studentProjects = parseJsonArray(profile?.studentProfile?.projects);
  const studentCertificates = parseJsonArray(profile?.studentProfile?.certificatesUrl);
  const studentJobPreferences = parseJsonObject(profile?.studentProfile?.jobPreferences);

  const externalLinkStyle = {
    color: '#7ce8c7',
    textDecoration: 'none',
    wordBreak: 'break-all',
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 16,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `linear-gradient(135deg, #00A878, #007A57)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ color: '#ffffff66', fontSize: 12 }}>
          {user.role === 'ALUMNO' && '👨‍🎓 Estudiante'}
          {user.role === 'CENTRO' && '🏫 Centro FP'}
          {user.role === 'EMPRESA' && '💼 Empresa'}
        </div>
        {user.bio && (
          <p style={{ color: '#ffffff88', fontSize: 12, margin: '4px 0 0 0' }}>
            {user.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleViewProfile}
          disabled={loadingProfile}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            cursor: loadingProfile ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 12,
            whiteSpace: 'nowrap',
            opacity: loadingProfile ? 0.7 : 1,
          }}
        >
          {loadingProfile ? 'Cargando...' : 'Ver perfil'}
        </button>

        {actions && (
          <button
            onClick={() => (isFollowing ? onUnfollow(user.id) : onFollow(user.id))}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: isFollowing
                ? 'rgba(255, 255, 255, 0.1)'
                : 'linear-gradient(135deg, #00A878, #007A57)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {isFollowing ? '✓ Siguiendo' : '+ Seguir'}
          </button>
        )}
      </div>

      {(profile || profileError) && (
        <div
          onClick={closeProfile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 560,
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'linear-gradient(160deg, #0c1a14 0%, #0f1f2e 100%)',
              color: '#fff',
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Perfil publico</h3>
              <button
                onClick={closeProfile}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#fff',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                x
              </button>
            </div>

            {profileError && (
              <div style={{ color: '#ff8c8c', fontSize: 13 }}>{profileError}</div>
            )}

            {profile && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div><strong>Nombre:</strong> {profile.firstName} {profile.lastName}</div>
                <div><strong>Rol:</strong> {profile.role}</div>
                {profile.location && <div><strong>Ubicacion:</strong> {profile.location}</div>}
                {profile.bio && <div><strong>Bio:</strong> {profile.bio}</div>}

                {profile.centerProfile && (
                  <>
                    <div><strong>Centro:</strong> {profile.centerProfile.centerName || 'No indicado'}</div>
                    <div><strong>Ciudad:</strong> {profile.centerProfile.city || 'No indicada'}</div>
                    <div><strong>Provincia:</strong> {profile.centerProfile.province || 'No indicada'}</div>
                    <div>
                      <strong>Ciclos:</strong>{' '}
                      {parsedCicles.length > 0 ? parsedCicles.join(', ') : 'No indicados'}
                    </div>
                  </>
                )}

                {profile.studentProfile && (
                  <>
                    {profile.studentProfile.cicle && <div><strong>Ciclo:</strong> {profile.studentProfile.cicle}</div>}
                    {profile.studentProfile.specialization && (
                      <div><strong>Especialidad:</strong> {profile.studentProfile.specialization}</div>
                    )}
                    {profile.studentProfile.experience && (
                      <div><strong>Experiencia:</strong> {profile.studentProfile.experience}</div>
                    )}
                    {studentSkills.length > 0 && (
                      <div><strong>Skills:</strong> {studentSkills.join(', ')}</div>
                    )}
                    {studentProjects.length > 0 && (
                      <div><strong>Proyectos:</strong> {studentProjects.join(' | ')}</div>
                    )}
                    {profile.studentProfile.cvUrl && (
                      <div>
                        <strong>CV:</strong>{' '}
                        <a href={profile.studentProfile.cvUrl} target="_blank" rel="noreferrer" style={externalLinkStyle}>
                          {profile.studentProfile.cvUrl}
                        </a>
                      </div>
                    )}
                    {studentCertificates.length > 0 && (
                      <div><strong>Certificados:</strong> {studentCertificates.join(' | ')}</div>
                    )}
                    {studentJobPreferences && (
                      <div><strong>Preferencias:</strong> {JSON.stringify(studentJobPreferences)}</div>
                    )}
                  </>
                )}

                {profile.linkedinUrl && (
                  <div>
                    <strong>LinkedIn:</strong>{' '}
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={externalLinkStyle}>
                      {profile.linkedinUrl}
                    </a>
                  </div>
                )}
                {profile.portfolioUrl && (
                  <div>
                    <strong>Portfolio:</strong>{' '}
                    <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" style={externalLinkStyle}>
                      {profile.portfolioUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
