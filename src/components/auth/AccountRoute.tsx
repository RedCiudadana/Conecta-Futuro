import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccount } from '../../contexts/AccountContext';
import { Loader2 } from 'lucide-react';

const AccountRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAccount();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default AccountRoute;
