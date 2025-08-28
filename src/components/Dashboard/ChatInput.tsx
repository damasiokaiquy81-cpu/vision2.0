import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { sendChatMessage } from '../../services/api';
import { WebhookResponse } from '../../types';
import { Send, Loader2 } from 'lucide-react';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, getWebhook } = useAuth();
  const { addMessage, removeMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message
    addMessage(userMessage, 'user');

    // Add typing indicator
    const typingId = `typing-${Date.now()}`;
    addMessage('Analisando dados...', 'bot', typingId);

    try {
      const webhook = getWebhook();
      if (!webhook) {
        throw new Error('Webhook não encontrado');
      }

      const payload = {
        tipo_filtro: 'geral',
        mensagem: userMessage,
        user: user.email
      };

      const response = await sendChatMessage(payload, webhook);
      
      removeMessage(typingId);
      
      // Todas as respostas agora vão para o chat
      const resposta = response.resposta || response.message || 'Processando sua solicitação.';
      addMessage(resposta, 'bot');
    } catch (error) {
      removeMessage(typingId);
      addMessage('Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-sm bg-white shadow-lg placeholder-gray-400"
          rows={2}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl transition-all duration-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};