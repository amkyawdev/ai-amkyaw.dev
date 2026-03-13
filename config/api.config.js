// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://ai.amkyaw.workers.dev/',
  endpoints: {
    chat: '/',
    code: '/',
    translate: '/',
    summarize: '/',
    roleplay: '/'
  },
  timeout: 30000,
  retries: 2
};

export default API_CONFIG;
