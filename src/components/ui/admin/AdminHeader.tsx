import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Bell, User, Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-accent-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Admin Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                onClick={() => navigate('/admin/profile')}
                className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
              >
                <span className="sr-only">Open user menu</span>
                <div className="bg-accent-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-accent-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;