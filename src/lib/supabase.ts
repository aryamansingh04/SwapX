import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    "Missing environment variable: VITE_SUPABASE_URL. Please check your .env.local file."
  );
}

if (!supabaseKey) {
  throw new Error(
    "Missing environment variable: VITE_SUPABASE_KEY. Please check your .env.local file."
  );
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

