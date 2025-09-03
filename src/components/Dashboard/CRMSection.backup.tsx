import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Clock, Loader2, Search, X, User } from 'lucide-react';
import { databaseService, DataAnalysisRecord } from '../../services/database';

type ViewType = 'individual' | 'weekly' | 'monthly' | 'yearly';

interface Lead {
  id: number;
  name: string;
  phone: string;
  resumo: string;
  satisfacao: string;
  reclamacao: string;
  duracao: string;
  tema: string;
  busca: string;
  keywords: string;
  dtAnalysis: string;
}

const CRMSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('individual');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchColumn, setSearchColumn] = useState<string>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  // Carregar dados na inicialização e quando a view muda
  useEffect(() => {
    loadData(currentView);
  }, [currentView]);

  // Filtrar leads baseado na busca
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredLeads(leads);
      return;
    }

    const filtered = leads.filter(lead => {
      const fieldValue = lead[searchColumn as keyof Lead]?.toString().toLowerCase() || '';
      return fieldValue.includes(searchValue.toLowerCase());
    });
    
    setFilteredLeads(filtered);
  }, [leads, searchColumn, searchValue]);

  const searchColumns = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Nome' },
    { value: 'phone', label: 'Telefone' },
    { value: 'resumo', label: 'Resumo' },
    { value: 'satisfacao', label: 'Satisfação' },
    { value: 'reclamacao', label: 'Reclamação' },
    { value: 'duracao', label: 'Duração' },
    { value: 'tema', label: 'Tema' },
    { value: 'busca', label: 'Busca' },
    { value: 'keywords', label: 'Keywords' },
    { value: 'dtAnalysis', label: 'Data Análise' }
  ];

  const loadData = async (view: ViewType) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await databaseService.getDataAnalysis(view);
      
      if (!data || data.length === 0) {
        // Se não há dados da API, usar dados de exemplo
        const mockData = getMockData(view);
        setLeads(mockData);
        setFilteredLeads(mockData);
      } else {
        const formattedLeads: Lead[] = data.map(record => ({
          id: record.id,
          name: record.name || `Lead ${record.id}`,
          phone: record.phone || '',
          resumo: record.resumo || '',
          satisfacao: record.satisfacao || '',
          reclamacao: record.reclamacao || '',
          duracao: record.duracao || '',
          tema: record.tema || '',
          busca: record.busca || '',
          keywords: record.keywords || '',
          dtAnalysis: record.dtAnalysis || ''
        }));
        
        setLeads(formattedLeads);
        setFilteredLeads(formattedLeads);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Usando dados de exemplo.');
      
      // Fallback para dados de exemplo
      const mockData = getMockData(view);
      setLeads(mockData);
      setFilteredLeads(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Dados de exemplo como fallback
  const getMockData = (view: ViewType): Lead[] => {
    const mockData: Record<ViewType, Lead[]> = {
      individual: [
        { 
          id: 1, 
          name: 'João Silva', 
          phone: '+5511999999999', 
          resumo: 'Cliente interessado em produto A com grande potencial de conversão', 
          satisfacao: 'Alta', 
          reclamacao: 'Nenhuma', 
          duracao: '15 min', 
          tema: 'Vendas', 
          busca: 'Produto A', 
          keywords: 'produto, interesse, conversão', 
          dtAnalysis: '2025-01-31' 
        },
        { 
          id: 2, 
          name: 'Maria Santos', 
          phone: '+5511888888888', 
          resumo: 'Aguardando proposta comercial detalhada para análise interna', 
          satisfacao: 'Média', 
          reclamacao: 'Demora no atendimento', 
          duracao: '20 min', 
          tema: 'Proposta', 
          busca: 'Orçamento', 
          keywords: 'proposta, orçamento, análise', 
          dtAnalysis: '2025-01-31' 
        },
        { 
          id: 3, 
          name: 'Carlos Oliveira', 
          phone: '+5511777777777', 
          resumo: 'Cliente em dúvida sobre funcionalidades do sistema', 
          satisfacao: 'Baixa', 
          reclamacao: 'Falta de informações técnicas', 
          duracao: '25 min', 
          tema: 'Suporte', 
          busca: 'Funcionalidades', 
          keywords: 'dúvidas, sistema, técnico', 
          dtAnalysis: '2025-01-30' 
        }
      ],
      weekly: [
        { id: 1, name: 'Semana 1', phone: '', resumo: '15 leads gerados esta semana', satisfacao: '', reclamacao: '', duracao: '', tema: '', busca: '', keywords: '', dtAnalysis: '2025-01-27' }
      ],
      monthly: [
        { id: 1, name: 'Janeiro 2025', phone: '', resumo: '87 leads gerados neste mês', satisfacao: '', reclamacao: '', duracao: '', tema: '', busca: '', keywords: '', dtAnalysis: '2025-01-01' }
      ],
      yearly: [
        { id: 1, name: '2025', phone: '', resumo: '1.245 leads gerados neste ano', satisfacao: '', reclamacao: '', duracao: '', tema: '', busca: '', keywords: '', dtAnalysis: '2025-01-01' }
      ]
    };
    return mockData[view] || [];
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedLead(null);
    setSearchValue('');
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const getViewIcon = (view: ViewType) => {
    switch (view) {
      case 'individual': return <User className="w-4 h-4" />;
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <TrendingUp className="w-4 h-4" />;
      case 'yearly': return <Clock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getViewLabel = (view: ViewType) => {
    switch (view) {
      case 'individual': return 'Individual';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'yearly': return 'Anual';
      default: return 'Individual';
    }
  };

  const viewOptions = [
    { id: 'individual' as ViewType, name: 'Diário', icon: User },
    { id: 'weekly' as ViewType, name: 'Semanal', icon: Calendar },
    { id: 'monthly' as ViewType, name: 'Mensal', icon: Calendar },
    { id: 'yearly' as ViewType, name: 'Anual', icon: TrendingUp }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">CRM Vision</h1>
        
        {/* View Selector */}
        <div className="flex flex-wrap gap-2">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentView === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleViewChange(option.id)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{option.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
        
        {/* Search Filter */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Buscar por:</span>
            </div>
            
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {searchColumns.map(column => (
                <option key={column.value} value={column.value}>
                  {column.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder={`Digite para buscar em ${searchColumns.find(col => col.value === searchColumn)?.label}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <div className="text-sm text-gray-500">
              {filteredLeads.length} de {leads.length} registros
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {currentView === 'individual' && (
                    <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Data Análise</th>
                  )}
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">ID</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Nome</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Telefone</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Resumo</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Satisfação</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Reclamação</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Duração</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Tema</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Busca</th>
                  <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">Keywords</th>
                  {currentView !== 'individual' && (
                    <th className="w-20 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Data Análise</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-600">Carregando dados...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={currentView === 'individual' ? 11 : 11} className="px-6 py-8 text-center text-gray-500">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => (
                    <tr key={lead.id} className={`transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                    }`}>
                      {currentView === 'individual' && (
                        <td className="w-20 px-2 py-2 text-xs text-gray-600 border-r border-gray-100 text-center whitespace-nowrap" 
                            onClick={() => { setSelectedLead(lead); setHighlightedField('dtAnalysis'); }}
                            title={lead.dtAnalysis}>
                          {lead.dtAnalysis ? new Date(lead.dtAnalysis).toLocaleDateString('pt-BR') : ''}
                        </td>
                      )}
                      <td className="w-20 px-2 py-2 text-xs font-mono text-gray-600 border-r border-gray-100 text-center whitespace-nowrap" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('id'); }}
                          title={`#${lead.id.toString().padStart(3, '0')}`}>
                        <div className="truncate">#{lead.id.toString().padStart(3, '0')}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm font-medium text-gray-800 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('name'); }}
                          title={lead.name}>
                        <div className="truncate">{lead.name}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('phone'); }}
                          title={lead.phone}>
                        <div className="truncate">{lead.phone}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('resumo'); }}
                          title={lead.resumo}>
                        <div className="truncate">{lead.resumo}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('satisfacao'); }}
                          title={lead.satisfacao}>
                        <div className="truncate">{lead.satisfacao}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('reclamacao'); }}
                          title={lead.reclamacao}>
                        <div className="truncate">{lead.reclamacao}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('duracao'); }}
                          title={lead.duracao}>
                        <div className="truncate">{lead.duracao}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('tema'); }}
                          title={lead.tema}>
                        <div className="truncate">{lead.tema}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('busca'); }}
                          title={lead.busca}>
                        <div className="truncate">{lead.busca}</div>
                      </td>
                      <td className="w-20 px-2 py-2 text-sm text-gray-600 border-r border-gray-100 text-center" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('keywords'); }}
                          title={lead.keywords}>
                        <div className="truncate">{lead.keywords}</div>
                      </td>
                      {currentView !== 'individual' && (
                        <td className="w-20 px-2 py-2 text-xs text-gray-600 text-center whitespace-nowrap" 
                            onClick={() => { setSelectedLead(lead); setHighlightedField('dtAnalysis'); }}
                            title={lead.dtAnalysis}>
                          <div className="truncate">{lead.dtAnalysis ? new Date(lead.dtAnalysis).toLocaleDateString('pt-BR') : ''}</div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Expansão */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedLead(null)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Lead #{selectedLead.id.toString().padStart(3, '0')}</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'id' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                  <p className="text-gray-900">#{selectedLead.id.toString().padStart(3, '0')}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'name' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-gray-900">{selectedLead.phone}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'resumo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
                  <p className="text-gray-900">{selectedLead.resumo}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'satisfacao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satisfação</label>
                  <p className="text-gray-900">{selectedLead.satisfacao}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'reclamacao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reclamação</label>
                  <p className="text-gray-900">{selectedLead.reclamacao}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'duracao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                  <p className="text-gray-900">{selectedLead.duracao}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'tema' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                  <p className="text-gray-900">{selectedLead.tema}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'busca' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
                  <p className="text-gray-900">{selectedLead.busca}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'keywords' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Palavras-chave</label>
                  <p className="text-gray-900">{selectedLead.keywords}</p>
                </div>
                
                <div className={`p-3 rounded-lg border-2 ${
                  highlightedField === 'dtAnalysis' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Análise</label>
                  <p className="text-gray-900">{selectedLead.dtAnalysis ? new Date(selectedLead.dtAnalysis).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="text-sm text-yellow-700">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMSection;