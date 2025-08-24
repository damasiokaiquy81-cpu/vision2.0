export const WEBHOOKS = {
  LOGIN: 'https://webhook-flows.intelectai.com.br/webhook/login-verification'
} as const;

export const FILTER_LABELS = {
  geral: 'Geral',
  cliente: 'Cliente',
  vendedor: 'Vendedor'
} as const;

export const TEMPO_LABELS = {
  daily: 'Diário',
  weekly: 'Semanal'
} as const;

export const STORAGE_KEYS = {
  USER: 'vision_user',
  WEBHOOK: 'vision_webhook',
  FAVORITES: 'chatFavorites'
} as const;