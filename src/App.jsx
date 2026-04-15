import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import AlumnoApp from './pages/AlumnoApp';
import CentroApp from './pages/CentroApp';
import EmpresaApp from './pages/EmpresaApp';

export default function App() {
  const { isAuthenticated, user, initialize, logout } = useAuthStore();

  // Inicializar auth desde localStorage
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Si no está autenticado, mostrar login
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Enrutar según el rol del usuario
  const role = user.role;

  if (role === 'ALUMNO') {
    return <AlumnoApp user={user} onLogout={logout} />;
  }

  if (role === 'CENTRO') {
    return <CentroApp user={user} onLogout={logout} />;
  }

  if (role === 'EMPRESA') {
    return <EmpresaApp user={user} onLogout={logout} />;
  }

  // Fallback
  return <LoginPage />;
}
