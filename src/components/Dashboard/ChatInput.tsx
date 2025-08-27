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
  const { addMessage, removeMessage, setReportContent } = useChat();

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
      
      // Verificar se a resposta tem o campo caminho
      if (response.caminho === 1) {
        // Resposta vai para o chat
        const resposta = response.resposta || 'Processando sua solicitação.';
        addMessage(resposta, 'bot');
      } else if (response.caminho === 2) {
        // Resposta vai para relatórios com animação
        const resposta = response.resposta || 'Gerando relatório...';
        setReportContent(resposta, true);
      } else {
        // Fallback para compatibilidade
        const resposta = response.resposta || response.message || 'Processando sua solicitação.';
        addMessage(resposta, 'bot');
      }
    } catch (error) {
      removeMessage(typingId);
      addMessage('Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full px-4 py-3 border border-gray-200/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-300 transition-all text-sm bg-white/80 backdrop-blur-sm shadow-sm placeholder-gray-400"
          rows={3}
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
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-lg transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};