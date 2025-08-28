import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Bot, User, MessageSquare, Filter } from 'lucide-react';

export const ChatMessages: React.FC = () => {
  const { messages } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Inicie uma conversa</h3>
          <p className="text-sm text-gray-500">Faça uma pergunta para começar a obter insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          {message.sender === 'bot' && (
            <div className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-[70%] px-4 py-3 rounded-xl text-sm shadow-sm ${
              message.sender === 'user'
                ? message.text.startsWith('🎯')
                  ? 'bg-teal-100 text-teal-800 shadow-lg border border-teal-200'
                : 'bg-teal-500 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
            }`}
          >
            {message.sender === 'user' && message.text.startsWith('🎯') && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-teal-300">
                <Filter className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">FILTRO PRÉ-CONFIGURADO</span>
              </div>
            )}
            <p className="leading-relaxed">{message.text}</p>
          </div>

          {message.sender === 'user' && (
            <div className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};