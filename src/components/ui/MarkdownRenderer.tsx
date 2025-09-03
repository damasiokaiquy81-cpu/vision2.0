import React from 'react';
import { TrendingUp, Users, AlertCircle, CheckCircle, XCircle, BarChart3, Calendar, Target, Lightbulb } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Processar o novo formato de resposta da API
  const processApiResponse = (content: string) => {
    try {
      // Tentar parsear como JSON (novo formato)
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed[0]?.output) {
        return parsed[0].output;
      }
    } catch {
      // Se não for JSON, retornar o conteúdo original
    }
    return content;
  };

  // Detectar se o conteúdo é markdown ou texto simples
  const isMarkdown = (text: string) => {
    // Verificar se contém elementos markdown típicos
    const markdownPatterns = [
      /^#{1,6}\s/m,        // Headers
      /\*\*.*\*\*/,        // Bold
      /\*.*\*/,            // Italic
      /^-\s/m,             // Lista
      /^\|.*\|/m,          // Tabela
      /```/,               // Code block
      /---/                // Divider
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentTable: string[] = [];
    let inTable = false;
    let listItems: string[] = [];
    let inList = false;

    const processQuantitativosSection = (content: string) => {
      // Extrair seção de quantitativos
      const quantitativosMatch = content.match(/## Quantitativos\s*([\s\S]*?)(?=\n##|$)/);
      if (!quantitativosMatch) return null;
      
      const quantitativosText = quantitativosMatch[1];
      const items = quantitativosText.split('\n')
        .filter(line => line.trim().startsWith('- **'))
        .map(line => {
          const match = line.match(/- \*\*([^*]+)\*\*:?\s*(.+)/);
          if (match) {
            return {
              metric: match[1].trim(),
              value: match[2].trim().replace(/\.$/, '')
            };
          }
          return null;
        })
        .filter(item => item !== null);

      if (items.length === 0) return null;

      return (
        <div key="quantitativos-table" className="my-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="bg-teal-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-teal-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quantitativos
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Métrica
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
                    {item.metric}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold border-b border-gray-100">
                    {item.value === 'Não identificado' || item.value === 'Não identificado.' ? (
                      <span className="text-gray-500 italic flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Não identificado
                      </span>
                    ) : (
                      item.value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const processTable = () => {
      if (currentTable.length === 0) return;
      
      const headers = currentTable[0].split('|').map(h => h.trim()).filter(h => h);
      const rows = currentTable.slice(2).map(row => 
        row.split('|').map(cell => cell.trim()).filter(cell => cell)
      );

      elements.push(
        <div key={`table-${elements.length}`} className="my-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                  {row.map((cell, cellIdx) => {
                    const isMetricCell = cellIdx === 0;
                    const isValueCell = cellIdx === 1;
                    
                    return (
                      <td key={cellIdx} className={`px-4 py-3 text-sm border-b border-gray-100 ${
                        isMetricCell ? 'font-medium text-gray-700' : 
                        isValueCell ? 'text-gray-900 font-semibold' : 'text-gray-600'
                      }`}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    };

    const processList = () => {
      if (listItems.length === 0) return;
      
      elements.push(
        <div key={`list-${elements.length}`} className="my-4">
          <ul className="space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400">•</span>
                <span className="leading-relaxed">{item.replace(/^-\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      listItems = [];
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle table detection
      if (trimmedLine.includes('|') && (trimmedLine.includes('Métrica') || trimmedLine.includes('---'))) {
        if (!inTable) {
          inTable = true;
          if (inList) {
            processList();
            inList = false;
          }
        }
        currentTable.push(line);
        return;
      } else if (inTable && trimmedLine.includes('|')) {
        currentTable.push(line);
        return;
      } else if (inTable) {
        processTable();
        inTable = false;
      }

      // Handle list items
      if (trimmedLine.startsWith('-') && trimmedLine.length > 1) {
        if (!inList) {
          inList = true;
          if (inTable) {
            processTable();
            inTable = false;
          }
        }
        // Remove símbolos '.-' dos itens da lista
        const cleanedItem = trimmedLine.replace(/^-\s*\.?-?\s*/, '- ');
        listItems.push(cleanedItem);
        return;
      } else if (inList && trimmedLine !== '') {
        processList();
        inList = false;
      }

      // Handle headers
      if (trimmedLine.startsWith('# ')) {
        if (inTable) processTable();
        if (inList) processList();
        inTable = false;
        inList = false;
        
        elements.push(
          <div key={`h1-${index}`} className="my-6 first:mt-0">
            <h1 className="text-xl font-bold text-gray-800 pb-2 border-b-2 border-teal-500">
              {trimmedLine.replace('# ', '')}
            </h1>
          </div>
        );
      } else if (trimmedLine.startsWith('## ')) {
        if (inTable) processTable();
        if (inList) processList();
        inTable = false;
        inList = false;
        
        const title = trimmedLine.replace('## ', '');
        
        // Renderizar Quantitativos, Relatório e Insight da IA com estilos especiais
        if (title === 'Quantitativos') {
          elements.push(
            <div key={`h2-${index}`} className="my-4">
              <div className="bg-teal-50 px-4 py-3 rounded-lg border border-teal-200">
                <h2 className="text-lg font-semibold text-teal-800 mb-0">{title}</h2>
              </div>
            </div>
          );
        } else if (title === 'Relatorio') {
          elements.push(
            <div key={`h2-${index}`} className="my-4">
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">Relatório</h2>
              </div>
            </div>
          );
        } else if (title === 'Insight da IA') {
          elements.push(
            <div key={`h2-${index}`} className="my-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-xl border border-blue-200 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-800 mb-0 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Insight da IA
                </h2>
              </div>
            </div>
          );
        }
        // Ignorar outras seções como Tendências, Dúvidas, Interesses
      } else if (trimmedLine === '---') {
        if (inTable) processTable();
        if (inList) processList();
        inTable = false;
        inList = false;
        
        elements.push(
          <div key={`divider-${index}`} className="my-4">
            <div className="border-t border-gray-200"></div>
          </div>
        );
      } else if (trimmedLine && !inTable && !inList) {
        // Verificar se estamos em uma seção especial para aplicar estilo apropriado
        const isInsightsSection = elements.some((el, idx) => {
          if (idx >= elements.length - 3) { // Verificar os últimos elementos
            return el.key && el.key.toString().includes('h2-') && 
                   (el.props?.children?.props?.children?.props?.children?.includes('Insight da IA') ||
                    el.props?.children?.props?.children?.props?.children === 'Insight da IA');
          }
          return false;
        });
        
        const isRelatorioSection = elements.some((el, idx) => {
          if (idx >= elements.length - 3) { // Verificar os últimos elementos
            return el.key && el.key.toString().includes('h2-') && 
                   (el.props?.children?.props?.children?.props?.children?.includes('Relatório') ||
                    el.props?.children?.props?.children?.props?.children === 'Relatório');
          }
          return false;
        });
        
        if (isInsightsSection) {
          // Estilo especial para parágrafos da seção Insight da IA
          elements.push(
            <div key={`insights-p-${index}`} className="my-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-900 leading-relaxed font-medium">
                {trimmedLine}
              </p>
            </div>
          );
        } else if (isRelatorioSection) {
          // Estilo especial para parágrafos da seção Relatório
          elements.push(
            <div key={`relatorio-p-${index}`} className="my-3 bg-gray-50 px-4 py-3 rounded-lg border-l-4 border-gray-300">
              <p className="text-sm text-gray-800 leading-relaxed">
                {trimmedLine}
              </p>
            </div>
          );
        } else {
          // Regular paragraph para outras seções
          elements.push(
            <p key={`p-${index}`} className="my-3 text-sm text-gray-700 leading-relaxed">
              {trimmedLine}
            </p>
          );
        }
      }
    });

    // Process any remaining table or list
    if (inTable) processTable();
    if (inList) processList();

    return elements;
  };

  const processedContent = processApiResponse(content);
  
  // Verificar se é markdown ou texto simples
  if (!isMarkdown(processedContent)) {
    // Se for texto simples, renderizar como parágrafo normal
    return (
      <div className="markdown-content">
        <p className="text-sm text-gray-700 leading-relaxed">
          {processedContent}
        </p>
      </div>
    );
  }
  
  // Verificar se tem seção de quantitativos para processamento especial
  const hasQuantitativos = processedContent.includes('## Quantitativos');
  
  return (
    <div className="markdown-content">
      {hasQuantitativos ? (
        <>
          {processQuantitativosSection(processedContent)}
          {renderMarkdown(processedContent.replace(/## Quantitativos[\s\S]*?(?=\n##|$)/, ''))}
        </>
      ) : (
        renderMarkdown(processedContent)
      )}
    </div>
  );

  function processQuantitativosSection(content: string) {
    // Extrair seção de quantitativos
    const quantitativosMatch = content.match(/## Quantitativos\s*([\s\S]*?)(?=\n##|$)/);
    if (!quantitativosMatch) return null;
    
    const quantitativosText = quantitativosMatch[1];
    const items = quantitativosText.split('\n')
      .filter(line => line.trim().startsWith('- **'))
      .map(line => {
        const match = line.match(/- \*\*([^*]+)\*\*:?\s*(.+)/);
        if (match) {
          return {
            metric: match[1].trim(),
            value: match[2].trim().replace(/\.$/, '')
          };
        }
        return null;
      })
      .filter(item => item !== null);

    if (items.length === 0) return null;

    return (
      <div key="quantitativos-table" className="my-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="bg-teal-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-teal-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quantitativos
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Métrica
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
                  {item.metric}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold border-b border-gray-100">
                  {item.value === 'Não identificado' || item.value === 'Não identificado.' ? (
                    <span className="text-gray-500 italic flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Não identificado
                    </span>
                  ) : (
                    item.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};