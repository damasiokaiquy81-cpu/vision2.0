import React from 'react';
import { Filter, Send, X } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { sendChatMessage } from '../../services/api';

interface FilterOption {
  id: string;
  label: string;
  message: string;
  requiresData?: boolean;
  dataFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
    required?: boolean;
  }>;
}

interface FilterSubChatProps {
  selectedFilter: FilterOption | null;
  formData: Record<string, string>;
  isLoading: boolean;
  onFormChange: (key: string, value: string) => void;
  onSendMessage: () => void;
  onCancel: () => void;
  canSendMessage: () => boolean;
}

export const FilterSubChat: React.FC<FilterSubChatProps> = ({
  selectedFilter,
  formData,
  isLoading,
  onFormChange,
  onSendMessage,
  onCancel,
  canSendMessage
}) => {
  const { addMessage, removeMessage } = useChat();
  const { user, getWebhook } = useAuth();

  const handleSendMessage = async () => {
    if (!selectedFilter || !user) return;

    // Fechar filtro imediatamente ao clicar em enviar
    onCancel();

    let finalMessage = selectedFilter.message;
    
    // Adicionar dados do formulário à mensagem se necessário
    if (selectedFilter.requiresData && selectedFilter.dataFields) {
      const dataEntries = selectedFilter.dataFields
        .filter((field: any) => formData[field.key]?.trim())
        .map((field: any) => `${field.label}: ${formData[field.key]}`);
      
      if (dataEntries.length > 0) {
        finalMessage += ` - ${dataEntries.join(', ')}`;
      }
    }

    // Adicionar mensagem com selo especial
    addMessage(`🎯 ${finalMessage}`, 'user');
    
    // Adicionar indicador de carregamento
    const typingId = `typing-${Date.now()}`;
    addMessage('Analisando dados...', 'bot', typingId);

    try {
      const webhook = getWebhook();
      if (!webhook) {
        throw new Error('Webhook não encontrado');
      }

      const payload = {
        tipo_filtro: selectedFilter.id.includes('vendedor') ? 'vendedor' : 'cliente',
        mensagem: finalMessage,
        user: user.email,
        filtro_predefinido: true,
        dados_adicionais: formData
      };

      const response = await sendChatMessage(payload, webhook);
      
      // Remover indicador de carregamento
      removeMessage(typingId);
      
      const resposta = response.resposta || response.message || 'Processando sua solicitação.';
      addMessage(resposta, 'bot');
    } catch (error) {
      removeMessage(typingId);
      addMessage('Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.', 'bot');
    }
  };
  if (!selectedFilter) return null;

  // Verificar se é análise individual (contém "individual" no ID)
  const isIndividualAnalysis = selectedFilter.id.includes('individual');
  
  // Determinar o tipo de análise (cliente ou vendedor)
  const analysisType = selectedFilter.id.includes('vendedor') ? 'Vendedor' : 'Cliente';

  return (
    <div className="bg-white border-b border-gray-200 p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 text-teal-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">{analysisType} - {selectedFilter.label}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                Enviar
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
        
        {isIndividualAnalysis ? (
          <div className="mt-2">
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              💬 Para análises individuais, digite os dados diretamente no chat abaixo (nome, ID, telefone, etc.)
            </p>
          </div>
        ) : (
          <>
            {selectedFilter.requiresData && selectedFilter.dataFields && (
              <div className="space-y-2 mt-2">
                {selectedFilter.dataFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => onFormChange(field.key, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
    </div>
  );
};