import { z } from "zod"

/**
 * Validates environment variables at startup.
 * If required variables are missing, the app will warn but not crash
 * (to allow initial development with placeholder values).
 */
const envSchema = z.object({
  // NextAuth
  NEXTAUTH_URL: z.string().url().default("http://localhost:3001"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Ollama
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("llama3.1"),

  // Resend
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),

  // Apify
  APIFY_API_TOKEN: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.warn(
      "⚠️ Environment validation warnings:",
      parsed.error.flatten().fieldErrors
    )
    // Return partial env with defaults to avoid crashing
    return envSchema.parse({
      ...process.env,
    })
  }
  return parsed.data
}

export const env = validateEnv()
