import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, BookOpen, Users, FileBarChart } from 'lucide-react';

interface AdminSidebarProps {
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpen },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Close button - mobile only */}
      <div className="lg:hidden p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Logo */}
      <div className="px-6 pt-4 pb-8">
        <h1 className="text-2xl font-bold text-accent-600">EduAdmin</h1>
        <p className="text-sm text-gray-500 mt-1">Administration Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-accent-50 text-accent-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-accent-600'
              }`
            }
            onClick={() => onClose()}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;