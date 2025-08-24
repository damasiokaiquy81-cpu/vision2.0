import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageSquare, Sparkles } from 'lucide-react';

export const ChatMessages: React.FC = () => {
  const { messages } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        {/* Empty state - no content */}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollable">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'info' ? 'justify-center' : 'justify-start'}`}
        >
          <div
            className={`animate-slide-in ${
              message.sender === 'user'
                ? 'message-user'
                : message.sender === 'info'
                ? 'message-info'
                : 'message-bot'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};