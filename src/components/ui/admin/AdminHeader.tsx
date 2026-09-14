import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Bell, User, Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-sky-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Gestión de Participantes</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notificaciones</span>
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-sky-100 p-2 rounded-full">
                <User className="h-5 w-5 text-sky-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
