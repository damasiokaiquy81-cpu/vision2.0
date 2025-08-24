import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Zap, Trash2, LogOut, Circle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { clearMessages } = useChat();

  const handleClearChat = () => {
    clearMessages();
  };

  return (
    <header 
      className="col-span-3 px-5 py-3 flex items-center justify-between shadow-lg relative overflow-hidden z-header"
      style={{ background: 'var(--gradient-primary)' }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-white tracking-wide">
          Vision
        </h1>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 text-white/90 text-xs">
          <div className="status-online"></div>
          Online
        </div>
        
        <div className="text-white/80 text-xs hidden sm:flex items-center gap-2">
          <span>{user?.email}</span>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all hover:scale-105 backdrop-blur-sm"
          title="Limpar chat"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Limpar</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-lg transition-all hover:scale-105 backdrop-blur-sm"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};