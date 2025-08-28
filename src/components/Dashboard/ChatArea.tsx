import React from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { FilterSubChat } from './FilterSubChat';
import { useChat } from '../../contexts/ChatContext';
import { Trash2 } from 'lucide-react';

interface ChatAreaProps {
  selectedFilter?: any;
  formData?: Record<string, string>;
  isFilterLoading?: boolean;
  onFilterFormChange?: (key: string, value: string) => void;
  onFilterSendMessage?: () => void;
  onFilterCancel?: () => void;
  canSendFilterMessage?: () => boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedFilter,
  formData = {},
  isFilterLoading = false,
  onFilterFormChange = () => {},
  onFilterSendMessage = () => {},
  onFilterCancel = () => {},
  canSendFilterMessage = () => false
}) => {
  const { clearMessages } = useChat();

  const handleClearHistory = async () => {
    try {
      // Enviar para o webhook para limpar histórico no banco
      await fetch('https://webhook-flows.intelectai.com.br/webhook/lixeiro-Vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear_history' })
      });
      
      // Limpar mensagens localmente
      clearMessages();
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white/95 via-gray-50/20 to-white/90 border-r border-gray-200/40">
      <div className="px-5 py-3 border-b border-gray-200/40 bg-gradient-to-r from-white/90 to-gray-50/80 backdrop-blur-md shadow-sm shadow-gray-100/30">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-base font-semibold text-gray-800">Conversa</h2>
             <p className="text-xs text-gray-500 mt-0.5">Faça suas perguntas e obtenha insights</p>
           </div>
          <button
             onClick={handleClearHistory}
             className="p-2 text-gray-400 hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-red-100/30"
             title="Limpar histórico"
           >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-all duration-300" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FilterSubChat
          selectedFilter={selectedFilter}
          formData={formData}
          isLoading={isFilterLoading}
          onFormChange={onFilterFormChange}
          onSendMessage={onFilterSendMessage}
          onCancel={onFilterCancel}
          canSendMessage={canSendFilterMessage}
        />
        <ChatMessages />
        <div className="border-t border-gray-200 p-4 bg-white shadow-inner">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};