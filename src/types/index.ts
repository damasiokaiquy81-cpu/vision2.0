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

export interface ChatPayload {
  tipo_filtro: string;
  mensagem: string;
  data?: string;
  tempo?: string;
  user: string;
}

export interface WebhookResponse {
  caminho: 1 | 2;
  resposta: string;
}