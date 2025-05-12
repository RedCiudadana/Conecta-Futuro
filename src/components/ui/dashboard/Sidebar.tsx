import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  UserCircle, 
  Award, 
  Users2, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'My Courses', path: '/dashboard/courses' },
    { icon: <UserCircle className="w-5 h-5" />, label: 'Profile', path: '/dashboard/profile' },
    { icon: <Award className="w-5 h-5" />, label: 'Certificates', path: '/dashboard/certificates' },
    { icon: <Users2 className="w-5 h-5" />, label: 'Community', path: '/dashboard/community' },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Learning Portal</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;