import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Bot, User, MessageSquare } from 'lucide-react';

export const ChatMessages: React.FC = () => {
  const { messages } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-300/50">
            <MessageSquare className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Inicie uma conversa</h3>
          <p className="text-sm text-gray-500">Faça uma pergunta para começar a obter insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          {message.sender === 'bot' && (
            <div className="w-9 h-9 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg'
                : 'bg-white border border-gray-100/80 text-gray-900 backdrop-blur-sm'
            }`}
          >
            <p className="leading-relaxed font-medium">{message.text}</p>
          </div>

          {message.sender === 'user' && (
            <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};