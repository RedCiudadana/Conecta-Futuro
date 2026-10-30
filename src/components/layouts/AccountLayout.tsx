import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAccount } from '../../contexts/AccountContext';
import {
  LayoutDashboard, GraduationCap, Award, CalendarCheck,
  UserCircle, LogOut, Menu, X,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Inicio', path: '/mi-cuenta' },
  { icon: GraduationCap, label: 'Mis Cursos', path: '/mi-cuenta/cursos' },
  { icon: Award, label: 'Mis Certificados', path: '/mi-cuenta/certificados' },
  { icon: CalendarCheck, label: 'Mis Asistencias', path: '/mi-cuenta/asistencias' },
  { icon: UserCircle, label: 'Mi Perfil', path: '/mi-cuenta/perfil' },
];

const AccountLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, accountData } = useAccount();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const fullName = accountData?.participant
    ? `${accountData.participant.first_name} ${accountData.participant.last_name}`.trim()
    : session?.email ?? '';

  const initials = accountData?.participant
    ? `${accountData.participant.first_name?.[0] ?? ''}${accountData.participant.last_name?.[0] ?? ''}`.toUpperCase()
    : '??';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg flex flex-col transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <GraduationCap className="h-7 w-7 text-sky-600" />
            <span>Conecta Futuro</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Mi Cuenta</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = item.path === '/mi-cuenta'
                ? location.pathname === '/mi-cuenta'
                : location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
          >
            <GraduationCap className="h-5 w-5" />
            Volver al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <div className="h-9 w-9 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{fullName}</p>
                <p className="text-xs text-gray-400">{session?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
