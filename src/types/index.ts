export interface User {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  webhook?: string;
  message?: string;
}

export interface Message {
  text: string;
  sender: 'user' | 'bot' | 'info';
  timestamp: number;
  id?: string;
}

export interface FavoriteConversation {
  id: number;
  messages: Message[];
  preview: string;
  date: string;
  messageCount: number;
}

export interface FilterOptions {
  type: 'geral' | 'cliente' | 'vendedor';
  date?: string;
  tempo?: 'daily' | 'weekly';
}

export interface InsightData {
  vendas: number;
  topVendedor: string;
  topVendedorVendas: number;
}

export interface InsightsState {
  dia: InsightData;
  mes: InsightData;
}

export interface ChatPayload {
  tipo_filtro: string;
  mensagem: string;
  data?: string;
  tempo?: string;
  user: string;
}