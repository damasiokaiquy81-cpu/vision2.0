import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: 'user' | 'bot' | 'info', id?: string) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
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



  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      removeMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};