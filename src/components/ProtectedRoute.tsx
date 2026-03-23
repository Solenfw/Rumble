import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/authContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/signin" replace />;

  return <>{children}</>;
};