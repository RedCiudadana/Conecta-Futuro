import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../ui/admin/AdminSidebar';
import AdminHeader from '../ui/admin/AdminHeader';
import { Menu } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <button
          onClick={toggleSidebar}
          className="fixed z-20 bottom-4 right-4 p-2 rounded-full bg-accent-600 text-white shadow-lg hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;