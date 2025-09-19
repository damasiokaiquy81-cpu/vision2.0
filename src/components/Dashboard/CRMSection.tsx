import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Clock, Loader2, User, RefreshCw, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { databaseService, DataAnalysisRecord } from '../../services/database';

type ViewType = 'individual' | 'weekly' | 'monthly' | 'yearly';

const CRMSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('individual');
  const [records, setRecords] = useState<DataAnalysisRecord[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchColumn, setSearchColumn] = useState<string>('resumo');
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredRecords, setFilteredRecords] = useState<DataAnalysisRecord[]>([]);

  const searchColumns = [
    { value: 'contact_id', label: 'ID Contato' },
    { value: 'resumo', label: 'Resumo' },
    { value: 'etapa_lead', label: 'Etapa Lead' },
    { value: 'insight_ia', label: 'Insight IA' },
    { value: 'objecoes_comuns', label: 'Objeções' },
    { value: 'session_id', label: 'Session ID' },
    { value: 'date_of_analysis', label: 'Data Análise' }
  ];

  const viewOptions = [
    { id: 'individual' as ViewType, name: 'Diário', icon: User },
    { id: 'weekly' as ViewType, name: 'Semanal', icon: Calendar },
    { id: 'monthly' as ViewType, name: 'Mensal', icon: Calendar },
    { id: 'yearly' as ViewType, name: 'Anual', icon: TrendingUp }
  ];

  const loadData = async (view: ViewType) => {
    setLoading(true);
    setError(null);
    setExpandedRecord(null);
    
    try {
      const data = await databaseService.getDataAnalysis(view);
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do CRM.');
      setRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSearchValue('');
    setExpandedRecord(null);
  };

  const toggleExpanded = (recordId: number) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

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

  // Filtrar records baseado na busca
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredRecords(records);
      return;
    }

    const searchTrimmed = searchValue.trim();
    const searchNormalized = normalizeText(searchTrimmed);
    
    const filtered = records.filter(record => {
      if (!record) return false;
      
      const fieldValue = record[searchColumn as keyof DataAnalysisRecord];
      if (!fieldValue) return false;
      
      if (searchColumn === 'contact_id') {
        return fieldValue.toString().includes(searchTrimmed);
      }
      
      return normalizeText(fieldValue.toString()).includes(searchNormalized);
    });
    
    setFilteredRecords(filtered);
  }, [records, searchColumn, searchValue]);

  const getViewTitle = (view: ViewType) => {
    switch (view) {
      case 'individual': return 'Análises Diárias';
      case 'weekly': return 'Análises Semanais';
      case 'monthly': return 'Análises Mensais';
      case 'yearly': return 'Análises Anuais';
      default: return 'Análises';
    }
  };

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
            onClick={() => loadData(currentView)}
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
      <div className="flex-1 p-3 md:p-6 overflow-auto bg-white">
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
              {filteredRecords.length} de {records.length} registros
            </div>
          </div>
        </div>
        
        {/* Current View Title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{getViewTitle(currentView)}</h2>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">Data</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">ID</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200">Resumo</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden md:table-cell">Etapa Lead</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden lg:table-cell">Insight IA</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider border-r border-gray-200 hidden lg:table-cell">Objeções</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-600 font-medium">Carregando dados...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredRecords.map((record, index) => (
                      <React.Fragment key={record.id}>
                        <tr className={`transition-colors cursor-pointer hover:bg-blue-50 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } ${expandedRecord === record.id ? 'bg-blue-50' : ''}`}>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-900 border-r border-gray-100 font-medium">
                            <div className="truncate max-w-[80px]">{record.date_of_analysis}</div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs font-mono text-gray-900 border-r border-gray-100 font-bold">
                            <div className="truncate max-w-[60px]">#{record.contact_id}</div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-900 border-r border-gray-100 font-medium">
                            <div className="truncate max-w-[150px] md:max-w-[200px]" title={record.full_data?.Resumo}>
                              {record.resumo}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-900 border-r border-gray-100 font-medium hidden md:table-cell">
                            <div className="truncate max-w-[120px] md:max-w-[150px]" title={record.full_data?.EtapadoLead}>
                              {record.etapa_lead}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-900 border-r border-gray-100 font-medium hidden lg:table-cell">
                            <div className="truncate max-w-[150px]" title={record.full_data?.InsightdaIA}>
                              {record.insight_ia}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-900 border-r border-gray-100 font-medium hidden lg:table-cell">
                            <div className="truncate max-w-[100px]" title={record.full_data?.Objecoesmaiscomuns}>
                              {record.objecoes_comuns}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                            <button
                              onClick={() => toggleExpanded(record.id)}
                              className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              title={expandedRecord === record.id ? 'Recolher' : 'Expandir'}
                            >
                              {expandedRecord === record.id ? (
                                <ChevronUp className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                              )}
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expanded Row */}
                        {expandedRecord === record.id && record.full_data && (
                          <tr className="bg-blue-50">
                            <td colSpan={7} className="px-4 md:px-6 py-4 md:py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-3 md:space-y-4">
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Resumo Completo</h4>
                                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                      {record.full_data.Resumo || 'N/A'}
                                    </p>
                                  </div>
                                  
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Etapa do Lead</h4>
                                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                      {record.full_data.EtapadoLead || 'N/A'}
                                    </p>
                                  </div>
                                  
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Objeções Mais Comuns</h4>
                                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                      {record.full_data.Objecoesmaiscomuns || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3 md:space-y-4">
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Insight da IA</h4>
                                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                      {record.full_data.InsightdaIA || 'N/A'}
                                    </p>
                                  </div>
                                  
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Informações Técnicas</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Session ID:</span>
                                        <span className="text-xs font-mono text-gray-800">{record.session_id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Tipo:</span>
                                        <span className="text-xs text-gray-800 capitalize">{record.time_type}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-gray-600">Contact ID:</span>
                                        <span className="text-xs font-mono text-gray-800">#{record.contact_id}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMSection;