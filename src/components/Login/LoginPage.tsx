import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { loginAPI } from '../../services/api';
import { LoginForm } from './LoginForm';
import { LoginHeader } from './LoginHeader';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginAPI(email, password);
      
      if (response.success && response.webhook) {
        login({ email, password }, response.webhook);
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-5 drop-shadow-lg">
          <LoginHeader />
          <LoginForm
            email={email}
            password={password}
            error={error}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};