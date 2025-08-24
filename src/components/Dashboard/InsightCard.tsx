import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { TrendingUp, Users, RefreshCw } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'green' | 'blue';
  type: 'sales' | 'seller';
  period: 'dia' | 'mes';
  isTextValue?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  subtitle,
  color,
  type,
  period,
  isTextValue = false
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { updateInsights } = useChat();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      if (type === 'sales') {
        const newValue = Math.floor(Math.random() * (period === 'dia' ? 15 : 200)) + (period === 'dia' ? 3 : 50);
        updateInsights(period, { vendas: newValue });
      } else {
        const sellers = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Souza'];
        const newSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const newSales = Math.floor(Math.random() * (period === 'dia' ? 8 : 50)) + 1;
        updateInsights(period, { 
          topVendedor: newSeller, 
          topVendedorVendas: newSales 
        });
      }
      setIsRefreshing(false);
    }, 1500);
  };

  const colorClasses = {
    green: 'var(--success-color)',
    blue: 'var(--warning-color)'
  };

  const Icon = type === 'sales' ? TrendingUp : Users;

  return (
    <div className="bg-white rounded-lg p-3 border shadow-sm transition-all card hover:shadow-md" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${colorClasses[color]}15` }}>
            <Icon className="w-4 h-4" style={{ color: colorClasses[color] }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
            {title}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 hover:scale-110"
          title="Atualizar dados"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
      
      <div className={`${isTextValue ? 'text-base' : 'text-xl'} font-bold mb-1`} style={{ color: 'var(--text-color)' }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
        {subtitle}
      </div>
    </div>
  );
};