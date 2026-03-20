import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Supabase client for server-side usage (API routes, server components).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase admin client (uses service role key for elevated access).
 * Only use in API routes, never expose to the client.
 */
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient(supabaseUrl, serviceRoleKey)
}
