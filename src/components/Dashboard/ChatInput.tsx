import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { sendChatMessage } from '../../services/api';
import { Send, Loader2 } from 'lucide-react';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, getWebhook } = useAuth();
  const { currentFilter, addMessage, removeMessage } = useChat();

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
        tipo_filtro: currentFilter.type,
        mensagem: userMessage,
        user: user.email,
        ...(currentFilter.date && { data: currentFilter.date }),
        ...(currentFilter.tempo && { tempo: currentFilter.tempo })
      };

      const response = await sendChatMessage(payload, webhook);
      const resposta = response.resposta || response.message || 'Processando sua solicitação.';
      
      removeMessage(typingId);
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
          placeholder="Digite sua pergunta sobre os dados..."
          className="w-full px-3 py-2 pr-10 rounded-lg resize-none transition-all input-field focus-ring"
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
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent-color)' }} />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="px-4 py-2 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg disabled:cursor-not-allowed btn-primary hover:scale-105"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </form>
  );
};