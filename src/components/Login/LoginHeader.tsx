import React from 'react';
import { Eye } from 'lucide-react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
        <Eye className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Vision</h1>
      <p className="text-gray-500 font-medium">Entre na sua conta para continuar</p>
    </div>
  );
};