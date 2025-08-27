import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { FileText, Download, FileBarChart } from 'lucide-react';
import jsPDF from 'jspdf';

export const ReportsArea: React.FC = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { reportContent, isTypingReport, clearReport } = useChat();

  const generatePDF = async () => {
    if (!reportContent.trim()) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Adicionar título
      pdf.setFontSize(20);
      pdf.text('Relatório Vision', 20, 30);
      
      // Adicionar data
      pdf.setFontSize(12);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
      
      // Adicionar conteúdo
      pdf.setFontSize(11);
      const lines = pdf.splitTextToSize(reportContent, 170);
      pdf.text(lines, 20, 60);

      pdf.save(`relatorio-vision-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50/30 border-l border-gray-100/50 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-300/50">
            <FileBarChart className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Relatórios</h2>
            <p className="text-xs text-gray-500 -mt-0.5">Insights detalhados</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {reportContent && (
            <button
              onClick={clearReport}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
              title="Limpar relatório"
            >
              <FileText className="w-4.5 h-4.5" />
            </button>
          )}
          
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF || !reportContent.trim()}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!reportContent ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-300/50">
                <FileBarChart className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Aguardando relatórios</h3>
              <p className="text-sm text-gray-500">Os insights aparecerão aqui</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 min-h-[200px] border border-gray-100/80 shadow-sm">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {reportContent}
                {isTypingReport && (
                  <span className="inline-block w-2 h-5 bg-slate-400 ml-1 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};