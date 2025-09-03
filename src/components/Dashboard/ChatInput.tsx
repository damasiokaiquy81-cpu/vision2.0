import React from 'react';
import { Filter } from 'lucide-react';

export const ChatInput: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex items-center gap-3 text-gray-600">
        <Filter className="w-5 h-5 text-teal-600" />
        <span className="text-sm font-medium">
          Use os filtros acima para fazer perguntas específicas sobre os dados
        </span>
      </div>
    </div>
  );
};