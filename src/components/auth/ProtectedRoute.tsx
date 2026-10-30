import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminSession } from '../../hooks/useAdminSession';
import { supabase } from '../../config/supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAdminSession();
  const location = useLocation();
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setIsStaff(null);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase.rpc('is_staff');
      if (active) setIsStaff(data === true);
    })();
    return () => { active = false; };
  }, [session]);

  if (loading || (session && isStaff === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!session || isStaff !== true) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
