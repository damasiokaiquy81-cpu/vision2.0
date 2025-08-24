import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Filter, Calendar, Clock, Settings } from 'lucide-react';

export const FilterSidebar: React.FC = () => {
  const { currentFilter, updateFilter } = useChat();

  const filterOptions = [
    { 
      value: 'geral', 
      label: 'Geral', 
      description: 'Análise geral do sistema',
      icon: '🌐'
    },
    { 
      value: 'cliente', 
      label: 'Cliente', 
      description: 'Insights por cliente',
      icon: '👤'
    },
    { 
      value: 'vendedor', 
      label: 'Vendedor', 
      description: 'Performance de vendedores',
      icon: '💼'
    }
  ];

  const handleFilterChange = (type: 'geral' | 'cliente' | 'vendedor') => {
    updateFilter({ ...currentFilter, type });
  };

  const handleDateChange = (date: string) => {
    updateFilter({ ...currentFilter, date: date || undefined });
  };

  const handleTempoChange = (tempo: string) => {
    updateFilter({ ...currentFilter, tempo: (tempo as 'daily' | 'weekly') || undefined });
  };

  return (
    <aside 
      className="bg-white border-r shadow-sm overflow-y-auto scrollable mobile-hidden z-sidebar"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
            <Filter className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
          </div>
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>Filtros</h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Configure sua análise</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {filterOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleFilterChange(option.value as any)}
              className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] border ${
                currentFilter.type === option.value
                  ? 'shadow-md'
                  : 'hover:shadow-sm'
              }`}
              style={{
                background: currentFilter.type === option.value 
                  ? 'var(--accent-light)' 
                  : 'var(--tertiary-bg)',
                borderColor: currentFilter.type === option.value 
                  ? 'var(--accent-color)' 
                  : 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-color)' }}>
                    {option.label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {option.description}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    currentFilter.type === option.value ? 'border-cyan-500' : 'border-gray-300'
                  }`}
                >
                  {currentFilter.type === option.value && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="p-5" style={{ background: 'var(--tertiary-bg)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <span className="font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>
            Filtros Avançados
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              <Calendar className="w-4 h-4" />
              Data específica
            </label>
            <input
              type="date"
              value={currentFilter.date || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-field focus-ring"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: 'var(--text-color)' }}>
              <Clock className="w-4 h-4" />
              Período
            </label>
            <select
              value={currentFilter.tempo || ''}
              onChange={(e) => handleTempoChange(e.target.value)}
              className="input-field focus-ring"
            >
              <option value="">Selecione o período</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};