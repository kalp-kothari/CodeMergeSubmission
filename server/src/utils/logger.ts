export const logger = {
  info: (msg: string, data?: any) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`, data || ''),
  error: (msg: string, data?: any) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`, data || ''),
  warn: (msg: string, data?: any) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`, data || ''),
};
