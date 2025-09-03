// Database service for connecting to PostgreSQL via API

// Directus API configuration interface
interface DirectusConfig {
  apiUrl: string;
  token: string;
}

// All analysis JSON structure
interface AllAnalysisData {
  'U-Id': string;
  'S-Id': string;
  'DT-Analysis': string;
  'Name': string;
  'Phone': string;
  'Resumo': string;
  'Satisfacao': string;
  'Reclamacao': string;
  'Duracao': string;
  'Tema': string;
  'Busca': string;
  'Keywords': string;
}

// Directus data analysis record interface
interface DirectusDataAnalysisRecord {
  id: number;
  time_type: 'daily' | 'weekly' | 'month' | 'year';
  all_analysis: string; // JSON string
  'Date of Analysis'?: string;
  filtro?: string;
  created_at?: string;
  updated_at?: string;
}

// Processed data analysis record for display
interface DataAnalysisRecord {
  id: number;
  name: string;
  phone: string;
  dtAnalysis: string;
  resumo: string;
  satisfacao: string;
  reclamacao: string;
  duracao: string;
  tema: string;
  busca: string;
  keywords: string;
  filtro?: string;
  isViewReference?: boolean;
  apontamentos?: {
    clientesInsatisfeitos: string;
    clientesSatisfeitos: string;
    motivosReclamacoes: string;
  };
  user_id?: number;
  session_id?: string;
  date_of_analysis?: string;
  time_type?: string;
  all_analyzes?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class DatabaseService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  // Parse all_analysis JSON string to extract fields
  private parseAllAnalysis(allAnalysisJson: string): Partial<AllAnalysisData> {
    try {
      return JSON.parse(allAnalysisJson) as AllAnalysisData;
    } catch (error) {
      console.error('Error parsing all_analysis JSON:', error);
      return {};
    }
  }

  // Convert time_type to period mapping
  private mapTimeToPeriod(period: 'individual' | 'weekly' | 'monthly' | 'yearly'): string {
    const mapping = {
      'individual': 'daily',
      'weekly': 'weekly', 
      'monthly': 'month',
      'yearly': 'year'
    };
    return mapping[period];
  }

  // Process Directus record to DataAnalysisRecord
  private processDirectusRecord(record: DirectusDataAnalysisRecord): DataAnalysisRecord {
    const analysisData = this.parseAllAnalysis(record.all_analysis);
    const hasFilterMessage = record.filtro && record.filtro.includes('Os dados da semana se mantiveram os mesmos do atendimento realizado em');
    
    return {
      id: record.id,
      name: analysisData['Name'] || `Análise ${record.id}`,
      phone: analysisData['Phone'] !== 'null' ? analysisData['Phone'] : undefined,
      dtAnalysis: record['Date of Analysis'] || analysisData['DT-Analysis'],
      resumo: hasFilterMessage ? record.filtro : (analysisData['Resumo'] || undefined),
      satisfacao: hasFilterMessage ? 'Indefinido' : (analysisData['Satisfacao'] || undefined),
      reclamacao: hasFilterMessage ? 'Indefinido' : (analysisData['Reclamacao'] || undefined),
      duracao: hasFilterMessage ? 'Indefinido' : (analysisData['Duracao'] || undefined),
      tema: hasFilterMessage ? 'Indefinido' : (analysisData['Tema'] || undefined),
      busca: hasFilterMessage ? 'Indefinido' : (analysisData['Busca'] || undefined),
      keywords: hasFilterMessage ? 'Indefinido' : (analysisData['Keywords'] || undefined),
      filtro: record.filtro,
      user_id: analysisData['U-Id'] ? parseInt(analysisData['U-Id']) : undefined,
      session_id: analysisData['S-Id'],
      date_of_analysis: analysisData['DT-Analysis'],
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  }

  // Get data analysis records by period from Directus API
  async getDataAnalysis(period: 'individual' | 'weekly' | 'monthly' | 'yearly'): Promise<DataAnalysisRecord[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/directus/data-analysis?period=${period}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<DataAnalysisRecord[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Error fetching data analysis:', error);
      throw error;
    }
  }

  // Test Directus API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/directus/health`);
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
export type { DataAnalysisRecord };