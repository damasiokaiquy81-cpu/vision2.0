import { LoginResponse, ChatPayload } from '../types';

const LOGIN_WEBHOOK_URL = 'https://webhook-flows.intelectai.com.br/webhook/login-verification';

export const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(LOGIN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        action: 'login'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
    }
    
    const data = await response.json();
    return {
      success: data.success === true,
      webhook: data.webhook,
      message: data.message
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false };
  }
};

export const sendChatMessage = async (payload: ChatPayload, webhookUrl: string): Promise<any> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Erro na resposta do servidor: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no chat:', error);
    throw error;
  }
};