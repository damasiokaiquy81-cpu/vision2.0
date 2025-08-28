import React from 'react';
import { Eye } from 'lucide-react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-5">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
        <Eye className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Vision</h1>
      <p className="text-gray-600 text-center leading-relaxed">Entre na sua conta para continuar</p>
    </div>
  );
};