import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
            <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-800">Vision</h1>
            <p className="text-xs text-gray-500">Dashboard de Análises</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-bold text-gray-800">Vision</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
        <button
           onClick={logout}
           className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg transition-all duration-300 group hover:shadow-lg hover:shadow-red-100/30"
         >
           <LogOut className="w-4 h-4 group-hover:scale-110 transition-all duration-300" />
           <span className="text-sm font-medium hidden sm:inline">Sair</span>
         </button>
        </div>
      </div>
    </header>
  );
};