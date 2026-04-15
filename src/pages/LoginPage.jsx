import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const { login, register, isLoading, error, clearError, user, isAuthenticated } = useAuthStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selected, setSelected] = useState('ALUMNO');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ALUMNO',
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Aquí irías a la página correspondiente según el rol
      console.log('✓ Usuario autenticado:', user);
    }
  }, [isAuthenticated, user]);

  const roles = [
    {
      key: 'ALUMNO',
      label: 'Soy Alumno',
      icon: '🎓',
      desc: 'Busca centros, sube tu CV y conecta con empresas para prácticas',
      color: '00A878',
    },
    {
      key: 'CENTRO',
      label: 'Soy Centro FP',
      icon: '🏫',
      desc: 'Gestiona tu perfil, publica ciclos y atrae a los mejores alumnos',
      color: '2563EB',
    },
    {
      key: 'EMPRESA',
      label: 'Soy Empresa',
      icon: '💼',
      desc: 'Encuentra talento joven para prácticas, becas y empleo directo',
      color: '7C3AED',
    },
  ];

  const handleRoleSelect = (roleKey) => {
    setSelected(roleKey);
    setFormData((prev) => ({ ...prev, role: roleKey }));
    clearError();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.firstName || !formData.lastName) {
          alert('Por favor completa todos los campos');
          return;
        }
        await register(formData);
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0c1a14 0%, #0f1f2e 50%, #14101f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #00A87818 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #7C3AED12 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #00A878, #007A57)',
              fontSize: 28,
              marginBottom: 16,
              boxShadow: '0 8px 32px #00A87850',
            }}
          >
            🌿
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 800, color: '#fff' }}>
            FP<span style={{ color: '#00A878' }}>Connect</span>
          </h1>
          <p style={{ color: '#ffffff55', fontSize: 14, margin: 0 }}>
            Conecta alumnos, centros y empresas de FP
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.10)',
            padding: '32px 28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => {
                setIsLoginMode(true);
                clearError();
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: isLoginMode
                  ? 'linear-gradient(135deg, #00A878, #007A57)'
                  : 'rgba(255,255,255,0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLoginMode(false);
                clearError();
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: !isLoginMode
                  ? 'linear-gradient(135deg, #00A878, #007A57)'
                  : 'rgba(255,255,255,0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 20,
                color: '#fca5a5',
                fontSize: 13,
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#ffffff88', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0, 168, 120, 0.5)';
                  e.target.style.background = 'rgba(0, 168, 120, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: isLoginMode ? 24 : 16 }}>
              <label style={{ display: 'block', color: '#ffffff88', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0, 168, 120, 0.5)';
                  e.target.style.background = 'rgba(0, 168, 120, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Register Specific Fields */}
            {!isLoginMode && (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#ffffff88', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Juan"
                      required={!isLoginMode}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: 14,
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#ffffff88', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Pérez"
                      required={!isLoginMode}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: 14,
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: '#ffffff88', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                    Selecciona tu perfil
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {roles.map((role) => (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => handleRoleSelect(role.key)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 12,
                          border: selected === role.key ? `2px solid #${role.color}` : '1px solid rgba(255,255,255,0.15)',
                          background:
                            selected === role.key
                              ? `rgba(${parseInt(role.color.slice(0, 2), 16)}, ${parseInt(role.color.slice(2, 4), 16)}, ${parseInt(role.color.slice(4, 6), 16)}, 0.15)`
                              : 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        <span style={{ fontSize: 16, marginRight: 8 }}>{role.icon}</span>
                        <strong>{role.label}</strong>
                        <p style={{ margin: '4px 0 0 24px', fontSize: 12, color: '#ffffff66' }}>
                          {role.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: 'none',
                background: isLoading
                  ? 'rgba(0, 168, 120, 0.5)'
                  : 'linear-gradient(135deg, #00A878, #007A57)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? '⏳ Procesando...' : isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#ffffff33', fontSize: 12, marginTop: 20 }}>
          Plataforma social para FP desde Andalucía 🚀
        </p>
      </div>
    </div>
  );
}
