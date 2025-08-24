import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { InsightsHeader } from './InsightsHeader';
import { InsightCard } from './InsightCard';

export const InsightsSidebar: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState<'dia' | 'mes'>('dia');
  const { insights } = useChat();

  return (
    <aside 
      className="bg-white border-l shadow-sm flex flex-col overflow-hidden mobile-hidden z-sidebar"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <InsightsHeader currentPeriod={currentPeriod} onPeriodChange={setCurrentPeriod} />
        
        <div className="space-y-3 mt-5">
          <InsightCard
            title="VENDAS"
            value={insights[currentPeriod].vendas.toString()}
            subtitle={currentPeriod === 'dia' ? 'vendas hoje' : 'vendas no mês'}
            color="green"
            type="sales"
            period={currentPeriod}
          />
          
          <InsightCard
            title="TOP VENDEDOR"
            value={insights[currentPeriod].topVendedor}
            subtitle={`${insights[currentPeriod].topVendedorVendas} vendas ${currentPeriod === 'dia' ? 'hoje' : 'no mês'}`}
            color="blue"
            type="seller"
            period={currentPeriod}
            isTextValue
          />
        </div>
      </div>
    </aside>
  );
};