import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    const dashboardMap = {
      super_admin: '/admin',
      customer: '/customer',
      provider: '/provider',
      technician: '/technician',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return children;
}

