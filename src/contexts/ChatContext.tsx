import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  reportContent: string;
  isTypingReport: boolean;
  addMessage: (text: string, sender: 'user' | 'bot' | 'info', id?: string) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
  setReportContent: (content: string, animated?: boolean) => void;
  clearReport: () => void;
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
  const [reportContent, setReportContentState] = useState<string>('');
  const [isTypingReport, setIsTypingReport] = useState(false);

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

  const setReportContent = (content: string, animated: boolean = false) => {
    if (!animated) {
      setReportContentState(content);
      return;
    }

    setIsTypingReport(true);
    setReportContentState('');
    
    let currentIndex = 0;
    const words = content.split(' ');
    
    const typeWord = () => {
      if (currentIndex < words.length) {
        setReportContentState(prev => 
          prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex]
        );
        currentIndex++;
        setTimeout(typeWord, 100); // 100ms entre palavras
      } else {
        setIsTypingReport(false);
      }
    };
    
    typeWord();
  };

  const clearReport = () => {
    setReportContentState('');
    setIsTypingReport(false);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      reportContent,
      isTypingReport,
      addMessage,
      clearMessages,
      removeMessage,
      setReportContent,
      clearReport
    }}>
      {children}
    </ChatContext.Provider>
  );
};