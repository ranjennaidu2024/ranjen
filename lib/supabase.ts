import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type ApiKey = {
  id: string;
  name: string;
  secret: string;
  status: "active" | "revoked";
  scopes: string[];
  created_at: string;
  last_used: string | null;
  environment: "production" | "staging" | "development";
  updated_at: string;
};

export type ApiKeyInsert = Omit<ApiKey, "id" | "created_at" | "updated_at">;
export type ApiKeyUpdate = Partial<Omit<ApiKey, "id" | "created_at" | "updated_at">>;

