import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Clock, Loader2, User, RefreshCw, Eye, Search, X } from 'lucide-react';
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
  filtro?: string;
  isViewReference?: boolean;
  apontamentos?: {
    clientesInsatisfeitos: string;
    clientesSatisfeitos: string;
    motivosReclamacoes: string;
  };
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

  const searchColumns = [
    { value: 'dtAnalysis', label: 'Data Análise' },
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Nome' },
    { value: 'phone', label: 'Telefone' },
    { value: 'resumo', label: 'Resumo' },
    { value: 'satisfacao', label: 'Satisfação' },
    { value: 'reclamacao', label: 'Reclamação' },
    { value: 'duracao', label: 'Duração' },
    { value: 'tema', label: 'Tema' },
    { value: 'busca', label: 'Busca' },
    { value: 'keywords', label: 'Keywords' }
  ];

  const loadData = async (view: ViewType) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await databaseService.getDataAnalysis(view);
      
      if (!data || data.length === 0) {
        // Se não há dados da API, mostrar lista vazia
        setLeads([]);
        setFilteredLeads([]);
      } else {
        const formattedLeads: Lead[] = data.map(record => ({
          id: record.id,
          name: record.name || '0',
          phone: record.phone || '0',
          resumo: record.resumo || '0',
          satisfacao: record.satisfacao || '0',
          reclamacao: record.reclamacao || '0',
          duracao: record.duracao || '0',
          tema: record.tema || '0',
          busca: record.busca || '0',
          keywords: record.keywords || '0',
          dtAnalysis: record.dtAnalysis || '0',
          filtro: record.filtro,
          isViewReference: record.isViewReference,
          apontamentos: record.apontamentos
        }));
        
        setLeads(formattedLeads);
        setFilteredLeads(formattedLeads);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados.');
      
      // Em caso de erro, mostrar lista vazia
      setLeads([]);
      setFilteredLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedLead(null);
    setSearchValue('');
  };



  const viewOptions = [
    { id: 'individual' as ViewType, name: 'Diário', icon: User },
    { id: 'weekly' as ViewType, name: 'Semanal', icon: Calendar },
    { id: 'monthly' as ViewType, name: 'Mensal', icon: Calendar },
    { id: 'yearly' as ViewType, name: 'Anual', icon: TrendingUp }
  ];

  // Carregar dados na inicialização e quando a view muda
  useEffect(() => {
    loadData(currentView);
  }, [currentView]);

  // Normalize text for better search
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .trim();
  };

  // Filtrar leads baseado na busca
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredLeads(leads);
      return;
    }

    const searchTrimmed = searchValue.trim();
    const searchNormalized = normalizeText(searchTrimmed);
    
    const filtered = leads.filter(lead => {
      // Garantir que o lead existe e tem as propriedades necessárias
      if (!lead) return false;
      
      switch (searchColumn) {
        case 'id':
          return lead.id && lead.id.toString().startsWith(searchTrimmed);
          
        case 'dtAnalysis':
          if (!lead.dtAnalysis) return false;
          
          // Garantir que a data seja válida e formatada corretamente
          let dateFormatted: string;
          try {
            const date = new Date(lead.dtAnalysis);
            if (isNaN(date.getTime())) return false;
            dateFormatted = date.toLocaleDateString('pt-BR');
          } catch {
            return false;
          }
          
          // Busca progressiva por data
          if (searchTrimmed.startsWith('/')) {
            // Busca por mês: /08, /12, etc.
            const monthSearch = searchTrimmed.substring(1);
            if (!monthSearch) return false;
            
            const dateParts = dateFormatted.split('/');
            const month = dateParts[1];
            if (!month) return false;
            
            // Normalizar mês para sempre ter 2 dígitos
            const monthNormalized = month.padStart(2, '0');
            const searchNormalized = monthSearch.padStart(2, '0');
            
            if (monthSearch.length === 1) {
              return monthNormalized.startsWith(monthSearch);
            }
            return monthNormalized === searchNormalized;
            
          } else if (searchTrimmed.includes('/')) {
            // Busca por data completa ou parcial: 28/08, 28/08/2024
            return dateFormatted.startsWith(searchTrimmed);
            
          } else {
            // Busca por dia: 2, 28, 30, etc.
            const dateParts = dateFormatted.split('/');
            const day = dateParts[0];
            if (!day) return false;
            
            // Normalizar dia para sempre ter 2 dígitos
            const dayNormalized = day.padStart(2, '0');
            const searchNormalized = searchTrimmed.padStart(2, '0');
            
            if (searchTrimmed.length === 1) {
              // Para 1 dígito, buscar dias que começam com esse dígito
              return dayNormalized.startsWith(searchTrimmed);
            } else if (searchTrimmed.length === 2) {
              // Para 2 dígitos, busca exata
              return dayNormalized === searchNormalized;
            }
            
            return false;
          }
          
        case 'name':
          return lead.name && normalizeText(lead.name).includes(searchNormalized);
          
        case 'phone':
          if (!lead.phone) return false;
          // Remove formatting for phone search
          const phoneClean = lead.phone.replace(/\D/g, '');
          const searchClean = searchTrimmed.replace(/\D/g, '');
          return phoneClean.includes(searchClean) || normalizeText(lead.phone).includes(searchNormalized);
          
        case 'resumo':
          return lead.resumo && normalizeText(lead.resumo).includes(searchNormalized);
          
        case 'satisfacao':
          return lead.satisfacao && normalizeText(lead.satisfacao).includes(searchNormalized);
          
        case 'reclamacao':
          return lead.reclamacao && normalizeText(lead.reclamacao).includes(searchNormalized);
          
        case 'duracao':
          return lead.duracao && normalizeText(lead.duracao).includes(searchNormalized);
          
        case 'tema':
          return lead.tema && normalizeText(lead.tema).includes(searchNormalized);
          
        case 'busca':
          return lead.busca && normalizeText(lead.busca).includes(searchNormalized);
          
        case 'keywords':
          return lead.keywords && normalizeText(lead.keywords).includes(searchNormalized);
          
        default:
          return false;
      }
    });
    
    setFilteredLeads(filtered);
  }, [leads, searchColumn, searchValue]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-3 md:p-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">CRM Vision</h1>
        
        {/* View Selector and Refresh Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-wrap gap-1 md:gap-2 w-full sm:w-auto">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              const isActive = currentView === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleViewChange(option.id)}
                  disabled={loading}
                  className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm ${
                    isActive
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium text-gray-900 hidden sm:inline">{option.name}</span>
                  <span className="font-medium text-gray-900 sm:hidden">{option.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => handleViewChange(currentView)}
            disabled={loading}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm w-full sm:w-auto justify-center"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto bg-white">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">{error}</p>
          </div>
        )}
        
        {/* Search Filter */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 md:p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3 h-3 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">Buscar por:</span>
            </div>
            
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white min-w-0 flex-1 sm:flex-initial"
            >
              {searchColumns.map(column => (
                <option key={column.value} value={column.value} className="text-gray-900">
                  {column.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder={`Digite para buscar em ${searchColumns.find(col => col.value === searchColumn)?.label}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white placeholder-gray-500 min-w-0"
            />
            
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0 self-center"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            )}
            
            <div className="text-xs md:text-sm text-gray-500 font-medium text-center sm:text-left">
              {filteredLeads.length} de {leads.length} registros
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">Data</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">ID</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">Nome</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden sm:table-cell">Telefone</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">Resumo</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden md:table-cell">Satisfação</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden md:table-cell">Reclamação</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden lg:table-cell">Duração</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden lg:table-cell">Tema</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden lg:table-cell">Busca</th>
                  <th className="px-1 md:px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden lg:table-cell">Keywords</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-600 font-medium">Carregando dados...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500 font-medium">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => (
                    <tr key={lead.id} className={`transition-colors cursor-pointer hover:bg-blue-50 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[60px] md:max-w-[80px]" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('dtAnalysis'); }}
                          title={lead.dtAnalysis}>
                        <div className="truncate">{lead.dtAnalysis ? new Date(lead.dtAnalysis).toLocaleDateString('pt-BR') : 'N/A'}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs font-mono text-gray-900 border-r border-gray-100 font-bold max-w-[40px] md:max-w-[60px]" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('id'); }}
                          title={`#${lead.id.toString().padStart(3, '0')}`}>
                        <div className="truncate">#{lead.id.toString().padStart(3, '0')}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs font-medium text-gray-900 border-r border-gray-100 max-w-[80px] md:max-w-[100px]" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('name'); }}
                          title={lead.name}>
                        <div className="truncate font-semibold">{lead.name}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[80px] md:max-w-[100px] hidden sm:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('phone'); }}
                          title={lead.phone}>
                        <div className="truncate">{lead.phone}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 max-w-[100px] md:max-w-[150px]" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('resumo'); }}
                          title={lead.resumo}>
                        <div className="truncate font-medium">{lead.resumo}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[60px] md:max-w-[80px] hidden md:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('satisfacao'); }}
                          title={lead.satisfacao}>
                        <div className="truncate">{lead.satisfacao}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[80px] md:max-w-[100px] hidden md:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('reclamacao'); }}
                          title={lead.reclamacao}>
                        <div className="truncate">{lead.reclamacao}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[50px] md:max-w-[60px] hidden lg:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('duracao'); }}
                          title={lead.duracao}>
                        <div className="truncate">{lead.duracao}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[60px] md:max-w-[80px] hidden lg:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('tema'); }}
                          title={lead.tema}>
                        <div className="truncate">{lead.tema}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 border-r border-gray-100 font-medium max-w-[60px] md:max-w-[80px] hidden lg:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('busca'); }}
                          title={lead.busca}>
                        <div className="truncate">{lead.busca}</div>
                      </td>
                      <td className="px-1 md:px-2 py-1.5 md:py-2 text-xs text-gray-900 font-medium max-w-[80px] md:max-w-[100px] hidden lg:table-cell" 
                          onClick={() => { setSelectedLead(lead); setHighlightedField('keywords'); }}
                          title={lead.keywords}>
                        <div className="truncate">{lead.keywords}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Expansão */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-lg p-3 md:p-6 max-w-2xl w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Detalhes do Lead #{selectedLead.id.toString().padStart(3, '0')}</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <div className={`p-2 md:p-3 rounded-lg border-2 ${
                highlightedField === 'id' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-gray-900 font-semibold text-sm md:text-base">#{selectedLead.id.toString().padStart(3, '0')}</p>
              </div>
              
              <div className={`p-2 md:p-3 rounded-lg border-2 ${
                highlightedField === 'name' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nome</label>
                <p className="text-gray-900 font-semibold text-sm md:text-base">{selectedLead.name}</p>
              </div>
              
              <div className={`p-2 md:p-3 rounded-lg border-2 ${
                highlightedField === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <p className="text-gray-900 font-semibold text-sm md:text-base">{selectedLead.phone}</p>
              </div>
              
              <div className={`p-2 md:p-3 rounded-lg border-2 ${
                highlightedField === 'resumo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Resumo</label>
                <p className="text-gray-900 font-medium text-sm md:text-base">{selectedLead.resumo}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'satisfacao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Satisfação</label>
                <p className="text-gray-900 font-semibold">{selectedLead.satisfacao}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'reclamacao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reclamação</label>
                <p className="text-gray-900 font-medium">{selectedLead.reclamacao}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'duracao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                <p className="text-gray-900 font-semibold">{selectedLead.duracao}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'tema' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                <p className="text-gray-900 font-semibold">{selectedLead.tema}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'busca' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
                <p className="text-gray-900 font-semibold">{selectedLead.busca}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'keywords' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Palavras-chave</label>
                <p className="text-gray-900 font-medium">{selectedLead.keywords}</p>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${
                highlightedField === 'dtAnalysis' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Análise</label>
                <p className="text-gray-900 font-semibold">{selectedLead.dtAnalysis ? new Date(selectedLead.dtAnalysis).toLocaleDateString('pt-BR') : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMSection;