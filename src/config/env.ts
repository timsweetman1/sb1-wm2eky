export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  affiliate: {
    eightSleepPartnerId: import.meta.env.VITE_EIGHTSLEEP_PARTNER_ID
  }
};