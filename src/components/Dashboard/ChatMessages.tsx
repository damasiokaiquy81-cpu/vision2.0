import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Bot, User, MessageSquare, Filter } from 'lucide-react';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export const ChatMessages: React.FC = () => {
  const { messages } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div className="text-center flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Use os filtros acima para fazer perguntas específicas sobre os dados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-full">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          {message.sender === 'bot' && (
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={`${
              message.sender === 'bot' && (message.text.includes('#') || message.text.includes('|') || message.text.includes('---')) 
                ? 'max-w-[85%] px-4 py-3 rounded-lg bg-white border border-gray-200'
                : `max-w-[70%] px-4 py-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? message.text.startsWith('🎯')
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-teal-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`
            }`}
          >
            {message.sender === 'user' && message.text.startsWith('🎯') && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-teal-300">
                <Filter className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">FILTRO PRÉ-CONFIGURADO</span>
              </div>
            )}
            {message.sender === 'bot' && (message.text.includes('#') || message.text.includes('|') || message.text.includes('---')) ? (
              <MarkdownRenderer content={message.text} />
            ) : (
              <p className="leading-relaxed">{message.text}</p>
            )}
          </div>

          {message.sender === 'user' && (
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};