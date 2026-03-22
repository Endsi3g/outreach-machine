import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if credentials are placeholder or empty
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-project")

/**
 * Supabase client for server-side usage (API routes, server components).
 */
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-project.supabase.co", 
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-key"
)

/**
 * Supabase admin client (uses service role key for elevated access).
 * Only use in API routes, never expose to the client.
 */
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const isServiceConfigured = serviceRoleKey && !serviceRoleKey.includes("your-service-role")
  const isSupabaseFullyConfigured = isSupabaseConfigured && !!isServiceConfigured
  
  return createClient(
    isSupabaseFullyConfigured ? supabaseUrl : "https://placeholder-project.supabase.co", 
    isSupabaseFullyConfigured ? serviceRoleKey : "placeholder-key"
  )
}
