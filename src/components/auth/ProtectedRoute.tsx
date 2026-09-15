import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminSession } from '../../hooks/useAdminSession';
import { Loader2 } from 'lucide-react';

const ALLOWED_EMAIL = 'jherrera@redciudadana.org.gt';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!session || session.email.toLowerCase() !== ALLOWED_EMAIL) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
