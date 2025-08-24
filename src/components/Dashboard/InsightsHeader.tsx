import React from 'react';
import { BarChart3 } from 'lucide-react';

interface InsightsHeaderProps {
  currentPeriod: 'dia' | 'mes';
  onPeriodChange: (period: 'dia' | 'mes') => void;
}

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  currentPeriod,
  onPeriodChange
}) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
        </div>
        <div>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>Insights</h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Dados em tempo real</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onPeriodChange('dia')}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentPeriod === 'dia'
              ? 'text-white shadow-md hover:scale-105'
              : 'hover:bg-slate-100'
          }`}
          style={{
            background: currentPeriod === 'dia' ? 'var(--accent-color)' : 'var(--tertiary-bg)',
            color: currentPeriod === 'dia' ? 'white' : 'var(--text-secondary)'
          }}
        >
          Hoje
        </button>
        <button
          onClick={() => onPeriodChange('mes')}
          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentPeriod === 'mes'
              ? 'text-white shadow-md hover:scale-105'
              : 'hover:bg-slate-100'
          }`}
          style={{
            background: currentPeriod === 'mes' ? 'var(--accent-color)' : 'var(--tertiary-bg)',
            color: currentPeriod === 'mes' ? 'white' : 'var(--text-secondary)'
          }}
        >
          Este Mês
        </button>
      </div>
    </div>
  );
};