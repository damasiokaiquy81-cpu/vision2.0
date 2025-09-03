import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { sendChatMessage } from '../../services/api';
import { Filter, Users, UserCheck, Calendar, Clock, User, Phone, Hash, ChevronDown, ChevronRight, Send } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  message: string;
  requiresData?: boolean;
  dataFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
    required?: boolean;
  }>;
}

interface FilterCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  subcategories: Array<{
    id: string;
    label: string;
    options: FilterOption[];
  }>;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'vendedor',
    label: 'Análise por Vendedor',
    icon: <UserCheck className="w-4 h-4" />,
    subcategories: [
      {
        id: 'vendedor_options',
        label: '',
        options: [
          {
            id: 'vendedor_geral_semanal',
            label: 'Semanal',
            message: 'Gerar análise weekly geral de todos os vendedores'
          },
          {
            id: 'vendedor_geral_mensal',
            label: 'Mensal',
            message: 'Gerar análise month geral de todos os vendedores'
          },
          {
            id: 'vendedor_geral_anual',
            label: 'Anual',
            message: 'Gerar análise year geral de todos os vendedores'
          }
        ]
      }
    ]
  },
  {
    id: 'cliente',
    label: 'Análise por Cliente',
    icon: <Users className="w-4 h-4" />,
    subcategories: [
      {
        id: 'cliente_options',
        label: '',
        options: [
          {
            id: 'cliente_geral_semanal',
            label: 'Semanal',
            message: 'Gerar análise weekly geral de todos os clientes'
          },
          {
            id: 'cliente_geral_mensal',
            label: 'Mensal',
            message: 'Gerar análise month geral de todos os clientes'
          },
          {
            id: 'cliente_geral_anual',
            label: 'Anual',
            message: 'Gerar análise year geral de todos os clientes'
          }
        ]
      }
    ]
  }
];

interface FilterAreaProps {
  onFilterSelect: (filter: FilterOption | null) => void;
  onLoadingChange: (loading: boolean) => void;
  selectedFilter: FilterOption | null;
  formData: Record<string, string>;
  onFormChange: (key: string, value: string) => void;
}

export const FilterArea: React.FC<FilterAreaProps> = ({
  onFilterSelect,
  onLoadingChange,
  selectedFilter,
  formData,
  onFormChange
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  const { user, getWebhook } = useAuth();
  const { addMessage, removeMessage } = useChat();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleFilterSelect = (filter: FilterOption) => {
    onFilterSelect(filter);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
        >
          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
            isSidebarExpanded ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Overlay for mobile */}
       {isSidebarExpanded && (
         <div 
           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
           onClick={() => setIsSidebarExpanded(false)}
         />
       )}

       {/* Sidebar */}
       <div className={`${
         isSidebarExpanded ? 'translate-x-0' : 'translate-x-full'
       } md:translate-x-0 fixed md:relative top-0 right-0 h-full w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out z-40 md:z-auto`}>
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-white">
           <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-black" />
              <div>
                <h2 className="text-sm font-semibold text-black">Filtros</h2>
                <p className="text-xs text-gray-500 -mt-0.5">Análises pré-configuradas</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarExpanded(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
         </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {FILTER_CATEGORIES.map(category => (
          <div key={category.id} className="bg-white rounded border border-gray-200 shadow-sm">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded"
            >
              <div className="flex items-center gap-2">
                <div className="text-gray-600">
                  {category.icon}
                </div>
                <span className="font-medium text-gray-800 text-xs">{category.label}</span>
              </div>
              {expandedCategories.includes(category.id) ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </button>
            
            {expandedCategories.includes(category.id) && (
              <div className="px-2 pb-2 space-y-1">
                {category.subcategories[0].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterSelect(option)}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      selectedFilter?.id === option.id
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


    </div>
    </>
  );
};