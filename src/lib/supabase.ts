import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Guard against placeholder or empty values
export const isSupabaseConfigured =
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'your_supabase_project_url_here' &&
    supabaseKey !== 'your_supabase_anon_key_here';

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseKey)
    : null as any; // Cast to any to avoid type errors in usage, but logical checks should precede use
