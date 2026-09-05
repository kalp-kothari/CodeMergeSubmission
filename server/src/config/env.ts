import dotenv from 'dotenv';
dotenv.config();

const requiredVars = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
  'SUPABASE_STORAGE_BUCKET'
];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_KEY) {
  throw new Error(`Missing required environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY`);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: SUPABASE_KEY,
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET!,
  JWT_SECRET: process.env.JWT_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RESEND_API_KEY: process.env.RESEND_API_KEY
};
