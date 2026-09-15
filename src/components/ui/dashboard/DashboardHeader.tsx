import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import { useAdminSession } from '../../../hooks/useAdminSession';
import { LogOut, User } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const { session } = useAdminSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-3 p-2 rounded-full">
                <div className="bg-gray-200 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {session?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
