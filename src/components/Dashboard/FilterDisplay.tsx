import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Filter, Calendar, Clock, Tag } from 'lucide-react';

export const FilterDisplay: React.FC = () => {
  const { currentFilter } = useChat();

  const filterLabels = {
    geral: 'Geral',
    cliente: 'Cliente',
    vendedor: 'Vendedor'
  };

  const tempoLabels = {
    daily: 'Diário',
    weekly: 'Semanal'
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>
      <Tag className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        Filtro Ativo:
      </span>
      <span className="px-2 py-1 text-white text-xs font-semibold rounded-full" style={{ background: 'var(--accent-color)' }}>
        {filterLabels[currentFilter.type]}
      </span>
      
      {currentFilter.date && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs" style={{ background: 'var(--secondary-bg)', color: 'var(--text-secondary)' }}>
          <Calendar className="w-3 h-3" />
          {new Date(currentFilter.date).toLocaleDateString('pt-BR')}
        </div>
      )}
      
      {currentFilter.tempo && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs" style={{ background: 'var(--secondary-bg)', color: 'var(--text-secondary)' }}>
          <Clock className="w-3 h-3" />
          {tempoLabels[currentFilter.tempo]}
        </div>
      )}
    </div>
  );
};