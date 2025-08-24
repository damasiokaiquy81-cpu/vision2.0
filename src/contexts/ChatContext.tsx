import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, FilterOptions, InsightsState } from '../types';

interface ChatContextType {
  messages: Message[];
  currentFilter: FilterOptions;
  insights: InsightsState;
  addMessage: (text: string, sender: 'user' | 'bot' | 'info', id?: string) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
  updateFilter: (filter: FilterOptions) => void;
  updateInsights: (period: 'dia' | 'mes', data: Partial<InsightsState['dia']>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({ type: 'geral' });
  const [insights, setInsights] = useState<InsightsState>({
    dia: {
      vendas: Math.floor(Math.random() * 15) + 3,
      topVendedor: 'João Silva',
      topVendedorVendas: Math.floor(Math.random() * 8) + 1
    },
    mes: {
      vendas: Math.floor(Math.random() * 200) + 50,
      topVendedor: 'Maria Santos',
      topVendedorVendas: Math.floor(Math.random() * 50) + 10
    }
  });

  const addMessage = (text: string, sender: 'user' | 'bot' | 'info', id?: string) => {
    const message: Message = {
      text,
      sender,
      timestamp: Date.now(),
      id: id || `msg-${Date.now()}`
    };
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const updateFilter = (filter: FilterOptions) => {
    setCurrentFilter(filter);
  };


  const updateInsights = (period: 'dia' | 'mes', data: Partial<InsightsState['dia']>) => {
    setInsights(prev => ({
      ...prev,
      [period]: { ...prev[period], ...data }
    }));
  };

  return (
    <ChatContext.Provider value={{
      messages,
      currentFilter,
      insights,
      addMessage,
      clearMessages,
      removeMessage,
      updateFilter,
      updateInsights
    }}>
      {children}
    </ChatContext.Provider>
  );
};