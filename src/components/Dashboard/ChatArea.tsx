import React from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export const ChatArea: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-100/50">
      <div className="px-6 py-4 border-b border-gray-100/50 bg-white/60 backdrop-blur-sm">
        <h2 className="text-base font-semibold text-gray-900">Conversa</h2>
        <p className="text-xs text-gray-500 mt-0.5">Faça suas perguntas e obtenha insights</p>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatMessages />
        <div className="border-t border-gray-100/50 p-6 bg-white/80 backdrop-blur-sm">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};