// Database service for connecting to new CRM webhook

// CRM Analysis data structure
interface CRMAnalysisData {
  Resumo?: string;
  time_type?: string;
  session_id?: string;
  EtapadoLead?: string;
  InsightdaIA?: string;
  date_of_analysis?: string;
  Objecoesmaiscomuns?: string;
  [key: string]: any; // Para campos adicionais
}

// CRM record from webhook
interface CRMRecord {
  id: number;
  contacts: any;
  daily_analysis_ai: CRMAnalysisData | null;
  weekly_analysis_ai: CRMAnalysisData | null;
  monthly_analysis_ai: CRMAnalysisData | null;
  yearly_analysis_ai: CRMAnalysisData | null;
  date_of_analysis: string;
}

// Processed data analysis record for display
interface DataAnalysisRecord {
  id: number;
  contact_id: number;
  date_of_analysis: string;
  resumo: string;
  etapa_lead: string;
  insight_ia: string;
  objecoes_comuns: string;
  session_id: string;
  time_type: string;
  // Campos expandidos para visualização completa
  full_data?: CRMAnalysisData;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class DatabaseService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = 'https://webhook-flows.intelectai.com.br/webhook/vision-dados-crm';
  }

  // Process CRM record based on analysis type
  private processCRMRecord(record: CRMRecord, analysisType: 'daily' | 'weekly' | 'monthly' | 'yearly'): DataAnalysisRecord | null {
    let analysisData: CRMAnalysisData | null = null;
    
    switch (analysisType) {
      case 'daily':
        analysisData = record.daily_analysis_ai;
        break;
      case 'weekly':
        analysisData = record.weekly_analysis_ai;
        break;
      case 'monthly':
        analysisData = record.monthly_analysis_ai;
        break;
      case 'yearly':
        analysisData = record.yearly_analysis_ai;
        break;
    }

    // Se não há dados para este tipo de análise, retorna null
    if (!analysisData) {
      return null;
    }

    return {
      id: record.id,
      contact_id: record.id, // Usando o ID do registro como contact_id
      date_of_analysis: record.date_of_analysis,
      resumo: this.truncateText(analysisData.Resumo || 'N/A', 50),
      etapa_lead: this.truncateText(analysisData.EtapadoLead || 'N/A', 40),
      insight_ia: this.truncateText(analysisData.InsightdaIA || 'N/A', 50),
      objecoes_comuns: this.truncateText(analysisData.Objecoesmaiscomuns || 'N/A', 30),
      session_id: analysisData.session_id || 'N/A',
      time_type: analysisData.time_type || analysisType,
      full_data: analysisData // Dados completos para expansão
    };
  }

  // Truncate text for preview
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Format date for display
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  }

  // Get data analysis records by period from new webhook
  async getDataAnalysis(period: 'individual' | 'weekly' | 'monthly' | 'yearly'): Promise<DataAnalysisRecord[]> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_crm_data',
          period: period
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CRMRecord[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // Mapear period para analysis type
      const analysisTypeMap = {
        'individual': 'daily' as const,
        'weekly': 'weekly' as const,
        'monthly': 'monthly' as const,
        'yearly': 'yearly' as const
      };

      const analysisType = analysisTypeMap[period];
      
      // Processar registros e filtrar apenas os que têm dados para o tipo solicitado
      const processedRecords = data
        .map(record => this.processCRMRecord(record, analysisType))
        .filter((record): record is DataAnalysisRecord => record !== null)
        .map(record => ({
          ...record,
          date_of_analysis: this.formatDate(record.date_of_analysis)
        }));
      
      return processedRecords;
    } catch (error) {
      console.error('Error fetching CRM data:', error);
      throw error;
    }
  }

  // Test webhook connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test_connection'
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
export type { DataAnalysisRecord };