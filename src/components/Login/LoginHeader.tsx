import React from 'react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg animate-float">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Vision</h1>
      <p className="text-white/70 text-sm">Entre na sua conta para continuar</p>
    </div>
  );
};