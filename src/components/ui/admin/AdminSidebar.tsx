import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Users, GraduationCap, ClipboardCheck, BookOpen, Database, ArrowLeft, Star, Award } from 'lucide-react';

interface AdminSidebarProps {
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const navigation = [
    { name: 'Panel General', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Participantes', href: '/dashboard/participantes', icon: Users },
    { name: 'Inscripciones', href: '/dashboard/inscripciones', icon: GraduationCap },
    { name: 'Asistencia', href: '/dashboard/asistencia', icon: ClipboardCheck },
    { name: 'Cursos', href: '/dashboard/cursos', icon: BookOpen },
    { name: 'Habilidades', href: '/dashboard/habilidades', icon: Star },
    { name: 'Insignias', href: '/dashboard/insignias', icon: Award },
    { name: 'Base de Datos', href: '/dashboard/base-de-datos', icon: Database },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="lg:hidden p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <span className="sr-only">Cerrar menú</span>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h1 className="text-xl font-bold text-sky-700">Escuela Red Ciudadana</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión de Participantes</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-sky-700'
              }`
            }
            onClick={() => onClose()}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <NavLink
          to="/"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="mr-3 h-5 w-5 flex-shrink-0" />
          Volver al sitio
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
